@echo off
start pwsh -NoExit -Command "cd '%~dp0'; python -m uvicorn app.main:app --reload --port 8000"
start pwsh -NoExit -Command "cd '%~dp0todo-frontend'; npm run dev"