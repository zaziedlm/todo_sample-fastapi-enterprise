from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class EntryType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class Category(str, Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    HOUSING = "housing"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    SHOPPING = "shopping"
    SALARY = "salary"
    BONUS = "bonus"
    OTHER = "other"


class ExpenseEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime
    entry_type: EntryType
    category: Category
    amount: int = Field(description="Amount in cents to avoid floating point issues")
    description: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default=None)