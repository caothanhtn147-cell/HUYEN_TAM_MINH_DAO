import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reflection_journal import ReflectionJournalEntry
from app.schemas.reflection_journal import (
    ConsultationHistoryItemResponse,
    JournalEntryCreate,
    JournalEntryUpdate,
)


async def create_journal_entry(
    db: AsyncSession, user_id: uuid.UUID, data: JournalEntryCreate
) -> ReflectionJournalEntry:
    """Create a new self-reflection journal entry for a user."""
    entry = ReflectionJournalEntry(
        user_id=user_id,
        title=data.title,
        content=data.content,
        mood_tag=data.mood_tag,
        source_module=data.source_module,
        source_reference_id=data.source_reference_id,
        insights=data.insights,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def get_user_journal_entries(
    db: AsyncSession, user_id: uuid.UUID, source_module: str | None = None
) -> Sequence[ReflectionJournalEntry]:
    """Retrieve all journal entries belonging to a user."""
    stmt = (
        select(ReflectionJournalEntry)
        .where(ReflectionJournalEntry.user_id == user_id)
        .order_by(ReflectionJournalEntry.created_at.desc())
    )
    if source_module:
        stmt = stmt.where(ReflectionJournalEntry.source_module == source_module)

    result = await db.execute(stmt)
    return result.scalars().all()


async def get_journal_entry_by_id(
    db: AsyncSession, user_id: uuid.UUID, entry_id: uuid.UUID
) -> ReflectionJournalEntry | None:
    """Retrieve a specific journal entry by ID for a user."""
    stmt = select(ReflectionJournalEntry).where(
        ReflectionJournalEntry.id == entry_id,
        ReflectionJournalEntry.user_id == user_id,
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def update_journal_entry(
    db: AsyncSession,
    user_id: uuid.UUID,
    entry_id: uuid.UUID,
    data: JournalEntryUpdate,
) -> ReflectionJournalEntry | None:
    """Update an existing journal entry for a user."""
    entry = await get_journal_entry_by_id(db, user_id, entry_id)
    if not entry:
        return None

    if data.title is not None:
        entry.title = data.title
    if data.content is not None:
        entry.content = data.content
    if data.mood_tag is not None:
        entry.mood_tag = data.mood_tag
    if data.insights is not None:
        entry.insights = data.insights

    await db.commit()
    await db.refresh(entry)
    return entry


async def delete_journal_entry(
    db: AsyncSession, user_id: uuid.UUID, entry_id: uuid.UUID
) -> bool:
    """Delete a journal entry by ID."""
    entry = await get_journal_entry_by_id(db, user_id, entry_id)
    if not entry:
        return False

    await db.delete(entry)
    await db.commit()
    return True


async def get_user_consultation_history(
    db: AsyncSession, user_id: uuid.UUID
) -> list[ConsultationHistoryItemResponse]:
    """Synthesize consultation and reading timeline for user across modules."""
    # Query journal entries linked to modules
    entries = await get_user_journal_entries(db, user_id)

    history_items: list[ConsultationHistoryItemResponse] = []
    for entry in entries:
        history_items.append(
            ConsultationHistoryItemResponse(
                id=str(entry.id),
                module_type=entry.source_module,
                title_vi=entry.title,
                summary_vi=entry.content[:120] + "..."
                if len(entry.content) > 120
                else entry.content,
                timestamp=entry.created_at,
                reference_id=entry.source_reference_id or str(entry.id),
            )
        )

    return history_items
