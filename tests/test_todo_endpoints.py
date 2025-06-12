import os
import sys
from pathlib import Path
import time

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session

# テスト用のパスを設定
BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(BASE_DIR))

# テスト用DBのURLを設定
TEST_DB_PATH = "test.db"
TEST_DB_URL = f"sqlite:///./{TEST_DB_PATH}"
os.environ["DATABASE_URL"] = TEST_DB_URL

from app.main import app  # noqa: E402
from app.core.config import settings  # noqa: E402


def setup_test_db():
    """テスト用データベースを設定する"""
    test_engine = create_engine(settings.DATABASE_URL)
    SQLModel.metadata.create_all(test_engine)
    return test_engine


@pytest.fixture
def client():
    """テスト用のAPIクライアントを提供する"""
    return TestClient(app)


@pytest.fixture(autouse=True)
def clear_db():
    """各テスト前後にデータベースをクリーンアップする"""
    # 既存のDBがあれば削除
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except PermissionError:
            # 使用中の場合は少し待ってから再試行
            time.sleep(1)
            try:
                os.remove(TEST_DB_PATH)
            except Exception:
                pass  # 削除できなくても続行

    # テスト用のDBとテーブルを作成
    engine = setup_test_db()
    
    yield
    
    # テスト終了後に接続を閉じてからDBを削除
    engine.dispose()
    time.sleep(0.5)  # 少し待ってからファイル操作
    
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except PermissionError:
            pass  # テスト終了時に削除できなくても無視


def test_create_and_get_todo(client):
    """TODOの作成と取得をテスト"""
    # Create a new todo item
    todo_data = {"title": "Buy milk", "description": "2 liters"}
    resp = client.post("/todos/", json=todo_data)
    
    assert resp.status_code == 201
    created = resp.json()
    assert created["id"] is not None
    assert created["title"] == todo_data["title"]
    assert created["description"] == todo_data["description"]
    assert created["completed"] is False

    # Retrieve list of todos
    resp = client.get("/todos/")
    assert resp.status_code == 200
    todos = resp.json()
    assert len(todos) == 1
    assert todos[0]["id"] == created["id"]
    assert todos[0]["title"] == todo_data["title"]
    assert todos[0]["description"] == todo_data["description"]
