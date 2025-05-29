
---

# ToDo Sample App: Enterprise Edition

## 概要
このプロジェクトは、Pythonベースのフレームワーク「FastAPI」を利用したToDoアプリケーションです。以下のようなモジュールやツールを採用して、エンタープライズ向けのアーキテクチャを構築しています。

## 特徴
- **FastAPI**: 高速なAPI開発を可能にするPythonフレームワーク。
- **SQLModel**: ORM（Object Relational Mapper）を利用したデータベース操作。
- **Alembic**: データベースマイグレーションの管理を支援。
- **Docker/Docker Compose**: 環境構築とデプロイの簡易化。(未検証)
- **モジュール構成**: 明確に分離されたモデル・サービス・リポジトリ層。
- **FastAPI-MCP**: Model Context Protocol サーバーとして動作し、AIエージェントとの連携が可能。

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
### 依存関係のインストール（Poetry 推奨、検証済のため）
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

## Model Context Protocol（MCP）サーバーとしての機能
このアプリケーションはFastAPI-MCPを採用しており、Model Context Protocol（MCP）サーバーとして動作します。MCPは、AIエージェント（GitHub Copilot、ChatGPTなど）とアプリケーションを接続するためのプロトコルです。

### 主な機能
- AI エージェントがアプリケーションのコンテキストを理解できるようにする
- AIとアプリケーション間の双方向通信を実現
- AIエージェントによるアプリケーションの操作・制御を可能に

### MCPエンドポイント
- `http://localhost:8000/mcp` - MCPサーバーのエンドポイント
- VS Codeなどの開発環境からMCP対応のAIエージェントを使用して、このエンドポイントに接続することで、AIがアプリケーションのコンテキストを理解し、より精度の高い支援を提供できます。

### 活用例
- AIによるアプリケーションのバグ診断と修正
- コードの自動生成と改善提案
- データ分析とレポート生成の自動化
- ユーザーのクエリに基づいたインタラクティブな応答

MCPを活用することで、AIエージェントとToDoアプリケーションが直接連携し、より高度な機能や効率的な開発体験を提供します。

## 使用技術
- **言語**: Python 3.11+
- **フレームワーク**: FastAPI
- **ORM**: SQLModel
- **開発環境**: Docker, Docker Compose
- **マイグレーション**: Alembic
- **AI連携**: FastAPI-MCP（Model Context Protocol）

## 開発に貢献したい方へ
1. Issueを確認し、新しいIssueを作成してください。
2. プルリクエストを通じて貢献してください。

---
