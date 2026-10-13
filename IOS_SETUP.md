# 🍎 iOS Setup Guide (macOS Only)

Panduan lengkap untuk setup Xcode dan build iOS app.

**⚠️ Note**: iOS development requires macOS.

## 📥 Install Xcode

### 1. Download from App Store
- Open App Store
- Search "Xcode"
- Click "Get" / "Install"
- Wait for download (~10GB)

### 2. Install Command Line Tools
```bash
xcode-select --install
```

### 3. First Launch
- Open Xcode
- Accept license agreement
- Install additional components

## 📦 Install CocoaPods

```bash
sudo gem install cocoapods
```

Or with Homebrew:
```bash
brew install cocoapods
```

## 🍏 Apple Developer Account

### Free Account (for testing)
- https://appleid.apple.com
- Create Apple ID
- Use for testing on physical device

### Paid Account ($99/year, for App Store)
- https://developer.apple.com/programs/
- Enroll in Developer Program
- Required for App Store distribution

## 🔐 Setup Signing

### 1. Open Xcode
```bash
npx cap open ios
```

### 2. Add Account
- Xcode → Settings (⌘ + ,)
- Accounts tab
- Click "+" → Apple ID
- Sign in

### 3. Select Team
- Select project in navigator
- Signing & Capabilities tab
- Select your team from dropdown
- Enable "Automatically manage signing"

## 🏗️ Build iOS App

### 1. Build Web App
```bash
npm run build
```

### 2. Sync to iOS
```bash
npx cap sync ios
```

### 3. Install Pods
```bash
cd ios/App
pod install
```

### 4. Open in Xcode
```bash
npx cap open ios
```

### 5. Build in Xcode
- Select development team
- Select device/emulator
- Click **Run** ▶️

## 📱 Test on Simulator

### 1. Select Simulator
- In Xcode, select simulator from device dropdown
- iPhone 15 Pro (recommended)

### 2. Run
- Click **Run** ▶️
- Wait for build
- App will launch in simulator

## 📱 Test on Physical Device

### 1. Connect Device
- Connect iPhone via USB
- Trust computer on device

### 2. Select Device
- In Xcode, select your device from dropdown

### 3. Run
- Click **Run** ▶️
- App will install and launch

## 📦 Archive for App Store

### 1. Select "Any iOS Device"
- In Xcode, select "Any iOS Device" from dropdown

### 2. Archive
- Product → Archive
- Wait for build (~5-10 minutes)

### 3. Organizer
- Window → Organizer
- Select archive
- Click "Distribute App"

### 4. Distribution Method
- Select "App Store Connect"
- Click "Upload"
- Wait for upload

## 📤 Upload to App Store

### 1. App Store Connect
- https://appstoreconnect.apple.com
- Create new app
- Fill app details:
  - App name
  - Bundle ID: `com.pjbot.ai.trading`
  - SKU
  - Primary language

### 2. Upload Build
- Go to "App Store" tab
- Click "+" in iOS section
- Select uploaded build
- Fill metadata:
  - Description
  - Keywords
  - Screenshots
  - App icon (1024x1024)
  - Support URL
  - Privacy Policy URL

### 3. Submit for Review
- Click "Submit for Review"
- Wait for approval (~1-3 days)

## 🎨 Icons & Splash

### Generate Icons
1. Use online tool: https://icon.kitchen/
2. Upload icon (1024x1024 PNG)
3. Select "Capacitor"
4. Download zip
5. Extract to `ios/App/App/Assets.xcassets/`

### Manual
1. Open `ios/App/Assets.xcassets/AppIcon.appiconset`
2. Drag & drop icon images:
   - 20x20 (2x, 3x)
   - 29x29 (2x, 3x)
   - 40x40 (2x, 3x)
   - 60x60 (2x, 3x)
   - 1024x1024 (App Store)

### Splash Screen
1. Open `ios/App/Assets.xcassets/Splash.imageset`
2. Add splash images for various device sizes

## 🐛 Debug

### Safari Web Inspector
1. Enable Web Inspector on device:
   - Settings → Safari → Advanced → Web Inspector
2. In Safari:
   - Develop → [Device] → [App]
3. Inspect elements, view console, debug

### Xcode Console
- View → Debug Areas → Activate Console
- Filter by "Capacitor"

### View Logs
```bash
# In Xcode
Window → Devices and Simulators
Select device → Open Console
```

## 🔧 Configuration

### Info.plist
File: `ios/App/App/Info.plist`

Common settings:
```xml
<key>CFBundleDisplayName</key>
<string>PJ.BOT AI Trading</string>

<key>CFBundleVersion</key>
<string>1</string>

<key>CFBundleShortVersionString</key>
<string>2.0.0</string>
```

### Capabilities
- Push Notifications
- In-App Purchases
- Sign in with Apple
- Associated Domains

## 📊 App Size

- Development build: ~25-30 MB
- App Store build: ~20-25 MB
- Download size: ~15-20 MB (compressed)

## 🐛 Troubleshooting

### Error: "No profiles for 'com.pjbot.ai.trading' were found"
- Check provisioning profile in Xcode
- Download profile from Apple Developer
- Import profile to Xcode

### Error: "Command PhaseScriptExecution failed"
```bash
cd ios/App
pod deintegrate
pod install
```

### Error: "The operation couldn't be completed"
```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Error: "Signing requires a development team"
- Select development team in Xcode
- Enable "Automatically manage signing"

### Build takes too long
- Clean build folder: Product → Clean Build Folder (⇧ + ⌘ + K)
- Delete derived data: Window → Projects → Delete

### Simulator won't start
- Reset simulator: Device → Erase All Content and Settings
- Try different simulator device

## 📚 Resources

- [Capacitor iOS Docs](https://capacitorjs.com/docs/ios)
- [Apple Developer](https://developer.apple.com/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Xcode Help](https://help.apple.com/xcode/)

---

**Status**: ✅ Setup Complete  
**Next Step**: Run `npm run build` then `npx cap sync ios`

🎉 Ready to build iOS app!
