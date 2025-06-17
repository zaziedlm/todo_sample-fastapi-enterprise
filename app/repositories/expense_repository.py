from sqlmodel import Session, select, func
from app.models.expense_entry import ExpenseEntry, EntryType
from typing import List, Optional
from datetime import datetime, date


class ExpenseRepository:
    def __init__(self, session: Session):
        self.session = session

    def get(self, entry_id: int) -> Optional[ExpenseEntry]:
        return self.session.get(ExpenseEntry, entry_id)

    def get_all(self) -> List[ExpenseEntry]:
        entries = self.session.exec(select(ExpenseEntry).order_by(ExpenseEntry.date.desc())).all()
        return entries

    def get_by_date_range(self, start_date: date, end_date: date) -> List[ExpenseEntry]:
        # 日付のみの比較を行うために、datetimeオブジェクトのdate部分で比較する
        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date, datetime.max.time())
        
        print(f"Searching between {start_datetime} and {end_datetime}")
        
        entries = self.session.exec(
            select(ExpenseEntry)
            .where(ExpenseEntry.date >= start_datetime)
            .where(ExpenseEntry.date <= end_datetime)
            .order_by(ExpenseEntry.date.desc())
        ).all()
        
        print(f"Found {len(entries)} entries")
        for entry in entries:
            print(f"  - ID: {entry.id}, Date: {entry.date}")
            
        return entries

    def get_monthly_summary(self, year: int, month: int) -> dict:
        start_date = datetime(year, month, 1).date()
        if month == 12:
            end_date = datetime(year + 1, 1, 1).date()
        else:
            end_date = datetime(year, month + 1, 1).date()
        
        entries = self.session.exec(
            select(ExpenseEntry)
            .where(ExpenseEntry.date >= start_date)
            .where(ExpenseEntry.date < end_date)
        ).all()
        
        total_income = sum(entry.amount for entry in entries if entry.entry_type == EntryType.INCOME)
        total_expense = sum(entry.amount for entry in entries if entry.entry_type == EntryType.EXPENSE)
        
        return {
            "year": year,
            "month": month,
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": total_income - total_expense,
            "entries": entries
        }

    def create(self, entry: ExpenseEntry) -> ExpenseEntry:
        self.session.add(entry)
        self.session.commit()
        self.session.refresh(entry)
        return entry

    def update(self, entry: ExpenseEntry) -> ExpenseEntry:
        entry.updated_at = datetime.now()
        self.session.add(entry)
        self.session.commit()
        self.session.refresh(entry)
        return entry

    def delete(self, entry: ExpenseEntry):
        self.session.delete(entry)
        self.session.commit()