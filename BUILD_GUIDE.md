# 🚀 PJ.BOT AI Trading Agent - Multi-Platform Build Guide

Panduan lengkap untuk build dan deploy aplikasi ke semua platform.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Web Application](#web-application)
4. [Desktop Application (Electron)](#desktop-application-electron)
5. [Mobile Application (Capacitor)](#mobile-application-capacitor)
6. [Quick Build Scripts](#quick-build-scripts)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Platform yang Didukung

| Platform | Technology | Output | Status |
|----------|-----------|--------|--------|
| **Web** | React + Vite | HTML/CSS/JS | ✅ Ready |
| **Windows** | Electron | .exe (Installer/Portable) | ✅ Ready |
| **macOS** | Electron | .dmg (Intel/Apple Silicon) | ✅ Ready |
| **Linux** | Electron | .AppImage, .deb, .rpm | ✅ Ready |
| **Android** | Capacitor | .apk, .aab | ✅ Ready |
| **iOS** | Capacitor | .ipa | ✅ Ready (macOS only) |

### Arsitektur

```
src/ (React + TypeScript + Tailwind)
    ↓
Vite Build
    ↓
dist/ (Web assets)
    ↓
├── Web Deployment (direct)
├── Electron (Desktop)
│   ├── Windows (.exe)
│   ├── macOS (.dmg)
│   └── Linux (.AppImage, .deb)
└── Capacitor (Mobile)
    ├── Android (.apk, .aab)
    └── iOS (.ipa)
```

---

## 📦 Prerequisites

### Common Requirements

- **Node.js**: v18.0.0 atau lebih baru
- **npm**: v8.0.0 atau lebih baru
- **Git**: Latest version

### Platform-Specific Requirements

#### Web Application
- ✅ Browser modern (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- ✅ Web server (Nginx, Apache, atau static hosting)

#### Desktop Application (Electron)

**Windows:**
- ✅ Windows 10/11 (64-bit)
- ✅ Visual Studio Build Tools ([Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/))
- ✅ Python 3.x (untuk native modules)

**macOS:**
- ✅ macOS 10.13 atau lebih baru
- ✅ Xcode Command Line Tools: `xcode-select --install`
- ✅ CocoaPods: `sudo gem install cocoapods`

**Linux:**
- ✅ Ubuntu 18.04+, Debian 10+, Fedora 32+, atau distro modern lainnya
- ✅ Build tools: `sudo apt-get install build-essential rpm fakeroot`

#### Mobile Application (Capacitor)

**Android:**
- ✅ Android Studio ([Download](https://developer.android.com/studio))
- ✅ Java JDK 17 atau lebih baru
- ✅ Android SDK (API level 22+)
- ✅ Environment variables:
  ```bash
  export ANDROID_HOME=/path/to/android/sdk
  export JAVA_HOME=/path/to/java/jdk
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

**iOS (macOS only):**
- ✅ Xcode ([App Store](https://apps.apple.com/app/xcode/id497799835))
- ✅ CocoaPods: `sudo gem install cocoapods`
- ✅ Apple Developer Account (untuk App Store)

---

## 🌐 Web Application

### Build

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Output

```
dist/
├── index.html          (3.19 KB)
├── assets/
│   ├── index.css       (44.43 KB, gzip: 7.69 KB)
│   └── index.js        (319.66 KB, gzip: 99.28 KB)
└── ...
```

### Deployment

#### Static Hosting (Netlify, Vercel, GitHub Pages)

```bash
# Build
npm run build

# Upload dist/ folder to hosting service
```

#### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/dist

    <Directory /path/to/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # SPA fallback
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
```

---

## 🖥️ Desktop Application (Electron)

### Setup

```bash
# Install Electron dependencies
npm install electron electron-builder concurrently wait-on cross-env --save-dev

# Copy Electron configuration
cp package.json.electron package.json
```

### Configuration Files

- `electron/main.js` - Main process
- `electron/preload.js` - Preload script
- `electron-builder.yml` - Build configuration
- `package.json.electron` - Template package.json

### Development

```bash
# Start development with hot-reload
npm run electron:dev
```

### Build

#### Windows

```bash
# Debug build
npm run electron:build:win

# Or use script
./build-electron.bat win
```

**Output:**
```
release/
├── PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe  (Installer, ~80MB)
└── PJ.BOT AI Trading Agent-2.0.0-x64.exe        (Portable, ~80MB)
```

#### macOS

```bash
# Build for Intel and Apple Silicon
npm run electron:build:mac

# Or use script
./build-electron.sh mac
```

**Output:**
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.dmg        (Intel, ~90MB)
└── PJ.BOT AI Trading Agent-2.0.0-arm64.dmg      (Apple Silicon, ~85MB)
```

#### Linux

```bash
# Build AppImage, deb, rpm
npm run electron:build:linux

# Or use script
./build-electron.sh linux
```

**Output:**
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.AppImage   (~85MB)
├── PJ.BOT AI Trading Agent-2.0.0-x64.deb        (~80MB)
└── PJ.BOT AI Trading Agent-2.0.0-x64.rpm        (~80MB)
```

#### All Platforms

```bash
# Build for all platforms (requires macOS for .dmg)
npm run electron:build:all

# Or use script
./build-electron.sh all
```

### Icons

Download icon from: https://image.qwenlm.ai/generated-images/9d5bd751-cd93-4ce4-93a1-050fc699d188/_result.png

Convert and save:
- **Windows**: `build/icon.ico` → https://convertico.com/
- **macOS**: `build/icon.icns` → https://cloudconvert.com/png-to-icns
- **Linux**: `build/icons/icon-256x256.png` (and other sizes)

### Code Signing (Optional)

#### Windows

```bash
# Set environment variables
export WIN_CSC_LINK="path/to/certificate.p12"
export WIN_CSC_KEY_PASSWORD="your-password"

# Build
npm run electron:build:win
```

#### macOS

```bash
# Import certificate to Keychain
# Set environment variable
export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"

# Build
npm run electron:build:mac
```

---

## 📱 Mobile Application (Capacitor)

### Setup

```bash
# Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios --save

# Add platforms (first time only)
npx cap add android
npx cap add ios  # macOS only
```

### Configuration

- `capacitor.config.ts` - Capacitor configuration

### Development

```bash
# Build web app
npm run build

# Sync to native
npx cap sync

# Open in IDE
npx cap open android  # Android Studio
npx cap open ios      # Xcode (macOS only)
```

### Build

#### Android

```bash
# Debug APK
./build-mobile.sh android debug

# Release APK
./build-mobile.sh android release

# AAB (for Play Store)
./build-mobile.sh android aab

# Or use batch script (Windows)
build-mobile.bat android debug
```

**Output:**
```
android/app/build/outputs/
├── apk/
│   ├── debug/app-debug.apk              (~15-20MB)
│   └── release/app-release-unsigned.apk (~15-20MB)
└── bundle/
    └── release/app-release.aab          (~10-15MB)
```

#### iOS (macOS only)

```bash
# Open in Xcode
./build-mobile.sh ios

# Then in Xcode:
# 1. Select development team
# 2. Select device/emulator
# 3. Click Run ▶️
```

**Output:**
- Development build: ~25-30MB
- App Store build: ~20-25MB

### Icons

Use https://icon.kitchen/ to generate icons:

1. Upload icon (1024x1024 PNG)
2. Select "Capacitor"
3. Download zip
4. Extract to:
   - `android/app/src/main/res/` (Android)
   - `ios/App/App/Assets.xcassets/` (iOS)

### Signing

#### Android

```bash
# Generate keystore
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 \
  -validity 10000 -alias pjbot-key

# Create android/key.properties
storePassword=your_password
keyPassword=your_key_password
keyAlias=pjbot-key
storeFile=release-key.jks

# Edit android/app/build.gradle (add signing config)
```

#### iOS

In Xcode:
1. Signing & Capabilities tab
2. Select team
3. Enable "Automatically manage signing"

---

## 🛠️ Quick Build Scripts

### Unified Build Script

```bash
# Build all platforms
./build-all.sh

# Build specific platforms
./build-all.sh web          # Web only
./build-all.sh desktop      # Desktop only
./build-all.sh mobile       # Mobile only
./build-all.sh web desktop  # Web + Desktop
./build-all.sh web mobile   # Web + Mobile
```

### Platform-Specific Scripts

**Desktop:**
```bash
./build-electron.sh [win|mac|linux|all]
build-electron.bat [win|all]  # Windows
```

**Mobile:**
```bash
./build-mobile.sh [android|ios|all] [debug|release|aab]
build-mobile.bat [android] [debug|release|aab]  # Windows
```

---

## 📤 Deployment

### Web

| Platform | Method | URL |
|----------|--------|-----|
| Netlify | Drag & drop `dist/` | https://app.netlify.com/drop |
| Vercel | `vercel deploy` | https://vercel.com |
| GitHub Pages | Push to `gh-pages` branch | https://pages.github.com |
| AWS S3 | Upload `dist/` to S3 bucket | https://aws.amazon.com/s3 |
| Cloudflare Pages | Connect Git repo | https://pages.cloudflare.com |

### Desktop

| Platform | Distribution |
|----------|--------------|
| Windows | GitHub Releases, Website download |
| macOS | Mac App Store, Website download |
| Linux | GitHub Releases, Snap Store, Flathub |

### Mobile

| Platform | Store | Requirements |
|----------|-------|--------------|
| Android | Google Play Store | AAB file, $25 one-time fee |
| iOS | Apple App Store | IPA file, $99/year developer account |

---

## 🐛 Troubleshooting

### Common Issues

#### Build Fails

**Error: "Module not found"**
```bash
rm -rf node_modules
npm install
```

**Error: "Electron not found"**
```bash
npm install electron --save-dev
```

**Error: "Capacitor not found"**
```bash
npm install @capacitor/cli --save-dev
```

#### Desktop Build Issues

**Windows: "MSB8036: The Windows SDK version was not found"**
- Install Windows SDK from Visual Studio Installer

**macOS: "Command PhaseScriptExecution failed"**
```bash
cd ios/App
pod deintegrate
pod install
```

**Linux: "Error while loading shared libraries"**
```bash
sudo apt-get install libgconf-2-4 libnotify4 libnss3 libxss1
```

#### Mobile Build Issues

**Android: "SDK location not found"**
```bash
export ANDROID_HOME=/path/to/android/sdk
```

**Android: "Gradle sync failed"**
```bash
cd android
./gradlew clean
./gradlew build
```

**iOS: "No profiles for 'com.pjbot.ai.trading' were found"**
- Check provisioning profile in Xcode
- Download from Apple Developer

**iOS: "Command PhaseScriptExecution failed"**
```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Performance Issues

**App is slow**
- Enable production mode: `NODE_ENV=production`
- Minimize bundle size: Check `npm run build` output
- Use code splitting for large components

**Memory leaks**
- Check for unmounted components with active subscriptions
- Use React DevTools Profiler
- Monitor with Chrome DevTools Memory tab

---

## 📊 Build Size Reference

| Platform | Development | Production | Compressed |
|----------|-------------|------------|------------|
| Web | ~500KB | ~320KB | ~100KB (gzip) |
| Windows | ~150MB | ~80MB | ~80MB |
| macOS | ~180MB | ~90MB | ~90MB |
| Linux | ~160MB | ~85MB | ~85MB |
| Android | ~30MB | ~20MB | ~15-20MB |
| iOS | ~40MB | ~25MB | ~20-25MB |

---

## ✅ Pre-Build Checklist

### Web
- [ ] All dependencies installed (`npm install`)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Tests passing
- [ ] Environment variables configured

### Desktop
- [ ] Web build successful
- [ ] Icon files in `build/` folder
- [ ] `package.json` updated from `package.json.electron`
- [ ] Code signing configured (optional)
- [ ] Tested in development mode

### Mobile
- [ ] Web build successful
- [ ] Platforms added (`npx cap add android/ios`)
- [ ] Icons generated and placed
- [ ] Signing configured
- [ ] Tested on device/emulator

---

## 📚 Additional Resources

### Documentation
- [Electron Documentation](https://www.electronjs.org/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

### Tools
- [Icon Generator](https://icon.kitchen/)
- [ICO Converter](https://convertico.com/)
- [ICNS Converter](https://cloudconvert.com/png-to-icns)

### Distribution
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

## 🆘 Support

If you encounter issues:

1. Check this documentation
2. Search existing GitHub issues
3. Create a new issue with:
   - Platform (Web/Desktop/Mobile)
   - OS and version
   - Error messages
   - Steps to reproduce

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ All Platforms Ready

🎉 **Ready to build for all platforms!**
