import uuid

import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.models.ledger import TransactionType
from app.models.user import User
from app.services.ledger_service import (
    deduct_credits,
    deposit_credits,
    get_or_create_wallet,
    get_wallet_balance,
    reconcile_wallet_balance,
    record_transaction,
)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_wallet_and_ledger_transaction_lifecycle() -> None:
    """Verify wallet creation, deposit, deduction, reconciliation, and idempotency."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    unique_email = f"ledger_{uuid.uuid4().hex[:8]}@example.com"

    try:
        async with session_factory() as db_session:
            # 1. Create User
            user = User(
                email=unique_email,
                hashed_password="test_hashed_password",
                is_active=True,
            )
            db_session.add(user)
            await db_session.commit()
            await db_session.refresh(user)

            # 2. Get or create wallet
            wallet = await get_or_create_wallet(db_session, user.id)
            wallet_id = wallet.id
            assert wallet.user_id == user.id
            assert wallet.cached_balance == 0

            initial_balance = await get_wallet_balance(db_session, user.id)
            assert initial_balance == 0

            # 3. Deposit credits (TOPUP)
            idempotency_1 = f"topup_tx_{uuid.uuid4().hex[:8]}"
            topup_entry = await deposit_credits(
                db_session,
                user_id=user.id,
                amount=100,
                transaction_type=TransactionType.TOPUP,
                reference_id="order_123",
                idempotency_key=idempotency_1,
            )
            assert topup_entry.amount == 100
            assert topup_entry.balance_after == 100
            assert topup_entry.transaction_type == TransactionType.TOPUP
            assert topup_entry.reference_id == "order_123"

            updated_balance = await get_wallet_balance(db_session, user.id)
            assert updated_balance == 100

            # 4. Attempt duplicate idempotency key
            with pytest.raises(
                ValueError, match="Duplicate transaction idempotency key"
            ):
                await deposit_credits(
                    db_session,
                    user_id=user.id,
                    amount=100,
                    idempotency_key=idempotency_1,
                )

            # 5. Deduct credits (SPEND)
            spend_entry = await deduct_credits(
                db_session,
                user_id=user.id,
                amount=30,
                reference_id="session_456",
                idempotency_key=f"spend_tx_{uuid.uuid4().hex[:8]}",
            )
            assert spend_entry.amount == -30
            assert spend_entry.balance_after == 70
            assert spend_entry.transaction_type == TransactionType.SPEND

            new_balance = await get_wallet_balance(db_session, user.id)
            assert new_balance == 70

            # 6. Attempt deducting more credits than available balance
            with pytest.raises(ValueError, match="Insufficient credit balance"):
                await deduct_credits(
                    db_session,
                    user_id=user.id,
                    amount=100,
                    idempotency_key=f"spend_failed_{uuid.uuid4().hex[:8]}",
                )

            # 7. Reconcile balance against ledger SUM
            reconciled_balance = await reconcile_wallet_balance(db_session, wallet_id)
            assert reconciled_balance == 70

            # Test cleanup: disable trigger temporarily for teardown
            await db_session.execute(
                text(
                    "ALTER TABLE credit_ledger DISABLE TRIGGER "
                    "trigger_prevent_credit_ledger_update_delete;"
                )
            )
            await db_session.delete(user)
            await db_session.commit()
            await db_session.execute(
                text(
                    "ALTER TABLE credit_ledger ENABLE TRIGGER "
                    "trigger_prevent_credit_ledger_update_delete;"
                )
            )
            await db_session.commit()
    finally:
        await engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_db_trigger_blocks_update_and_delete() -> None:
    """Verify PostgreSQL DB trigger blocks UPDATE and DELETE on credit_ledger table."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    unique_email = f"trigger_{uuid.uuid4().hex[:8]}@example.com"

    try:
        async with session_factory() as db_session:
            user = User(
                email=unique_email,
                hashed_password="test_hashed_password",
                is_active=True,
            )
            db_session.add(user)
            await db_session.commit()
            await db_session.refresh(user)

            entry = await record_transaction(
                db_session,
                user_id=user.id,
                transaction_type=TransactionType.PROMO,
                amount=50,
                idempotency_key=f"promo_immutability_{uuid.uuid4().hex[:8]}",
            )
            entry_id = entry.id

            # 1. Attempt UPDATE directly via SQL -> MUST BE REJECTED BY DB TRIGGER
            with pytest.raises(DBAPIError, match="credit_ledger table is append-only"):
                await db_session.execute(
                    text("UPDATE credit_ledger SET amount = 9999 WHERE id = :id"),
                    {"id": entry_id},
                )

            await db_session.rollback()

            # 2. Attempt DELETE directly via SQL -> MUST BE REJECTED BY DB TRIGGER
            with pytest.raises(DBAPIError, match="credit_ledger table is append-only"):
                await db_session.execute(
                    text("DELETE FROM credit_ledger WHERE id = :id"),
                    {"id": entry_id},
                )

            await db_session.rollback()

            # Test cleanup: disable trigger temporarily for test teardown
            await db_session.execute(
                text(
                    "ALTER TABLE credit_ledger DISABLE TRIGGER "
                    "trigger_prevent_credit_ledger_update_delete;"
                )
            )
            await db_session.delete(user)
            await db_session.commit()
            await db_session.execute(
                text(
                    "ALTER TABLE credit_ledger ENABLE TRIGGER "
                    "trigger_prevent_credit_ledger_update_delete;"
                )
            )
            await db_session.commit()
    finally:
        await engine.dispose()
