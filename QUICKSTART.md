# 🚀 Quick Start - Build Desktop App

Panduan cepat untuk build PJ.BOT AI Trading Agent sebagai desktop application.

## ⚡ 3-Step Build (Windows)

### Step 1: Setup
```bash
# Copy konfigurasi Electron
copy package.json.electron package.json

# Install dependencies
npm install
```

### Step 2: Add Icon
Download icon dari sini: https://image.qwenlm.ai/generated-images/9d5bd751-cd93-4ce4-93a1-050fc699d188/_result.png

Save sebagai `build/icon.ico` (gunakan online converter: https://convertico.com/)

### Step 3: Build
```bash
# Build untuk Windows
build-electron.bat win

# Atau manual
npm run build
npx electron-builder --win
```

**Output**: `release/PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe`

---

## ⚡ 3-Step Build (macOS/Linux)

### Step 1: Setup
```bash
# Copy konfigurasi Electron
cp package.json.electron package.json

# Install dependencies
npm install
```

### Step 2: Add Icon
Download icon dari sini: https://image.qwenlm.ai/generated-images/9d5bd751-cd93-4ce4-93a1-050fc699d188/_result.png

Save sebagai `build/icon.icns` (macOS) atau `build/icons/icon-256x256.png` (Linux)

### Step 3: Build
```bash
# Make script executable
chmod +x build-electron.sh

# Build
./build-electron.sh mac    # macOS
./build-electron.sh linux  # Linux
./build-electron.sh all    # All platforms
```

**Output**: 
- macOS: `release/PJ.BOT AI Trading Agent-2.0.0-x64.dmg`
- Linux: `release/PJ.BOT AI Trading Agent-2.0.0-x64.AppImage`

---

## 🧪 Development Mode

Test app dalam development mode dengan hot-reload:

```bash
npm run electron:dev
```

---

## 📦 Build Commands

| Command | Description |
|---------|-------------|
| `npm run electron:dev` | Development mode dengan hot-reload |
| `npm run electron:build` | Build untuk platform saat ini |
| `npm run electron:build:win` | Build Windows (.exe) |
| `npm run electron:build:mac` | Build macOS (.dmg) |
| `npm run electron:build:linux` | Build Linux (.AppImage, .deb) |
| `npm run electron:build:all` | Build semua platform |

---

## 🎯 Output Files

### Windows
```
release/
├── PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe  (Installer)
└── PJ.BOT AI Trading Agent-2.0.0-x64.exe        (Portable)
```

### macOS
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.dmg        (Intel)
└── PJ.BOT AI Trading Agent-2.0.0-arm64.dmg      (Apple Silicon)
```

### Linux
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.AppImage
└── PJ.BOT AI Trading Agent-2.0.0-x64.deb
```

---

## 🐛 Troubleshooting

### Error: "electron not found"
```bash
npm install electron --save-dev
```

### Error: "electron-builder not found"
```bash
npm install electron-builder --save-dev
```

### Icon tidak muncul
Pastikan icon files ada di folder `build/`:
- Windows: `build/icon.ico`
- macOS: `build/icon.icns`
- Linux: `build/icons/icon-256x256.png`

### Build gagal di Windows
Install Visual Studio Build Tools:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

### Build gagal di macOS
```bash
xcode-select --install
```

### Build gagal di Linux
```bash
sudo apt-get install -y build-essential rpm fakeroot
```

---

## 📚 Dokumentasi Lengkap

Lihat `ELECTRON_SETUP.md` untuk dokumentasi lengkap termasuk:
- Code signing
- Auto-update
- Distribution
- Advanced configuration

---

## ✅ Checklist

Sebelum build, pastikan:
- [ ] Node.js v18+ terinstall
- [ ] `package.json` sudah diupdate dari `package.json.electron`
- [ ] Dependencies sudah diinstall (`npm install`)
- [ ] Icon files sudah ada di folder `build/`
- [ ] App sudah ditest di development mode (`npm run electron:dev`)

---

**Butuh bantuan?** Lihat `ELECTRON_SETUP.md` atau buat issue di GitHub.
