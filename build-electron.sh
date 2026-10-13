#!/bin/bash

# PJ.BOT AI Trading Agent - Electron Build Script
# Usage: ./build-electron.sh [platform]
# Platforms: win, mac, linux, all

set -e

PLATFORM=${1:-all}

echo "🚀 PJ.BOT AI Trading Agent - Electron Build Script"
echo "=================================================="
echo ""

# Check if package.json has electron config
if ! grep -q "electron" package.json; then
    echo "⚠️  package.json belum dikonfigurasi untuk Electron"
    echo "📋 Copy konfigurasi dari package.json.electron..."
    cp package.json.electron package.json
    echo "✅ package.json updated"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check build folder
if [ ! -d "build" ]; then
    echo "📁 Creating build folder..."
    mkdir -p build
    echo "⚠️  Please add icon files to build/ folder:"
    echo "   - Windows: build/icon.ico"
    echo "   - macOS: build/icon.icns"
    echo "   - Linux: build/icons/ (multiple PNG sizes)"
    echo ""
fi

# Build based on platform
case $PLATFORM in
    win|windows)
        echo "🪟 Building for Windows..."
        npm run build
        npx electron-builder --win
        echo ""
        echo "✅ Windows build complete!"
        echo "📦 Output: release/*.exe"
        ;;
    mac|macos)
        echo "🍎 Building for macOS..."
        npm run build
        npx electron-builder --mac
        echo ""
        echo "✅ macOS build complete!"
        echo "📦 Output: release/*.dmg"
        ;;
    linux)
        echo "🐧 Building for Linux..."
        npm run build
        npx electron-builder --linux
        echo ""
        echo "✅ Linux build complete!"
        echo "📦 Output: release/*.AppImage, release/*.deb"
        ;;
    all)
        echo "🌍 Building for all platforms..."
        npm run build
        npx electron-builder --win --mac --linux
        echo ""
        echo "✅ All platforms build complete!"
        echo "📦 Output: release/"
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Usage: ./build-electron.sh [win|mac|linux|all]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Build process finished!"
echo "📂 Check release/ folder for output files"
