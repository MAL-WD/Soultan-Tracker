@echo off
REM ============================================
REM Soltan SM Tracker - Automated Setup Script
REM ============================================

cls
echo.
echo ========================================
echo   Soltan SM Tracker Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing backend dependencies
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

REM Check if .env exists, if not create from .env.example
if not exist ".env" (
    echo Creating .env file...
    if exist ".env.example" (
        copy .env.example .env
        echo ✅ .env file created from .env.example
        echo ⚠️  IMPORTANT: Edit server\.env and update MONGODB_URI, JWT_SECRET
    ) else (
        echo ⚠️  .env.example not found, creating basic .env...
        (
            echo MONGODB_URI=mongodb://localhost:27017/soltan-tracker
            echo PORT=5000
            echo JWT_SECRET=your_secret_key_change_this
            echo NODE_ENV=development
        ) > .env
        echo ✅ .env file created
    )
) else (
    echo ✅ .env already exists
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Starting application...
echo.
echo Opening 2 terminals:
echo   - Terminal 1: Backend server (port 5000)
echo   - Terminal 2: Frontend dev server (port 5173)
echo.
pause

cd ..

REM Start backend in new terminal
start cmd /k "cd server && npm start"

REM Wait a bit then start frontend in new terminal
timeout /t 3 /nobreak
start cmd /k "npm run dev"

echo.
echo ========================================
echo 🎉 Application is starting!
echo ========================================
echo.
echo Open your browser and go to: http://localhost:5173
echo.
pause
