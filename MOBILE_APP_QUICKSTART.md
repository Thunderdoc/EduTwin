# 🚀 EduFlow Mobile App - Quick Start Guide

## ⚡ TL;DR - Build APK in 5 Minutes

### Windows
```bash
./build-apk.bat
```

### Mac/Linux
```bash
chmod +x build-apk.sh
./build-apk.sh
```

That's it! The script will:
1. ✅ Check prerequisites
2. ✅ Install dependencies
3. ✅ Build web app
4. ✅ Sync to Android
5. ✅ Open Android Studio

---

## 📱 What You're Building

**EduFlow** is a next-generation autonomous learning platform with:

### 🎯 Key Features
- **One-Click Learning** - No decisions needed, just start learning
- **8 AI Systems** - Smart Engine with advanced personalization
- **Offline-First** - Works completely without internet
- **Real-Time Adaptation** - Difficulty adjusts as you learn
- **15+ AI Tools** - Quiz generator, math solver, essay writer, and more
- **Multi-Language** - English, Telugu, Tamil support

### 📊 Tech Stack
- **React 18.3.1** + TypeScript
- **Vite** - Lightning-fast builds
- **Capacitor 8.3.0** - Native mobile bridge
- **Tailwind CSS v4** - Modern styling
- **PWA Ready** - Install as web app too

---

## 🎯 Step-by-Step Guide

### Step 1: Prerequisites (5 minutes)

#### Required Software
1. **Node.js 18+**
   - Download: https://nodejs.org/
   - Check: `node -v` should show v18 or higher

2. **pnpm** (automatically installed by script)
   - Or install manually: `npm install -g pnpm`

3. **Android Studio** (for building APK)
   - Download: https://developer.android.com/studio
   - Install with default settings
   - ⚠️ IMPORTANT: During setup, ensure Android SDK is installed

4. **Java JDK 17+**
   - Download: https://adoptium.net/
   - Check: `java -version` should show version 17 or higher

### Step 2: Get the Code

```bash
# If you have the code already, skip to Step 3
# Otherwise, clone the repository:
git clone https://github.com/yourusername/eduflow.git
cd eduflow
```

### Step 3: Run Build Script

#### Windows Users:
```bash
# Open Command Prompt or PowerShell in the project folder
./build-apk.bat

# Follow the prompts
# When asked "Open Android Studio?", type 'y' and press Enter
```

#### Mac/Linux Users:
```bash
# Open Terminal in the project folder
chmod +x build-apk.sh
./build-apk.sh

# Follow the prompts
# When asked "Open Android Studio?", type 'y' and press Enter
```

### Step 4: Build APK in Android Studio

1. **Wait for Gradle Sync**
   - Android Studio will automatically sync Gradle files
   - This may take 2-5 minutes on first run
   - You'll see progress at the bottom of the window

2. **Build APK**
   - Click: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for build to complete (1-3 minutes)
   - You'll see a notification when done

3. **Find Your APK**
   - Click **locate** in the notification
   - Or navigate to: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 5: Install on Android Device

#### Option A: USB Debugging (Recommended)
1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging

3. Connect device via USB

4. In Android Studio:
   - Click the green play button (▶️)
   - Select your device
   - App will install and launch automatically

#### Option B: APK Installation
1. Copy `app-debug.apk` to your Android device
2. Open the file on your device
3. Allow installation from unknown sources if prompted
4. Tap "Install"
5. Open EduFlow!

---

## 🎨 Customization Before Building

### Change App Name
```typescript
// capacitor.config.ts
appName: 'Your App Name',
```

```json
// public/manifest.json
{
  "name": "Your App Name - Smart Learning Platform",
  "short_name": "Your App"
}
```

### Change App Icon
1. Replace `public/icon-192.png` and `public/icon-512.png` with your logo
2. Open `public/generate-icons.html` in browser
3. Click "Generate All Icon Sizes"
4. Download and replace all icons

### Change Theme Color
```json
// public/manifest.json
{
  "theme_color": "#YOUR_COLOR",
  "background_color": "#YOUR_COLOR"
}
```

```typescript
// capacitor.config.ts
SplashScreen: {
  backgroundColor: '#YOUR_COLOR',
}
```

---

## 🐛 Common Issues & Solutions

