@echo off
start pwsh -NoExit -Command "cd '%~dp0'; uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
start pwsh -NoExit -Command "cd '%~dp0todo-frontend'; npm run dev"