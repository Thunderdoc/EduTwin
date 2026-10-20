# 📱 EduFlow APK - Visual Step-by-Step Guide

Easy-to-follow guide with step-by-step instructions to build your Android APK.

---

## 🎯 Overview

You will:
1. Install Android Studio (15 minutes)
2. Run automated setup script (5 minutes)
3. Build APK in Android Studio (5 minutes)
4. Install on your phone (2 minutes)

**Total Time: ~30 minutes (first time only)**

---

## Part 1: Install Android Studio

### Step 1.1: Download Android Studio

1. Go to: https://developer.android.com/studio
2. Click the big green "Download Android Studio" button
3. Accept terms and download

📥 **File size:** ~1 GB
⏱️ **Download time:** 5-15 minutes (depends on internet speed)

### Step 1.2: Install Android Studio

**Windows:**
```
1. Run the downloaded .exe file
2. Click "Next" through the installation wizard
3. Use default settings
4. Click "Install"
5. Wait for installation to complete
6. Click "Finish"
```

**Mac:**
```
1. Open the downloaded .dmg file
2. Drag "Android Studio" to Applications folder
3. Open Applications and run Android Studio
4. Click "Open" if security warning appears
```

### Step 1.3: First Time Setup

When you open Android Studio for the first time:

```
1. Welcome screen appears
2. Click "Next"
3. Select "Standard" installation type
4. Click "Next"
5. Choose your theme (Light or Dark)
6. Click "Next"
7. Click "Finish"
8. Wait for SDK download (5-10 minutes)
9. Click "Finish" when complete
```

✅ **Android Studio is now ready!**

---

## Part 2: Install Java JDK

### Step 2.1: Download JDK 17

1. Go to: https://www.oracle.com/java/technologies/downloads/
2. Find "Java 17" section
3. Download for your operating system:
   - Windows: `.exe` installer
   - Mac: `.dmg` installer
   - Linux: `.tar.gz` package

### Step 2.2: Install JDK

**Windows:**
```
1. Run the downloaded .exe file
2. Click "Next"
3. Note the installation path (e.g., C:\Program Files\Java\jdk-17)
4. Click "Next"
5. Wait for installation
6. Click "Close"
```

**Mac:**
```
1. Open the .dmg file
2. Double-click the package installer
3. Follow the prompts
4. Enter your password when asked
5. Click "Close" when done
```

✅ **Java is now installed!**

---

## Part 3: Run Setup Script

### Step 3.1: Open Project Folder

1. Open File Explorer (Windows) or Finder (Mac)
2. Navigate to your EduFlow project folder
3. You should see files like:
   - `package.json`
   - `setup-android.bat` (Windows)
   - `setup-android.sh` (Mac/Linux)
   - `capacitor.config.ts`

### Step 3.2: Run Setup Script

**Windows:**
```
1. Double-click "setup-android.bat"
2. A command window will open
3. Script will run automatically
4. Wait for it to complete (3-5 minutes)
5. Look for "Setup Complete!" message
```

**Mac/Linux:**
```
1. Open Terminal
2. Type: cd /path/to/eduflow
3. Type: ./setup-android.sh
4. Press Enter
5. Wait for completion (3-5 minutes)
6. Look for "Setup Complete!" message
```

**What the script does:**
- ✅ Installs dependencies
- ✅ Builds the web app
- ✅ Creates Android project folder
- ✅ Syncs everything together

✅ **Setup is complete! You now have an `android` folder in your project**

---

## Part 4: Build APK in Android Studio

### Step 4.1: Open Project in Android Studio

```
1. Open Android Studio
2. Click "Open" (or File → Open)
3. Navigate to your EduFlow project
4. Select the "android" folder (NOT the root folder!)
5. Click "OK"
```

### Step 4.2: Wait for Gradle Sync

```
1. Android Studio will open the project
2. Bottom right corner shows "Gradle Sync"
3. Wait for sync to complete (2-5 minutes)
4. Look for "BUILD SUCCESSFUL" in the bottom panel
```

**If sync fails:**
- Click "Sync Project with Gradle Files" (elephant icon)
- Or go to File → Sync Project with Gradle Files

### Step 4.3: Build the APK

```
1. Click "Build" in the top menu
2. Click "Build Bundle(s) / APK(s)"
3. Click "Build APK(s)"
4. Wait for build (2-5 minutes)
5. Look for "BUILD SUCCESSFUL" message
6. A notification appears at bottom right
7. Click "locate" in the notification
```

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

✅ **Your APK is ready!**

📦 **File size:** ~15-30 MB

---

## Part 5: Install APK on Your Phone

### Method A: File Transfer (Easiest)

#### Step 5A.1: Transfer APK

