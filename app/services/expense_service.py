from sqlmodel import Session
from app.models.expense_entry import ExpenseEntry
from app.repositories.expense_repository import ExpenseRepository
from typing import List, Optional
from datetime import date, datetime


class ExpenseEntryCreate:
    def __init__(self, date: date, entry_type: str, category: str, amount: int, description: str = None):
        self.date = date
        self.entry_type = entry_type
        self.category = category
        self.amount = amount
        self.description = description

    def dict(self):
        return {
            "date": self.date,
            "entry_type": self.entry_type,
            "category": self.category,
            "amount": self.amount,
            "description": self.description
        }


class ExpenseEntryUpdate:
    def __init__(self, date: date = None, entry_type: str = None, category: str = None, 
                 amount: int = None, description: str = None):
        self.date = date
        self.entry_type = entry_type
        self.category = category
        self.amount = amount
        self.description = description

    def dict(self, exclude_unset: bool = False):
        data = {}
        if self.date is not None:
            data["date"] = self.date
        if self.entry_type is not None:
            data["entry_type"] = self.entry_type
        if self.category is not None:
            data["category"] = self.category
        if self.amount is not None:
            data["amount"] = self.amount
        if self.description is not None:
            data["description"] = self.description
        return data


class ExpenseService:
    def __init__(self, session: Session):
        self.repo = ExpenseRepository(session)

    def get_entry(self, entry_id: int) -> Optional[ExpenseEntry]:
        return self.repo.get(entry_id)

    def list_entries(self) -> List[ExpenseEntry]:
        return self.repo.get_all()

    def get_entries_by_date_range(self, start_date: date, end_date: date) -> List[ExpenseEntry]:
        return self.repo.get_by_date_range(start_date, end_date)

    def get_monthly_summary(self, year: int, month: int) -> dict:
        return self.repo.get_monthly_summary(year, month)

    def create_entry(self, entry_data: ExpenseEntryCreate) -> ExpenseEntry:
        entry = ExpenseEntry(**entry_data.dict())
        return self.repo.create(entry)

    def update_entry(self, entry_id: int, entry_data: ExpenseEntryUpdate) -> Optional[ExpenseEntry]:
        entry = self.repo.get(entry_id)
        if not entry:
            return None
        update_data = entry_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(entry, key, value)
        return self.repo.update(entry)

    def delete_entry(self, entry_id: int) -> Optional[ExpenseEntry]:
        entry = self.repo.get(entry_id)
        if not entry:
            return None
        self.repo.delete(entry)
        return entry