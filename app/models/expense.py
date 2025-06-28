from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date
from decimal import Decimal


class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: Decimal = Field(decimal_places=2)
    category_id: int = Field(foreign_key="category.id")
    date: date
    memo: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
