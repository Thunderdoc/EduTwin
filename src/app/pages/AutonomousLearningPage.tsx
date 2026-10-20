import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Brain,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Book,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  BarChart3,
  Lightbulb,
  Trophy,
  Activity,
  Keyboard
} from 'lucide-react';
import { Input } from '../components/ui/input';

// Behavior Intelligence Engine
interface BehaviorMetrics {
  timeSpent: number; // seconds
  accuracy: number; // percentage
  mistakes: number;
  learningSpeed: 'slow' | 'medium' | 'fast';
  focusLevel: number; // 0-100
  consecutiveCorrect: number;
  consecutiveWrong: number;
  avgResponseTime: number; // seconds
  hintsUsed: number;
  revisitCount: number;
}

interface ConceptState {
  id: string;
  name: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number; // 0-100
  lastStudied: number; // timestamp
  nextReview: number; // timestamp
  studySessions: number;
  behavior: BehaviorMetrics;
  status: 'learning' | 'practicing' | 'mastered' | 'needs_review' | 'struggling';
}

interface LearningContent {
  type: 'video' | 'text' | 'example' | 'interactive';
  content: string;
  duration: number; // seconds
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const AutonomousLearningPage = () => {
  const navigate = useNavigate();
  const [isLearning, setIsLearning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'learn' | 'test' | 'analyze' | 'adapt'>('idle');
  const [currentConcept, setCurrentConcept] = useState<ConceptState | null>(null);
  const [learningContent, setLearningContent] = useState<LearningContent | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionStats, setSessionStats] = useState({
    conceptsLearned: 0,
    questionsAnswered: 0,
    accuracy: 0,
    totalTime: 0,
    streak: 0
  });
  const [mentorMessage, setMentorMessage] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [autoNotes, setAutoNotes] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [explanationType, setExplanationType] = useState<'video' | 'text' | 'example'>('text');
  const [learningTopic, setLearningTopic] = useState('');
  
  const sessionStartTime = useRef<number>(0);
  const conceptStartTime = useRef<number>(0);
  const questionStartTime = useRef<number>(0);

  // Sample concepts database (in real app, this would be comprehensive)
  const conceptsDatabase: ConceptState[] = [
    {
      id: 'math_001',
      name: 'Quadratic Equations',
      subject: 'Mathematics',
      difficulty: 'medium',
      masteryLevel: 0,
      lastStudied: 0,
      nextReview: Date.now(),
      studySessions: 0,
      behavior: {
        timeSpent: 0,
        accuracy: 0,
        mistakes: 0,
        learningSpeed: 'medium',
        focusLevel: 100,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        avgResponseTime: 0,
        hintsUsed: 0,
        revisitCount: 0
      },
      status: 'learning'
    },
    {
      id: 'physics_001',
      name: 'Newton\'s Laws of Motion',
      subject: 'Physics',
      difficulty: 'medium',
      masteryLevel: 0,
      lastStudied: 0,
      nextReview: Date.now(),
      studySessions: 0,
      behavior: {
        timeSpent: 0,
        accuracy: 0,
        mistakes: 0,
        learningSpeed: 'medium',
        focusLevel: 100,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        avgResponseTime: 0,
        hintsUsed: 0,
        revisitCount: 0
      },
      status: 'learning'
    },
    {
      id: 'chem_001',
      name: 'Periodic Table Basics',
      subject: 'Chemistry',
      difficulty: 'easy',
      masteryLevel: 0,
      lastStudied: 0,
      nextReview: Date.now(),
      studySessions: 0,
      behavior: {
        timeSpent: 0,
        accuracy: 0,
        mistakes: 0,
        learningSpeed: 'medium',
        focusLevel: 100,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        avgResponseTime: 0,
        hintsUsed: 0,
        revisitCount: 0
      },
      status: 'learning'
    }
  ];

  const [concepts, setConcepts] = useState<ConceptState[]>(conceptsDatabase);

  // Behavior Intelligence Engine - analyzes learning patterns
  const analyzeBehavior = (concept: ConceptState): BehaviorMetrics => {
    const behavior = concept.behavior;
    
    // Determine learning speed based on response time and accuracy
    let speed: 'slow' | 'medium' | 'fast' = 'medium';
    if (behavior.avgResponseTime < 5 && behavior.accuracy > 80) {
      speed = 'fast';
    } else if (behavior.avgResponseTime > 15 || behavior.accuracy < 50) {
      speed = 'slow';
    }

    // Calculate focus level based on consecutive patterns
    let focus = 100;
    if (behavior.consecutiveWrong > 2) {
      focus = Math.max(30, 100 - (behavior.consecutiveWrong * 15));
    }

    return {
      ...behavior,
      learningSpeed: speed,
      focusLevel: focus
    };
  };

  // Adaptive Difficulty Adjustment
  const adjustDifficulty = (concept: ConceptState): 'easy' | 'medium' | 'hard' => {
    const behavior = concept.behavior;
    
    if (behavior.accuracy > 85 && behavior.consecutiveCorrect >= 3) {
      return 'hard';
    } else if (behavior.accuracy < 50 || behavior.consecutiveWrong >= 2) {
      return 'easy';
    }
    return 'medium';
  };

  // Memory-Based Revision Scheduler (Spaced Repetition)
  const calculateNextReview = (concept: ConceptState): number => {
    const masteryLevel = concept.masteryLevel;
    const now = Date.now();
    
    // Spaced repetition intervals based on mastery
    const intervals = {
      low: 1 * 60 * 60 * 1000, // 1 hour
      medium: 24 * 60 * 60 * 1000, // 1 day
      high: 7 * 24 * 60 * 60 * 1000, // 7 days
      mastered: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    if (masteryLevel < 30) return now + intervals.low;
    if (masteryLevel < 60) return now + intervals.medium;
    if (masteryLevel < 90) return now + intervals.high;
    return now + intervals.mastered;
  };

  // Failure Prediction System
  const predictFailure = (concept: ConceptState): boolean => {
    const behavior = concept.behavior;
    
    // Multiple indicators of potential failure
    const indicators = [
      behavior.consecutiveWrong >= 3,
      behavior.accuracy < 40,
      behavior.hintsUsed > 3,
      behavior.focusLevel < 40,
      behavior.revisitCount > 2 && behavior.masteryLevel < 30
    ];

    // If 2 or more indicators are true, predict failure
    return indicators.filter(Boolean).length >= 2;
  };

  // Concept Mastery Checker
  const checkMastery = (concept: ConceptState): boolean => {
    const behavior = concept.behavior;
    
    // Mastery criteria
    const criteria = [
      behavior.accuracy >= 90,
      behavior.consecutiveCorrect >= 5,
      behavior.mistakes <= 1,
      concept.masteryLevel >= 90,
      concept.studySessions >= 3
    ];

    // All criteria must be met
    return criteria.every(Boolean);
  };

  // Smart Topic Selection Algorithm
  const selectNextTopic = (): ConceptState => {
    const now = Date.now();
    
    // Priority 1: Concepts that need review (scheduled)
    const needsReview = concepts.filter(c => c.nextReview <= now && c.status !== 'mastered');
    if (needsReview.length > 0) {
      setMentorMessage('📚 Time to review! This will strengthen your memory.');
      return needsReview[0];
    }

    // Priority 2: Struggling concepts (failure predicted)
    const struggling = concepts.filter(c => predictFailure(c));
    if (struggling.length > 0) {
      setMentorMessage('💪 Let\'s tackle this challenging topic together. You got this!');
      return struggling[0];
    }

    // Priority 3: Continue incomplete concepts
    const inProgress = concepts.filter(c => c.status === 'learning' || c.status === 'practicing');
    if (inProgress.length > 0) {
      return inProgress[0];
    }

    // Priority 4: Start new concept
    const newConcept = concepts.find(c => c.studySessions === 0);
    if (newConcept) {
      setMentorMessage('🚀 Exciting! Let\'s explore something new today!');
      return newConcept;
    }

    // Default: first concept
    return concepts[0];
  };

  // Generate Learning Content (Micro-Learning)
  const generateLearningContent = (concept: ConceptState): LearningContent => {
    const difficulty = adjustDifficulty(concept);
    const behavior = concept.behavior;

    // Switch explanation type based on behavior
    let type: 'video' | 'text' | 'example' = 'text';
    if (behavior.consecutiveWrong >= 2) {
      type = 'video'; // Use video when struggling
    } else if (behavior.learningSpeed === 'fast') {
      type = 'example'; // Fast learners prefer examples
    }

    setExplanationType(type);

    // Micro-learning: short, focused content
    const content = {
      'math_001': {
        easy: 'A quadratic equation is any equation in the form ax² + bx + c = 0. Let\'s start with the simplest case: x² = 4. What is x?',
        medium: 'Quadratic equations have the form ax² + bx + c = 0. To solve them, we can use factoring, completing the square, or the quadratic formula: x = (-b ± √(b²-4ac)) / 2a',
        hard: 'For complex quadratic equations, the discriminant (b²-4ac) determines the nature of roots. When positive, we get two real roots; when zero, one repeated root; when negative, two complex roots.'
      },
      'physics_001': {
        easy: 'Newton\'s First Law: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.',
        medium: 'Newton\'s Second Law: F = ma. The force on an object equals its mass times acceleration. Example: A 2kg object with 10N force accelerates at 5m/s².',
        hard: 'Newton\'s Third Law applications: When you push against a wall, the wall pushes back with equal force. This explains rocket propulsion and walking mechanics.'
      },
      'chem_001': {
        easy: 'The Periodic Table organizes elements by atomic number. Hydrogen (H) is first with 1 proton, Helium (He) is second with 2 protons.',
        medium: 'Elements in the same group (column) have similar properties. Group 1 are alkali metals (Li, Na, K) - highly reactive. Group 18 are noble gases (He, Ne, Ar) - stable.',
        hard: 'Periodic trends: Atomic radius decreases left to right, increases top to bottom. Electronegativity increases left to right, decreases top to bottom. These trends explain chemical reactivity.'
      }
    };

    const conceptContent = content[concept.id as keyof typeof content] || content['math_001'];
    
    return {
      type,
      content: conceptContent[difficulty],
      duration: 90 // 90 seconds of focused learning
    };
  };

  // Generate Test Question
  const generateQuestion = (concept: ConceptState): Question => {
    const difficulty = adjustDifficulty(concept);

    const questions = {
      'math_001': {
        easy: {
          id: 'q1',
          text: 'Solve: x² = 16. What is x?',
          options: ['x = 2', 'x = 4 or x = -4', 'x = 8', 'x = 16'],
          correctAnswer: 1,
          explanation: 'When x² = 16, we take the square root of both sides. √16 = 4, but remember both positive and negative roots: x = ±4',
          difficulty: 'easy'
        },
        medium: {
          id: 'q2',
          text: 'Solve using the quadratic formula: x² + 5x + 6 = 0',
          options: ['x = -2 or x = -3', 'x = 2 or x = 3', 'x = -1 or x = -6', 'x = 1 or x = 6'],
          correctAnswer: 0,
          explanation: 'Using x = (-b ± √(b²-4ac)) / 2a with a=1, b=5, c=6: x = (-5 ± √(25-24)) / 2 = (-5 ± 1) / 2 = -2 or -3',
          difficulty: 'medium'
        },
        hard: {
          id: 'q3',
          text: 'What is the discriminant of 2x² - 3x + 5 = 0, and what does it tell us?',
          options: [
            'b²-4ac = 9, two real roots',
            'b²-4ac = -31, two complex roots',
            'b²-4ac = 31, two real roots',
            'b²-4ac = 0, one repeated root'
          ],
          correctAnswer: 1,
          explanation: 'Discriminant = b²-4ac = (-3)² - 4(2)(5) = 9 - 40 = -31. Since it\'s negative, the equation has two complex (imaginary) roots.',
          difficulty: 'hard'
        }
      },
      'physics_001': {
        easy: {
          id: 'q4',
          text: 'According to Newton\'s First Law, what happens to an object at rest?',
          options: [
            'It starts moving on its own',
            'It stays at rest unless a force acts on it',
            'It accelerates slowly',
            'It falls down due to gravity'
          ],
          correctAnswer: 1,
          explanation: 'Newton\'s First Law (Law of Inertia) states that an object at rest stays at rest unless acted upon by an external force.',
          difficulty: 'easy'
        },
        medium: {
          id: 'q5',
          text: 'If a 5kg object is pushed with 20N of force, what is its acceleration?',
          options: ['2 m/s²', '4 m/s²', '10 m/s²', '100 m/s²'],
          correctAnswer: 1,
          explanation: 'Using F = ma, we get a = F/m = 20N / 5kg = 4 m/s²',
          difficulty: 'medium'
        },
        hard: {
          id: 'q6',
          text: 'A rocket expels gas downward. Which law explains why the rocket moves up?',
          options: [
            'First Law - Inertia',
            'Second Law - F=ma',
            'Third Law - Action-Reaction',
            'Law of Gravitation'
          ],
          correctAnswer: 2,
          explanation: 'Newton\'s Third Law: For every action, there\'s an equal and opposite reaction. Gas pushes down (action), rocket pushes up (reaction).',
          difficulty: 'hard'
        }
      },
      'chem_001': {
        easy: {
          id: 'q7',
          text: 'How many protons does Oxygen (O, atomic number 8) have?',
          options: ['6', '8', '16', '24'],
          correctAnswer: 1,
          explanation: 'The atomic number equals the number of protons. Oxygen has atomic number 8, so it has 8 protons.',
          difficulty: 'easy'
        },
        medium: {
          id: 'q8',
          text: 'Which group in the periodic table contains the most reactive metals?',
          options: ['Group 1 (Alkali Metals)', 'Group 2 (Alkaline Earth)', 'Group 17 (Halogens)', 'Group 18 (Noble Gases)'],
          correctAnswer: 0,
          explanation: 'Group 1 alkali metals (Li, Na, K) are the most reactive metals. They have one valence electron that they readily lose.',
          difficulty: 'medium'
        },
        hard: {
          id: 'q9',
          text: 'Why does atomic radius decrease from left to right across a period?',
          options: [
            'More electrons are added to outer shells',
            'Nuclear charge increases, pulling electrons closer',
            'Atoms lose electrons',
            'Molecular bonds become stronger'
          ],
          correctAnswer: 1,
          explanation: 'As we move left to right, protons increase (higher nuclear charge) while electrons are added to the same shell. Stronger pull = smaller radius.',
          difficulty: 'hard'
        }
      }
    };

    const conceptQuestions = questions[concept.id as keyof typeof questions] || questions['math_001'];
    return conceptQuestions[difficulty];
  };

  // Continuous Learning Loop
  const startLearningLoop = () => {
    setIsLearning(true);
    sessionStartTime.current = Date.now();
    setMentorMessage('🎯 Let\'s begin your personalized learning journey!');
    
    // Start with selecting topic
    setTimeout(() => {
      runLearningPhase();
    }, 1000);
  };

  const runLearningPhase = () => {
    setCurrentPhase('learn');
    
    // Select next topic intelligently
    const nextConcept = selectNextTopic();
    setCurrentConcept(nextConcept);
    conceptStartTime.current = Date.now();
    
    // Generate appropriate content
    const content = generateLearningContent(nextConcept);
    setLearningContent(content);
    
    // Auto-generate note
    const note = `📝 ${nextConcept.name}: ${content.content.slice(0, 100)}...`;
    setAutoNotes(prev => [...prev, note]);
    
    // Move to test phase after content duration
    setTimeout(() => {
      runTestPhase();
    }, content.duration * 1000);
  };

  const runTestPhase = () => {
    setCurrentPhase('test');
    setMentorMessage('🎯 Let\'s check your understanding!');
    
    if (currentConcept) {
      const question = generateQuestion(currentConcept);
      setCurrentQuestion(question);
      questionStartTime.current = Date.now();
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuestion || !currentConcept) return;

    const responseTime = (Date.now() - questionStartTime.current) / 1000;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setAnswerFeedback(isCorrect ? 'correct' : 'wrong');

    // Update behavior metrics
    const updatedConcepts = concepts.map(c => {
      if (c.id === currentConcept.id) {
        const newBehavior = { ...c.behavior };
        
        if (isCorrect) {
          newBehavior.consecutiveCorrect += 1;
          newBehavior.consecutiveWrong = 0;
          c.masteryLevel = Math.min(100, c.masteryLevel + 10);
        } else {
          newBehavior.consecutiveWrong += 1;
          newBehavior.consecutiveCorrect = 0;
          newBehavior.mistakes += 1;
          c.masteryLevel = Math.max(0, c.masteryLevel - 5);
        }

        const totalQuestions = sessionStats.questionsAnswered + 1;
        const totalCorrect = isCorrect ? (sessionStats.accuracy * sessionStats.questionsAnswered / 100) + 1 : (sessionStats.accuracy * sessionStats.questionsAnswered / 100);
        newBehavior.accuracy = (totalCorrect / totalQuestions) * 100;
        
        newBehavior.avgResponseTime = ((newBehavior.avgResponseTime * sessionStats.questionsAnswered) + responseTime) / totalQuestions;
        
        return {
          ...c,
          behavior: analyzeBehavior({ ...c, behavior: newBehavior }),
          lastStudied: Date.now(),
          nextReview: calculateNextReview(c),
          studySessions: c.studySessions + 1,
          status: checkMastery(c) ? 'mastered' : predictFailure(c) ? 'struggling' : 'practicing'
        };
      }
      return c;
    });

    setConcepts(updatedConcepts);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      accuracy: ((prev.accuracy * prev.questionsAnswered) + (isCorrect ? 100 : 0)) / (prev.questionsAnswered + 1),
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    // Mentor feedback
    if (isCorrect) {
      const messages = [
        '🎉 Excellent! You\'re mastering this!',
        '⭐ Perfect! Your understanding is growing!',
        '🚀 Amazing! Keep up this momentum!',
        '💯 Brilliant! You got it right!'
      ];
      setMentorMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      setMentorMessage('🤔 Not quite, but that\'s okay! Let me explain...');
    }

    // Wait for feedback display, then move to analyze phase
    setTimeout(() => {
      runAnalyzePhase();
    }, 3000);
  };

  const runAnalyzePhase = () => {
    setCurrentPhase('analyze');
    setAnswerFeedback(null);
    setSelectedAnswer(null);
    
    if (currentConcept) {
      const analysis = {
        conceptName: currentConcept.name,
        masteryLevel: currentConcept.masteryLevel,
        learningSpeed: currentConcept.behavior.learningSpeed,
        focusLevel: currentConcept.behavior.focusLevel,
        accuracy: currentConcept.behavior.accuracy,
        status: currentConcept.status,
        needsReview: predictFailure(currentConcept),
        mastered: checkMastery(currentConcept),
        nextReview: new Date(currentConcept.nextReview).toLocaleDateString(),
        recommendations: []
      };

      // Generate recommendations
      if (analysis.needsReview) {
        analysis.recommendations.push('🔄 Let\'s try a different explanation method');
        analysis.recommendations.push('💡 I\'ll break this down into smaller steps');
      }
      if (analysis.accuracy < 60) {
        analysis.recommendations.push('📺 Watch a video explanation');
      }
      if (analysis.focusLevel < 50) {
        analysis.recommendations.push('☕ Time for a short break');
      }
      if (analysis.mastered) {
        analysis.recommendations.push('🎓 Concept mastered! Moving to advanced topics');
      }

      setAnalysisData(analysis);
    }

    setTimeout(() => {
      runAdaptPhase();
    }, 2000);
  };

  const runAdaptPhase = () => {
    setCurrentPhase('adapt');
    setMentorMessage('🔄 Adapting to your learning style...');
    
    // Adaptation happens internally via adjustDifficulty, analyzeBehavior, etc.
    
    setTimeout(() => {
      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        conceptsLearned: prev.conceptsLearned + 1,
        totalTime: (Date.now() - sessionStartTime.current) / 1000
      }));

      // Loop back to learning phase
      if (isLearning) {
        runLearningPhase();
      }
    }, 1500);
  };

  const stopLearning = () => {
    setIsLearning(false);
    setCurrentPhase('idle');
    setShowAnalysis(true);
    setMentorMessage('📊 Great session! Let\'s review your progress.');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Autonomous Learning</h1>
                  <p className="text-sm text-gray-500">AI-Powered Adaptive System</p>
                </div>
              </div>
            </div>

            {/* Session Timer */}
            {isLearning && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    {formatTime(sessionStats.totalTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    {sessionStats.accuracy.toFixed(0)}% Accuracy
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Learning Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start Learning Card */}
            {currentPhase === 'idle' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Autonomous Learning Engine
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Click one button and let our AI take over. We'll automatically select topics, teach using the best method for you, test your understanding, and adapt in real-time. No decisions needed!
                </p>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <Book className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">Learn</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">Test</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">Analyze</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">Adapt</p>
                  </div>
                </div>

                {/* Topic Input Box */}
                <div className="mb-6 max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Keyboard className="w-4 h-4 inline mr-1" />
                    What would you like to learn? (Optional)
                  </label>
                  <Input
                    type="text"
                    value={learningTopic}
                    onChange={(e) => setLearningTopic(e.target.value)}
                    placeholder="e.g., Calculus, Physics, Programming..."
                    className="text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave blank for AI-recommended topics based on your progress
                  </p>
                </div>

                <button
                  onClick={startLearningLoop}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5" />
                  {learningTopic ? `Learn ${learningTopic}` : 'Start Smart Learning'}
                </button>
              </div>
            )}

            {/* Learning Phase */}
            {currentPhase === 'learn' && learningContent && currentConcept && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Book className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600">Learning Phase</div>
                    <h3 className="text-xl font-bold text-gray-900">{currentConcept.name}</h3>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500">Subject:</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                      {currentConcept.subject}
                    </span>
                    <span className="text-xs font-medium text-gray-500">Difficulty:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      currentConcept.difficulty === 'easy' ? 'bg-green-50 text-green-700' :
                      currentConcept.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {currentConcept.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content Display */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                  {explanationType === 'video' && (
                    <div className="mb-4 p-3 bg-blue-100 rounded-lg flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Video Explanation Mode</span>
                    </div>
                  )}
                  {explanationType === 'example' && (
                    <div className="mb-4 p-3 bg-green-100 rounded-lg flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Example-Based Learning</span>
                    </div>
                  )}
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {learningContent.content}
                  </p>
                </div>

                {/* Mastery Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Mastery Level</span>
                    <span className="font-semibold text-purple-600">{currentConcept.masteryLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${currentConcept.masteryLevel}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <Activity className="w-4 h-4 inline mr-2 animate-pulse" />
                  System will automatically test your understanding in {learningContent.duration} seconds...
                </div>
              </div>
            )}

            {/* Test Phase */}
            {currentPhase === 'test' && currentQuestion && currentConcept && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-600">Test Phase</div>
                    <h3 className="text-xl font-bold text-gray-900">Check Your Understanding</h3>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-lg font-medium text-gray-900">{currentQuestion.text}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !answerFeedback && setSelectedAnswer(index)}
                      disabled={answerFeedback !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        answerFeedback === null 
                          ? selectedAnswer === index 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                          : answerFeedback === 'correct' && selectedAnswer === index
                            ? 'border-green-500 bg-green-50'
                            : answerFeedback === 'wrong' && selectedAnswer === index
                              ? 'border-red-500 bg-red-50'
                              : index === currentQuestion.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answerFeedback === null
                            ? selectedAnswer === index
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                            : answerFeedback === 'correct' && selectedAnswer === index
                              ? 'border-green-500 bg-green-500'
                              : answerFeedback === 'wrong' && selectedAnswer === index
                                ? 'border-red-500 bg-red-500'
                                : index === currentQuestion.correctAnswer
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300'
                        }`}>
                          {((answerFeedback === null && selectedAnswer === index) ||
                            (answerFeedback === 'correct' && selectedAnswer === index) ||
                            (answerFeedback === 'wrong' && index === currentQuestion.correctAnswer)) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {answerFeedback && (
                  <div className={`p-4 rounded-xl mb-6 ${
                    answerFeedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {answerFeedback === 'correct' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-semibold mb-1 ${
                          answerFeedback === 'correct' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {answerFeedback === 'correct' ? '✨ Correct!' : '🤔 Not quite right'}
                        </p>
                        <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!answerFeedback && (
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}

            {/* Analyze Phase */}
            {currentPhase === 'analyze' && analysisData && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-600">Analyze Phase</div>
                    <h3 className="text-xl font-bold text-gray-900">Performance Analysis</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Mastery Level</div>
                    <div className="text-2xl font-bold text-purple-600">{analysisData.masteryLevel}%</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Focus Level</div>
                    <div className="text-2xl font-bold text-blue-600">{analysisData.focusLevel}%</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Learning Speed</div>
                    <div className="text-2xl font-bold text-green-600 capitalize">{analysisData.learningSpeed}</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div className="text-2xl font-bold text-orange-600 capitalize">{analysisData.status}</div>
                  </div>
                </div>

                {analysisData.recommendations.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="font-semibold text-blue-900 mb-2">💡 AI Recommendations</div>
                    <ul className="space-y-2">
                      {analysisData.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-blue-800 flex items-center gap-2">
                          <ChevronRight className="w-4 h-4" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 text-center text-sm text-gray-500">
                  <Activity className="w-4 h-4 inline mr-2 animate-pulse" />
                  Adapting learning strategy...
                </div>
              </div>
            )}

            {/* Adapt Phase */}
            {currentPhase === 'adapt' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-orange-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Adapting to Your Style</h3>
                <p className="text-gray-600 mb-4">
                  Adjusting difficulty, content type, and learning pace based on your performance...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Control Button */}
            {isLearning && currentPhase !== 'idle' && (
              <div className="flex justify-center">
                <button
                  onClick={stopLearning}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Stop Learning Session
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Mentor */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Mentor</h3>
                  <div className="text-xs text-gray-500">Always here to guide you</div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mentorMessage || '👋 Hi! I\'m your AI mentor. Click "Start Smart Learning" and I\'ll guide you through a personalized learning journey!'}
                </p>
              </div>
            </div>

            {/* Session Stats */}
            {isLearning && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Session Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Concepts</span>
                    <span className="font-semibold text-purple-600">{sessionStats.conceptsLearned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Questions</span>
                    <span className="font-semibold text-blue-600">{sessionStats.questionsAnswered}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <span className="font-semibold text-green-600">{sessionStats.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Streak</span>
                    <span className="font-semibold text-orange-600">{sessionStats.streak} 🔥</span>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-Generated Notes */}
            {autoNotes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Book className="w-5 h-5 text-purple-500" />
                  Auto Notes
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {autoNotes.slice(-5).map((note, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg text-xs text-gray-700">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concept Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Learning Pipeline</h3>
              <div className="space-y-2">
                {concepts.slice(0, 3).map((concept) => (
                  <div key={concept.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{concept.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        concept.status === 'mastered' ? 'bg-green-100 text-green-700' :
                        concept.status === 'struggling' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {concept.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          concept.status === 'mastered' ? 'bg-green-500' :
                          concept.status === 'struggling' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${concept.masteryLevel}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousLearningPage;
