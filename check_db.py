from sqlmodel import create_engine, Session, select
from app.models.expense_entry import ExpenseEntry
from app.core.config import settings

def main():
    print(f"Database URL: {settings.DATABASE_URL}")
    engine = create_engine(settings.DATABASE_URL, echo=True)
    with Session(engine) as session:
        entries = session.exec(select(ExpenseEntry)).all()
        print(f"Total entries: {len(entries)}")
        for entry in entries:
            print(f"ID: {entry.id}, Date: {entry.date}, Type: {entry.entry_type}, Category: {entry.category}, Amount: {entry.amount}, Description: {entry.description}")

if __name__ == "__main__":
    main()
