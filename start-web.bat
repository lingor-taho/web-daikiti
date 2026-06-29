@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

if not defined PORT set "PORT=13000"
if not defined HOST set "HOST=0.0.0.0"
if not defined PUBLIC_HOST set "PUBLIC_HOST=43.165.177.49"
if not defined DATABASE_URL set "DATABASE_URL=file:./dev.db"
if not defined ADMIN_USER set "ADMIN_USER=admin"
if not defined ADMIN_PASSWORD set "ADMIN_PASSWORD=admin123"

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Please install Node.js first.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting DKT Motors demo...
echo Public URL:  http://%PUBLIC_HOST%:%PORT%
echo Local URL:   http://127.0.0.1:%PORT%
echo Admin:       http://%PUBLIC_HOST%:%PORT%/admin
echo Admin login: %ADMIN_USER% / %ADMIN_PASSWORD%
echo.
echo Press Ctrl+C to stop.
echo.

start "" "http://127.0.0.1:%PORT%"
call npm run dev -- --hostname %HOST% --port %PORT%

endlocal
