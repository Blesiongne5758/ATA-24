@echo off
REM PJ.BOT AI Trading Agent - Unified Build Script for Windows
REM Usage: build-all.bat [platforms...]
REM Platforms: web, desktop, mobile, all

setlocal enabledelayedexpansion

set PLATFORMS=%*
if "%PLATFORMS%"=="" set PLATFORMS=all

echo.
echo 🚀 PJ.BOT AI Trading Agent - Multi-Platform Build
echo ==================================================
echo Platforms: %PLATFORMS%
echo.

REM Function to build web
:build_web
echo 🌐 Building Web Application...
call npm run build
if errorlevel 1 (
    echo ❌ Web build failed
    exit /b 1
)
echo ✅ Web build complete!
echo 📦 Output: dist\
echo.
goto :eof

REM Function to build desktop
:build_desktop
echo 🖥️  Building Desktop Application...

REM Check if electron is configured
findstr /C:"electron" package.json >nul
if errorlevel 1 (
    echo ⚠️  package.json belum dikonfigurasi untuk Electron
    echo 📋 Copy konfigurasi dari package.json.electron...
    copy package.json.electron package.json
    call npm install
)

REM Check if build folder exists
if not exist "build" (
    echo ⚠️  Please add icon files to build\ folder
    echo    - Windows: build\icon.ico
)

REM Build for Windows
call npm run electron:build:win
if errorlevel 1 (
    echo ❌ Desktop build failed
    exit /b 1
)

echo ✅ Desktop build complete!
echo 📦 Output: release\
echo.
goto :eof

REM Function to build mobile
:build_mobile
echo 📱 Building Mobile Application...

REM Check if capacitor is installed
call npm list @capacitor/core >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Capacitor not installed. Installing...
    call npm install @capacitor/core @capacitor/cli @capacitor/android
)

REM Build web first
call npm run build

REM Add platforms if not exists
if not exist "android" (
    echo 📱 Adding Android platform...
    call npx cap add android
)

REM Sync
call npx cap sync

echo ✅ Mobile sync complete!
echo.
echo 📦 Next steps:
echo    Android: npx cap open android → Build in Android Studio
echo.
goto :eof

REM Main logic
if "%PLATFORMS%"=="all" (
    call :build_web
    call :build_desktop
    call :build_mobile
    goto :end
)

if "%PLATFORMS%"=="web" call :build_web
if "%PLATFORMS%"=="desktop" call :build_desktop
if "%PLATFORMS%"=="mobile" call :build_mobile

:end
echo.
echo 🎉 All builds complete!
echo.
echo 📂 Output locations:
echo    Web: dist\
echo    Desktop: release\
echo    Mobile: android\app\build\
pause
