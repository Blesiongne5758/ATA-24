@echo off
REM PJ.BOT AI Trading Agent - Mobile Build Script for Windows
REM Usage: build-mobile.bat [platform] [type]
REM Platforms: android
REM Types: debug, release, aab

echo.
echo 📱 PJ.BOT AI Trading Agent - Mobile Build Script
echo ================================================
echo.

set PLATFORM=%1
set BUILD_TYPE=%2

if "%PLATFORM%"=="" set PLATFORM=android
if "%BUILD_TYPE%"=="" set BUILD_TYPE=debug

echo Platform: %PLATFORM%
echo Build Type: %BUILD_TYPE%
echo.

REM Build web app
echo 🔨 Building web app...
call npm run build
if errorlevel 1 (
    echo ❌ Web build failed
    exit /b 1
)
echo ✅ Web app built
echo.

REM Sync to native
echo 🔄 Syncing to native...
call npx cap sync %PLATFORM%
if errorlevel 1 (
    echo ❌ Sync failed
    exit /b 1
)
echo ✅ Sync complete
echo.

REM Build based on platform and type
if "%PLATFORM%"=="android" goto :android
if "%PLATFORM%"=="ios" goto :ios_error
goto :unknown

:android
cd android
if "%BUILD_TYPE%"=="debug" goto :android_debug
if "%BUILD_TYPE%"=="release" goto :android_release
if "%BUILD_TYPE%"=="aab" goto :android_aab
goto :unknown_type

:android_debug
echo 🔧 Building debug APK...
call gradlew assembleDebug
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)
echo.
echo ✅ Debug APK built!
echo 📦 Output: android\app\build\outputs\apk\debug\app-debug.apk
goto :end

:android_release
echo 🔧 Building release APK...
call gradlew assembleRelease
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)
echo.
echo ✅ Release APK built!
echo 📦 Output: android\app\build\outputs\apk\release\app-release-unsigned.apk
goto :end

:android_aab
echo 🔧 Building AAB for Play Store...
call gradlew bundleRelease
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)
echo.
echo ✅ AAB built!
echo 📦 Output: android\app\build\outputs\bundle\release\app-release.aab
goto :end

:ios_error
echo ❌ iOS build is only available on macOS
exit /b 1

:unknown
echo ❌ Unknown platform: %PLATFORM%
echo Usage: build-mobile.bat [android] [debug^|release^|aab]
exit /b 1

:unknown_type
echo ❌ Unknown build type: %BUILD_TYPE%
echo Usage: build-mobile.bat android [debug^|release^|aab]
exit /b 1

:end
echo.
echo 🎉 Build process finished!
pause
