#!/bin/bash

# EduFlow Mobile App - APK Build Script
# This script automates the entire APK build process

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════╗"
echo "║     EduFlow Mobile App - APK Build Script              ║"
echo "║     Version 2.1.0                                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}► $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_success "Node.js found: $(node -v)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi
print_success "pnpm found: $(pnpm -v)"

# Check Java
if ! command -v java &> /dev/null; then
    print_warning "Java not found. Android build may fail."
    print_info "Please install Java JDK 17+ from: https://adoptium.net/"
else
    print_success "Java found: $(java -version 2>&1 | head -n 1)"
fi

echo ""
print_step "Installing dependencies..."
pnpm install
print_success "Dependencies installed"

echo ""
print_step "Building web application..."
pnpm build
print_success "Web app built successfully"

echo ""
print_step "Checking Capacitor setup..."

# Check if android folder exists
if [ ! -d "android" ]; then
    print_warning "Android platform not found. Adding Android platform..."
    npx cap add android
    print_success "Android platform added"
else
    print_success "Android platform already exists"
fi

echo ""
print_step "Syncing files to Android platform..."
npx cap sync android
print_success "Files synced successfully"

echo ""
print_step "Checking for Android Studio..."
if command -v studio &> /dev/null || [ -d "/Applications/Android Studio.app" ] || [ -d "/opt/android-studio" ]; then
    print_success "Android Studio detected"
    echo ""
    print_info "═══════════════════════════════════════════════════════"
    print_info "Build preparation complete!"
    print_info "═══════════════════════════════════════════════════════"
    echo ""
    print_step "Next steps to generate APK:"
    echo "  1. Open Android Studio"
    echo "  2. Open project from: $(pwd)/android"
    echo "  3. Wait for Gradle sync to complete"
    echo "  4. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "  5. APK will be at: android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    
    # Ask if user wants to open Android Studio
    read -p "Would you like to open Android Studio now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Opening Android Studio..."
        npx cap open android
    fi
else
    print_warning "Android Studio not found"
    print_info "═══════════════════════════════════════════════════════"
    print_info "Build preparation complete!"
    print_info "═══════════════════════════════════════════════════════"
    echo ""
    print_warning "To complete APK build:"
    echo "  1. Install Android Studio from: https://developer.android.com/studio"
    echo "  2. Open the project: $(pwd)/android"
    echo "  3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo ""
fi

echo ""
print_info "═══════════════════════════════════════════════════════"
print_success "Script completed successfully!"
print_info "═══════════════════════════════════════════════════════"
echo ""

# Print build information
print_info "Build Information:"
echo "  App Name: EduFlow"
echo "  App ID: com.eduflow.app"
echo "  Version: 2.1.0"
echo "  Platform: Android"
echo "  Build Type: Debug"
echo ""

print_info "For release build (signed APK for Play Store):"
echo "  1. Generate keystore (if not done already):"
echo "     keytool -genkey -v -keystore eduflow-release-key.jks \\"
echo "       -keyalg RSA -keysize 2048 -validity 10000 -alias eduflow-key"
echo ""
echo "  2. In Android Studio:"
echo "     Build → Generate Signed Bundle / APK → APK"
echo ""

print_info "For detailed instructions, see: BUILD_MOBILE_APP.md"
echo ""
