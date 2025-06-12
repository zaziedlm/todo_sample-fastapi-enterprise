#!/bin/bash

echo "Starting FastAPI backend..."
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting Next.js frontend..."
cd todo-frontend
npm run dev &
FRONTEND_PID=$!

echo "FastAPI backend started on http://localhost:8000 (PID: $BACKEND_PID)"
echo "Next.js frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait