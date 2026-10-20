# 📱 EduFlow Mobile App

<div align="center">

![EduFlow Logo](public/icon-192.png)

# EduFlow - Smart Learning Platform

**Next-Generation Autonomous Learning Platform with AI-Powered Personalization**

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/yourusername/eduflow)
[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](https://www.android.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.3.0-119EFF.svg)](https://capacitorjs.com/)

</div>

---

## 🌟 Features

### 🧠 Smart Engine - 8 Advanced AI Systems
1. **Learning DNA Profiler** - Understands your unique learning patterns
2. **Cognitive State Modeler** - Adapts to your mental state in real-time
3. **Adaptive Strategy Switcher** - Changes teaching methods based on performance
4. **Future Path Simulator** - Predicts and optimizes your learning journey
5. **Cognitive Load Balancer** - Prevents mental overload
6. **Memory Strength Mapper** - Tracks and reinforces memory retention
7. **Error Intelligence Classifier** - Analyzes mistakes to improve learning
8. **Invisible Personalization Engine** - Seamless, automatic customization

### ⚡ Core Features
- **🎯 Autonomous Learning Loop** - One-click learning (Learn → Test → Analyze → Adapt → Repeat)
- **📴 Offline-First Design** - Complete functionality without internet
- **🔄 Real-Time Difficulty Adjustment** - Adapts to your performance instantly
- **📊 Spaced Repetition Algorithm** - Optimizes memory retention
- **🎮 Gamification System** - Streaks, achievements, and rewards
- **📈 Advanced Analytics** - Comprehensive learning insights
- **🤖 AI Chat Assistant** - Context-aware help and guidance
- **🌐 Multi-Language Support** - English, Telugu, Tamil

### 🛠️ 15+ AI-Powered Tools
1. **Enhanced Chat** - Intelligent conversational AI
2. **Quiz Generator** - Auto-generate custom quizzes
3. **Notes Generator** - AI-powered note-taking
4. **Code Playground** - Learn coding interactively
5. **Math Solver** - Step-by-step math solutions
6. **Essay Writer** - AI writing assistance
7. **Flashcards** - Smart flashcard creation
8. **Voice Assistant** - Voice-controlled learning
9. **Doubt Solver** - Instant doubt resolution
10. **Mock Tests** - Realistic exam simulation
11. **Summarizer** - Content summarization
12. **Translator** - Multi-language translation
13. **Mind Map** - Visual concept mapping
14. **Writing Assistant** - Grammar and style help
15. **Interview Trainer** - Practice interviews

### 🎨 Customization
- **Theme System** - Light, Dark, Auto modes
- **Font Sizes** - Small, Medium, Large
- **Layout Density** - Comfortable, Compact, Spacious
- **Learning Pace** - Slow, Medium, Fast
- **Custom Subjects & Skills** - Create your own learning paths

### 👨‍🏫 Teacher Portal
- Student performance tracking
- Intervention recommendations
- Real-time analytics
- Progress monitoring

---

## 🚀 Quick Start

### For Users
1. **Download the APK** from releases
2. **Enable "Install from Unknown Sources"** in Android settings
3. **Install EduFlow**
4. **Open the app** and create an account
5. **Start learning!**

### For Developers

#### Build APK in 3 Easy Steps

**Windows:**
```bash
# Run automated build script
./build-apk.bat
```

**Mac/Linux:**
```bash
# Make script executable
chmod +x build-apk.sh

# Run automated build script
./build-apk.sh
```

**Manual Build:**
```bash
# Install dependencies
pnpm install

# Build web app
pnpm build

# Sync to Android
pnpm build:android

# Open in Android Studio
pnpm cap:open:android
```

📚 **Detailed Instructions:** See [BUILD_MOBILE_APP.md](BUILD_MOBILE_APP.md)

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.3.1** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **React Router 7** - Navigation

### Mobile Stack
- **Capacitor 8.3.0** - Native Bridge
- **PWA** - Progressive Web App Support
- **Service Worker** - Offline Functionality
- **IndexedDB** - Local Data Storage

### UI Components
- **Radix UI** - Accessible Components
- **shadcn/ui** - Component Library
- **Recharts** - Data Visualization
- **Lucide Icons** - Icon System

### AI & Analytics
- **Cognitive Engine** - Custom AI System
- **Local ML Processing** - Privacy-First AI
- **Behavior Analytics** - Learning Pattern Analysis

---

## 📁 Project Structure

```
eduflow/
├── android/                 # Capacitor Android project
├── public/                  # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Service worker
│   └── icon-*.png          # App icons
├── src/
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── pages/          # App pages/routes
│   │   ├── context/        # React context
│   │   ├── lib/            # Utilities & libraries
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   └── App.tsx         # Main app component
│   └── styles/             # CSS files
├── capacitor.config.ts     # Capacitor configuration
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
└── BUILD_MOBILE_APP.md     # Build instructions
```

---

## 🎯 Key Concepts

### Autonomous Learning
- **Zero-Decision Learning** - No complex choices, just click "Start"
- **Continuous Loop** - Seamless progression through learning phases
- **Automatic Adaptation** - System adjusts without manual input

### Cognitive Personalization
- **Learning DNA** - Unique profile for each user
- **Mental State Tracking** - Real-time cognitive load monitoring
- **Adaptive Strategies** - Teaching method switches based on effectiveness
- **Predictive Paths** - AI predicts optimal learning trajectory

### Offline-First Design
- **Complete Offline Functionality** - All core features work offline
- **Local Data Storage** - Everything saved on device
- **Background Sync** - Seamless sync when online
- **No Internet Required** - Learn anywhere, anytime

---

## 📊 Performance

- **Instant Load Time** - Optimized bundle splitting
- **Smooth Animations** - 60 FPS UI
- **Low Memory Usage** - Efficient resource management
- **Battery Optimized** - Minimal battery drain

---

## 🔒 Privacy & Security

- **Local-First Data** - All data stored on device
- **No PII Collection** - We don't collect personal information
- **No Tracking** - Your learning is private
- **Offline Capable** - Works without internet

---

## 🛠️ Development

### Requirements
- Node.js 18+
- pnpm
- Android Studio (for Android builds)
- Java JDK 17+

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/eduflow.git

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Build Android app
pnpm build:android
```

### Available Scripts
```json
{
  "build": "vite build",
  "cap:init": "npx cap init",
  "cap:add:android": "npx cap add android",
  "cap:sync": "npx cap sync",
  "cap:open:android": "npx cap open android",
  "build:android": "pnpm build && npx cap sync android"
}
```

---

## 📱 App Configuration

### Manifest (PWA)
```json
{
  "name": "EduFlow - Smart Learning Platform",
  "short_name": "EduFlow",
  "theme_color": "#65a30d",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### Capacitor
```typescript
{
  appId: 'com.eduflow.app',
  appName: 'EduFlow',
  webDir: 'dist'
}
```

---

## 🎨 Customization Guide

### Change App Name
1. Edit `capacitor.config.ts`
2. Edit `public/manifest.json`
3. Run `pnpm cap:sync`

### Change App Icon
1. Replace `public/icon-192.png` and `public/icon-512.png`
2. Visit `/public/generate-icons.html` to generate all sizes
3. Run `pnpm cap:sync`

### Change Theme Colors
1. Edit `public/manifest.json` for theme colors
2. Edit `capacitor.config.ts` for splash screen
3. Edit `src/styles/theme.css` for app colors

---

## 📦 Distribution

### Google Play Store
1. Generate signed release APK
2. Create Google Play Developer account
3. Create app listing
4. Upload APK
5. Submit for review

### Direct Distribution
1. Build release APK
2. Share APK file
3. Users enable "Unknown Sources"
4. Install app

---

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean cache
cd android && ./gradlew clean && cd ..

# Rebuild
pnpm build:android
```

### Capacitor Errors
```bash
# Remove and re-add platform
npx cap remove android
pnpm cap:add:android
pnpm cap:sync
```

### Common Issues
- **Gradle build failed** → Update Java to JDK 17+
- **Android SDK missing** → Install via Android Studio
- **Capacitor sync failed** → Delete `android/` and re-add platform

---

## 📚 Documentation

- **Build Guide:** [BUILD_MOBILE_APP.md](BUILD_MOBILE_APP.md)
- **APK Quick Reference:** [APK_QUICK_REFERENCE.md](APK_QUICK_REFERENCE.md)
- **Setup Guide:** [START_HERE.md](START_HERE.md)
- **Visual Guide:** [VISUAL_GUIDE.md](VISUAL_GUIDE.md)

---

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- React Team
- Capacitor Team
- Tailwind CSS
- Radix UI
- shadcn/ui
- All open-source contributors

---

## 📞 Support

For issues or questions:
- Check [BUILD_MOBILE_APP.md](BUILD_MOBILE_APP.md)
- Review documentation
- Open an issue on GitHub

---

## 🚀 Roadmap

### Version 2.2 (Upcoming)
- [ ] iOS Support
- [ ] Cloud Sync
- [ ] Real-time Collaboration
- [ ] Advanced AI Models
- [ ] More Languages

### Version 3.0 (Future)
- [ ] AR/VR Learning Modes
- [ ] Social Learning Features
- [ ] Marketplace for Custom Content
- [ ] Advanced Analytics Dashboard
- [ ] Integration with LMS

---

<div align="center">

**Built with ❤️ using React + TypeScript + Vite + Capacitor**

[Website](#) • [Documentation](#) • [Support](#) • [GitHub](#)

</div>