### "Node.js not found"
**Solution:** Install Node.js from https://nodejs.org/

### "Java not found" or "Gradle build failed"
**Solution:** 
1. Install Java JDK 17+ from https://adoptium.net/
2. Set JAVA_HOME environment variable
3. Restart Android Studio

### "Android SDK not found"
**Solution:**
1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install latest Android SDK
4. Apply changes

### "Capacitor not initialized"
**Solution:**
```bash
npx cap init
pnpm cap:add:android
pnpm cap:sync
```

### "Build script won't run" (Windows)
**Solution:**
```bash
# Try running with PowerShell as Administrator
powershell -ExecutionPolicy Bypass -File .\build-apk.bat
```

### "Permission denied" (Mac/Linux)
**Solution:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

---

## 📦 Building Release APK (For Play Store)

### Step 1: Generate Keystore
```bash
keytool -genkey -v -keystore eduflow-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias eduflow-key
```

**Save your keystore password and key alias password securely!**

### Step 2: Build Signed APK
1. In Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Select **APK**
3. Choose your keystore file
4. Enter passwords
5. Select **release** build variant
6. Click **Finish**

### Step 3: Find Release APK
Location: `android/app/build/outputs/apk/release/app-release.apk`

This is your production-ready APK for the Play Store!

---

## 📊 App Size & Performance

### APK Size
- **Debug Build**: ~15-20 MB
- **Release Build**: ~8-12 MB (optimized)

### Performance
- **Load Time**: < 2 seconds
- **Offline**: ✅ Full functionality
- **Battery**: Optimized for low drain
- **Memory**: ~50-80 MB RAM usage

---

## 🎯 Next Steps After Building

### For Testing
1. ✅ Test all features offline
2. ✅ Test on different Android versions
3. ✅ Test on different screen sizes
4. ✅ Test app lifecycle (pause, resume, kill)
5. ✅ Test data persistence

### For Distribution

#### Internal Testing
1. Share `app-debug.apk` with friends/team
2. Collect feedback
3. Fix bugs
4. Iterate

#### Public Release
1. Generate signed release APK
2. Create Google Play Developer account ($25)
3. Create app listing in Play Console
4. Upload APK
5. Fill in store listing (description, screenshots, etc.)
6. Submit for review
7. Wait for approval (usually 1-3 days)
8. Publish!

---

## 📚 Additional Resources

### Documentation
- [Full Build Guide](BUILD_MOBILE_APP.md) - Detailed instructions
- [Mobile App README](MOBILE_APP_README.md) - Complete feature list
- [APK Quick Reference](APK_QUICK_REFERENCE.md) - Quick commands

### External Resources
- [Capacitor Docs](https://capacitorjs.com/docs) - Native features
- [Android Studio Guide](https://developer.android.com/studio/intro) - IDE help
- [Play Console Help](https://support.google.com/googleplay/android-developer) - Publishing

### Troubleshooting
- Check console output for errors
- Review Android Studio Logcat for app logs
- Search error messages on Stack Overflow
- Check Capacitor GitHub issues

---

## ✨ Tips for Success

### Before Building
- ✅ Test thoroughly in browser first
- ✅ Check all features work offline
- ✅ Optimize images and assets
- ✅ Remove console.log statements
- ✅ Update version numbers

### During Building
- ✅ Ensure stable internet connection
- ✅ Close other heavy applications
- ✅ Let Gradle sync complete fully
- ✅ Don't interrupt the build process

### After Building
- ✅ Test on real Android devices
- ✅ Check app permissions
- ✅ Verify offline functionality
- ✅ Test app updates work correctly
- ✅ Monitor crash reports

---

## 🎉 Congratulations!

You've successfully built your EduFlow mobile app! 

### What's Next?
1. **Test thoroughly** on different devices
2. **Gather feedback** from users
3. **Iterate and improve** based on feedback
4. **Publish to Play Store** when ready
5. **Monitor and update** regularly

### Need Help?
- 📖 Read the [full documentation](BUILD_MOBILE_APP.md)
- 🐛 Check [common issues](#-common-issues--solutions) above
- 💬 Search for answers online
- 📧 Reach out for support

---

<div align="center">

**🚀 Happy Learning with EduFlow! 🎓**

Built with ❤️ using React + TypeScript + Vite + Capacitor

</div>
