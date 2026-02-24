@echo off
echo Starting Backend...
start "Backend API" cmd /k "cd backend && python -m uvicorn main:app --reload"

echo Starting Frontend...
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo.
echo Application is starting. Please wait a moment.
echo Once started, open your browser to: http://localhost:5175
pause
