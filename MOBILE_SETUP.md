# 📱 Mobile App Setup Guide - Capacitor

Panduan lengkap untuk build PJ.BOT AI Trading Agent sebagai mobile app menggunakan Capacitor.

## 🎯 Overview

Capacitor adalah framework dari Ionic yang memungkinkan build web app menjadi native mobile app untuk Android dan iOS.

**Features:**
- ✅ Build Android APK/AAB
- ✅ Build iOS IPA
- ✅ Hot reload untuk development
- ✅ Native plugins support
- ✅ Cross-platform codebase

## 📋 Prerequisites

### Untuk Android
- **Android Studio** (latest version)
- **Java JDK 17** atau lebih baru
- **Android SDK** (API level 22+)
- **Gradle** (biasanya sudah termasuk di Android Studio)

### Untuk iOS
- **macOS** (wajib untuk build iOS)
- **Xcode** (latest version)
- **CocoaPods** (`sudo gem install cocoapods`)
- **Apple Developer Account** (untuk deploy ke App Store)

## 🚀 Quick Start

### 1. Build Web App
```bash
npm run build
```

### 2. Sync ke Native Projects
```bash
# Sync ke Android
npx cap sync android

# Sync ke iOS
npx cap sync ios
```

### 3. Open di IDE
```bash
# Open di Android Studio
npx cap open android

# Open di Xcode
npx cap open ios
```

### 4. Build & Run
Di Android Studio / Xcode, klik **Run** untuk build dan install ke device/emulator.

## 📦 Build Production

### Android

#### Debug APK
```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK
```bash
npx cap sync android
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

#### Signed APK (untuk Play Store)
```bash
cd android
./gradlew assembleRelease -Pandroid.injected.signing.store.file=release-key.jks \
  -Pandroid.injected.signing.store.password=your_password \
  -Pandroid.injected.signing.key.alias=your_alias \
  -Pandroid.injected.signing.key.password=your_key_password
```

#### AAB (Android App Bundle)
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS

#### Development Build
```bash
npx cap sync ios
cd ios/App
pod install
open App.xcworkspace
```

Di Xcode:
1. Pilih development team
2. Pilih device/emulator
3. Klik **Run**

#### Archive untuk App Store
```bash
npx cap sync ios
cd ios/App
pod install
open App.xcworkspace
```

Di Xcode:
1. Product → Archive
2. Window → Organizer
3. Distribute App → App Store Connect

## 🔧 Configuration

### capacitor.config.ts

```typescript
{
  appId: 'com.pjbot.ai.trading',  // Bundle ID
  appName: 'PJ.BOT AI Trading',   // App name
  webDir: 'dist',                  // Web build output
  server: {
    androidScheme: 'https'         // Android scheme
  },
  // ... other configs
}
```

### Android Configuration

File: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.pjbot.ai.trading"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "2.0.0"
    }
}
```

### iOS Configuration

File: `ios/App/App.xcodeproj/project.pbxproj`

- Bundle Identifier: `com.pjbot.ai.trading`
- Version: `2.0.0`
- Build: `1`

## 🎨 Icons & Splash Screen

### Android

1. Generate icons menggunakan Android Studio:
   - Right-click `android/app/src/main/res` → New → Image Asset
   - Pilih icon image
   - Generate semua sizes

2. Splash screen:
   - Edit `android/app/src/main/res/values/styles.xml`
   - Edit `android/app/src/main/res/drawable/splash.png`

### iOS

1. Generate icons menggunakan Xcode:
   - Open `ios/App/Assets.xcassets/AppIcon.appiconset`
   - Drag & drop icon images (berbagai sizes)

2. Splash screen:
   - Edit `ios/App/Assets.xcassets/Splash.imageset`
   - Add splash images untuk berbagai device sizes

### Auto-generate Icons

Gunakan tool online:
- https://icon.kitchen/ (Capacitor Icon Generator)
- https://easyappicon.com/

## 📱 Native Features

### Status Bar
```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

await StatusBar.setStyle({ style: Style.Dark });
await StatusBar.setBackgroundColor({ color: '#050211' });
```

### Splash Screen
```typescript
import { SplashScreen } from '@capacitor/splash-screen';

await SplashScreen.hide();
```

### Keyboard
```typescript
import { Keyboard } from '@capacitor/keyboard';

Keyboard.addListener('keyboardWillShow', info => {
  console.log('Keyboard will show', info);
});
```

## 🐛 Debugging

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

## 📤 Deployment

### Google Play Store

1. Build AAB:
```bash
cd android
./gradlew bundleRelease
```

2. Upload ke Play Console:
   - https://play.google.com/console
   - Create new app
   - Upload AAB file
   - Fill app details
   - Submit for review

### Apple App Store

1. Archive di Xcode:
   - Product → Archive
   - Window → Organizer
   - Distribute App

2. Upload ke App Store Connect:
   - https://appstoreconnect.apple.com
   - Create new app
   - Upload build
   - Fill app details
   - Submit for review

## 🔐 Signing

### Android

1. Generate keystore:
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 \
  -validity 10000 -alias pjbot-key
```

2. Edit `android/key.properties`:
```properties
storePassword=your_password
keyPassword=your_key_password
keyAlias=pjbot-key
storeFile=release-key.jks
```

3. Edit `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file("key.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
            
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### iOS

1. Di Xcode:
   - Signing & Capabilities tab
   - Pilih team
   - Enable "Automatically manage signing"

2. Atau manual:
   - Download provisioning profile dari Apple Developer
   - Import ke Xcode
   - Select profile di build settings

## 📊 App Size

### Android
- APK size: ~15-20 MB
- AAB size: ~10-15 MB

### iOS
- IPA size: ~20-25 MB

## 🔧 Troubleshooting

### Android

**Error: "SDK location not found"**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=/path/to/android/sdk
```

**Error: "Gradle sync failed"**
```bash
cd android
./gradlew clean
./gradlew build
```

**Error: "Execution failed for task ':app:mergeDebugResources'"**
```bash
cd android
./gradlew clean
rm -rf .gradle
rm -rf build
```

### iOS

**Error: "No profiles for 'com.pjbot.ai.trading' were found"**
- Check provisioning profile di Xcode
- Download profile dari Apple Developer
- Import profile ke Xcode

**Error: "Command PhaseScriptExecution failed"**
```bash
cd ios/App
pod deintegrate
pod install
```

**Error: "The operation couldn't be completed"**
```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Setup](https://capacitorjs.com/docs/android)
- [iOS Setup](https://capacitorjs.com/docs/ios)
- [Native Plugins](https://capacitorjs.com/docs/plugins)

## 🆘 Support

Jika mengalami masalah:
1. Check troubleshooting section di atas
2. Search issues di GitHub
3. Buat issue baru dengan detail error

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Setup Complete
