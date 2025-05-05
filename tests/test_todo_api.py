import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.models.todo import ToDo
from app.core.config import settings

# テスト用のインメモリSQLiteデータベースを作成
TEST_DATABASE_URL = "sqlite://"  # インメモリデータベース
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


# テスト用のセッション作成関数
def get_test_session():
    with Session(test_engine) as session:
        yield session


# テスト全体のセットアップと破棄を行うフィクスチャ
@pytest.fixture(scope="module")
def setup_test_db():
    # テスト用DBのテーブル作成
    SQLModel.metadata.create_all(test_engine)
    
    # テスト用の依存関係オーバーライドの設定
    from app.api.endpoints.todo import get_session
    app.dependency_overrides[get_session] = get_test_session
    
    yield  # テスト実行
    
    # テスト終了後のクリーンアップ
    SQLModel.metadata.drop_all(test_engine)
    app.dependency_overrides = {}


# テスト用クライアントを作成するフィクスチャ
@pytest.fixture
def client(setup_test_db):
    # テスト用のクライアントを返す
    with TestClient(app) as test_client:
        yield test_client


# 各テスト間でデータベースをクリーンアップするフィクスチャ
@pytest.fixture(autouse=True)
def clean_db():
    # テスト前にデータベースをクリーンアップ
    with Session(test_engine) as session:
        session.query(ToDo).delete()
        session.commit()
    yield


# テストケース：ToDoの作成
def test_create_todo(client):
    # リクエストデータの準備
    todo_data = {
        "title": "テストタスク",
        "description": "これはテスト用のタスクです"
    }
    
    # POSTリクエストを送信
    response = client.post("/todos/", json=todo_data)
    
    # レスポンスの検証
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == todo_data["title"]
    assert data["description"] == todo_data["description"]
    assert data["completed"] is False
    assert "id" in data


# テストケース：全ToDoの取得
def test_read_todos(client):
    # テストデータの作成
    todo_data1 = {"title": "タスク1", "description": "説明1"}
    todo_data2 = {"title": "タスク2", "description": "説明2"}
    
    # テストデータをDBに登録
    client.post("/todos/", json=todo_data1)
    client.post("/todos/", json=todo_data2)
    
    # GETリクエストを送信
    response = client.get("/todos/")
    
    # レスポンスの検証
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2  # 少なくとも2つのToDoが存在する
    assert any(item["title"] == "タスク1" for item in data)
    assert any(item["title"] == "タスク2" for item in data)


# テストケース：特定のToDoの取得
def test_read_todo(client):
    # テストデータの作成
    todo_data = {"title": "個別タスク", "description": "個別の説明"}
    response = client.post("/todos/", json=todo_data)
    todo_id = response.json()["id"]
    
    # GETリクエストを送信
    response = client.get(f"/todos/{todo_id}")
    
    # レスポンスの検証
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == todo_data["title"]
    assert data["description"] == todo_data["description"]


# テストケース：存在しないToDoの取得
def test_read_todo_not_found(client):
    # 存在しないIDでGETリクエストを送信
    response = client.get("/todos/999")
    
    # レスポンスの検証
    assert response.status_code == 404
    assert response.json()["detail"] == "ToDo not found"


# テストケース：ToDoの更新
def test_update_todo(client):
    # テストデータの作成
    todo_data = {"title": "更新前タスク", "description": "更新前の説明"}
    response = client.post("/todos/", json=todo_data)
    todo_id = response.json()["id"]
    
    # 更新データの準備
    update_data = {
        "title": "更新後タスク",
        "description": "更新後の説明",
        "completed": True
    }
    
    # PUTリクエストを送信
    response = client.put(f"/todos/{todo_id}", json=update_data)
    
    # レスポンスの検証
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == update_data["title"]
    assert data["description"] == update_data["description"]
    assert data["completed"] == update_data["completed"]


# テストケース：部分的なToDoの更新
def test_partial_update_todo(client):
    # テストデータの作成
    todo_data = {"title": "部分更新前", "description": "部分更新前の説明"}
    response = client.post("/todos/", json=todo_data)
    todo_id = response.json()["id"]
    
    # 部分的な更新データの準備（completedのみ更新）
    update_data = {"completed": True}
    
    # PUTリクエストを送信
    response = client.put(f"/todos/{todo_id}", json=update_data)
    
    # レスポンスの検証
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == todo_id
    assert data["title"] == todo_data["title"]  # タイトルは変わらない
    assert data["description"] == todo_data["description"]  # 説明も変わらない
    assert data["completed"] == True  # completedだけが更新される


# テストケース：存在しないToDoの更新
def test_update_todo_not_found(client):
    # 更新データの準備
    update_data = {"title": "存在しないタスク"}
    
    # 存在しないIDでPUTリクエストを送信
    response = client.put("/todos/999", json=update_data)
    
    # レスポンスの検証
    assert response.status_code == 404
    assert response.json()["detail"] == "ToDo not found"


# テストケース：ToDoの削除
def test_delete_todo(client):
    # テストデータの作成
    todo_data = {"title": "削除用タスク", "description": "削除される説明"}
    response = client.post("/todos/", json=todo_data)
    todo_id = response.json()["id"]
    
    # DELETEリクエストを送信
    response = client.delete(f"/todos/{todo_id}")
    
    # レスポンスの検証
    assert response.status_code == 200
    deleted_todo = response.json()
    assert deleted_todo["id"] == todo_id
    
    # 削除されたことを確認
    response = client.get(f"/todos/{todo_id}")
    assert response.status_code == 404


# テストケース：存在しないToDoの削除
def test_delete_todo_not_found(client):
    # 存在しないIDでDELETEリクエストを送信
    response = client.delete("/todos/999")
    
    # レスポンスの検証
    assert response.status_code == 404
    assert response.json()["detail"] == "ToDo not found"