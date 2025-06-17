# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド / Development Commands

### バックエンド (FastAPI)
- 依存関係のインストール: `uv sync` (pyproject.tomlから)
- 開発依存関係も含めて: `uv sync --dev`
- 開発サーバー起動: `uv run uvicorn app.main:app --reload`
- データベースマイグレーション: `bash scripts/migrate.sh` (内部でuvを使用)
- データベース直接作成: `uv run python create_db.py`
- テスト実行: `uv run pytest tests/`
- 個別テスト実行: `uv run pytest tests/test_specific.py::test_function_name`

### フルスタック開発
- バックエンド・フロントエンド同時起動: `bash start-project.sh` (バックエンドでuvを使用)

### フロントエンド (Next.js)
- フロントエンドディレクトリへ移動: `cd todo-frontend`
- 依存関係インストール: `npm install`
- 開発サーバー起動: `npm run dev` (Turbopackによる高速ビルド)
- プロダクションビルド: `npm run build`
- プロダクションサーバー起動: `npm start`
- Lint実行: `npm run lint`

## アーキテクチャ概要 / Architecture Overview

エンタープライズレベルのフルスタックToDoアプリケーション

### バックエンド構造 (FastAPI + SQLModel)
- **レイヤードアーキテクチャ**: Models → Repositories → Services → API Endpoints
- **app/models/**: データベースエンティティのSQLModel定義
- **app/repositories/**: データアクセス層、DB操作
- **app/services/**: ビジネスロジック層
- **app/api/endpoints/**: FastAPIルートハンドラー
- **app/core/config.py**: Pydantic設定によるアプリケーション設定

### フロントエンド構造 (Next.js + TypeScript)
- **todo-frontend/app/**: Next.js App Router構造
- **todo-frontend/app/components/**: Reactコンポーネント (TodoForm, TodoItem, TodoList)
- **todo-frontend/app/api/**: バックエンド通信用APIクライアント
- **todo-frontend/app/types/**: TypeScript型定義

### 主要技術 / Key Technologies
- **FastAPI-MCP**: AIエージェント統合用Model Context Protocolサーバー
- **SQLModel**: Pydantic統合型安全ORM
- **Alembic**: データベースマイグレーション管理
- **SQLite**: デフォルトDB (DATABASE_URLで設定変更可能)
- **Next.js 15**: App Router + Turbopack対応Reactフレームワーク
- **TypeScript**: 型安全フロントエンド開発
- **Axios**: API通信用HTTPクライアント
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク

### データベース設定 / Database Configuration
- 本番DB: `todo.db`
- テストDB: `test.db` (テスト時自動使用)
- 接続文字列: `DATABASE_URL`環境変数で設定可能

### テスト / Testing
- バックエンド: pytest + TestClient使用
- テスト時は自動的に別DBを使用
- フロントエンド: Next.js標準テスト機能

### CORS設定 / Cross-Origin Setup
- `http://localhost:3000` (Next.js開発サーバー) 向けCORS設定済み
- バックエンドデフォルトポート: `http://localhost:8000`
- MCPエンドポイント: `http://localhost:8000/mcp`

## Development Notes
- Uses uv for Python dependency management (fast, modern Python package manager)
- Python requirements defined in pyproject.toml using PEP 621 format
- Frontend uses Next.js 15 with App Router structure
- Database file names: `todo.db` (production), `test.db` (testing)
- WSL2 support: Use provided PowerShell scripts for port forwarding if needed

## uv Migration Notes
- Migrated from Poetry to uv for faster dependency resolution and installation
- All commands now use `uv run` prefix for script execution
- Dependencies managed through standard pyproject.toml [project] section