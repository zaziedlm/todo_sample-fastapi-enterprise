from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.models.expense_entry import EntryType, Category


class ExpenseEntryCreate(BaseModel):
    date: date
    entry_type: EntryType
    category: Category
    amount: int
    description: Optional[str] = None


class ExpenseEntryUpdate(BaseModel):
    date: Optional[date] = None
    entry_type: Optional[EntryType] = None
    category: Optional[Category] = None
    amount: Optional[int] = None
    description: Optional[str] = None


class ExpenseEntryRead(BaseModel):
    id: int
    date: date
    entry_type: EntryType
    category: Category
    amount: int
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class MonthlySummary(BaseModel):
    year: int
    month: int
    total_income: int
    total_expense: int
    balance: int
    entries: List[ExpenseEntryRead]