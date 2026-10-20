import React, { createContext, useContext, useState, useEffect } from 'react';

// User Profile Interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
  createdAt: string;
}

// User Preferences Interface
export interface UserPreferences {
  // Theme Customization
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  layoutDensity: 'comfortable' | 'compact' | 'spacious';
  
  // Learning Preferences
  learningPace: 'slow' | 'medium' | 'fast';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // Notification Settings
  notificationsEnabled: boolean;
  reminderFrequency: 'high' | 'medium' | 'low';
  emailNotifications: boolean;
  
  // Interface Settings
  showDigitalTwin: boolean;
  autoSaveNotes: boolean;
  offlineMode: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
  dyslexiaFriendlyFont: boolean;
}

// Plan Interface
export interface UserPlan {
  type: 'free' | 'pro' | 'enterprise';
  startDate: string;
  endDate?: string;
  features: string[];
}

interface AppContextType {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userRole: 'student' | 'teacher' | null;
  setUserRole: (role: 'student' | 'teacher' | null) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  
  // New: User Profile & Customization
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  
  // Offline Storage
  saveToOfflineStorage: () => void;
  loadFromOfflineStorage: () => void;
  clearOfflineStorage: () => void;
}

// Default Preferences
const defaultPreferences: UserPreferences = {
  theme: 'auto',
  accentColor: '#8b5cf6',
  fontSize: 'medium',
  layoutDensity: 'comfortable',
  learningPace: 'medium',
  difficultyLevel: 'intermediate',
  dailyGoalMinutes: 60,
  preferredStudyTime: 'evening',
  notificationsEnabled: true,
  reminderFrequency: 'medium',
  emailNotifications: true,
  showDigitalTwin: true,
  autoSaveNotes: true,
  offlineMode: false,
  animationsEnabled: true,
  highContrast: false,
  dyslexiaFriendlyFont: false,
};

const defaultPlan: UserPlan = {
  type: 'free',
  startDate: new Date().toISOString(),
  features: ['Basic AI Tools', '5 Languages', 'Offline Access', 'Digital Twin'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [language, setLanguage] = useState('English');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // New state for user customization
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [userPlan, setUserPlan] = useState<UserPlan>(defaultPlan);

  // Load from offline storage on mount
  useEffect(() => {
    loadFromOfflineStorage();
    setIsHydrated(true);
  }, []);

  // Save to offline storage whenever important state changes
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      saveToOfflineStorage();
    }
  }, [isAuthenticated, userProfile, userPreferences, userPlan, selectedSubjects, selectedSkills, language]);

  const saveToOfflineStorage = () => {
    try {
      const offlineData = {
        userProfile,
        userPreferences,
        userPlan,
        selectedSubjects,
        selectedSkills,
        language,
        isAuthenticated,
        userRole,
        lastSyncedAt: new Date().toISOString(),
      };
      localStorage.setItem('eduflow_user_data', JSON.stringify(offlineData));
      localStorage.setItem('eduflow_offline_mode', 'true');
    } catch (error) {
      console.error('Failed to save to offline storage:', error);
    }
  };

  const loadFromOfflineStorage = () => {
    try {
      const offlineDataStr = localStorage.getItem('eduflow_user_data');
      if (offlineDataStr) {
        const offlineData = JSON.parse(offlineDataStr);
        const lastActive = Date.parse(offlineData.lastSyncedAt || '');
        const expired = !Number.isFinite(lastActive) || Date.now() - lastActive > 12 * 60 * 60 * 1000;
        if (expired && offlineData.isAuthenticated) {
          localStorage.removeItem('eduflow_user_data');
          setIsAuthenticated(false);
          setUserRole(null);
          return;
        }
        setUserProfile(offlineData.userProfile || null);
        setUserPreferences({ ...defaultPreferences, ...(offlineData.userPreferences || {}) });
        setUserPlan(offlineData.userPlan || defaultPlan);
        setSelectedSubjects(offlineData.selectedSubjects || []);
        setSelectedSkills(offlineData.selectedSkills || []);
        setLanguage(offlineData.language || 'English');
        setIsAuthenticated(offlineData.isAuthenticated || false);
        setUserRole(offlineData.userRole || null);
      }
    } catch (error) {
      console.error('Failed to load from offline storage:', error);
    }
  };

  const clearOfflineStorage = () => {
    try {
      localStorage.removeItem('eduflow_user_data');
      localStorage.removeItem('eduflow_offline_mode');
      setUserProfile(null);
      setUserPreferences(defaultPreferences);
      setUserPlan(defaultPlan);
      setSelectedSubjects([]);
      setSelectedSkills([]);
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Failed to clear offline storage:', error);
    }
  };

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({
      ...prev,
      ...preferences,
    }));
  };

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = userPreferences.theme === 'auto' ? (prefersDark ? 'dark' : 'light') : userPreferences.theme;
    root.dataset.fontSize = userPreferences.fontSize;
    root.dataset.density = userPreferences.layoutDensity;
    root.classList.toggle('reduce-motion', !userPreferences.animationsEnabled);
    root.classList.toggle('high-contrast', userPreferences.highContrast);
    root.classList.toggle('dyslexia-font', userPreferences.dyslexiaFriendlyFont);
    root.style.setProperty('--user-accent', userPreferences.accentColor);
  }, [userPreferences]);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isOnline,
        setIsOnline,
        language,
        setLanguage,
        isAuthenticated,
        isHydrated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        selectedSubjects,
        setSelectedSubjects,
        selectedSkills,
        setSelectedSkills,
        userProfile,
        setUserProfile,
        userPreferences,
        updateUserPreferences,
        userPlan,
        setUserPlan,
        saveToOfflineStorage,
        loadFromOfflineStorage,
        clearOfflineStorage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}