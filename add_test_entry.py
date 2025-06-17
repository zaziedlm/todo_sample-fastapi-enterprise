from sqlmodel import create_engine, Session
from app.models.expense_entry import ExpenseEntry, EntryType, Category
from app.core.config import settings
from datetime import datetime, date

def main():
    engine = create_engine(settings.DATABASE_URL)
    with Session(engine) as session:
        # 今日のデータを作成
        today_date = datetime(2025, 6, 17)
        entry = ExpenseEntry(
            date=today_date,
            entry_type=EntryType.EXPENSE,
            category=Category.FOOD,
            amount=1000,  # 10.00
            description="Test expense entry for 2025-06-17"
        )
        session.add(entry)
        session.commit()
        print(f"Created entry with ID: {entry.id}")
        print(f"Entry date: {entry.date}")

if __name__ == "__main__":
    main()
