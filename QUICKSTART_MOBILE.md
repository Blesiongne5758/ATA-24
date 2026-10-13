# 📱 Mobile App Quick Start

Panduan cepat untuk build PJ.BOT AI Trading Agent sebagai mobile app.

## ⚡ Quick Build (5 Steps)

### 1. Build Web App
```bash
npm run build
```

### 2. Add Platforms (First Time Only)
```bash
# Add Android
npx cap add android

# Add iOS (macOS only)
npx cap add ios
```

### 3. Sync Web to Native
```bash
# Sync to Android
npx cap sync android

# Sync to iOS
npx cap sync ios
```

### 4. Open in IDE
```bash
# Android Studio
npx cap open android

# Xcode (macOS only)
npx cap open ios
```

### 5. Build & Run
- **Android Studio**: Click **Run** ▶️
- **Xcode**: Click **Run** ▶️

---

## 📦 Build APK (Android)

### Debug APK (for testing)
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for distribution)
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

**Output**: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 📦 Build IPA (iOS - macOS only)

### Development Build
```bash
npm run build
npx cap sync ios
cd ios/App
pod install
open App.xcworkspace
```

In Xcode:
1. Select development team
2. Select device/emulator
3. Click **Run** ▶️

### Archive for App Store
```bash
npm run build
npx cap sync ios
cd ios/App
pod install
open App.xcworkspace
```

In Xcode:
1. Product → Archive
2. Window → Organizer
3. Distribute App → App Store Connect

---

## 🔄 Development with Hot Reload

### Android
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Sync and run
npx cap sync android
npx cap open android
```

In Android Studio, click **Run** ▶️

### iOS
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Sync and run
npx cap sync ios
npx cap open ios
```

In Xcode, click **Run** ▶️

---

## 🎨 Add Icons & Splash

### Auto-generate (Recommended)

Use online tool: https://icon.kitchen/

1. Upload your icon (1024x1024 PNG)
2. Select "Capacitor"
3. Download generated zip
4. Extract and copy to:
   - `android/app/src/main/res/` (Android)
   - `ios/App/App/Assets.xcassets/` (iOS)

### Manual

**Android:**
- Right-click `android/app/src/main/res` → New → Image Asset
- Select icon image
- Generate all sizes

**iOS:**
- Open `ios/App/Assets.xcassets/AppIcon.appiconset`
- Drag & drop icon images (various sizes)

---

## 🐛 Debug

### Android
```bash
# View logs
adb logcat | grep Capacitor

# Chrome DevTools
chrome://inspect/#devices
```

### iOS
```bash
# Safari Web Inspector
Safari → Develop → [Device] → [App]
```

---

## 📤 Deploy

### Google Play Store

1. Build AAB:
```bash
cd android
./gradlew bundleRelease
```

2. Upload to Play Console:
   - https://play.google.com/console
   - Create new app
   - Upload AAB
   - Submit for review

### Apple App Store

1. Archive in Xcode:
   - Product → Archive
   - Distribute App → App Store Connect

2. Upload to App Store Connect:
   - https://appstoreconnect.apple.com
   - Create new app
   - Upload build
   - Submit for review

---

## 🛠️ Common Commands

```bash
# Build web app
npm run build

# Sync to platforms
npx cap sync
npx cap sync android
npx cap sync ios

# Open in IDE
npx cap open android
npx cap open ios

# Run on device/emulator
npx cap run android
npx cap run ios

# Copy web assets
npx cap copy
npx cap copy android
npx cap copy ios

# Update native projects
npx cap update
npx cap update android
npx cap update ios
```

---

## 📋 Prerequisites Checklist

### Android
- [ ] Android Studio installed
- [ ] Java JDK 17+ installed
- [ ] Android SDK installed (API 22+)
- [ ] Environment variables set (ANDROID_HOME, JAVA_HOME)

### iOS (macOS only)
- [ ] Xcode installed
- [ ] CocoaPods installed (`sudo gem install cocoapods`)
- [ ] Apple Developer Account (for App Store)

---

## 🐛 Troubleshooting

### Android

**Error: "SDK location not found"**
```bash
export ANDROID_HOME=/path/to/android/sdk
```

**Error: "Gradle sync failed"**
```bash
cd android
./gradlew clean
./gradlew build
```

### iOS

**Error: "No profiles found"**
- Check provisioning profile in Xcode
- Download from Apple Developer

**Error: "Command PhaseScriptExecution failed"**
```bash
cd ios/App
pod deintegrate
pod install
```

---

## 📚 Full Documentation

See `MOBILE_SETUP.md` for complete documentation including:
- Detailed configuration
- Native features
- Signing & deployment
- Advanced troubleshooting

---

**Status**: ✅ Ready to Build  
**Next Step**: Run `npm run build` then `npx cap sync android` or `npx cap sync ios`

🎉 Ready to build mobile app!
