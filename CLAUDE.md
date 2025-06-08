# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (FastAPI)
- Install dependencies: `pip install -r requirements.txt` or `poetry install`
- Run development server: `uvicorn app.main:app --reload`
- Database migration: `bash scripts/migrate.sh`
- Create database directly: `python create_db.py`
- Run tests: `pytest tests/`

### Frontend (Next.js)
- Navigate to frontend: `cd todo-frontend`
- Install dependencies: `npm install`
- Run development server: `npm run dev`  
- Build: `npm run build`
- Lint: `npm run lint`

## Architecture Overview

This is a full-stack ToDo application with enterprise-level architecture:

### Backend Structure (FastAPI + SQLModel)
- **Layered Architecture**: Models → Repositories → Services → API Endpoints
- **app/models/**: SQLModel definitions for database entities
- **app/repositories/**: Data access layer with database operations
- **app/services/**: Business logic layer
- **app/api/endpoints/**: FastAPI route handlers
- **app/core/config.py**: Application configuration using Pydantic settings

### Frontend Structure (Next.js + TypeScript)
- **todo-frontend/app/**: Next.js App Router structure
- **todo-frontend/app/components/**: React components (TodoForm, TodoItem, TodoList)
- **todo-frontend/app/api/**: API client for backend communication
- **todo-frontend/app/types/**: TypeScript type definitions

### Key Technologies
- **FastAPI-MCP**: Model Context Protocol server for AI agent integration
- **SQLModel**: Type-safe ORM with Pydantic integration
- **Alembic**: Database migration management
- **SQLite**: Default database (configurable via DATABASE_URL)

### Database Configuration
- Production DB: `todo.db`
- Test DB: `test.db` (automatically used in tests)
- Connection string configurable via `DATABASE_URL` environment variable

### Testing
- Backend tests use pytest with TestClient
- Tests automatically use separate test database
- Frontend uses Next.js built-in testing capabilities

### Cross-Origin Setup
- CORS configured for `http://localhost:3000` (Next.js dev server)
- Backend runs on `http://localhost:8000` by default
- MCP endpoint available at `http://localhost:8000/mcp`