@echo off
REM ============================================
REM Soltan SM Tracker - Validation Script (Windows)
REM ============================================

cls
echo.
echo =========================================
echo   Soltan SM Tracker - Setup Validation
echo =========================================
echo.

setlocal enabledelayedexpansion
set PASS=0
set FAIL=0

REM Test 1: Node.js installed
echo [1] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo ✓ PASS: Node.js !NODE_VER! is installed
    set /a PASS+=1
) else (
    echo ✗ FAIL: Node.js is not installed
    set /a FAIL+=1
)

REM Test 2: npm installed
echo [2] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
    echo ✓ PASS: npm !NPM_VER! is installed
    set /a PASS+=1
) else (
    echo ✗ FAIL: npm is not installed
    set /a FAIL+=1
)

REM Test 3: Frontend node_modules
echo [3] Checking frontend dependencies...
if exist "node_modules\" (
    echo ✓ PASS: Frontend node_modules exists
    set /a PASS+=1
) else (
    echo ⚠ WARNING: node_modules not found. Run 'npm install' in root
    set /a FAIL+=1
)

REM Test 4: Backend node_modules
echo [4] Checking backend dependencies...
if exist "server\node_modules\" (
    echo ✓ PASS: Backend node_modules exists
    set /a PASS+=1
) else (
    echo ⚠ WARNING: server\node_modules not found
    set /a FAIL+=1
)

REM Test 5: .env file
echo [5] Checking .env file...
if exist "server\.env" (
    echo ✓ PASS: server\.env exists
    set /a PASS+=1
) else (
    echo ⚠ WARNING: server\.env not found
    set /a FAIL+=1
)

REM Test 6: .env.example file
echo [6] Checking .env.example file...
if exist "server\.env.example" (
    echo ✓ PASS: server\.env.example exists
    set /a PASS+=1
) else (
    echo ✗ FAIL: server\.env.example not found
    set /a FAIL+=1
)

REM Test 7: package.json (frontend)
echo [7] Checking frontend package.json...
if exist "package.json" (
    echo ✓ PASS: Frontend package.json found
    set /a PASS+=1
) else (
    echo ✗ FAIL: Frontend package.json not found
    set /a FAIL+=1
)

REM Test 8: package.json (backend)
echo [8] Checking backend package.json...
if exist "server\package.json" (
    echo ✓ PASS: Backend package.json found
    set /a PASS+=1
) else (
    echo ✗ FAIL: Backend package.json not found
    set /a FAIL+=1
)

REM Test 9: server.js exists
echo [9] Checking server.js...
if exist "server\server.js" (
    echo ✓ PASS: server\server.js found
    set /a PASS+=1
) else (
    echo ✗ FAIL: server\server.js not found
    set /a FAIL+=1
)

echo.
echo =========================================
echo   Test Results
echo =========================================
echo Passed: !PASS!
echo Failed: !FAIL!
echo.

if !FAIL! equ 0 (
    echo ✓ All checks passed! Ready to start.
    echo.
    echo Run the project with:
    echo   Terminal 1: cd server ^&^& npm start
    echo   Terminal 2: npm run dev
    echo.
    pause
    exit /b 0
) else (
    echo ✗ Some checks failed. Please fix the issues above.
    echo.
    echo Quick fixes:
    echo   1. npm install (in root folder)
    echo   2. cd server ^&^& npm install
    echo   3. Copy server\.env.example to server\.env
    echo.
    pause
    exit /b 1
)
