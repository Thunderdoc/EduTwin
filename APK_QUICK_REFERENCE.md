# 📱 APK Build - Quick Reference Card

## First Time Setup (Do Once)

### Install Requirements
1. Install Android Studio: https://developer.android.com/studio
2. Install Java JDK 17: https://www.oracle.com/java/technologies/downloads/
3. Run setup script:
   - **Windows:** Double-click `setup-android.bat`
   - **Mac/Linux:** Run `./setup-android.sh`

## Build APK (Every Time)

### Method 1: Android Studio (Recommended)
```
1. Open Android Studio
2. Open → Select 'android' folder
3. Build → Build APK(s)
4. APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 2: Command Line
```bash
cd android
./gradlew assembleDebug
```

## Install on Phone

### Via File Transfer
```
1. Copy app-debug.apk to phone
2. Open APK file on phone
3. Allow unknown sources
4. Install
```

### Via USB
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Update APK After Code Changes

```bash
pnpm build               # Build web app
npx cap sync android     # Sync to Android
cd android              # Go to Android folder
./gradlew assembleDebug # Build APK
```

Or use the one-liner:
```bash
pnpm build:android && cd android && ./gradlew assembleDebug
```

## Troubleshooting

### SDK Not Found
Create `android/local.properties`:
```
sdk.dir=PATH_TO_YOUR_ANDROID_SDK
```

### Build Failed
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Can't Install
```bash
adb uninstall com.eduflow.app
adb install path/to/app-debug.apk
```

## File Locations

- **Setup Scripts:**
  - `setup-android.sh` (Mac/Linux)
  - `setup-android.bat` (Windows)

- **APK Output:**
  - Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
  - Release: `android/app/build/outputs/apk/release/app-release.apk`

- **Config:**
  - `capacitor.config.ts` - App configuration
  - `android/app/src/main/AndroidManifest.xml` - Permissions
  - `android/app/src/main/res/values/strings.xml` - App name

## Quick Commands

```bash
# Complete build pipeline
pnpm install && pnpm build && npx cap sync android

# Open in Android Studio
npx cap open android

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Check connected devices
adb devices

# View app logs
adb logcat | grep -i "eduflow"
```

## APK Size Optimization

For smaller APK (release build):
```bash
cd android
./gradlew assembleRelease
```

## Resources

- **Full Guide:** `BUILD_APK_GUIDE.md`
- **Quick Start:** `README_APK.md`
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Docs:** https://developer.android.com

---

💡 **Tip:** Bookmark this file for quick reference!
