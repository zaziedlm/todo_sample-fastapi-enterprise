from sqlmodel import SQLModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class ExpenseBase(SQLModel):
    amount: Decimal
    category_id: int
    date: date
    memo: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseRead(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ExpenseUpdate(SQLModel):
    amount: Optional[Decimal] = None
    category_id: Optional[int] = None
    date: Optional[date] = None
    memo: Optional[str] = None


class ExpenseSummary(SQLModel):
    category_name: str
    category_id: int
    total_amount: Decimal
    color: Optional[str] = None


class MonthlyExpense(SQLModel):
    year: int
    month: int
    total_amount: Decimal


class DashboardData(SQLModel):
    monthly_total: Decimal
    category_summary: list[ExpenseSummary]
    monthly_trend: list[MonthlyExpense]
