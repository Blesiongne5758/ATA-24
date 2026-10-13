# 🖥️ Electron Desktop App Setup Guide

Panduan lengkap untuk build PJ.BOT AI Trading Agent sebagai desktop application menggunakan Electron.

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** v18+ dan npm
- **Git** (untuk clone repository)
- **Platform-specific tools**:
  - **Windows**: Visual Studio Build Tools (untuk native modules)
  - **macOS**: Xcode Command Line Tools
  - **Linux**: build-essential, rpm, fakeroot

## 🚀 Quick Start

### 1. Update package.json

Copy isi dari `package.json.electron` ke `package.json`:

```bash
# Backup package.json asli
cp package.json package.json.backup

# Copy konfigurasi Electron
cp package.json.electron package.json
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Build Assets

Buat folder `build/` dan tambahkan icon files:

```bash
mkdir -p build

# Untuk Windows: build/icon.ico (256x256 atau multi-size)
# Untuk macOS: build/icon.icns
# Untuk Linux: build/icons/ (16x16, 32x32, 64x64, 128x128, 256x256, 512x512 PNG)
```

**Catatan**: Anda bisa generate icon dari PNG menggunakan tools online seperti:
- https://convertico.com/ (ICO)
- https://cloudconvert.com/png-to-icns (ICNS)
- https://www.electronjs.org/images/app-icon-template.png (Template)

### 4. Development Mode

Jalankan app dalam development mode dengan hot-reload:

```bash
npm run electron:dev
```

Ini akan:
- Start Vite dev server di port 5173
- Launch Electron window
- Auto-reload saat ada perubahan

### 5. Build Desktop App

#### Build untuk Platform Saat Ini
```bash
npm run electron:build
```

#### Build untuk Windows (.exe)
```bash
npm run electron:build:win
```

Output:
- `release/PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe` (Installer)
- `release/PJ.BOT AI Trading Agent-2.0.0-x64.exe` (Portable)

#### Build untuk macOS (.dmg)
```bash
npm run electron:build:mac
```

Output:
- `release/PJ.BOT AI Trading Agent-2.0.0-x64.dmg` (Intel)
- `release/PJ.BOT AI Trading Agent-2.0.0-arm64.dmg` (Apple Silicon)

#### Build untuk Linux (.AppImage, .deb)
```bash
npm run electron:build:linux
```

Output:
- `release/PJ.BOT AI Trading Agent-2.0.0-x64.AppImage`
- `release/PJ.BOT AI Trading Agent-2.0.0-x64.deb`

#### Build untuk Semua Platform
```bash
npm run electron:build:all
```

**Catatan**: Cross-platform build memiliki keterbatasan:
- Windows .exe bisa di-build dari Windows atau macOS/Windows
- macOS .dmg hanya bisa di-build dari macOS
- Linux .AppImage bisa di-build dari Linux atau macOS/Windows

## 📁 Struktur File

```
project/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script (security)
├── build/
│   ├── icon.ico         # Windows icon (256x256)
│   ├── icon.icns        # macOS icon
│   └── icons/           # Linux icons (multiple sizes)
├── dist/                # Vite build output
├── release/             # Electron build output
├── electron-builder.yml # Build configuration
├── package.json.electron # Template package.json
└── ELECTRON_SETUP.md    # This file
```

## 🔧 Konfigurasi

### electron/main.js

File ini mengontrol:
- Window size dan properties
- Menu bar
- Keyboard shortcuts
- External links handling

**Customize window size:**
```javascript
const mainWindow = new BrowserWindow({
  width: 1400,    // Change width
  height: 900,    // Change height
  minWidth: 1024, // Minimum width
  minHeight: 768, // Minimum height
  // ...
});
```

### electron-builder.yml

File ini mengontrol:
- Build targets (NSIS, DMG, AppImage, dll)
- App metadata
- Code signing
- Auto-update

**Customize app name:**
```yaml
productName: Your App Name
appId: com.yourcompany.yourapp
```

**Customize installer behavior (Windows):**
```yaml
nsis:
  oneClick: false  # Show installer options
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
```

## 🔐 Code Signing (Optional)

### Windows Code Signing

1. Dapatkan certificate dari Certificate Authority
2. Set environment variables:
```bash
export WIN_CSC_LINK="path/to/certificate.p12"
export WIN_CSC_KEY_PASSWORD="your-password"
```

3. Build:
```bash
npm run electron:build:win
```

### macOS Code Signing

1. Dapatkan Apple Developer Certificate
2. Import ke Keychain
3. Set environment variables:
```bash
export CSC_NAME="Developer ID Application: Your Name (TEAM_ID)"
```

4. Build:
```bash
npm run electron:build:mac
```

## 🔄 Auto-Update

Electron Builder mendukung auto-update menggunakan `electron-updater`.

### Setup Auto-Update

1. Install electron-updater:
```bash
npm install electron-updater
```

2. Tambahkan ke `electron/main.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});
```

3. Configure publish di `electron-builder.yml`:
```yaml
publish:
  provider: github
  owner: your-username
  repo: your-repo
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'electron'"

