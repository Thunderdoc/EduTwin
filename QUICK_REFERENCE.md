# 📱 EduFlow - Quick Reference Card

<div align="center">

# ⚡ QUICK REFERENCE

**Everything you need on one page**

</div>

---

## 🚀 BUILD APK IN 3 STEPS

### Windows
```bash
./build-apk.bat
```

### Mac/Linux  
```bash
chmod +x build-apk.sh && ./build-apk.sh
```

### That's it! 
APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📦 COMMON COMMANDS

```bash
# Install dependencies
pnpm install

# Build web app
pnpm build

# Build for Android
pnpm build:android

# Open Android Studio
pnpm cap:open:android

# Sync Capacitor
pnpm cap:sync

# Add Android platform (first time)
pnpm cap:add:android
```

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | App ID, name, settings |
| `public/manifest.json` | PWA config, icons |
| `src/app/App.tsx` | Main app entry |
| `src/app/routes.tsx` | All routes |
| `package.json` | Dependencies |

---

## 🎨 CUSTOMIZATION

### Change App Name
```typescript
// capacitor.config.ts
appName: 'YourAppName'

// public/manifest.json
"name": "YourAppName"
```

### Change App Icon
1. Replace `public/icon-192.png` & `public/icon-512.png`
2. Run `pnpm cap:sync`

### Change Theme
```json
// public/manifest.json
"theme_color": "#YOUR_COLOR"
```

---

## 🐛 TROUBLESHOOTING

### Build Fails
```bash
cd android && ./gradlew clean && cd ..
pnpm build:android
```

### Capacitor Error
```bash
npx cap remove android
pnpm cap:add:android
pnpm cap:sync
```

### Clean Start
```bash
rm -rf node_modules android
pnpm install
pnpm build:android
```

---

## 📚 DOCUMENTATION

| Doc | For |
|-----|-----|
| [MOBILE_APP_QUICKSTART.md](MOBILE_APP_QUICKSTART.md) | 5-min start guide |
| [BUILD_MOBILE_APP.md](BUILD_MOBILE_APP.md) | Detailed build |
| [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) | Testing guide |
| [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) | All docs |

---

## ✨ KEY FEATURES

- ⚡ **One-Click Learning** - Zero decisions
- 🧠 **8 AI Systems** - Smart Engine
- 📴 **Offline-First** - No internet needed
- 🤖 **15+ AI Tools** - Complete toolkit
- 🌐 **Multi-Language** - EN/TE/TA
- 🎮 **Gamification** - Streaks & rewards

---

## 🎯 TECH STACK

```
React 18.3.1 + TypeScript
Vite 6.3.5
Capacitor 8.3.0
Tailwind CSS v4
Motion (Framer Motion)
```

---

## 📊 APP INFO

- **App ID**: com.eduflow.app
- **Version**: 2.1.0
- **Platform**: Android
- **APK Size**: ~15 MB (debug)
- **Min Android**: 5.0 (API 21)

---

## 🆘 GET HELP

1. Check documentation above
2. Review error messages
3. Search Stack Overflow
4. Open GitHub issue

---

## 📱 INSTALL ON DEVICE

### USB Debug
1. Enable Developer Options
2. Enable USB Debugging  
3. Connect device
4. Click play in Android Studio

### APK Install
1. Copy APK to device
2. Open file
3. Allow unknown sources
4. Install

---

## 🚀 RELEASE BUILD

```bash
# Generate keystore
keytool -genkey -v -keystore eduflow-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000

# In Android Studio:
# Build → Generate Signed Bundle/APK → APK
```

---

## ✅ PRE-RELEASE CHECKLIST

- [ ] All features tested
- [ ] Offline mode works
- [ ] No console errors
- [ ] Version updated
- [ ] Icons correct
- [ ] Signed APK built

---

## 📞 QUICK LINKS

- 📖 [Full Documentation](DOCUMENTATION_INDEX.md)
- 🚀 [Quick Start](MOBILE_APP_QUICKSTART.md)
- 🧪 [Testing](TESTING_CHECKLIST.md)
- 🐛 [Issues](#)

---

<div align="center">

**EduFlow v2.1.0**

*Smart Learning Platform*

Built with React + TypeScript + Capacitor

</div>
