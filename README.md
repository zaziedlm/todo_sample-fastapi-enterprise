
---

# ToDo Sample App: Enterprise Edition

## 概要
このプロジェクトは、Pythonベースのフレームワーク「FastAPI」を利用したToDoアプリケーションです。以下のようなモジュールやツールを採用して、エンタープライズ向けのアーキテクチャを構築しています。

## 特徴
- **FastAPI**: 高速なAPI開発を可能にするPythonフレームワーク。
- **SQLModel**: ORM（Object Relational Mapper）を利用したデータベース操作。
- **Alembic**: データベースマイグレーションの管理を支援。
- **uv**: 高速で現代的なPython依存関係管理ツール。
- **Next.js 15**: React Appルーターとモダンなフロントエンド機能。
- **Docker/Docker Compose**: 環境構築とデプロイの簡易化。(未検証)
- **モジュール構成**: 明確に分離されたモデル・サービス・リポジトリ層。
- **FastAPI-MCP**: Model Context Protocol サーバーとして動作し、AIエージェントとの連携が可能。

## プロジェクト構成
以下は、このプロジェクトの主要なディレクトリとファイルの構成です。

```
app/                   # バックエンド（FastAPI）
├── main.py            # FastAPIアプリケーションのエントリーポイント
├── core/config.py     # アプリケーション設定
├── models/todo.py     # ToDoモデル定義
├── services/          # ビジネスロジック層
└── repositories/      # データアクセス層

todo-frontend/         # フロントエンド（Next.js）
├── app/               # Next.js App Router
├── components/        # Reactコンポーネント
├── api/              # バックエンドAPI通信
└── types/            # TypeScript型定義

pyproject.toml        # uv依存関係管理
start-project.sh      # フルスタック起動スクリプト

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
### uvのインストール
このプロジェクトでは依存関係管理に`uv`を使用しています。まだインストールしていない場合は、以下のコマンドでインストールしてください：

#### Windows (PowerShell)
```powershell
iwr -useb https://astral.sh/uv/install.ps1 | iex
```

#### Linux/macOS/WSL
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 依存関係のインストール（uv 推奨、高速で現代的なパッケージマネージャー）
```bash
uv sync --dev
```

従来の方法（互換性維持）：
```bash
# Pip使用の場合
pip install -r requirements.txt
```

### データベースのマイグレーション
uv環境でAlembicを実行します：
```bash
bash scripts/migrate.sh
```

### データベースのマイグレーションに失敗する場合など、DBを直接作成
```bash
uv run python create_db.py
```
プロジェクトフォルダー直下に、todo.db というデータベースファイルが作成されます

### アプリケーションの起動

#### フルスタック起動（推奨）
バックエンド（FastAPI）とフロントエンド（Next.js）を同時起動：
```bash
./start-project.sh
```
- バックエンド: `http://localhost:8000`
- フロントエンド: `http://localhost:3000`

#### 個別起動
バックエンドのみ：
```bash
uv run uvicorn app.main:app --reload
```

フロントエンドのみ：
```bash
cd todo-frontend
npm run dev
```

Docker Composeを利用する場合（未検証）：
```bash
docker-compose up
```

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

### バックエンド
- **言語**: Python 3.11+
- **フレームワーク**: FastAPI
- **ORM**: SQLModel
- **データベース**: SQLite
- **マイグレーション**: Alembic
- **依存関係管理**: uv
- **AI連携**: FastAPI-MCP（Model Context Protocol）

### フロントエンド
- **言語**: TypeScript
- **フレームワーク**: Next.js 15 (App Router)
- **ライブラリ**: React 19
- **スタイリング**: Tailwind CSS
- **HTTP クライアント**: Axios

### 開発環境
- **コンテナ**: Docker, Docker Compose（未検証）
- **起動スクリプト**: Bash

## 開発に貢献したい方へ
1. Issueを確認し、新しいIssueを作成してください。
2. プルリクエストを通じて貢献してください。

---
