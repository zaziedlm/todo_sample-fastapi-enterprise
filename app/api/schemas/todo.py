from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ToDoCreate(BaseModel):
    title: str
    description: Optional[str] = None


class ToDoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class ToDoRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime

    class Config:
        orm_mode = True