```
1. Connect phone to computer via USB
2. Or use Google Drive, Email, etc.
3. Copy "app-debug.apk" to your phone
4. Can put it in Downloads folder
```

#### Step 5A.2: Install on Phone

```
1. Open "Files" or "Downloads" app on phone
2. Find "app-debug.apk"
3. Tap the APK file
4. You may see "For your security..."
5. Tap "Settings"
6. Enable "Allow from this source"
7. Go back
8. Tap "Install"
9. Wait for installation
10. Tap "Open"
```

✅ **EduFlow is now installed on your phone!**

### Method B: USB Direct Install (Advanced)

#### Step 5B.1: Enable USB Debugging

```
1. On your phone, go to Settings
2. Go to "About Phone"
3. Find "Build Number"
4. Tap "Build Number" 7 times
5. Enter your PIN/password
6. You see "You are now a developer!"
7. Go back to main Settings
8. Go to "Developer Options"
9. Enable "USB Debugging"
```

#### Step 5B.2: Install via ADB

```
1. Connect phone to computer via USB
2. On phone, tap "Allow USB Debugging" popup
3. On computer, open terminal/command prompt
4. Navigate to your project folder
5. Run command:
```

**Windows:**
```cmd
android\platform-tools\adb install android\app\build\outputs\apk\debug\app-debug.apk
```

**Mac/Linux:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

✅ **App installed directly to phone!**

---

## Part 6: Using Your App

### First Launch

```
1. Find "EduFlow" icon on your phone
2. Tap to open
3. App works just like a native Android app!
4. Works offline
5. Can share with friends
```

### Features

✅ **Works Offline** - No internet needed after installation
✅ **Native Performance** - Fast and smooth
✅ **Push Notifications** - Get learning reminders
✅ **Home Screen Icon** - Quick access
✅ **Full Screen** - Immersive experience

---

## 🔄 Updating Your App

When you make changes to the code:

### Quick Update Process

```
1. Make your code changes
2. Run: pnpm build
3. Run: npx cap sync android
4. Open Android Studio
5. Build → Build APK(s)
6. New APK created at same location
7. Install new APK on phone (replaces old version)
```

---

## 📊 Checklist

Use this to track your progress:

- [ ] Downloaded Android Studio
- [ ] Installed Android Studio
- [ ] Completed Android Studio first-time setup
- [ ] Downloaded Java JDK 17
- [ ] Installed Java JDK
- [ ] Ran setup script (setup-android.bat or .sh)
- [ ] Setup completed successfully
- [ ] "android" folder created in project
- [ ] Opened "android" folder in Android Studio
- [ ] Gradle sync completed successfully
- [ ] Built APK successfully
- [ ] Located app-debug.apk file
- [ ] Transferred APK to phone
- [ ] Installed APK on phone
- [ ] Opened EduFlow app on phone
- [ ] App works correctly

---

## ❓ Common Issues & Solutions

### Issue: "SDK location not found"

**Solution:**
```
1. Open android folder in File Explorer
2. Create new file: local.properties
3. Add this line:
   sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
   (Replace YOUR_USERNAME with your actual username)
4. Save file
5. Sync Gradle again
```

### Issue: "Gradle sync failed"

**Solution:**
```
1. In Android Studio: File → Invalidate Caches
2. Click "Invalidate and Restart"
3. Wait for Android Studio to reopen
4. Sync should work now
```

### Issue: "Build failed with error"

**Solution:**
```
1. Click "Build" → "Clean Project"
2. Wait for clean to complete
3. Click "Build" → "Rebuild Project"
4. Try building APK again
```

### Issue: "Can't install APK on phone"

**Solution:**
```
1. Uninstall existing EduFlow app from phone
2. Try installing new APK again
3. Make sure you enabled "Install from Unknown Sources"
```

### Issue: "App crashes when opened"

**Solution:**
```
1. Make sure you ran "pnpm build" before building APK
2. Make sure "dist" folder exists in project
3. Rebuild APK
4. Try installing again
```

---

## 📞 Getting Help

If you're stuck:

1. **Read the detailed guide:** `BUILD_APK_GUIDE.md`
2. **Check quick reference:** `APK_QUICK_REFERENCE.md`
3. **Run diagnostics:**
   ```bash
   npx cap doctor
   ```
4. **Check logs:**
   ```bash
   adb logcat | grep -i "eduflow"
   ```

---

## 🎉 Success!

Congratulations! You now have:

✅ A proper Android APK file
✅ EduFlow installed on your phone
✅ The ability to share with friends
✅ A native Android app experience

**You can:**
- Install on unlimited devices
- Share APK with anyone
- Publish to Google Play Store
- Distribute however you want

---

**Enjoy your EduFlow mobile app! 📱🎓**
