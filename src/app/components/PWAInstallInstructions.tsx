import { Smartphone, Chrome, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function PWAInstallInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Install EduFlow on Your Device</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Android Chrome */}
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold mb-2">Android (Chrome)</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Tap the menu icon (⋮) in the top right</li>
              <li>Select "Install app" or "Add to Home screen"</li>
              <li>Follow the prompts to install</li>
              <li>Launch from your home screen!</li>
            </ol>
          </div>
        </div>

        {/* iOS Safari */}
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold mb-2">iPhone/iPad (Safari)</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Tap the Share button (□↑) at the bottom</li>
              <li>Scroll and tap "Add to Home Screen"</li>
              <li>Name it "EduFlow" and tap "Add"</li>
              <li>Find the app icon on your home screen!</li>
            </ol>
          </div>
        </div>

        {/* Desktop Chrome */}
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Monitor className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold mb-2">Desktop (Chrome/Edge)</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Click the install icon (⊕) in the address bar</li>
              <li>Or click menu (⋮) → "Install EduFlow"</li>
              <li>Click "Install" in the popup</li>
              <li>Launch from your desktop or taskbar!</li>
            </ol>
          </div>
        </div>

        <div className="p-4 bg-lime-50 rounded-lg">
          <h4 className="font-bold text-lime-800 mb-2">Benefits of Installing:</h4>
          <ul className="text-sm text-lime-700 space-y-1">
            <li>✓ <strong>Work Offline:</strong> Access your learning content without internet</li>
            <li>✓ <strong>Faster Loading:</strong> Native-like performance and speed</li>
            <li>✓ <strong>Save Data:</strong> Cached content reduces data usage</li>
            <li>✓ <strong>Full Screen:</strong> Immersive learning experience</li>
            <li>✓ <strong>Quick Access:</strong> Launch directly from home screen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
