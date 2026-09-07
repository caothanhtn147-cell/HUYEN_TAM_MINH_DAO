import uuid
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.models.reflection_journal import ReflectionJournalEntry
from app.schemas.reflection_journal import JournalEntryCreate, JournalEntryUpdate
from app.services.reflection_service import (
    create_journal_entry,
    delete_journal_entry,
    get_journal_entry_by_id,
    get_user_consultation_history,
    update_journal_entry,
)


@pytest.mark.asyncio
async def test_journal_entry_service_mock_lifecycle() -> None:
    """Test reflection journal service logic with AsyncMock session."""
    user_id = uuid.uuid4()
    mock_db = AsyncMock()

    create_data = JournalEntryCreate(
        title="Quan sát cảm xúc sau khi gieo quẻ Càn",
        content="Cảm thấy điềm tĩnh hơn và nhận ra bài học nhẫn nại.",
        mood_tag="calm",
        source_module="iching",
        source_reference_id="toss-12345",
        insights=["nhẫn nại", "tự cường"],
    )

    # Test create
    entry = await create_journal_entry(mock_db, user_id, create_data)
    assert entry.title == "Quan sát cảm xúc sau khi gieo quẻ Càn"
    assert entry.mood_tag == "calm"
    assert entry.user_id == user_id

    # Test update
    entry.id = uuid.uuid4()

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = entry
    mock_db.execute.return_value = mock_result

    fetched = await get_journal_entry_by_id(mock_db, user_id, entry.id)
    assert fetched is not None
    assert fetched.title == entry.title

    update_data = JournalEntryUpdate(title="Tiêu đề đã cập nhật")
    updated = await update_journal_entry(mock_db, user_id, entry.id, update_data)
    assert updated is not None
    assert updated.title == "Tiêu đề đã cập nhật"

    # Test delete
    success = await delete_journal_entry(mock_db, user_id, entry.id)
    assert success is True


@pytest.mark.asyncio
async def test_user_consultation_history_mapping() -> None:
    """Test mapping journal entries to consultation history timeline."""
    user_id = uuid.uuid4()
    mock_db = AsyncMock()

    entry1 = ReflectionJournalEntry(
        id=uuid.uuid4(),
        user_id=user_id,
        title="Rút bài Tarot 3 lá",
        content="Chiêm nghiệm bài học quá khứ và hiện tại.",
        mood_tag="reflective",
        source_module="tarot",
        source_reference_id="draw-999",
        insights=["hiểu mình"],
        created_at=datetime.now(UTC),
    )

    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [entry1]
    mock_db.execute.return_value = mock_result

    history = await get_user_consultation_history(mock_db, user_id)
    assert len(history) == 1
    assert history[0].module_type == "tarot"
    assert history[0].reference_id == "draw-999"
