import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  ClipboardCheck,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  Trophy,
  BarChart3,
  Book,
  Zap,
  ChevronRight,
  Brain
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

// Behavior-driven Test Analytics
interface TestBehaviorMetrics {
  timeSpent: number;
  accuracy: number;
  speed: 'slow' | 'medium' | 'fast';
  focusLevel: number; // 0-100
  difficultyConcepts: string[];
  strengths: string[];
  avgResponseTime: number;
  skipPattern: number[];
}

interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

interface QuestionAttempt {
  questionId: string;
  answer: number | null;
  timeSpent: number;
  isCorrect: boolean;
  skipped: boolean;
}

interface TestResult {
  id: string;
  date: number;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  weakTopics: string[];
  strongTopics: string[];
  behavior: TestBehaviorMetrics;
}

// Sample question bank with behavior-driven difficulty
const questionBank: Question[] = [
  // Mathematics - Easy
  {
    id: 'math-e1',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'easy',
    concept: 'Linear Equations',
    text: 'Solve for x: 2x + 5 = 13',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
    correctAnswer: 1,
    explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
  },
  {
    id: 'math-e2',
    subject: 'Mathematics',
    topic: 'Geometry',
    difficulty: 'easy',
    concept: 'Area Calculation',
    text: 'What is the area of a rectangle with length 8cm and width 5cm?',
    options: ['30 cm²', '40 cm²', '45 cm²', '50 cm²'],
    correctAnswer: 1,
    explanation: 'Area = length × width = 8 × 5 = 40 cm²'
  },
  // Mathematics - Medium
  {
    id: 'math-m1',
    subject: 'Mathematics',
    topic: 'Algebra',
    difficulty: 'medium',
    concept: 'Quadratic Equations',
    text: 'Solve: x² - 5x + 6 = 0',
    options: ['x = 1, 6', 'x = 2, 3', 'x = 2, 4', 'x = 3, 4'],
    correctAnswer: 1,
    explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3'
  },
  {
    id: 'math-m2',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    difficulty: 'medium',
    concept: 'Trigonometric Ratios',
    text: 'If sin θ = 3/5, what is cos θ in a right triangle?',
    options: ['3/5', '4/5', '5/3', '5/4'],
    correctAnswer: 1,
    explanation: 'Using Pythagorean theorem: cos θ = 4/5'
  },
  // Mathematics - Hard
  {
    id: 'math-h1',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'hard',
    concept: 'Differentiation',
    text: 'Find dy/dx if y = x³ + 2x² - 5x + 1',
    options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 4x - 5', '3x² + 4x + 5'],
    correctAnswer: 0,
    explanation: 'Using power rule: dy/dx = 3x² + 4x - 5'
  },
  // Physics - Easy
  {
    id: 'phy-e1',
    subject: 'Physics',
    topic: 'Mechanics',
    difficulty: 'easy',
    concept: 'Speed Calculation',
    text: 'A car travels 120 km in 2 hours. What is its average speed?',
    options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
    correctAnswer: 1,
    explanation: 'Speed = Distance/Time = 120/2 = 60 km/h'
  },
  {
    id: 'phy-e2',
    subject: 'Physics',
    topic: 'Energy',
    difficulty: 'easy',
    concept: 'Kinetic Energy',
    text: 'What is the SI unit of energy?',
    options: ['Watt', 'Joule', 'Newton', 'Pascal'],
    correctAnswer: 1,
    explanation: 'The SI unit of energy is Joule (J)'
  },
  // Physics - Medium
  {
    id: 'phy-m1',
    subject: 'Physics',
    topic: 'Mechanics',
    difficulty: 'medium',
    concept: "Newton's Laws",
    text: 'A 2kg object accelerates at 3 m/s². What force is applied?',
    options: ['4 N', '5 N', '6 N', '8 N'],
    correctAnswer: 2,
    explanation: 'Using F = ma: F = 2 × 3 = 6 N'
  },
  {
    id: 'phy-m2',
    subject: 'Physics',
    topic: 'Electricity',
    difficulty: 'medium',
    concept: "Ohm's Law",
    text: 'Calculate resistance if voltage is 12V and current is 3A',
    options: ['2Ω', '3Ω', '4Ω', '5Ω'],
    correctAnswer: 2,
    explanation: 'Using V = IR: R = V/I = 12/3 = 4Ω'
  },
  // Physics - Hard
  {
    id: 'phy-h1',
    subject: 'Physics',
    topic: 'Waves',
    difficulty: 'hard',
    concept: 'Wave Properties',
    text: 'A wave has frequency 50 Hz and wavelength 2m. Find its speed.',
    options: ['50 m/s', '75 m/s', '100 m/s', '125 m/s'],
    correctAnswer: 2,
    explanation: 'Speed = frequency × wavelength = 50 × 2 = 100 m/s'
  },
  // Chemistry - Easy
  {
    id: 'chem-e1',
    subject: 'Chemistry',
    topic: 'Atomic Structure',
    difficulty: 'easy',
    concept: 'Periodic Table',
    text: 'What is the atomic number of Carbon?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    explanation: 'Carbon has 6 protons, so its atomic number is 6'
  },
  {
    id: 'chem-e2',
    subject: 'Chemistry',
    topic: 'Chemical Bonding',
    difficulty: 'easy',
    concept: 'Ionic vs Covalent',
    text: 'What type of bond is formed when atoms share electrons?',
    options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'],
    correctAnswer: 1,
    explanation: 'Covalent bonds involve sharing of electrons between atoms'
  },
  // Chemistry - Medium
  {
    id: 'chem-m1',
    subject: 'Chemistry',
    topic: 'Chemical Reactions',
    difficulty: 'medium',
    concept: 'Balancing Equations',
    text: 'Balance: H₂ + O₂ → H₂O. What coefficient goes before H₂O?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: '2H₂ + O₂ → 2H₂O is the balanced equation'
  },
  {
    id: 'chem-m2',
    subject: 'Chemistry',
    topic: 'Solutions',
    difficulty: 'medium',
    concept: 'Molarity',
    text: 'What is molarity defined as?',
    options: ['Moles/Liter', 'Grams/Liter', 'Moles/Kilogram', 'Grams/Mole'],
    correctAnswer: 0,
    explanation: 'Molarity = moles of solute / liters of solution'
  },
  // Chemistry - Hard
  {
    id: 'chem-h1',
    subject: 'Chemistry',
    topic: 'Thermodynamics',
    difficulty: 'hard',
    concept: 'Enthalpy',
    text: 'An exothermic reaction has ΔH value that is:',
    options: ['Positive', 'Negative', 'Zero', 'Variable'],
    correctAnswer: 1,
    explanation: 'Exothermic reactions release energy, so ΔH is negative'
  }
];

