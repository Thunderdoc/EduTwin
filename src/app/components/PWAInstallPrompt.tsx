import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { showInstallPrompt, isPWAInstalled } from '../utils/pwa';
import { Button } from './ui/button';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isPWAInstalled());

    // Listen for install availability
    const handleInstallAvailable = () => {
      if (!isPWAInstalled()) {
        setShowPrompt(true);
      }
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if dismissed in this session
  if (sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null;
  }

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if not available
  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-lime-200 p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Install EduFlow</h3>
            <p className="text-sm text-gray-600">
              Install our app for a better experience! Access offline, get notifications, and enjoy native-like performance.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleInstall}
            className="flex-1 bg-gradient-to-r from-lime-600 to-green-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          <Button onClick={handleDismiss} variant="outline">
            Not Now
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          ✓ Works offline · ✓ Fast & secure · ✓ No app store required
        </div>
      </div>
    </div>
  );
}
