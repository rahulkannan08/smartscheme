@echo off
echo ========================================
echo    SMART SCHEME - Backend Quick Start
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/4] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo.
echo [3/4] Checking MongoDB connection...
echo Please make sure MongoDB is running on your system
echo For Windows: MongoDB should be running as a service
echo For other OS: Run 'sudo systemctl start mongod' or equivalent
echo.

echo [4/4] Starting the backend server...
echo.
echo 🚀 Backend will be available at: http://localhost:5000
echo 📊 API Documentation: http://localhost:5000/api/v2/schemes
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause 