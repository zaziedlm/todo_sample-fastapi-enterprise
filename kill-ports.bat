@echo off
echo Terminating processes on ports 8000 and 3000...

REM Detect and terminate processes on port 8000
echo Checking port 8000...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') DO (
  echo Terminating process using port 8000 (PID: %%P)
  taskkill /PID %%P /F 2>nul
)

REM Detect and terminate processes on port 3000
echo Checking port 3000...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') DO (
  echo Terminating process using port 3000 (PID: %%P)
  taskkill /PID %%P /F 2>nul
)

echo Done. Ports 8000 and 3000 have been released.
pause
