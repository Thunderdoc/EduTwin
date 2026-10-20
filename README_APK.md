# 📱 How to Build EduFlow Android APK

Quick guide to build and install EduFlow as a native Android app.

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Install Prerequisites

Download and install these (one-time setup):

1. **Android Studio** - [Download here](https://developer.android.com/studio)
2. **Java JDK 17** - [Download here](https://www.oracle.com/java/technologies/downloads/)

### Step 2: Run Setup Script

**On Windows:**
```bash
setup-android.bat
```

**On Mac/Linux:**
```bash
chmod +x setup-android.sh
./setup-android.sh
```

This will automatically:
- Install dependencies
- Build the web app
- Set up Android platform
- Prepare everything for APK building

### Step 3: Build the APK

**Option A: Using Android Studio (Easiest)**

1. Open Android Studio
2. Click **File** → **Open**
3. Select the `android` folder inside your project
4. Wait for Gradle to finish syncing (bottom right corner)
5. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
6. Wait 2-5 minutes for build to complete
7. Click **locate** in the notification to find your APK

✅ Your APK is ready at: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Command Line**

```bash
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📲 Install APK on Your Phone

### Method 1: Transfer and Install

1. Copy `app-debug.apk` to your Android phone
2. Open the APK file on your phone
3. Allow "Install from Unknown Sources" if prompted
4. Tap Install
5. Open the app!

### Method 2: Direct Install via USB

1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap Build Number 7 times
   - Go back to Settings → Developer Options
   - Enable USB Debugging

2. Connect phone to computer via USB

3. Run this command:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎨 Customize Your App

### Change App Icon

Replace icon files in `android/app/src/main/res/`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Then rebuild the APK.

### Change App Name

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">Your App Name</string>
```

### Change Package Name

Edit `capacitor.config.ts`:

```typescript
appId: 'com.yourcompany.yourapp',
```

Then delete the `android` folder and run setup again.

## 🔧 Troubleshooting

### "SDK location not found"

Create file `android/local.properties`:

**Windows:**
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

**Mac:**
```properties
sdk.dir=/Users/YourUsername/Library/Android/sdk
```

**Linux:**
```properties
sdk.dir=/home/YourUsername/Android/Sdk
```

### "Gradle build failed"

1. Open Android Studio
2. File → Invalidate Caches → Invalidate and Restart
3. Let it sync
4. Build → Clean Project
5. Build → Rebuild Project

### "Installation failed"

Uninstall existing app first:
```bash
adb uninstall com.eduflow.app
```

Then install again.

### App crashes on phone

Check what went wrong:
```bash
adb logcat | grep -i "eduflow"
```

## 🔄 Update Your APK

When you make changes to the app:

```bash
# 1. Build web app
pnpm build

# 2. Sync to Android
npx cap sync android

# 3. Build new APK
cd android
./gradlew assembleDebug
```

New APK will be at the same location.

## 📦 Build Release APK (for distribution)

To create a smaller, optimized APK:

```bash
cd android
./gradlew assembleRelease
```

Location: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

For signing and publishing, see `BUILD_APK_GUIDE.md`

## ⚡ One-Command Update

After initial setup, rebuild everything with:

```bash
pnpm build:android
```

Then build APK in Android Studio.

## 📚 More Help

- Full detailed guide: See `BUILD_APK_GUIDE.md`
- Capacitor docs: https://capacitorjs.com/docs
- Android docs: https://developer.android.com

## 🎉 That's It!

You now have a proper Android APK that you can:
- Install on any Android phone
- Share with friends
- Publish to Google Play Store
- Distribute as you want

The app works offline, has native performance, and behaves like any other Android app!

---

**Need help?** Check the detailed guide in `BUILD_APK_GUIDE.md`
