@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

if not defined PORT set "PORT=3000"
if not defined HOST set "HOST=127.0.0.1"
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

if not exist "prisma\dev.db" (
  echo Preparing local database...
  call npm run db:migrate
  if errorlevel 1 (
    echo [ERROR] database migration failed.
    pause
    exit /b 1
  )
  call npm run db:seed
  if errorlevel 1 (
    echo [ERROR] database seed failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting DKT Motors website...
echo URL:   http://%HOST%:%PORT%
echo Admin: http://%HOST%:%PORT%/admin
echo Local admin account: %ADMIN_USER% / %ADMIN_PASSWORD%
echo.
echo Press Ctrl+C to stop the service.
echo.

start "" "http://%HOST%:%PORT%"
call npm run dev -- --hostname %HOST% --port %PORT%

endlocal
