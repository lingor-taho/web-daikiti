@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

if not defined PORT set "PORT=13000"
if not defined HOST set "HOST=0.0.0.0"
if not defined BROWSER_HOST set "BROWSER_HOST=127.0.0.1"
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

echo Preparing database schema...
call npm run db:deploy
if errorlevel 1 (
  echo [ERROR] database migration failed.
  pause
  exit /b 1
)

call npm run db:seed-if-empty
if errorlevel 1 (
  echo [ERROR] database seed check failed.
  pause
  exit /b 1
)

echo.
echo Starting DKT Motors website...
echo Local URL:   http://%BROWSER_HOST%:%PORT%
echo Public URL:  http://%PUBLIC_HOST%:%PORT%
echo Admin:       http://%PUBLIC_HOST%:%PORT%/admin
echo Local admin account: %ADMIN_USER% / %ADMIN_PASSWORD%
echo.
echo Press Ctrl+C to stop the service.
echo.

if "%SKIP_BUILD%"=="1" (
  echo Skipping production build.
) else (
  echo Building production app...
  call npm run build
  if errorlevel 1 (
    echo [ERROR] npm run build failed.
    pause
    exit /b 1
  )
)

start "" "http://%BROWSER_HOST%:%PORT%"
call npm run start -- --hostname %HOST% --port %PORT%

endlocal
