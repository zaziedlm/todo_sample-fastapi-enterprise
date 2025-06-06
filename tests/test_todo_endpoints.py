import os
import sys
from pathlib import Path
import time

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

# テスト用DBのURLを設定
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

# Ensure the application package is on the path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from app.main import app  # noqa: E402


# テスト用に新しいDBセットアップ関数を作成
def setup_test_db():
    from app.core.config import settings
    from sqlmodel import SQLModel, create_engine
    test_engine = create_engine(settings.DATABASE_URL)
    SQLModel.metadata.create_all(test_engine)
    return test_engine


@pytest.fixture(autouse=True)
def clear_db():
    """Ensure a clean test database for each test."""
    db_path = "test.db"
    # 既存のDBがあれば削除
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except PermissionError:
            # 使用中の場合は少し待ってから再試行
            time.sleep(1)
            try:
                os.remove(db_path)
            except:
                pass  # 削除できなくても続行

    # テスト用のDBとテーブルを作成
    engine = setup_test_db()
    
    yield
    
    # テスト終了後に接続を閉じてからDBを削除
    engine.dispose()
    time.sleep(0.5)  # 少し待ってからファイル操作
    
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except PermissionError:
            pass  # テスト終了時に削除できなくても無視


def test_create_and_get_todo():
    client = TestClient(app)

    # Create a new todo item
    resp = client.post(
        "/todos/",
        json={"title": "Buy milk", "description": "2 liters"},
    )
    assert resp.status_code == 201
    created = resp.json()
    assert created["id"] is not None
    assert created["title"] == "Buy milk"
    assert created["description"] == "2 liters"
    assert created["completed"] is False

    # Retrieve list of todos
    resp = client.get("/todos/")
    assert resp.status_code == 200
    todos = resp.json()
    assert len(todos) == 1
    assert todos[0]["id"] == created["id"]
    assert todos[0]["title"] == "Buy milk"
    assert todos[0]["description"] == "2 liters"
