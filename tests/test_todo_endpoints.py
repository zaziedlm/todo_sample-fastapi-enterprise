import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from fastapi.testclient import TestClient
from sqlmodel import Session
from app.main import app, engine
from app.models.todo import ToDo


def test_create_and_get_todo():
    with TestClient(app) as client:
        create_payload = {"title": "Test Todo", "description": "Test description"}
        response = client.post("/todos/", json=create_payload)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == create_payload["title"]
        assert data["description"] == create_payload["description"]
        assert data["completed"] is False

        todo_id = data["id"]
        get_response = client.get(f"/todos/{todo_id}")
        assert get_response.status_code == 200
        assert get_response.json() == data

        list_response = client.get("/todos/")
        assert list_response.status_code == 200
        assert any(item["id"] == todo_id for item in list_response.json())

        # verify record exists in the database
        with Session(engine) as session:
            todo_in_db = session.get(ToDo, todo_id)
            assert todo_in_db is not None
            assert todo_in_db.title == create_payload["title"]
            assert todo_in_db.description == create_payload["description"]
