# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (FastAPI)
- Install dependencies: `uv sync` (installs from pyproject.toml)
- Install dev dependencies: `uv sync --dev`
- Run development server: `uv run uvicorn app.main:app --reload`
- Database migration: `bash scripts/migrate.sh` (uses uv internally)
- Create database directly: `uv run python create_db.py`
- Run tests: `uv run pytest tests/`
- Run single test: `uv run pytest tests/test_specific.py::test_function_name`

### Full Stack Development
- Start both backend and frontend: `bash start-project.sh` (uses uv for backend)

### Frontend (Next.js)
- Navigate to frontend: `cd todo-frontend`
- Install dependencies: `npm install`
- Run development server: `npm run dev` (uses Turbopack for faster builds)
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

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
- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe frontend development
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework

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