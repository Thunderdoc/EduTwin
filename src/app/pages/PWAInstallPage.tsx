import { useNavigate } from 'react-router';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Button } from '../components/ui/button';
import { PWAInstallInstructions } from '../components/PWAInstallInstructions';
import { showInstallPrompt, isPWAInstalled } from '../utils/pwa';
import { useState, useEffect } from 'react';

export default function PWAInstallPage() {
  const navigate = useNavigate();
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());

    const handleInstallAvailable = () => {
      setCanInstall(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
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
      setIsInstalled(true);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-lime-50 p-6 lg:ml-64">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-green-500 rounded-2xl flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                Install EduFlow
              </h1>
              <p className="text-gray-600">Get the full app experience on your device</p>
            </div>
          </div>

          {/* Installation Status */}
          {isInstalled ? (
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-green-800">App Installed Successfully! 🎉</h3>
                  <p className="text-sm text-green-700">
                    You're using the installed version of EduFlow. Enjoy offline access and faster performance!
                  </p>
                </div>
              </div>
            </div>
          ) : canInstall ? (
            <div className="mb-6 p-6 bg-lime-50 border-2 border-lime-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="w-6 h-6 text-lime-600" />
                  <div>
                    <h3 className="font-bold text-lime-800">Ready to Install</h3>
                    <p className="text-sm text-lime-700">
                      Click the button to install EduFlow on your device
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleInstall}
                  className="bg-gradient-to-r from-lime-600 to-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              </div>
            </div>
          ) : null}

          {/* Installation Instructions */}
          <PWAInstallInstructions />

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
              <h3 className="font-bold mb-2">📱 Mobile Optimized</h3>
              <p className="text-sm text-gray-600">
                Fully responsive design that works perfectly on phones, tablets, and desktops
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
              <h3 className="font-bold mb-2">⚡ Lightning Fast</h3>
              <p className="text-sm text-gray-600">
                Instant loading with intelligent caching and optimized performance
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
              <h3 className="font-bold mb-2">🔒 Secure & Private</h3>
              <p className="text-sm text-gray-600">
                All data stored locally on your device with end-to-end encryption
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
              <h3 className="font-bold mb-2">🎯 No App Store</h3>
              <p className="text-sm text-gray-600">
                Install directly from the web - no need for Google Play or App Store
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
