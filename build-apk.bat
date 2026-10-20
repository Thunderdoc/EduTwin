@echo off
REM EduFlow Mobile App - APK Build Script for Windows
REM This script automates the entire APK build process

setlocal enabledelayedexpansion

echo ========================================================
echo      EduFlow Mobile App - APK Build Script
echo      Version 2.1.0
echo ========================================================
echo.

REM Check Node.js
echo [STEP 1] Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found
node -v

REM Check pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] pnpm is not installed. Installing pnpm...
    call npm install -g pnpm
)
echo [OK] pnpm found
pnpm -v

REM Check Java
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Java not found. Android build may fail.
    echo Please install Java JDK 17+ from: https://adoptium.net/
) else (
    echo [OK] Java found
    java -version
)

echo.
echo [STEP 2] Installing dependencies...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo [STEP 3] Building web application...
call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build web app
    pause
    exit /b 1
)
echo [OK] Web app built successfully

echo.
echo [STEP 4] Checking Capacitor setup...

REM Check if android folder exists
if not exist "android" (
    echo [INFO] Android platform not found. Adding Android platform...
    call npx cap add android
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to add Android platform
        pause
        exit /b 1
    )
    echo [OK] Android platform added
) else (
    echo [OK] Android platform already exists
)

echo.
echo [STEP 5] Syncing files to Android platform...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to sync files
    pause
    exit /b 1
)
echo [OK] Files synced successfully

echo.
echo ========================================================
echo  Build preparation complete!
echo ========================================================
echo.
echo [NEXT STEPS] To generate APK:
echo   1. Open Android Studio
echo   2. Open project from: %CD%\android
echo   3. Wait for Gradle sync to complete
echo   4. Click: Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo   5. APK will be at: android\app\build\outputs\apk\debug\app-debug.apk
echo.

REM Ask if user wants to open Android Studio
set /p OPEN_STUDIO="Would you like to open Android Studio now? (y/n): "
if /i "%OPEN_STUDIO%"=="y" (
    echo [INFO] Opening Android Studio...
    call npx cap open android
)

echo.
echo ========================================================
echo  Script completed successfully!
echo ========================================================
echo.

echo [BUILD INFO]
echo   App Name: EduFlow
echo   App ID: com.eduflow.app
echo   Version: 2.1.0
echo   Platform: Android
echo   Build Type: Debug
echo.

echo [RELEASE BUILD INFO]
echo For signed APK (for Play Store):
echo   1. Generate keystore (if not done already):
echo      keytool -genkey -v -keystore eduflow-release-key.jks ^
echo        -keyalg RSA -keysize 2048 -validity 10000 -alias eduflow-key
echo.
echo   2. In Android Studio:
echo      Build -^> Generate Signed Bundle / APK -^> APK
echo.

echo For detailed instructions, see: BUILD_MOBILE_APP.md
echo.

pause
