// EduFlow - Education Platform v2.1 - Fixed module import issues
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { AppProvider } from './context/AppContext';
import { router } from './routes';
import { Toaster } from 'sonner';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { registerServiceWorker, initPWAInstall, addMetaTags } from './utils/pwa';
import { useGenerateIcons } from './hooks/useGenerateIcons';
import { isMobileApp, logDeviceInfo } from './utils/platform';
import { AppErrorBoundary } from './components/AppErrorBoundary';

export default function App() {
  useGenerateIcons();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Log device info in development
    if (import.meta.env.DEV) {
      logDeviceInfo();
    }

    // Initialize PWA functionality
    addMetaTags();
    registerServiceWorker();
    initPWAInstall();

    // Mark app as initialized
    setIsInitialized(true);

    // Log app start
    console.log('🚀 EduFlow v2.1.0 - Smart Learning Platform');
    console.log(`📱 Platform: ${isMobileApp() ? 'Native Mobile App' : 'Web Browser'}`);
  }, []);

  if (!isInitialized) {
    return null; // or a loading screen
  }

  return (
    <AppErrorBoundary>
      <AppProvider>
        <a className="skip-link" href="#app-route">Skip to main content</a>
        <div id="app-route" tabIndex={-1}><RouterProvider router={router} /></div>
        <Toaster position="top-right" richColors />
        <PWAInstallPrompt />
      </AppProvider>
    </AppErrorBoundary>
  );
}