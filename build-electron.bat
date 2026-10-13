@echo off
REM PJ.BOT AI Trading Agent - Electron Build Script for Windows
REM Usage: build-electron.bat [platform]
REM Platforms: win, all

echo.
echo 🚀 PJ.BOT AI Trading Agent - Electron Build Script
echo ==================================================
echo.

REM Check if package.json has electron config
findstr /C:"electron" package.json >nul
if errorlevel 1 (
    echo ⚠️  package.json belum dikonfigurasi untuk Electron
    echo 📋 Copy konfigurasi dari package.json.electron...
    copy package.json.electron package.json
    echo ✅ package.json updated
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo ✅ Dependencies installed
echo.

REM Check build folder
if not exist "build" (
    echo 📁 Creating build folder...
    mkdir build
    echo ⚠️  Please add icon files to build/ folder:
    echo    - Windows: build/icon.ico
    echo    - macOS: build/icon.icns
    echo    - Linux: build/icons/ (multiple PNG sizes)
    echo.
)

REM Build based on platform
set PLATFORM=%1
if "%PLATFORM%"=="" set PLATFORM=all

if "%PLATFORM%"=="win" goto :buildwin
if "%PLATFORM%"=="all" goto :buildall
goto :unknown

:buildwin
echo 🪟 Building for Windows...
call npm run build
call npx electron-builder --win
echo.
echo ✅ Windows build complete!
echo 📦 Output: release\*.exe
goto :end

:buildall
echo 🌍 Building for all platforms...
call npm run build
call npx electron-builder --win --mac --linux
echo.
echo ✅ All platforms build complete!
echo 📦 Output: release\
goto :end

:unknown
echo ❌ Unknown platform: %PLATFORM%
echo Usage: build-electron.bat [win|all]
exit /b 1

:end
echo.
echo 🎉 Build process finished!
echo 📂 Check release\ folder for output files
pause
