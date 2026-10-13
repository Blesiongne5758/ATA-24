# 📱 START HERE - Mobile App Setup

Selamat datang! File ini adalah panduan awal untuk setup mobile app PJ.BOT AI Trading Agent.

## 🎯 Quick Decision

**Pilih platform yang ingin Anda build:**

### 🤖 Android
→ Baca [`ANDROID_SETUP.md`](./ANDROID_SETUP.md)

### 🍎 iOS (macOS only)
→ Baca [`IOS_SETUP.md`](./IOS_SETUP.md)

### 📱 Keduanya
→ Baca [`MOBILE_SETUP.md`](./MOBILE_SETUP.md)

---

## ⚡ Super Quick Start (5 Minutes)

### 1. Install Prerequisites

**Android:**
- Download Android Studio: https://developer.android.com/studio
- Install Java JDK 17+

**iOS (macOS only):**
- Install Xcode dari App Store
- Install CocoaPods: `sudo gem install cocoapods`

### 2. Build Web App
```bash
npm run build
```

### 3. Add Platform
```bash
# Android
npx cap add android

# iOS (macOS only)
npx cap add ios
```

### 4. Sync & Open
```bash
# Android
npx cap sync android
npx cap open android

# iOS
npx cap sync ios
npx cap open ios
```

### 5. Build & Run
- Click **Run** ▶️ di Android Studio / Xcode

---

## 📚 Documentation Files

| File | Untuk Siapa | Isi |
|------|-------------|-----|
| `MOBILE_SUMMARY.md` | Overview | Ringkasan lengkap |
| `QUICKSTART_MOBILE.md` | Pemula | Panduan cepat 5 steps |
| `MOBILE_SETUP.md` | Advanced | Full guide & troubleshooting |
| `ANDROID_SETUP.md` | Android Dev | Android Studio setup |
| `IOS_SETUP.md` | iOS Dev | Xcode setup (macOS) |

---

## 📦 Build Commands

### Android
```bash
# Debug APK (untuk testing)
./build-mobile.sh android debug

# Release APK (untuk distribusi)
./build-mobile.sh android release

# AAB (untuk Play Store)
./build-mobile.sh android aab
```

### iOS (macOS only)
```bash
# Open di Xcode
./build-mobile.sh ios

# Lalu klik Run di Xcode
```

---

## 🎨 Icons

Download icon dari:
https://image.qwenlm.ai/generated-images/9d5bd751-cd93-4ce4-93a1-050fc699d188/_result.png

Convert & save ke:
- **Android**: `android/app/src/main/res/`
- **iOS**: `ios/App/App/Assets.xcassets/`

Gunakan tool: https://icon.kitchen/

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
- Check provisioning profile di Xcode
- Download dari Apple Developer

**Error: "Command PhaseScriptExecution failed"**
```bash
cd ios/App
pod deintegrate
pod install
```

---

## 📤 Deploy

### Google Play Store
1. Build AAB: `./build-mobile.sh android aab`
2. Upload: https://play.google.com/console

### Apple App Store
1. Archive di Xcode: Product → Archive
2. Upload: https://appstoreconnect.apple.com

---

## ✅ Checklist

- [ ] Android Studio / Xcode installed
- [ ] Dependencies installed (`npm install`)
- [ ] Web app built (`npm run build`)
- [ ] Platforms added (`npx cap add android` / `npx cap add ios`)
- [ ] Icons added
- [ ] Signing configured (untuk release)

---

## 🆘 Butuh Bantuan?

1. **Quick fix**: `QUICKSTART_MOBILE.md`
2. **Detailed guide**: `MOBILE_SETUP.md`
3. **Platform-specific**: `ANDROID_SETUP.md` atau `IOS_SETUP.md`

---

**Status**: ✅ Setup Complete  
**Next Step**: Pilih platform → Ikuti panduan

🎉 Ready to build mobile app!
