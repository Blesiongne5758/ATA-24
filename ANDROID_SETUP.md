# 📱 Android Studio Setup Guide

Panduan lengkap untuk setup Android Studio dan build Android app.

## 📥 Install Android Studio

### 1. Download
- https://developer.android.com/studio

### 2. Install
- Run installer
- Select "Standard" installation type
- Accept all defaults
- Wait for SDK download

### 3. First Launch
- Select "Do not import settings"
- Choose UI theme (Darcula recommended)
- Install Android SDK
- Accept licenses

## 🔧 Setup SDK

### 1. Open SDK Manager
- File → Settings → Languages & Frameworks → Android SDK
- Or: Tools → SDK Manager

### 2. SDK Platforms Tab
Install:
- ✅ Android 14.0 (API 34)
- ✅ Android 13.0 (API 33)
- ✅ Android 12.0 (API 31)
- ✅ Android 11.0 (API 30)

### 3. SDK Tools Tab
Install:
- ✅ Android SDK Build-Tools
- ✅ Android SDK Platform-Tools
- ✅ Android SDK Command-line Tools
- ✅ Android Emulator
- ✅ Google Play services

## 🌍 Environment Variables

### Windows
```cmd
# System Properties → Environment Variables

ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk-17

# Add to PATH:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\emulator
```

### macOS/Linux
```bash
# ~/.bashrc or ~/.zshrc

export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# or
export ANDROID_HOME=$HOME/Android/Sdk  # Linux

export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home  # macOS
# or
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk  # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 📱 Create Emulator

### 1. Open Device Manager
- Tools → Device Manager

### 2. Create Device
- Click "Create Device"
- Select phone (e.g., Pixel 6)
- Select system image (e.g., API 34)
- Click "Finish"

### 3. Start Emulator
- Click ▶️ next to device
- Wait for boot

## 🔌 Connect Physical Device

### 1. Enable Developer Options
- Settings → About phone
- Tap "Build number" 7 times

### 2. Enable USB Debugging
- Settings → Developer options
- Enable "USB debugging"

### 3. Connect via USB
- Connect phone to computer
- Authorize USB debugging on phone
- Verify: `adb devices`

## 🏗️ Build Android App

### 1. Build Web App
```bash
npm run build
```

### 2. Sync to Android
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build in Android Studio
- Wait for Gradle sync
- Select device/emulator
- Click **Run** ▶️

## 📦 Build APK

### Debug APK
```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### AAB (for Play Store)
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## 🔐 Sign APK

### 1. Generate Keystore
```bash
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 \
  -validity 10000 -alias pjbot-key
```

### 2. Create key.properties
File: `android/key.properties`
```properties
storePassword=your_password
keyPassword=your_key_password
keyAlias=pjbot-key
storeFile=release-key.jks
```

### 3. Update build.gradle
File: `android/app/build.gradle`
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

### 4. Build Signed APK
```bash
cd android
./gradlew assembleRelease
```

## 🐛 Debug

### View Logs
```bash
adb logcat | grep Capacitor
```

### Chrome DevTools
1. Open Chrome
2. Navigate to `chrome://inspect/#devices`
3. Click "inspect" next to your app

### Android Studio Logcat
1. Open Android Studio
2. View → Tool Windows → Logcat
3. Filter by "Capacitor"

## 📤 Deploy to Play Store

### 1. Build AAB
```bash
cd android
./gradlew bundleRelease
```

### 2. Upload to Play Console
- https://play.google.com/console
- Create new app
- Upload AAB file
- Fill app details:
  - App name
  - Description
  - Screenshots
  - Icon (512x512)
  - Feature graphic (1024x500)
- Set pricing & distribution
- Submit for review

## 🎨 Icons & Splash

### Generate Icons
1. Use online tool: https://icon.kitchen/
2. Upload icon (1024x1024 PNG)
3. Select "Capacitor"
4. Download zip
5. Extract to `android/app/src/main/res/`

### Manual
1. Right-click `android/app/src/main/res`
2. New → Image Asset
3. Select icon image
4. Generate all sizes

## 🐛 Troubleshooting

### Error: "SDK location not found"
```bash
# Set ANDROID_HOME
export ANDROID_HOME=/path/to/android/sdk
```

### Error: "Gradle sync failed"
```bash
cd android
./gradlew clean
./gradlew build
```

### Error: "Execution failed for task ':app:mergeDebugResources'"
```bash
cd android
./gradlew clean
rm -rf .gradle
rm -rf build
```

### Error: "Unable to locate adb"
- Check ANDROID_HOME environment variable
- Ensure platform-tools is installed
- Restart Android Studio

### Emulator won't start
- Check if HAXM is installed (Intel) or Hypervisor (AMD)
- Allocate more RAM to emulator
- Try different system image

---

**Status**: ✅ Setup Complete  
**Next Step**: Run `npm run build` then `npx cap sync android`

🎉 Ready to build Android app!
