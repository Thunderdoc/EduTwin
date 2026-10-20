# 📱 EduFlow Mobile App - Build Guide

## Quick Start - Build Android APK

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Android Studio installed (for Android builds)
- Java JDK 17+ installed

### Method 1: Automated Build (Recommended)

#### Windows Users:
```bash
# Run the automated setup script
./setup-android.bat

# Build the app
pnpm build:android

# Open in Android Studio
pnpm cap:open:android
```

#### Mac/Linux Users:
```bash
# Make script executable
chmod +x setup-android.sh

# Run the automated setup script
./setup-android.sh

# Build the app
pnpm build:android

# Open in Android Studio
pnpm cap:open:android
```

### Method 2: Manual Build Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Build Web App**
   ```bash
   pnpm build
   ```

3. **Initialize Capacitor (First Time Only)**
   ```bash
   pnpm cap:init
   ```

4. **Add Android Platform (First Time Only)**
   ```bash
   pnpm cap:add:android
   ```

5. **Sync Files to Android**
   ```bash
   pnpm cap:sync
   ```

6. **Open in Android Studio**
   ```bash
   pnpm cap:open:android
   ```

7. **Generate APK in Android Studio**
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - APK will be generated in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Method 3: Generate Signed Release APK

1. **Create Keystore (First Time Only)**
   ```bash
   keytool -genkey -v -keystore eduflow-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias eduflow-key
   ```

2. **Update capacitor.config.ts**
   ```typescript
   android: {
     buildOptions: {
       keystorePath: 'path/to/eduflow-release-key.jks',
       keystoreAlias: 'eduflow-key',
     }
   }
   ```

3. **Build Release APK in Android Studio**
   - Click **Build** → **Generate Signed Bundle / APK**
   - Select **APK**
   - Choose your keystore file
   - Enter keystore password and key alias password
   - Select **release** build variant
   - Click **Finish**

## 📦 App Configuration

### App Details
- **App ID**: com.eduflow.app
- **App Name**: EduFlow
- **Theme Color**: #65a30d (Lime Green)
- **Background Color**: #ffffff (White)

### Features Included
✅ Offline-First Architecture
✅ Smart Learning Engine with 8 AI Systems
✅ Adaptive Difficulty Adjustment
✅ Real-Time Analytics Dashboard
✅ Spaced Repetition Algorithm
✅ AI Chat Assistant
✅ Multi-Language Support (English, Telugu, Tamil)
✅ Custom Subject & Skill Creation
✅ Teacher Portal
✅ Gamification System
✅ Knowledge Graph Visualization
✅ 15+ AI-Powered Tools
✅ PWA Support

## 🎨 Customization

### Change App Icon
1. Replace icons in `/public/` directory:
   - `icon-192.png` (192x192px)
   - `icon-512.png` (512x512px)

2. Update manifest:
   ```bash
   # Visit /public/generate-icons.html in browser to generate icons
   ```

3. Sync changes:
   ```bash
   pnpm cap:sync
   ```

### Change App Name
1. Edit `/capacitor.config.ts`:
   ```typescript
   appName: 'Your App Name',
   ```

2. Edit `/public/manifest.json`:
   ```json
   {
     "name": "Your App Name - Smart Learning Platform",
     "short_name": "Your App Name"
   }
   ```

3. Sync changes:
   ```bash
   pnpm cap:sync
   ```

### Change Theme Colors
1. Edit `/public/manifest.json`:
   ```json
   {
     "theme_color": "#YOUR_COLOR",
     "background_color": "#YOUR_COLOR"
   }
   ```

2. Edit `/capacitor.config.ts`:
   ```typescript
   SplashScreen: {
     backgroundColor: '#YOUR_COLOR',
   }
   ```

## 🚀 Distribution

### Google Play Store
1. Generate signed release APK (see Method 3 above)
2. Create a Google Play Developer account ($25 one-time fee)
3. Create new app listing in Google Play Console
4. Upload APK and fill in store listing details
5. Submit for review

### Direct Distribution
1. Generate signed release APK
2. Share APK file directly with users
3. Users need to enable "Install from Unknown Sources" in Android settings

## 🔧 Troubleshooting

### Build Fails
```bash
# Clean build cache
cd android
./gradlew clean
cd ..

# Rebuild
pnpm build:android
```

### Capacitor Errors
```bash
# Remove and re-add Android platform
npx cap remove android
pnpm cap:add:android
pnpm cap:sync
```

### Android Studio Issues
- Ensure Android SDK is installed
- Check Java JDK version (must be JDK 17+)
- Update Android Studio to latest version
- Sync Gradle files in Android Studio

## 📱 Test on Device

### Via USB Debugging
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run from Android Studio

### Via APK Installation
1. Copy APK to device
2. Open file manager and tap APK
3. Allow installation from unknown sources if prompted
4. Install and open app

## 🎯 Next Steps

After building your app:
1. Test thoroughly on physical devices
2. Optimize performance using Chrome DevTools
3. Set up crash reporting (Firebase Crashlytics)
4. Implement analytics (Google Analytics)
5. Add push notifications (Firebase Cloud Messaging)
6. Submit to app stores

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Guide](https://developer.android.com/studio)
- [Google Play Console](https://play.google.com/console)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## 💡 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Capacitor documentation
3. Check Android Studio error logs
4. Review build output in terminal

---

**Built with ❤️ using React + TypeScript + Vite + Capacitor**
