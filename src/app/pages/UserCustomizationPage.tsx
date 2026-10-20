import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import {
  Palette,
  Settings,
  User,
  Bell,
  Gauge,
  Layout,
  Moon,
  Sun,
  Monitor,
  Save,
  RotateCcw,
  Brain,
  Clock,
  Target,
  Zap,
  Mail,
  Volume2,
  Download,
  Sparkles,
  Globe,
  Type,
  Grid,
  CheckCircle2,
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import Navigation from '../components/Navigation';

export default function UserCustomizationPage() {
  const { userPreferences, updateUserPreferences, userProfile, setUserProfile, language, setLanguage, clearOfflineStorage } = useApp();
  const [hasChanges, setHasChanges] = useState(false);
  const [profileName, setProfileName] = useState(userProfile?.name || '');
  const [profileEmail, setProfileEmail] = useState(userProfile?.email || '');

  useEffect(() => {
    setProfileName(userProfile?.name || '');
    setProfileEmail(userProfile?.email || '');
  }, [userProfile]);

  // Color palette options
  const accentColors = [
    { name: 'Purple', value: '#8b5cf6', gradient: 'from-purple-500 to-purple-600' },
    { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
    { name: 'Green', value: '#10b981', gradient: 'from-green-500 to-green-600' },
    { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Orange', value: '#f97316', gradient: 'from-orange-500 to-orange-600' },
    { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
  ];

  const handlePreferenceChange = (key: string, value: any) => {
    updateUserPreferences({ [key]: value });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (userProfile && profileName.trim() && profileEmail.trim()) {
      setUserProfile({ ...userProfile, name: profileName.trim(), email: profileEmail.trim().toLowerCase() });
    }
    toast.success('Preferences saved successfully!', { description: 'Your customization settings have been updated.' });
    setHasChanges(false);
  };

  const handleResetToDefaults = () => {
    updateUserPreferences({ theme: 'auto', accentColor: '#8b5cf6', fontSize: 'medium', layoutDensity: 'comfortable', learningPace: 'medium', difficultyLevel: 'intermediate', dailyGoalMinutes: 60, preferredStudyTime: 'evening', notificationsEnabled: true, reminderFrequency: 'medium', emailNotifications: true, showDigitalTwin: true, autoSaveNotes: true, offlineMode: false, animationsEnabled: true, highContrast: false, dyslexiaFriendlyFont: false });
    toast.info('All settings were reset to their defaults.');
    setHasChanges(false);
  };

  const exportMyData = () => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith('eduflow_') || key.startsWith('cognilearn_'));
    const data = Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)]));
    const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'eduflow-my-data.json'; link.click(); URL.revokeObjectURL(url);
    toast.success('Your data export is ready.');
  };

  const deleteMyAccount = () => {
    if (!window.confirm('Delete this local account and all EduFlow data on this device? This cannot be undone.')) return;
    Object.keys(localStorage).filter((key) => key.startsWith('eduflow_') || key.startsWith('cognilearn_')).forEach((key) => localStorage.removeItem(key));
    clearOfflineStorage();
    window.location.assign(import.meta.env.BASE_URL);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customization Center</h1>
              <p className="text-gray-600">Personalize your learning experience</p>
            </div>
          </div>

          {userProfile && (
            <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <User className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Welcome, {userProfile.name}!</strong> Customize your CogniLearn AI experience below.
              </AlertDescription>
            </Alert>
          )}

          {hasChanges && (
            <Alert className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900 flex items-center justify-between">
                <span>You have unsaved changes</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleResetToDefaults}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges} className="bg-gradient-to-r from-green-500 to-emerald-600">
                    <Save className="w-3 h-3 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Interface</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance & Theme
                </CardTitle>
                <CardDescription>Customize the look and feel of your interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Mode */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Theme Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'auto', icon: Monitor, label: 'Auto' },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => handlePreferenceChange('theme', theme.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          userPreferences.theme === theme.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                        <p className="text-sm font-medium">{theme.label}</p>
                        {userPreferences.theme === theme.value && (
                          <CheckCircle2 className="w-4 h-4 text-purple-600 mx-auto mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Accent Color */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Accent Color</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handlePreferenceChange('accentColor', color.value)}
                        className="relative group"
                      >
                        <div
                          className={`w-full aspect-square rounded-xl bg-gradient-to-br ${color.gradient} shadow-lg hover:scale-110 transition-transform`}
                        />
                        {userPreferences.accentColor === color.value && (
                          <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white" />
                        )}
                        <p className="text-xs mt-1 text-center font-medium">{color.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Font Size */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font Size
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'small', label: 'Small', size: 'text-sm' },
                      { value: 'medium', label: 'Medium', size: 'text-base' },
                      { value: 'large', label: 'Large', size: 'text-lg' },
                    ].map((size) => (
                      <button
                        key={size.value}
                        onClick={() => handlePreferenceChange('fontSize', size.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          userPreferences.fontSize === size.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <p className={`${size.size} font-medium`}>Aa</p>
                        <p className="text-xs mt-1">{size.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Layout Density */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    Layout Density
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'compact', label: 'Compact' },
                      { value: 'comfortable', label: 'Comfortable' },
                      { value: 'spacious', label: 'Spacious' },
                    ].map((density) => (
                      <button
                        key={density.value}
                        onClick={() => handlePreferenceChange('layoutDensity', density.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          userPreferences.layoutDensity === density.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <p className="text-sm font-medium">{density.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Preferences */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Learning Preferences
                </CardTitle>
                <CardDescription>Customize your learning experience and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Learning Pace */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Learning Pace
                  </Label>
                  <Select
                    value={userPreferences.learningPace}
                    onValueChange={(value) => handlePreferenceChange('learningPace', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">🐢 Slow & Steady - Take your time</SelectItem>
                      <SelectItem value="medium">🚶 Medium Pace - Balanced approach</SelectItem>
                      <SelectItem value="fast">🚀 Fast Track - Quick learner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Difficulty Level
                  </Label>
                  <Select
                    value={userPreferences.difficultyLevel}
                    onValueChange={(value) => handlePreferenceChange('difficultyLevel', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🌱 Beginner - Just starting out</SelectItem>
                      <SelectItem value="intermediate">📚 Intermediate - Some experience</SelectItem>
                      <SelectItem value="advanced">🎓 Advanced - Expert level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Daily Goal */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Daily Learning Goal
                    </Label>
                    <Badge variant="outline" className="text-base">
                      {userPreferences.dailyGoalMinutes} minutes
                    </Badge>
                  </div>
                  <Slider
                    value={[userPreferences.dailyGoalMinutes]}
                    onValueChange={([value]) => handlePreferenceChange('dailyGoalMinutes', value)}
                    min={15}
                    max={240}
                    step={15}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>15 min</span>
                    <span>120 min</span>
                    <span>240 min</span>
                  </div>
                </div>

                <Separator />

                {/* Preferred Study Time */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Preferred Study Time
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'morning', label: 'Morning', emoji: '🌅' },
                      { value: 'afternoon', label: 'Afternoon', emoji: '☀️' },
                      { value: 'evening', label: 'Evening', emoji: '🌆' },
                      { value: 'night', label: 'Night', emoji: '🌙' },
                    ].map((time) => (
                      <button
                        key={time.value}
                        onClick={() => handlePreferenceChange('preferredStudyTime', time.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          userPreferences.preferredStudyTime === time.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <p className="text-2xl mb-1">{time.emoji}</p>
                        <p className="text-sm font-medium">{time.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Enable Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">Enable Notifications</p>
                        <p className="text-sm text-gray-500">Receive learning reminders and updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={userPreferences.notificationsEnabled}
                      onCheckedChange={(checked) => handlePreferenceChange('notificationsEnabled', checked)}
                    />
                  </div>

                  {/* Reminder Frequency */}
                  <div className="p-4 rounded-lg border">
                    <Label className="text-base font-semibold mb-3 block flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Reminder Frequency
                    </Label>
                    <Select
                      value={userPreferences.reminderFrequency}
                      onValueChange={(value) => handlePreferenceChange('reminderFrequency', value)}
                      disabled={!userPreferences.notificationsEnabled}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Once a day</SelectItem>
                        <SelectItem value="medium">Medium - Twice a day</SelectItem>
                        <SelectItem value="high">High - Multiple times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Email Notifications</p>
                        <p className="text-sm text-gray-500">Get weekly progress reports via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={userPreferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interface Settings */}
          <TabsContent value="interface" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Interface Settings
                </CardTitle>
                <CardDescription>Customize how the interface behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Show Digital Twin */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">Show Digital Twin</p>
                        <p className="text-sm text-gray-500">Display your AI companion on dashboard</p>
                      </div>
                    </div>
                    <Switch
                      checked={userPreferences.showDigitalTwin}
                      onCheckedChange={(checked) => handlePreferenceChange('showDigitalTwin', checked)}
                    />
                  </div>

                  {/* Auto-save Notes */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Save className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Auto-save Notes</p>
                        <p className="text-sm text-gray-500">Automatically save your notes as you type</p>
                      </div>
                    </div>
                    <Switch
                      checked={userPreferences.autoSaveNotes}
                      onCheckedChange={(checked) => handlePreferenceChange('autoSaveNotes', checked)}
                    />
                  </div>

                  {/* Offline Mode */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-semibold">Offline Mode</p>
                        <p className="text-sm text-gray-500">Enable full offline functionality</p>
                      </div>
                    </div>
                    <Switch
                      checked={userPreferences.offlineMode}
                      onCheckedChange={(checked) => handlePreferenceChange('offlineMode', checked)}
                    />
                  </div>

                  {/* Animations */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-pink-600" /><div><p className="font-semibold">Animations</p><p className="text-sm text-gray-500">Enable smooth animations and transitions</p></div></div>
                    <Switch checked={userPreferences.animationsEnabled} onCheckedChange={(checked) => handlePreferenceChange('animationsEnabled', checked)} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div><p className="font-semibold">High contrast</p><p className="text-sm text-gray-500">Increase contrast and strengthen keyboard focus indicators</p></div>
                    <Switch checked={userPreferences.highContrast} onCheckedChange={(checked) => handlePreferenceChange('highContrast', checked)} aria-label="Use high contrast" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div><p className="font-semibold">Reading-friendly font</p><p className="text-sm text-gray-500">Use wider spacing and a highly legible typeface</p></div>
                    <Switch checked={userPreferences.dyslexiaFriendlyFont} onCheckedChange={(checked) => handlePreferenceChange('dyslexiaFriendlyFont', checked)} aria-label="Use reading-friendly font" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userProfile?.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF, max 2MB</p>
                  </div>
                </div>

                <Separator />

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={profileName} onChange={(event) => { setProfileName(event.target.value); setHasChanges(true); }} className="h-12" placeholder="Enter your full name" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profileEmail} onChange={(event) => { setProfileEmail(event.target.value); setHasChanges(true); }} className="h-12" placeholder="your@email.com" />
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Preferred Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">🇬🇧 English</SelectItem>
                      <SelectItem value="Tamil">🇮🇳 தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="Hindi">🇮🇳 हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="Telugu">🇮🇳 తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="Malayalam">🇮🇳 മലയാളം (Malayalam)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />
                <div className="rounded-xl border p-4"><h3 className="font-semibold">Your data and account</h3><p className="mt-1 text-sm text-gray-500">Download a portable copy or permanently remove local data from this device.</p><div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" onClick={exportMyData}><Download className="mr-2 h-4 w-4" />Export my data</Button><Button variant="destructive" onClick={deleteMyAccount}>Delete account and data</Button></div></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Save Button */}
        {hasChanges && (
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              size="lg"
              onClick={handleSaveChanges}
              className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl hover:shadow-purple-500/50 transition-all"
            >
              <Save className="w-5 h-5 mr-2" />
              Save All Changes
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
