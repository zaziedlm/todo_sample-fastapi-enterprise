from pydantic import BaseModel
from typing import Optional


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

    class Config:
        orm_mode = True
