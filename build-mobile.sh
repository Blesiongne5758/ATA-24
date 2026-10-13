#!/bin/bash

# PJ.BOT AI Trading Agent - Mobile Build Script
# Usage: ./build-mobile.sh [platform] [type]
# Platforms: android, ios, all
# Types: debug, release, aab (Android only)

set -e

PLATFORM=${1:-android}
BUILD_TYPE=${2:-debug}

echo "📱 PJ.BOT AI Trading Agent - Mobile Build Script"
echo "================================================"
echo "Platform: $PLATFORM"
echo "Build Type: $BUILD_TYPE"
echo ""

# Build web app
echo "🔨 Building web app..."
npm run build
echo "✅ Web app built"
echo ""

# Sync to native
echo "🔄 Syncing to native..."
npx cap sync $PLATFORM
echo "✅ Sync complete"
echo ""

# Build based on platform and type
case $PLATFORM in
    android)
        cd android
        case $BUILD_TYPE in
            debug)
                echo "🔧 Building debug APK..."
                ./gradlew assembleDebug
                echo ""
                echo "✅ Debug APK built!"
                echo "📦 Output: android/app/build/outputs/apk/debug/app-debug.apk"
                ;;
            release)
                echo "🔧 Building release APK..."
                ./gradlew assembleRelease
                echo ""
                echo "✅ Release APK built!"
                echo "📦 Output: android/app/build/outputs/apk/release/app-release-unsigned.apk"
                ;;
            aab)
                echo "🔧 Building AAB for Play Store..."
                ./gradlew bundleRelease
                echo ""
                echo "✅ AAB built!"
                echo "📦 Output: android/app/build/outputs/bundle/release/app-release.aab"
                ;;
            *)
                echo "❌ Unknown build type: $BUILD_TYPE"
                echo "Usage: ./build-mobile.sh android [debug|release|aab]"
                exit 1
                ;;
        esac
        ;;
    ios)
        if [[ "$OSTYPE" != "darwin"* ]]; then
            echo "❌ iOS build is only available on macOS"
            exit 1
        fi
        cd ios/App
        echo "🔧 Installing pods..."
        pod install
        echo ""
        echo "✅ Pods installed"
        echo ""
        echo "📦 Opening Xcode..."
        open App.xcworkspace
        echo ""
        echo "✅ Xcode opened!"
        echo "👉 Click Run ▶️ to build and run on device/emulator"
        ;;
    all)
        echo "🌍 Building for all platforms..."
        
        # Android
        echo ""
        echo "📱 Building Android..."
        cd android
        ./gradlew assembleDebug
        cd ..
        echo "✅ Android built"
        
        # iOS (macOS only)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo ""
            echo "🍎 Building iOS..."
            cd ios/App
            pod install
            cd ../..
            echo "✅ iOS built"
        else
            echo ""
            echo "⚠️  Skipping iOS (macOS only)"
        fi
        
        echo ""
        echo "✅ All platforms built!"
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Usage: ./build-mobile.sh [android|ios|all] [debug|release|aab]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Build process finished!"
