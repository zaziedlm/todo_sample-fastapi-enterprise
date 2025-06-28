from sqlmodel import SQLModel, Field
from typing import Optional


class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    description: Optional[str] = Field(default=None)
    color: Optional[str] = Field(default=None)  # チャート用の色コード
