import uuid
from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ledger import CreditLedger, TransactionType
from app.models.wallet import Wallet


async def get_or_create_wallet(db: AsyncSession, user_id: uuid.UUID) -> Wallet:
    """Get existing user wallet or create a new wallet with zero balance."""
    stmt = select(Wallet).where(Wallet.user_id == user_id)
    result = await db.execute(stmt)
    wallet = result.scalar_one_or_none()

    if wallet is None:
        wallet = Wallet(user_id=user_id, cached_balance=0)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)

    return wallet


async def get_wallet_balance(db: AsyncSession, user_id: uuid.UUID) -> int:
    """Return the cached credit balance for a given user."""
    wallet = await get_or_create_wallet(db, user_id)
    return wallet.cached_balance


async def reconcile_wallet_balance(db: AsyncSession, wallet_id: uuid.UUID) -> int:
    """Reconcile cached wallet balance against sum of credit_ledger entries."""
    stmt = select(Wallet).where(Wallet.id == wallet_id)
    result = await db.execute(stmt)
    wallet = result.scalar_one_or_none()
    if wallet is None:
        raise ValueError("Wallet not found.")

    sum_stmt = select(func.coalesce(func.sum(CreditLedger.amount), 0)).where(
        CreditLedger.wallet_id == wallet_id
    )
    sum_result = await db.execute(sum_stmt)
    reconciled_sum = int(sum_result.scalar_one())

    wallet.cached_balance = reconciled_sum
    wallet.last_reconciled_at = datetime.now(UTC)
    await db.commit()
    await db.refresh(wallet)
    return reconciled_sum


async def record_transaction(
    db: AsyncSession,
    user_id: uuid.UUID,
    transaction_type: TransactionType,
    amount: int,
    reference_id: str | None = None,
    idempotency_key: str | None = None,
) -> CreditLedger:
    """Record an append-only credit ledger transaction and update wallet balance.

    Raises:
        ValueError: On duplicate idempotency key or insufficient balance.
    """
    if idempotency_key is not None:
        dup_stmt = select(CreditLedger).where(
            CreditLedger.idempotency_key == idempotency_key
        )
        dup_result = await db.execute(dup_stmt)
        if dup_result.scalar_one_or_none() is not None:
            raise ValueError(
                f"Duplicate transaction idempotency key: '{idempotency_key}'."
            )

    wallet = await get_or_create_wallet(db, user_id)

    new_balance = wallet.cached_balance + amount
    if new_balance < 0:
        raise ValueError(
            f"Insufficient credit balance. Current: {wallet.cached_balance}, "
            f"Required: {abs(amount)}."
        )

    entry = CreditLedger(
        wallet_id=wallet.id,
        user_id=user_id,
        transaction_type=transaction_type,
        amount=amount,
        balance_after=new_balance,
        reference_id=reference_id,
        idempotency_key=idempotency_key,
    )

    wallet.cached_balance = new_balance
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def deposit_credits(
    db: AsyncSession,
    user_id: uuid.UUID,
    amount: int,
    transaction_type: TransactionType = TransactionType.TOPUP,
    reference_id: str | None = None,
    idempotency_key: str | None = None,
) -> CreditLedger:
    """Deposit positive credits into user wallet."""
    if amount <= 0:
        raise ValueError("Deposit credit amount must be greater than zero.")
    return await record_transaction(
        db,
        user_id=user_id,
        transaction_type=transaction_type,
        amount=amount,
        reference_id=reference_id,
        idempotency_key=idempotency_key,
    )


async def deduct_credits(
    db: AsyncSession,
    user_id: uuid.UUID,
    amount: int,
    reference_id: str | None = None,
    idempotency_key: str | None = None,
) -> CreditLedger:
    """Deduct positive credit amount from user wallet."""
    if amount <= 0:
        raise ValueError("Deduction credit amount must be greater than zero.")
    return await record_transaction(
        db,
        user_id=user_id,
        transaction_type=TransactionType.SPEND,
        amount=-abs(amount),
        reference_id=reference_id,
        idempotency_key=idempotency_key,
    )
