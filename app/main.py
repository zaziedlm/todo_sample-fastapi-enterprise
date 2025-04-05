from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine
from app.core.config import settings
from app.api.endpoints import todo

app = FastAPI(title="ToDo Sample App")

engine = create_engine(settings.DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(todo.router)
