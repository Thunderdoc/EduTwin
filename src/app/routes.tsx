import { createBrowserRouter, Navigate } from 'react-router';
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

// Personalization & Autonomous Learning Pages
import OnboardingQuizPage from './pages/OnboardingQuizPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import GamificationPage from './pages/GamificationPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AutonomousLearningPage from './pages/AutonomousLearningPage';
import CognitiveAutonomousLearning from './pages/CognitiveAutonomousLearning';
import MobileAppLauncher from './pages/MobileAppLauncher';

// Hub, Training Lab, Plans, Customization & PWA Pages
import AIToolsHub from './pages/AIToolsHub';
import AIModelTrainingPage from './pages/AIModelTrainingPage';
import PWAInstallPage from './pages/PWAInstallPage';
import PlanManagementPage from './pages/PlanManagementPage';
import UserCustomizationPage from './pages/UserCustomizationPage';
import ButtonTestPage from './pages/ButtonTestPage';

// 15 Specialized AI Tool Pages
import EnhancedChatPage from './pages/ai-tools/EnhancedChatPage';
import QuizGeneratorPage from './pages/ai-tools/QuizGeneratorPage';
import NotesGeneratorPage from './pages/ai-tools/NotesGeneratorPage';
import CodePlaygroundPage from './pages/ai-tools/CodePlaygroundPage';
import EssayWriterPage from './pages/ai-tools/EssayWriterPage';
import MathSolverPage from './pages/ai-tools/MathSolverPage';
import FlashcardsPage from './pages/ai-tools/FlashcardsPage';
import VoiceAssistantPage from './pages/ai-tools/VoiceAssistantPage';
import DoubtSolverPage from './pages/ai-tools/DoubtSolverPage';
import MockTestPage from './pages/ai-tools/MockTestPage';
import SummarizerPage from './pages/ai-tools/SummarizerPage';
import TranslatorPage from './pages/ai-tools/TranslatorPage';
import MindMapPage from './pages/ai-tools/MindMapPage';
import WritingAssistantPage from './pages/ai-tools/WritingAssistantPage';
import InterviewTrainerPage from './pages/ai-tools/InterviewTrainerPage';

export const router = createBrowserRouter(
  [
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
    // Personalization & Autonomous Learning Pages
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
    // AI Tools Hub & 15 AI Tools
    {
      path: '/ai-tools',
      Component: AIToolsHub,
    },
    {
      path: '/ai-tools/chat',
      Component: EnhancedChatPage,
    },
    {
      path: '/ai-tools/quiz-generator',
      Component: QuizGeneratorPage,
    },
    {
      path: '/ai-tools/notes-generator',
      Component: NotesGeneratorPage,
    },
    {
      path: '/ai-tools/code-playground',
      Component: CodePlaygroundPage,
    },
    {
      path: '/ai-tools/essay-writer',
      Component: EssayWriterPage,
    },
    {
      path: '/ai-tools/math-solver',
      Component: MathSolverPage,
    },
    {
      path: '/ai-tools/flashcards',
      Component: FlashcardsPage,
    },
    {
      path: '/ai-tools/voice-assistant',
      Component: VoiceAssistantPage,
    },
    {
      path: '/ai-tools/doubt-solver',
      Component: DoubtSolverPage,
    },
    {
      path: '/ai-tools/mock-test',
      Component: MockTestPage,
    },
    {
      path: '/ai-tools/summarizer',
      Component: SummarizerPage,
    },
    {
      path: '/ai-tools/translator',
      Component: TranslatorPage,
    },
    {
      path: '/ai-tools/mind-map',
      Component: MindMapPage,
    },
    {
      path: '/ai-tools/writing-assistant',
      Component: WritingAssistantPage,
    },
    {
      path: '/ai-tools/interview-trainer',
      Component: InterviewTrainerPage,
    },
    // AI Model Training Lab, Plans, Customization & PWA Install
    {
      path: '/ai-training',
      Component: AIModelTrainingPage,
    },
    {
      path: '/plans',
      Component: PlanManagementPage,
    },
    {
      path: '/settings',
      Component: UserCustomizationPage,
    },
    {
      path: '/install',
      Component: PWAInstallPage,
    },
    {
      path: '/button-test',
      Component: ButtonTestPage,
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