```bash
npm install electron --save-dev
```

### Error: "electron-builder not found"

```bash
npm install electron-builder --save-dev
```

### Build gagal di Windows

Install Visual Studio Build Tools:
1. Download dari: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Install "Desktop development with C++"

### Build gagal di macOS

Install Xcode Command Line Tools:
```bash
xcode-select --install
```

### Build gagal di Linux

Install dependencies:
```bash
# Ubuntu/Debian
sudo apt-get install -y build-essential rpm fakeroot

# CentOS/RHEL
sudo yum install -y gcc-c++ make rpm-build

# Fedora
sudo dnf install -y gcc-c++ make rpm-build
```

### Icon tidak muncul

Pastikan icon files ada di folder `build/`:
- Windows: `build/icon.ico`
- macOS: `build/icon.icns`
- Linux: `build/icons/icon-256x256.png` (dan sizes lainnya)

### App tidak bisa dibuka di macOS

Jika muncul error "App is damaged":
```bash
xattr -cr "PJ.BOT AI Trading Agent.app"
```

## 📊 Build Output

### Windows
```
release/
├── PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe  (Installer, ~80MB)
├── PJ.BOT AI Trading Agent-2.0.0-x64.exe        (Portable, ~80MB)
└── latest.yml                                    (Auto-update manifest)
```

### macOS
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.dmg        (Intel, ~90MB)
├── PJ.BOT AI Trading Agent-2.0.0-arm64.dmg      (Apple Silicon, ~85MB)
└── latest-mac.yml                                (Auto-update manifest)
```

### Linux
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.AppImage   (~85MB)
├── PJ.BOT AI Trading Agent-2.0.0-x64.deb        (~80MB)
├── PJ.BOT AI Trading Agent-2.0.0-x64.rpm        (~80MB)
└── latest-linux.yml                              (Auto-update manifest)
```

## 🚀 Distribution

### GitHub Releases

1. Push code ke GitHub
2. Buat release baru di GitHub
3. Upload semua file dari folder `release/`
4. Users bisa download dari Releases page

### Website Download

Upload file installer ke website Anda:
```html
<!-- Windows -->
<a href="/downloads/PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe">
  Download for Windows
</a>

<!-- macOS -->
<a href="/downloads/PJ.BOT AI Trading Agent-2.0.0-x64.dmg">
  Download for macOS (Intel)
</a>
<a href="/downloads/PJ.BOT AI Trading Agent-2.0.0-arm64.dmg">
  Download for macOS (Apple Silicon)
</a>

<!-- Linux -->
<a href="/downloads/PJ.BOT AI Trading Agent-2.0.0-x64.AppImage">
  Download for Linux
</a>
```

## 📝 Scripts Tambahan

Tambahkan ke `package.json`:

```json
{
  "scripts": {
    "electron:dev": "concurrently \"cross-env BROWSER=none npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:win": "npm run build && electron-builder --win",
    "electron:build:mac": "npm run build && electron-builder --mac",
    "electron:build:linux": "npm run build && electron-builder --linux",
    "electron:build:all": "npm run build && electron-builder --win --mac --linux",
    "electron:preview": "electron ."
  }
}
```

## 🎯 Checklist Sebelum Release

- [ ] Update version di `package.json`
- [ ] Test di semua platform target
- [ ] Generate icon files untuk semua platform
- [ ] Code signing (jika diperlukan)
- [ ] Test auto-update (jika di-setup)
- [ ] Update changelog
- [ ] Create GitHub release
- [ ] Upload build artifacts
- [ ] Update download links di website

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder Documentation](https://www.electron.build/)
- [Electron Quick Start](https://www.electronjs.org/docs/latest/tutorial/quick-start)
- [Code Signing Guide](https://www.electron.build/code-signing)

## 🆘 Support

Jika mengalami masalah:
1. Check troubleshooting section di atas
2. Search issues di GitHub
3. Buat issue baru dengan detail error

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
