# 📱 EduFlow - Android APK Build Guide

Complete guide to build a proper Android APK file for EduFlow.

## Prerequisites

Before building the APK, you need to install:

1. **Node.js** (v18 or later) - [Download](https://nodejs.org/)
2. **Android Studio** - [Download](https://developer.android.com/studio)
3. **Java JDK 17** - [Download](https://www.oracle.com/java/technologies/downloads/)

## Step 1: Initial Setup

### Install Android Studio
1. Download and install Android Studio
2. Open Android Studio
3. Go to **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**
4. Install the following:
   - Android SDK Platform 34 (or latest)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools

### Set Environment Variables

**For Windows:**
```bash
# Add to System Environment Variables
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk-17

# Add to Path:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\cmdline-tools\latest\bin
%JAVA_HOME%\bin
```

**For Mac/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

## Step 2: Build the Web App

```bash
# Navigate to project directory
cd /path/to/eduflow

# Install dependencies (if not already done)
pnpm install

# Build the web application
pnpm build
```

This creates a `dist` folder with the compiled web app.

## Step 3: Initialize Capacitor (First Time Only)

If you haven't already initialized Capacitor:

```bash
# Initialize Capacitor
npx cap init

# When prompted, enter:
# App name: EduFlow
# App ID: com.eduflow.app
# Web asset directory: dist
```

## Step 4: Add Android Platform

```bash
# Add Android platform (first time only)
pnpm cap:add:android

# Or manually:
npx cap add android
```

This creates an `android` folder with the Android project.

## Step 5: Sync Web App with Android

Every time you rebuild the web app, run:

```bash
# Build and sync in one command
pnpm build:android

# Or manually:
pnpm build
npx cap sync android
```

## Step 6: Build the APK

### Option A: Build with Android Studio (Recommended)

1. Open Android Studio
2. Click **Open an Existing Project**
3. Navigate to `eduflow/android` folder and open it
4. Wait for Gradle sync to complete
5. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
6. Wait for the build to complete
7. Click **locate** in the notification to find the APK
8. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option B: Build from Command Line

```bash
# Navigate to android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (unsigned)
./gradlew assembleRelease
```

**APK Locations:**
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Step 7: Sign the Release APK (For Production)

To publish on Play Store or distribute widely, sign the APK:

### Generate Keystore

```bash
# Generate keystore file
keytool -genkey -v -keystore eduflow-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias eduflow

# Answer the prompts:
# - Enter keystore password
# - Enter your name, organization, etc.
# - Enter key password
```

### Configure Gradle Signing

Create `android/key.properties`:

```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=eduflow
storeFile=../eduflow-release-key.jks
```

Edit `android/app/build.gradle`:

```gradle
// Add before android { block
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    // Add signing config
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Build Signed Release APK

```bash
cd android
./gradlew assembleRelease

# Signed APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

## Step 8: Install APK on Android Device

### Method 1: USB Installation

```bash
# Enable USB Debugging on your Android phone
# Connect phone to computer via USB

# Install the APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or for release:
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Method 2: Manual Installation

1. Copy the APK file to your phone
2. Open the APK file on your phone
3. Allow installation from unknown sources if prompted
4. Click Install

## Customization

### Update App Icon

Replace these files in `android/app/src/main/res/`:

- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Update App Name

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">EduFlow</string>
    <string name="title_activity_main">EduFlow</string>
    <string name="package_name">com.eduflow.app</string>
    <string name="custom_url_scheme">com.eduflow.app</string>
</resources>
```

### Update Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Add required permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        ...
    </application>
</manifest>
```

## Troubleshooting

### Error: "SDK location not found"

Create `android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
# Or for Mac/Linux:
# sdk.dir=/Users/YourUsername/Library/Android/sdk
```

### Error: "Gradle build failed"

1. Open Android Studio
2. File → Invalidate Caches and Restart
3. Build → Clean Project
4. Build → Rebuild Project

### Error: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

Uninstall the existing app first:
```bash
adb uninstall com.eduflow.app
```

### App Crashes on Startup

Check logs:
```bash
adb logcat | grep -i "eduflow"
```

## Quick Reference

```bash
# Complete build workflow
pnpm install          # Install dependencies
pnpm build            # Build web app
npx cap sync android  # Sync to Android
cd android            # Navigate to Android
./gradlew assembleDebug  # Build APK

# APK location
# android/app/build/outputs/apk/debug/app-debug.apk
```

## Distribution

### Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Build a signed release APK
3. Create app listing on Play Console
4. Upload the APK
5. Complete store listing (screenshots, description, etc.)
6. Submit for review

### Direct Distribution

1. Build signed release APK
2. Host on your website
3. Share download link
4. Users must enable "Install from Unknown Sources"

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Capacitor Android Configuration](https://capacitorjs.com/docs/android/configuration)

## Support

For issues with building:
1. Check Capacitor logs: `npx cap doctor`
2. Check Android logs: `adb logcat`
3. Verify Android Studio setup
4. Clean and rebuild: `cd android && ./gradlew clean`

---

**Your app is ready to be built as a native Android APK! 🎉**