export default function MockTestPage() {
  const navigate = useNavigate();
  const [testPhase, setTestPhase] = useState<'setup' | 'testing' | 'results'>('setup');

  // Setup state
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'adaptive'>('adaptive');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15); // minutes

  // Test state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAttempt[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Results state
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load test history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cognilearn_test_history');
    if (saved) {
      setTestHistory(JSON.parse(saved));
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (testPhase === 'testing' && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testPhase, isPaused, timeRemaining]);

  // Generate adaptive test based on behavior
  const generateAdaptiveTest = () => {
    let selectedQuestions: Question[] = [];
    const availableQuestions = selectedSubject === 'All'
      ? questionBank
      : questionBank.filter(q => q.subject === selectedSubject);

    if (selectedDifficulty === 'adaptive') {
      // Behavior-driven adaptive selection
      const recentHistory = testHistory.slice(-3);
      let startDifficulty: 'easy' | 'medium' | 'hard' = 'medium';

      if (recentHistory.length > 0) {
        const avgAccuracy = recentHistory.reduce((sum, t) => sum + t.accuracy, 0) / recentHistory.length;
        if (avgAccuracy >= 80) startDifficulty = 'hard';
        else if (avgAccuracy < 60) startDifficulty = 'easy';
      }

      // Mix of difficulties weighted by performance
      const easy = availableQuestions.filter(q => q.difficulty === 'easy');
      const medium = availableQuestions.filter(q => q.difficulty === 'medium');
      const hard = availableQuestions.filter(q => q.difficulty === 'hard');

      const distribution = startDifficulty === 'easy'
        ? { easy: 0.5, medium: 0.3, hard: 0.2 }
        : startDifficulty === 'medium'
        ? { easy: 0.3, medium: 0.4, hard: 0.3 }
        : { easy: 0.2, medium: 0.3, hard: 0.5 };

      const easyCount = Math.floor(questionCount * distribution.easy);
      const mediumCount = Math.floor(questionCount * distribution.medium);
      const hardCount = questionCount - easyCount - mediumCount;

      selectedQuestions = [
        ...shuffleArray(easy).slice(0, easyCount),
        ...shuffleArray(medium).slice(0, mediumCount),
        ...shuffleArray(hard).slice(0, hardCount)
      ];
    } else {
      const filtered = availableQuestions.filter(q => q.difficulty === selectedDifficulty);
      selectedQuestions = shuffleArray(filtered).slice(0, questionCount);
    }

    return shuffleArray(selectedQuestions);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startTest = () => {
    const testQuestions = generateAdaptiveTest();
    setQuestions(testQuestions);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeRemaining(timeLimit * 60);
    setQuestionStartTime(Date.now());
    setTestPhase('testing');
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      answer: selectedOption,
      timeSpent,
      isCorrect: selectedOption === currentQuestion.correctAnswer,
      skipped: selectedOption === null
    };

    setAnswers([...answers, attempt]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setQuestionStartTime(Date.now());
    } else {
      handleTestComplete([...answers, attempt]);
    }
  };

  const skipQuestion = () => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    const attempt: QuestionAttempt = {
      questionId: questions[currentQuestionIndex].id,
      answer: null,
      timeSpent,
      isCorrect: false,
      skipped: true
    };

    setAnswers([...answers, attempt]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setQuestionStartTime(Date.now());
    } else {
      handleTestComplete([...answers, attempt]);
    }
  };

  const handleTestComplete = (finalAnswers = answers) => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate metrics
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const accuracy = (correctCount / finalAnswers.length) * 100;
    const totalTimeSpent = finalAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
    const avgResponseTime = totalTimeSpent / finalAnswers.length;

    // Analyze behavior
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    finalAnswers.forEach((attempt, idx) => {
      const question = questions[idx];
      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[question.topic].total++;
      if (attempt.isCorrect) topicPerformance[question.topic].correct++;
    });

    const weakTopics = Object.entries(topicPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) < 0.6)
      .map(([topic]) => topic);

    const strongTopics = Object.entries(topicPerformance)
      .filter(([_, perf]) => (perf.correct / perf.total) >= 0.8)
      .map(([topic]) => topic);

    // Speed analysis
    const speed: 'slow' | 'medium' | 'fast' =
      avgResponseTime > 45 ? 'slow' : avgResponseTime > 25 ? 'medium' : 'fast';

    // Focus level based on time consistency
    const timeVariance = finalAnswers.reduce((sum, a) =>
      sum + Math.pow(a.timeSpent - avgResponseTime, 2), 0) / finalAnswers.length;
    const focusLevel = Math.max(0, Math.min(100, 100 - (timeVariance / 10)));

    const behavior: TestBehaviorMetrics = {
      timeSpent: totalTimeSpent,
      accuracy,
      speed,
      focusLevel,
      difficultyConcepts: weakTopics,
      strengths: strongTopics,
      avgResponseTime,
      skipPattern: finalAnswers.map((a, i) => a.skipped ? i : -1).filter(i => i >= 0)
    };

    const result: TestResult = {
      id: `test-${Date.now()}`,
      date: Date.now(),
      subject: selectedSubject,
      totalQuestions: finalAnswers.length,
      correctAnswers: correctCount,
      accuracy,
      timeSpent: totalTimeSpent,
      difficulty: selectedDifficulty === 'adaptive' ? 'medium' : selectedDifficulty,
      weakTopics,
      strongTopics,
      behavior
    };

    setTestResult(result);

    // Save to history
    const newHistory = [...testHistory, result];
    setTestHistory(newHistory);
    localStorage.setItem('cognilearn_test_history', JSON.stringify(newHistory));

    setTestPhase('results');
  };

  const resetTest = () => {
    setTestPhase('setup');
    setSelectedOption(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTestResult(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Setup Phase
  if (testPhase === 'setup') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 p-6 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI Mock Test Generator
                </h1>
                <p className="text-gray-600">Behavior-driven adaptive testing with real-time analytics</p>
              </div>
            </div>

            {/* Statistics Overview */}
            {testHistory.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tests Taken</p>
                        <p className="text-2xl font-bold">{testHistory.length}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-violet-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Accuracy</p>
                        <p className="text-2xl font-bold">
                          {(testHistory.reduce((sum, t) => sum + t.accuracy, 0) / testHistory.length).toFixed(1)}%
                        </p>
                      </div>
                      <Target className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Best Score</p>
                        <p className="text-2xl font-bold">
                          {Math.max(...testHistory.map(t => t.accuracy)).toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Focus Level</p>
                        <p className="text-2xl font-bold">
                          {(testHistory.reduce((sum, t) => sum + t.behavior.focusLevel, 0) / testHistory.length).toFixed(0)}%
                        </p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Test Configuration */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Configure Your Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['All', 'Mathematics', 'Physics', 'Chemistry'].map(subject => (
                      <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSubject === subject
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-violet-300'
                        }`}
                      >
                        <Book className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-sm font-medium">{subject}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulty Mode</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'adaptive', label: 'Adaptive', icon: Brain, desc: 'AI adjusts based on your performance' },
                      { value: 'easy', label: 'Easy', icon: Target, desc: 'Beginner friendly' },
                      { value: 'medium', label: 'Medium', icon: Zap, desc: 'Moderate challenge' },
                      { value: 'hard', label: 'Hard', icon: Trophy, desc: 'Expert level' }
                    ].map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        onClick={() => setSelectedDifficulty(value as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedDifficulty === value
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-violet-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Number of Questions: {questionCount}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="5"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 (Quick)</span>
                    <span>10 (Standard)</span>
                    <span>15 (Extended)</span>
                    <span>20 (Complete)</span>
                  </div>
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Time Limit: {timeLimit} minutes
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>15 min</span>
                    <span>30 min</span>
                  </div>
                </div>

                <Button
                  onClick={startTest}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Smart Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Render Testing Phase
  if (testPhase === 'testing') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 p-6 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            {/* Test Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <div>
                    <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <p className="font-semibold">{currentQuestion.subject} - {currentQuestion.topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className={`font-mono font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {currentQuestion.text}
                  </CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentQuestion.difficulty.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === index
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-violet-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        selectedOption === index
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedOption === null}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={skipQuestion}
                    variant="outline"
                  >
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Render Results Phase
  if (testPhase === 'results' && testResult) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 p-6 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Test Complete!
              </h1>
              <p className="text-gray-600">Here's your detailed performance analysis</p>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    testResult.accuracy >= 80 ? 'text-green-600' :
                    testResult.accuracy >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {testResult.accuracy.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <div className="mt-2">
                    {testResult.accuracy >= 80 ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Excellent!</span>
                    ) : testResult.accuracy >= 60 ? (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Good</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Needs Practice</span>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-blue-600">
                    {testResult.correctAnswers}/{testResult.totalQuestions}
                  </div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <CheckCircle2 className="w-6 h-6 text-blue-500 mx-auto mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-purple-600">
                    {formatTime(Math.floor(testResult.timeSpent))}
                  </div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <Clock className="w-6 h-6 text-purple-500 mx-auto mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-violet-600">
                    {testResult.behavior.focusLevel.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-600">Focus Level</p>
                  <Brain className="w-6 h-6 text-violet-500 mx-auto mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Behavior Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Behavior Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Learning Speed</span>
                      <span className={`text-sm font-semibold ${
                        testResult.behavior.speed === 'fast' ? 'text-green-600' :
                        testResult.behavior.speed === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {testResult.behavior.speed.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Avg response time: {testResult.behavior.avgResponseTime.toFixed(1)}s per question
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Focus & Consistency</span>
                      <span className="text-sm font-semibold">{testResult.behavior.focusLevel.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${testResult.behavior.focusLevel}%` }}
                      />
                    </div>
                  </div>
                  {testResult.behavior.skipPattern.length > 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-800">
                            Skipped {testResult.behavior.skipPattern.length} questions
                          </p>
                          <p className="text-xs text-yellow-700">
                            Consider reviewing these topics for better confidence
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Topic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Topic Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testResult.strongTopics.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold">Strong Areas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {testResult.strongTopics.map(topic => (
                          <span key={topic} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {testResult.weakTopics.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold">Needs Improvement</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {testResult.weakTopics.map(topic => (
                          <span key={topic} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800">
                          💡 Recommended: Practice these topics in Autonomous Learning mode for adaptive difficulty adjustment
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Question Review */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, idx) => {
                    const attempt = answers[idx];
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border-2 ${
                          attempt.isCorrect ? 'border-green-200 bg-green-50' :
                          attempt.skipped ? 'border-yellow-200 bg-yellow-50' :
                          'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">Q{idx + 1}.</span>
                              <span>{question.text}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span>{question.topic}</span>
                              <span>•</span>
                              <span className="capitalize">{question.difficulty}</span>
                              <span>•</span>
                              <span>{attempt.timeSpent.toFixed(1)}s</span>
                            </div>
                          </div>
                          {attempt.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : attempt.skipped ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        {!attempt.isCorrect && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm">
                              <span className="font-semibold">Correct Answer: </span>
                              {question.options[question.correctAnswer]}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={resetTest}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Another Test
              </Button>
              <Button
                onClick={() => navigate('/autonomous-learning')}
                variant="outline"
                className="flex-1"
              >
                Practice Weak Topics
              </Button>
              <Button
                onClick={() => navigate('/ai-tools')}
                variant="outline"
              >
                Back to AI Tools
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
