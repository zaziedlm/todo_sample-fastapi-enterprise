from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, create_engine
from app.core.config import settings
from app.services.todo_service import ToDoService
from app.api.schemas.todo import ToDoCreate, ToDoRead, ToDoUpdate

router = APIRouter(prefix="/todos", tags=["todos"])

engine = create_engine(settings.DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


@router.get("/", response_model=list[ToDoRead])
def read_todos(session: Session = Depends(get_session)):
    service = ToDoService(session)
    return service.list_todos()


@router.get("/{todo_id}", response_model=ToDoRead)
def read_todo(todo_id: int, session: Session = Depends(get_session)):
    service = ToDoService(session)
    todo = service.get_todo(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="ToDo not found")
    return todo


@router.post("/", response_model=ToDoRead, status_code=201)
def create_todo(todo: ToDoCreate, session: Session = Depends(get_session)):
    service = ToDoService(session)
    return service.create_todo(todo)


@router.put("/{todo_id}", response_model=ToDoRead)
def update_todo(
    todo_id: int, todo_data: ToDoUpdate, session: Session = Depends(get_session)
):
    service = ToDoService(session)
    updated = service.update_todo(todo_id, todo_data)
    if not updated:
        raise HTTPException(status_code=404, detail="ToDo not found")
    return updated


@router.delete("/{todo_id}", response_model=ToDoRead)
def delete_todo(todo_id: int, session: Session = Depends(get_session)):
    service = ToDoService(session)
    deleted = service.delete_todo(todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="ToDo not found")
    return deleted
