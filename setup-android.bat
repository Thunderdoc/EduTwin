@echo off
REM EduFlow Android Setup Script for Windows
REM This script prepares your project for Android APK building

echo.
echo ========================================
echo   EduFlow - Android APK Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo OK: Node.js found
node --version

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing pnpm...
    npm install -g pnpm
)

echo OK: pnpm found
pnpm --version

REM Step 1: Install dependencies
echo.
echo [Step 1] Installing dependencies...
call pnpm install

REM Step 2: Build the web app
echo.
echo [Step 2] Building web application...
call pnpm build

REM Check if dist folder was created
if not exist "dist" (
    echo ERROR: Build failed - dist folder not created
    pause
    exit /b 1
)

echo OK: Web app built successfully

REM Step 3: Add Android platform
echo.
echo [Step 3] Adding Android platform...

if exist "android" (
    echo WARNING: Android platform already exists. Skipping...
) else (
    call npx cap add android
    echo OK: Android platform added
)

REM Step 4: Sync web app to Android
echo.
echo [Step 4] Syncing web app to Android...
call npx cap sync android

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo To build the APK, you have two options:
echo.
echo Option 1 - Android Studio (Recommended):
echo   1. Open Android Studio
echo   2. Open the 'android' folder from this project
echo   3. Click Build - Build Bundle(s) / APK(s) - Build APK(s)
echo   4. Find APK in: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Option 2 - Command Line:
echo   cd android
echo   gradlew.bat assembleDebug
echo.
echo Prerequisites Required:
echo   - Android Studio installed
echo   - Android SDK configured
echo   - Java JDK 17 installed
echo.
echo For detailed instructions, see BUILD_APK_GUIDE.md
echo ========================================
echo.
pause
