import { createBrowserRouter } from 'react-router';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import DigitalTwinDashboard from './pages/DigitalTwinDashboard';
import AIChatPage from './pages/AIChatPage';
import AdaptiveLearningPage from './pages/AdaptiveLearningPage';
import CognitiveToolsPage from './pages/CognitiveToolsPage';
import SmartRecommendationsPage from './pages/SmartRecommendationsPage';
import TimetablePage from './pages/TimetablePage';
import TeacherDashboard from './pages/TeacherDashboard';
import SubjectSelectionPage from './pages/SubjectSelectionPage';

// New Personalization Pages
import OnboardingQuizPage from './pages/OnboardingQuizPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import GamificationPage from './pages/GamificationPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AutonomousLearningPage from './pages/AutonomousLearningPage';
import CognitiveAutonomousLearning from './pages/CognitiveAutonomousLearning';
import MobileAppLauncher from './pages/MobileAppLauncher';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/dashboard',
    Component: StudentDashboard,
  },
  {
    path: '/digital-twin',
    Component: DigitalTwinDashboard,
  },
  {
    path: '/ai-chat',
    Component: AIChatPage,
  },
  {
    path: '/adaptive-learning',
    Component: AdaptiveLearningPage,
  },
  {
    path: '/cognitive-tools',
    Component: CognitiveToolsPage,
  },
  {
    path: '/recommendations',
    Component: SmartRecommendationsPage,
  },
  {
    path: '/timetable',
    Component: TimetablePage,
  },
  {
    path: '/teacher',
    Component: TeacherDashboard,
  },
  {
    path: '/teacher/students',
    Component: TeacherDashboard,
  },
  {
    path: '/teacher/performance',
    Component: TeacherDashboard,
  },
  {
    path: '/teacher/interventions',
    Component: TeacherDashboard,
  },
  {
    path: '/subjects',
    Component: SubjectSelectionPage,
  },
  // New Personalization Pages
  {
    path: '/onboarding-quiz',
    Component: OnboardingQuizPage,
  },
  {
    path: '/knowledge-graph',
    Component: KnowledgeGraphPage,
  },
  {
    path: '/gamification',
    Component: GamificationPage,
  },
  {
    path: '/analytics-dashboard',
    Component: AnalyticsDashboard,
  },
  {
    path: '/autonomous-learning',
    Component: AutonomousLearningPage,
  },
  {
    path: '/cognitive-learning',
    Component: CognitiveAutonomousLearning,
  },
  {
    path: '/mobile-app-launcher',
    Component: MobileAppLauncher,
  },
]);