# 📝 Instruksi Update package.json

File ini berisi instruksi untuk mengupdate `package.json` dengan konfigurasi Electron.

## 🎯 Cara 1: Copy dari Template (Recommended)

```bash
# Backup package.json asli
cp package.json package.json.backup

# Copy konfigurasi Electron
cp package.json.electron package.json

# Install dependencies
npm install
```

## 🎯 Cara 2: Manual Edit

Tambahkan field-field berikut ke `package.json` Anda:

### 1. Tambah "main" field
```json
{
  "name": "pjbot-ai-trading-agent",
  "version": "2.0.0",
  "main": "electron/main.js",  // <-- TAMBAHKAN INI
  ...
}
```

### 2. Tambah Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    
    // Electron scripts - TAMBAHKAN INI
    "electron:dev": "concurrently \"cross-env BROWSER=none npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:win": "npm run build && electron-builder --win",
    "electron:build:mac": "npm run build && electron-builder --mac",
    "electron:build:linux": "npm run build && electron-builder --linux",
    "electron:build:all": "npm run build && electron-builder --win --mac --linux"
  }
}
```

### 3. Tambah Build Configuration
```json
{
  "build": {
    "appId": "com.pjbot.ai-trading-agent",
    "productName": "PJ.BOT AI Trading Agent",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "package.json"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns",
      "category": "public.app-category.finance"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icons",
      "category": "Finance"
    }
  }
}
```

### 4. Tambah Dependencies
```json
{
  "devDependencies": {
    // ... dependencies yang sudah ada ...
    
    // Electron dependencies - TAMBAHKAN INI
    "electron": "^33.2.1",
    "electron-builder": "^25.1.8",
    "concurrently": "^9.1.0",
    "cross-env": "^7.0.3",
    "wait-on": "^8.0.1"
  }
}
```

## ✅ Verifikasi

Setelah update, verifikasi dengan:

```bash
# Check package.json valid
node -e "console.log(require('./package.json').main)"
# Output: electron/main.js

# Check scripts
npm run | grep electron
# Output: 
#   electron:build
#   electron:build:all
#   electron:build:linux
#   electron:build:mac
#   electron:build:win
#   electron:dev
```

## 🚀 Next Step

Setelah package.json diupdate, lanjut ke:

```bash
# Install dependencies
npm install

# Test development mode
npm run electron:dev

# Build desktop app
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
```

## 📚 Dokumentasi

- **Quick Start**: `QUICKSTART.md`
- **Full Guide**: `ELECTRON_SETUP.md`
- **Build Scripts**: `build-electron.sh` (Linux/Mac) atau `build-electron.bat` (Windows)
