import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const DigitalTwinDashboard = lazy(() => import('./pages/DigitalTwinDashboard'));
const AIChatPage = lazy(() => import('./pages/AIChatPage'));
const AdaptiveLearningPage = lazy(() => import('./pages/AdaptiveLearningPage'));
const CognitiveToolsPage = lazy(() => import('./pages/CognitiveToolsPage'));
const SmartRecommendationsPage = lazy(() => import('./pages/SmartRecommendationsPage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const TimetablePage = lazy(() => import('./pages/TimetablePage'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const SubjectSelectionPage = lazy(() => import('./pages/SubjectSelectionPage'));
const CurriculumLibraryPage = lazy(() => import('./pages/CurriculumLibraryPage'));

// Personalization & Autonomous Learning Pages
const LearnerSetupPage = lazy(() => import('./pages/LearnerSetupPage'));
const OnboardingQuizPage = lazy(() => import('./pages/OnboardingQuizPage'));
const KnowledgeGraphPage = lazy(() => import('./pages/KnowledgeGraphPage'));
const GamificationPage = lazy(() => import('./pages/GamificationPage'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const AutonomousLearningPage = lazy(() => import('./pages/AutonomousLearningPage'));
const CognitiveAutonomousLearning = lazy(() => import('./pages/CognitiveAutonomousLearning'));
const MobileAppLauncher = lazy(() => import('./pages/MobileAppLauncher'));

// Hub, Training Lab, Plans, Customization & PWA Pages
const AIToolsHub = lazy(() => import('./pages/AIToolsHub'));
const AIModelTrainingPage = lazy(() => import('./pages/AIModelTrainingPage'));
const PWAInstallPage = lazy(() => import('./pages/PWAInstallPage'));
const PlanManagementPage = lazy(() => import('./pages/PlanManagementPage'));
const UserCustomizationPage = lazy(() => import('./pages/UserCustomizationPage'));
const ButtonTestPage = lazy(() => import('./pages/ButtonTestPage'));

// 15 Specialized AI Tool Pages
const EnhancedChatPage = lazy(() => import('./pages/ai-tools/EnhancedChatPage'));
const QuizGeneratorPage = lazy(() => import('./pages/ai-tools/QuizGeneratorPage'));
const NotesGeneratorPage = lazy(() => import('./pages/ai-tools/NotesGeneratorPage'));
const CodePlaygroundPage = lazy(() => import('./pages/ai-tools/CodePlaygroundPage'));
const EssayWriterPage = lazy(() => import('./pages/ai-tools/EssayWriterPage'));
const MathSolverPage = lazy(() => import('./pages/ai-tools/MathSolverPage'));
const FlashcardsPage = lazy(() => import('./pages/ai-tools/FlashcardsPage'));
const VoiceAssistantPage = lazy(() => import('./pages/ai-tools/VoiceAssistantPage'));
const DoubtSolverPage = lazy(() => import('./pages/ai-tools/DoubtSolverPage'));
const MockTestPage = lazy(() => import('./pages/ai-tools/MockTestPage'));
const SummarizerPage = lazy(() => import('./pages/ai-tools/SummarizerPage'));
const TranslatorPage = lazy(() => import('./pages/ai-tools/TranslatorPage'));
const MindMapPage = lazy(() => import('./pages/ai-tools/MindMapPage'));
const WritingAssistantPage = lazy(() => import('./pages/ai-tools/WritingAssistantPage'));
const InterviewTrainerPage = lazy(() => import('./pages/ai-tools/InterviewTrainerPage'));

type AppRole = 'student' | 'teacher';

function protectedPage(Page: ComponentType, roles: AppRole[] = ['student', 'teacher']) {
  return function ProtectedPage() {
    const { isAuthenticated, isHydrated, userRole } = useApp();
    if (!isHydrated) return <main className="grid min-h-screen place-items-center bg-slate-50" aria-live="polite"><p className="font-medium text-slate-600">Restoring your learning space…</p></main>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!userRole || !roles.includes(userRole)) return <Navigate to={userRole === 'teacher' ? '/teacher' : '/dashboard'} replace />;
    return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-50" aria-live="polite"><p className="font-medium text-slate-600">Loading this workspace…</p></main>}><Page /></Suspense>;
  };
}

const studentPage = (Page: ComponentType) => protectedPage(Page, ['student']);
const teacherPage = (Page: ComponentType) => protectedPage(Page, ['teacher']);

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: HomePage,
    },
    {
      path: '/login',
      Component: LoginPage,
    },
    {
      path: '/dashboard',
      Component: studentPage(StudentDashboard),
    },
    {
      path: '/digital-twin',
      Component: studentPage(DigitalTwinDashboard),
    },
    {
      path: '/ai-chat',
      Component: studentPage(AIChatPage),
    },
    {
      path: '/adaptive-learning',
      Component: studentPage(AdaptiveLearningPage),
    },
    {
      path: '/cognitive-tools',
      Component: studentPage(CognitiveToolsPage),
    },
    {
      path: '/recommendations',
      Component: studentPage(SmartRecommendationsPage),
    },
    {
      path: '/courses/:courseId',
      Component: studentPage(CoursePage),
    },
    {
      path: '/timetable',
      Component: studentPage(TimetablePage),
    },
    {
      path: '/teacher',
      Component: teacherPage(TeacherDashboard),
    },
    {
      path: '/teacher/students',
      Component: teacherPage(TeacherDashboard),
    },
    {
      path: '/teacher/performance',
      Component: teacherPage(TeacherDashboard),
    },
    {
      path: '/teacher/interventions',
      Component: teacherPage(TeacherDashboard),
    },
    {
      path: '/subjects',
      Component: studentPage(SubjectSelectionPage),
    },
    {
      path: '/curriculum',
      Component: studentPage(CurriculumLibraryPage),
    },
    // Personalization & Autonomous Learning Pages
    {
      path: '/setup',
      Component: studentPage(LearnerSetupPage),
    },
    {
      path: '/onboarding-quiz',
      Component: studentPage(OnboardingQuizPage),
    },
    {
      path: '/knowledge-graph',
      Component: studentPage(KnowledgeGraphPage),
    },
    {
      path: '/gamification',
      Component: studentPage(GamificationPage),
    },
    {
      path: '/analytics-dashboard',
      Component: studentPage(AnalyticsDashboard),
    },
    {
      path: '/autonomous-learning',
      Component: studentPage(AutonomousLearningPage),
    },
    {
      path: '/cognitive-learning',
      Component: studentPage(CognitiveAutonomousLearning),
    },
    {
      path: '/mobile-app-launcher',
      Component: studentPage(MobileAppLauncher),
    },
    // AI Tools Hub & 15 AI Tools
    {
      path: '/ai-tools',
      Component: studentPage(AIToolsHub),
    },
    {
      path: '/ai-tools/chat',
      Component: studentPage(EnhancedChatPage),
    },
    {
      path: '/ai-tools/quiz-generator',
      Component: studentPage(QuizGeneratorPage),
    },
    {
      path: '/ai-tools/notes-generator',
      Component: studentPage(NotesGeneratorPage),
    },
    {
      path: '/ai-tools/code-playground',
      Component: studentPage(CodePlaygroundPage),
    },
    {
      path: '/ai-tools/essay-writer',
      Component: studentPage(EssayWriterPage),
    },
    {
      path: '/ai-tools/math-solver',
      Component: studentPage(MathSolverPage),
    },
    {
      path: '/ai-tools/flashcards',
      Component: studentPage(FlashcardsPage),
    },
    {
      path: '/ai-tools/voice-assistant',
      Component: studentPage(VoiceAssistantPage),
    },
    {
      path: '/ai-tools/doubt-solver',
      Component: studentPage(DoubtSolverPage),
    },
    {
      path: '/ai-tools/mock-test',
      Component: studentPage(MockTestPage),
    },
    {
      path: '/ai-tools/summarizer',
      Component: studentPage(SummarizerPage),
    },
    {
      path: '/ai-tools/translator',
      Component: studentPage(TranslatorPage),
    },
    {
      path: '/ai-tools/mind-map',
      Component: studentPage(MindMapPage),
    },
    {
      path: '/ai-tools/writing-assistant',
      Component: studentPage(WritingAssistantPage),
    },
    {
      path: '/ai-tools/interview-trainer',
      Component: studentPage(InterviewTrainerPage),
    },
    // AI Model Training Lab, Plans, Customization & PWA Install
    {
      path: '/ai-training',
      Component: studentPage(AIModelTrainingPage),
    },
    {
      path: '/plans',
      Component: studentPage(PlanManagementPage),
    },
    {
      path: '/settings',
      Component: protectedPage(UserCustomizationPage),
    },
    {
      path: '/install',
      Component: protectedPage(PWAInstallPage),
    },
    {
      path: '/button-test',
      Component: studentPage(ButtonTestPage),
    },
    // Fallback route
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
