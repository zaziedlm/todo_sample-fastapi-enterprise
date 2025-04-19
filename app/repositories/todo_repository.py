from sqlmodel import Session, select
from app.models.todo import ToDo


class ToDoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get(self, todo_id: int) -> ToDo:
        return self.session.get(ToDo, todo_id)

    def get_all(self) -> list[ToDo]:
        todos = self.session.exec(select(ToDo)).all()
        return todos

    def create(self, todo: ToDo) -> ToDo:
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def update(self, todo: ToDo) -> ToDo:
        self.session.add(todo)
        self.session.commit()
        self.session.refresh(todo)
        return todo

    def delete(self, todo: ToDo):
        self.session.delete(todo)
        self.session.commit()
