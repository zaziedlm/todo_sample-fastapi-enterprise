---

# ToDo Sample App: Enterprise Edition

## 概要
このプロジェクトは、Pythonベースのフレームワーク「FastAPI」を利用したToDoアプリケーションです。以下のようなモジュールやツールを採用して、エンタープライズ向けのアーキテクチャを構築しています。

## 特徴
- **FastAPI**: 高速なAPI開発を可能にするPythonフレームワーク。
- **SQLModel**: ORM（Object Relational Mapper）を利用したデータベース操作。
- **Alembic**: データベースマイグレーションの管理を支援。
- **Docker/Docker Compose**: 環境構築とデプロイの簡易化。
- **モジュール構成**: 明確に分離されたモデル・サービス・リポジトリ層。

## プロジェクト構成
以下は、このプロジェクトの主要なディレクトリとファイルの構成です。

```
app/
├── main.py            # FastAPIアプリケーションのエントリーポイント
├── core/config.py     # アプリケーション設定
├── models/todo.py     # ToDoモデル定義
├── services/          # ビジネスロジック層
└── repositories/      # データアクセス層

docker/
├── Dockerfile         # Dockerイメージのビルド定義
└── docker-compose.yml # サービス起動構成

migrations/
├── script.py.mako     # Alembic用スクリプトテンプレート
└── env.py             # マイグレーション設定

scripts/
└── migrate.sh         # マイグレーションスクリプト
```

## セットアップ
### 依存関係のインストール
Pip導入している場合：
```bash
pip install -r requirements.txt
```
Poetry導入している場合：
```bash
poetry install
```

### データベースのマイグレーション
現状は、Windows環境動作向けに Python経由でAlembicを実行する内容です。Linux/bash の場合は、コメントアウト部を参照方
```bash
bash scripts/migrate.sh
```

### データベースのマイグレーションに失敗する場合など、DBを直接作成
```bash
create_db.py
```
プロジェクトフォルダー直下に、test.db というデータベースファイルが作成されます

### アプリケーションの起動
ローカル環境で起動する場合：
```bash
uvicorn app.main:app --reload
```
Docker Composeを利用して起動する場合：
```bash
docker-compose up
```

ブラウザで `http://127.0.0.1:8000`あるいは、`http://localhost:8000` を開いて、アプリケーションにアクセスできます。

## 使用技術
- **言語**: Python 3.11+
- **フレームワーク**: FastAPI
- **ORM**: SQLModel
- **開発環境**: Docker, Docker Compose
- **マイグレーション**: Alembic

## 開発に貢献したい方へ
1. Issueを確認し、新しいIssueを作成してください。
2. プルリクエストを通じて貢献してください。

---
