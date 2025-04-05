from sqlmodel import Session
from app.models.todo import ToDo
from app.repositories.todo_repository import ToDoRepository
from app.api.schemas.todo import ToDoCreate, ToDoUpdate

class ToDoService:
    def __init__(self, session: Session):
        self.repo = ToDoRepository(session)

    def get_todo(self, todo_id: int) -> ToDo:
        return self.repo.get(todo_id)

    def list_todos(self) -> list[ToDo]:
        return self.repo.get_all()

    def create_todo(self, todo_data: ToDoCreate) -> ToDo:
        todo = ToDo(**todo_data.dict())
        return self.repo.create(todo)

    def update_todo(self, todo_id: int, todo_data: ToDoUpdate) -> ToDo | None:
        todo = self.repo.get(todo_id)
        if not todo:
            return None
        update_data = todo_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(todo, key, value)
        return self.repo.update(todo)

    def delete_todo(self, todo_id: int) -> ToDo | None:
        todo = self.repo.get(todo_id)
        if not todo:
            return None
        self.repo.delete(todo)
        return todo
