import { useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import {
  Home,
  Brain,
  MessageSquare,
  BookOpen,
  Lightbulb,
  Star,
  Calendar,
  Menu,
  X,
  Wifi,
  WifiOff,
  LogOut,
  GraduationCap,
  Sparkles,
  Settings,
  Crown,
  Zap,
  Download
} from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline, setIsAuthenticated, setUserRole, userRole, clearOfflineStorage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navigation on login page
  if (location.pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    clearOfflineStorage();
    navigate('/');
  };

  const studentNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/autonomous-learning', label: '⚡ Smart Learning', icon: Zap },
    { path: '/subjects', label: 'My Subjects', icon: GraduationCap },
    { path: '/knowledge-graph', label: '🗺️ Knowledge Map', icon: Brain },
    { path: '/gamification', label: '🏆 Achievements', icon: Star },
    { path: '/analytics-dashboard', label: '📊 Analytics', icon: BookOpen },
    { path: '/digital-twin', label: 'Digital Twin', icon: Brain },
    { path: '/ai-tools', label: '🤖 AI Tools Hub', icon: Sparkles },
    { path: '/ai-chat', label: 'AI Assistant', icon: MessageSquare },
    { path: '/adaptive-learning', label: 'Learning Path', icon: BookOpen },
    { path: '/cognitive-tools', label: 'Cognitive Tools', icon: Lightbulb },
    { path: '/recommendations', label: 'Recommendations', icon: Star },
    { path: '/timetable', label: 'Timetable', icon: Calendar },
    { path: '/install', label: '📱 Install App', icon: Download },
  ];

  const teacherNavItems = [
    { path: '/teacher', label: 'Dashboard', icon: Home },
    { path: '/teacher/students', label: 'Students', icon: GraduationCap },
    { path: '/teacher/performance', label: 'Performance Analytics', icon: BookOpen },
    { path: '/teacher/interventions', label: 'Interventions', icon: Lightbulb },
  ];

  const navItems = userRole === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white shadow-xl border-r border-gray-200 z-40">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">EduFlow</h2>
              <div className="flex items-center gap-1 text-xs">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-orange-500" />
                    <span className="text-orange-600">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-bold text-lg">EduFlow</h2>
              </div>
              <Button onClick={() => setMobileMenuOpen(false)} variant="ghost">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start text-lg h-12 ${
                      isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-lg h-12 border-red-300 text-red-600 hover:bg-red-50 mt-8"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-64" />
    </>
  );
}

export default Navigation;