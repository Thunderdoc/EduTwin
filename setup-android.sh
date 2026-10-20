#!/bin/bash

# EduFlow Android Setup Script
# This script prepares your project for Android APK building

echo "🚀 EduFlow - Android APK Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm found: $(pnpm --version)"

# Step 1: Install dependencies
echo ""
echo "📦 Step 1: Installing dependencies..."
pnpm install

# Step 2: Build the web app
echo ""
echo "🔨 Step 2: Building web application..."
pnpm build

# Check if dist folder was created
if [ ! -d "dist" ]; then
    echo "❌ Build failed. dist folder not created."
    exit 1
fi

echo "✅ Web app built successfully"

# Step 3: Add Android platform
echo ""
echo "📱 Step 3: Adding Android platform..."

if [ -d "android" ]; then
    echo "⚠️  Android platform already exists. Skipping..."
else
    npx cap add android
    echo "✅ Android platform added"
fi

# Step 4: Sync web app to Android
echo ""
echo "🔄 Step 4: Syncing web app to Android..."
npx cap sync android

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "To build the APK, you have two options:"
echo ""
echo "Option 1 - Android Studio (Recommended):"
echo "  1. Open Android Studio"
echo "  2. Open the 'android' folder from this project"
echo "  3. Click Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "  4. Find APK in: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Option 2 - Command Line:"
echo "  cd android"
echo "  ./gradlew assembleDebug"
echo ""
echo "⚠️  Prerequisites Required:"
echo "  - Android Studio installed"
echo "  - Android SDK configured"
echo "  - Java JDK 17 installed"
echo ""
echo "📖 For detailed instructions, see BUILD_APK_GUIDE.md"
echo "================================"
