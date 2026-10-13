#!/bin/bash

# PJ.BOT AI Trading Agent - Unified Build Script
# Usage: ./build-all.sh [platforms...]
# Platforms: web, desktop, mobile, all

set -e

PLATFORMS=${@:-all}

echo "🚀 PJ.BOT AI Trading Agent - Multi-Platform Build"
echo "=================================================="
echo "Platforms: $PLATFORMS"
echo ""

# Function to build web
build_web() {
    echo "🌐 Building Web Application..."
    npm run build
    echo "✅ Web build complete!"
    echo "📦 Output: dist/"
    echo ""
}

# Function to build desktop
build_desktop() {
    echo "🖥️  Building Desktop Application..."
    
    # Check if electron is configured
    if ! grep -q "electron" package.json; then
        echo "⚠️  package.json belum dikonfigurasi untuk Electron"
        echo "📋 Copy konfigurasi dari package.json.electron..."
        cp package.json.electron package.json
        npm install
    fi
    
    # Check if build folder exists
    if [ ! -d "build" ]; then
        echo "⚠️  Please add icon files to build/ folder"
        echo "   - Windows: build/icon.ico"
        echo "   - macOS: build/icon.icns"
        echo "   - Linux: build/icons/"
    fi
    
    # Build for current platform
    if [[ "$OSTYPE" == "darwin"* ]]; then
        npm run electron:build:mac
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        npm run electron:build:win
    else
        npm run electron:build:linux
    fi
    
    echo "✅ Desktop build complete!"
    echo "📦 Output: release/"
    echo ""
}

# Function to build mobile
build_mobile() {
    echo "📱 Building Mobile Application..."
    
    # Check if capacitor is installed
    if ! npm list @capacitor/core > /dev/null 2>&1; then
        echo "⚠️  Capacitor not installed. Installing..."
        npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
    fi
    
    # Build web first
    npm run build
    
    # Add platforms if not exists
    if [ ! -d "android" ]; then
        echo "📱 Adding Android platform..."
        npx cap add android
    fi
    
    if [[ "$OSTYPE" == "darwin"* ]] && [ ! -d "ios" ]; then
        echo "📱 Adding iOS platform..."
        npx cap add ios
    fi
    
    # Sync
    npx cap sync
    
    echo "✅ Mobile sync complete!"
    echo ""
    echo "📦 Next steps:"
    echo "   Android: npx cap open android → Build in Android Studio"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   iOS: npx cap open ios → Build in Xcode"
    fi
    echo ""
}

# Parse platforms
if [[ "$PLATFORMS" == *"all"* ]]; then
    build_web
    build_desktop
    build_mobile
else
    if [[ "$PLATFORMS" == *"web"* ]]; then
        build_web
    fi
    
    if [[ "$PLATFORMS" == *"desktop"* ]]; then
        build_desktop
    fi
    
    if [[ "$PLATFORMS" == *"mobile"* ]]; then
        build_mobile
    fi
fi

echo "🎉 All builds complete!"
echo ""
echo "📂 Output locations:"
echo "   Web: dist/"
echo "   Desktop: release/"
echo "   Mobile: android/app/build/ & ios/App/build/"
