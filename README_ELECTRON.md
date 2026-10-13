# 🖥️ PJ.BOT AI Trading Agent - Electron Desktop App

Setup lengkap untuk build PJ.BOT AI Trading Agent sebagai desktop application menggunakan Electron.

## 📚 Dokumentasi

| File | Deskripsi |
|------|-----------|
| [`QUICKSTART.md`](./QUICKSTART.md) | 🚀 Panduan cepat 3-step build |
| [`ELECTRON_SETUP.md`](./ELECTRON_SETUP.md) | 📖 Dokumentasi lengkap & troubleshooting |
| [`UPDATE_PACKAGE_JSON.md`](./UPDATE_PACKAGE_JSON.md) | 📝 Instruksi update package.json |
| [`package.json.electron`](./package.json.electron) | 📦 Template package.json untuk Electron |

## 🎯 Quick Start (3 Steps)

### Windows
```bash
copy package.json.electron package.json
npm install
build-electron.bat win
```

### macOS/Linux
```bash
cp package.json.electron package.json
npm install
./build-electron.sh mac  # atau linux, atau all
```

**Output**: File installer di folder `release/`

## 📦 File yang Dibuat

### Electron Core
- ✅ `electron/main.js` - Main process
- ✅ `electron/preload.js` - Preload script (security)
- ✅ `electron-builder.yml` - Build configuration

### Build Scripts
- ✅ `build-electron.sh` - Bash script (Linux/macOS)
- ✅ `build-electron.bat` - Batch script (Windows)

### Configuration
- ✅ `package.json.electron` - Template package.json

### Documentation
- ✅ `QUICKSTART.md` - Quick start guide
- ✅ `ELECTRON_SETUP.md` - Full documentation
- ✅ `UPDATE_PACKAGE_JSON.md` - Manual update instructions
- ✅ `README_ELECTRON.md` - This file

### Assets
- ✅ `build/` folder - Icon files (perlu ditambahkan)

## 🎨 Icon

Icon sudah di-generate dan tersedia di:
https://image.qwenlm.ai/generated-images/9d5bd751-cd93-4ce4-93a1-050fc699d188/_result.png

**Perlu di-convert ke format yang sesuai:**
- Windows: `build/icon.ico` (https://convertico.com/)
- macOS: `build/icon.icns` (https://cloudconvert.com/png-to-icns)
- Linux: `build/icons/icon-256x256.png` (resize manual)

## 🚀 Build Commands

| Command | Description |
|---------|-------------|
| `npm run electron:dev` | Development mode dengan hot-reload |
| `npm run electron:build` | Build untuk platform saat ini |
| `npm run electron:build:win` | Build Windows (.exe) |
| `npm run electron:build:mac` | Build macOS (.dmg) |
| `npm run electron:build:linux` | Build Linux (.AppImage, .deb) |
| `npm run electron:build:all` | Build semua platform |

## 📊 Output Files

### Windows (.exe)
```
release/
├── PJ.BOT AI Trading Agent-Setup-2.0.0-x64.exe  (Installer, ~80MB)
└── PJ.BOT AI Trading Agent-2.0.0-x64.exe        (Portable, ~80MB)
```

### macOS (.dmg)
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.dmg        (Intel, ~90MB)
└── PJ.BOT AI Trading Agent-2.0.0-arm64.dmg      (Apple Silicon, ~85MB)
```

### Linux (.AppImage, .deb)
```
release/
├── PJ.BOT AI Trading Agent-2.0.0-x64.AppImage   (~85MB)
└── PJ.BOT AI Trading Agent-2.0.0-x64.deb        (~80MB)
```

## 🔧 Features

### Desktop App Features
- ✅ Native window dengan menu bar
- ✅ Keyboard shortcuts (Ctrl+R untuk start agent, dll)
- ✅ External links open di browser default
- ✅ Auto-update support (optional)
- ✅ Code signing support (optional)
- ✅ Multi-platform build (Windows, macOS, Linux)

### Keyboard Shortcuts
- `Ctrl/Cmd + R` - Start Agent
- `Ctrl/Cmd + P` - Pause Agent
- `Ctrl/Cmd + Shift + E` - Emergency Stop
- `Ctrl/Cmd + ,` - Open Settings

## 🐛 Troubleshooting

### Common Issues

**Error: "electron not found"**
```bash
npm install electron --save-dev
```

**Error: "electron-builder not found"**
```bash
npm install electron-builder --save-dev
```

**Icon tidak muncul**
Pastikan icon files ada di folder `build/`:
- Windows: `build/icon.ico`
- macOS: `build/icon.icns`
- Linux: `build/icons/icon-256x256.png`

**Build gagal di Windows**
Install Visual Studio Build Tools:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

**Build gagal di macOS**
```bash
xcode-select --install
```

**Build gagal di Linux**
```bash
sudo apt-get install -y build-essential rpm fakeroot
```

### Full Troubleshooting Guide
Lihat [`ELECTRON_SETUP.md`](./ELECTRON_SETUP.md) section "Troubleshooting"

## 📝 Next Steps

1. **Update package.json** - Lihat [`UPDATE_PACKAGE_JSON.md`](./UPDATE_PACKAGE_JSON.md)
2. **Add icon files** - Download dan convert icon ke folder `build/`
3. **Test development mode** - `npm run electron:dev`
4. **Build desktop app** - `npm run electron:build:win` (atau mac/linux)
5. **Distribute** - Upload ke GitHub Releases atau website

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder Documentation](https://www.electron.build/)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Auto-Update Guide](https://www.electron.build/auto-update)

## 🆘 Support

Jika mengalami masalah:
1. Check [`QUICKSTART.md`](./QUICKSTART.md) untuk quick fix
2. Check [`ELECTRON_SETUP.md`](./ELECTRON_SETUP.md) untuk detailed troubleshooting
3. Buat issue di GitHub dengan detail error

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Setup Complete - Ready to Build
