import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Navigation } from '../components/Navigation';
import { Check, X, AlertCircle } from 'lucide-react';

export default function ButtonTestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [lastButtonClicked, setLastButtonClicked] = useState<string>('');

  const handleButtonClick = (buttonName: string) => {
    setClickCount(prev => prev + 1);
    setLastButtonClicked(buttonName);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Button Functionality Test
          </h1>

          {/* Status Display */}
          <Card className="shadow-lg border-0 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Button Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-2">
                <strong>Total Clicks:</strong> {clickCount}
              </p>
              <p className="text-lg">
                <strong>Last Button Clicked:</strong>{' '}
                {lastButtonClicked || 'None yet'}
              </p>
            </CardContent>
          </Card>

          {/* Test Buttons */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle>Button Variants Test</CardTitle>
              <CardDescription>Click any button to test functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Default Buttons</p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleButtonClick('Default Primary')}>
                    Default Primary
                  </Button>
                  <Button variant="secondary" onClick={() => handleButtonClick('Secondary')}>
                    Secondary
                  </Button>
                  <Button variant="outline" onClick={() => handleButtonClick('Outline')}>
                    Outline
                  </Button>
                  <Button variant="ghost" onClick={() => handleButtonClick('Ghost')}>
                    Ghost
                  </Button>
                  <Button variant="destructive" onClick={() => handleButtonClick('Destructive')}>
                    Destructive
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Size Variants</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" onClick={() => handleButtonClick('Small Button')}>
                    Small
                  </Button>
                  <Button size="default" onClick={() => handleButtonClick('Default Size')}>
                    Default
                  </Button>
                  <Button size="lg" onClick={() => handleButtonClick('Large Button')}>
                    Large
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Buttons with Icons</p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleButtonClick('Success Icon')}>
                    <Check className="w-4 h-4 mr-2" />
                    Success
                  </Button>
                  <Button variant="destructive" onClick={() => handleButtonClick('Error Icon')}>
                    <X className="w-4 h-4 mr-2" />
                    Error
                  </Button>
                  <Button variant="outline" onClick={() => handleButtonClick('Warning Icon')}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Warning
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Full Width Button</p>
                <Button 
                  className="w-full" 
                  onClick={() => handleButtonClick('Full Width Button')}
                >
                  Click Me - Full Width
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Gradient Buttons</p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleButtonClick('Blue-Purple Gradient')}
                  >
                    Blue-Purple Gradient
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    onClick={() => handleButtonClick('Green-Teal Gradient')}
                  >
                    Green-Teal Gradient
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">Disabled State</p>
                <div className="flex flex-wrap gap-3">
                  <Button disabled onClick={() => handleButtonClick('Disabled Button')}>
                    Disabled Button (Should Not Click)
                  </Button>
                  <Button variant="outline" disabled onClick={() => handleButtonClick('Disabled Outline')}>
                    Disabled Outline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="shadow-lg border-0 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-700">
                <strong>Test Instructions:</strong> Click any button above to verify functionality. 
                The counter at the top should increment, and the button name should be displayed. 
                If buttons are not responding, there may be a CSS or z-index issue blocking clicks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
