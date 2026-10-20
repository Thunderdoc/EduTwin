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
  FlaskConical,
  LineChart,
  Sparkles,
  Shield
} from 'lucide-react';
import { CognitiveEngine } from '../lib/CognitiveEngine';

// ============================================================
// NEXT-GENERATION AUTONOMOUS LEARNING WITH COGNITIVE INTELLIGENCE
// "We don't personalize content — we personalize cognition"
// ============================================================

interface ConceptState {
  id: string;
  name: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number;
  lastStudied: number;
  nextReview: number;
  studySessions: number;
  status: 'learning' | 'practicing' | 'mastered' | 'needs_review' | 'struggling';
}

interface Question {
  id: string;
  conceptId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CognitiveAutonomousLearning = () => {
  const navigate = useNavigate();
  const [isLearning, setIsLearning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'learn' | 'test' | 'analyze' | 'adapt'>('idle');
  const [currentConcept, setCurrentConcept] = useState<ConceptState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Cognitive Engine instance
  const cognitiveEngine = useRef<CognitiveEngine | null>(null);
  const questionStartTime = useRef<number>(0);

  // UI State
  const [mentorMessage, setMentorMessage] = useState('');
  const [showCognitiveInsights, setShowCognitiveInsights] = useState(false);
  const [showPathPrediction, setShowPathPrediction] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(30); // Default 30 minutes
  const [timeRemaining, setTimeRemaining] = useState(0); // Time remaining in seconds
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0); // Track consecutive wrong answers
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set()); // Track asked questions
  const [practiceInput, setPracticeInput] = useState(''); // For practice problem input during learning phase
  const [showPracticeFeedback, setShowPracticeFeedback] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    conceptsLearned: 0,
    questionsAnswered: 0,
    accuracy: 0,
    totalTime: 0,
    streak: 0
  });
  
  // Sample concepts database
  const [concepts] = useState<ConceptState[]>([
    {
      id: 'math_001',
      name: 'Quadratic Equations',
      subject: 'Mathematics',
      difficulty: 'medium',
      masteryLevel: 0,
      lastStudied: 0,
      nextReview: Date.now(),
      studySessions: 0,
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
      status: 'learning'
    },
    {
      id: 'chem_001',
      name: 'Chemical Bonding',
      subject: 'Chemistry',
      difficulty: 'hard',
      masteryLevel: 0,
      lastStudied: 0,
      nextReview: Date.now(),
      studySessions: 0,
      status: 'learning'
    },
    {
      id: 'bio_001',
      name: 'Cell Structure',
      subject: 'Biology',
      difficulty: 'easy',
      masteryLevel: 0,
      lastStudied: 0,
      nextReview: Date.now(),
      studySessions: 0,
      status: 'learning'
    }
  ]);
  
  // Sample questions database
  const questionsDatabase: Question[] = [
    {
      id: 'q_math_001_1',
      conceptId: 'math_001',
      text: 'Solve: x² - 5x + 6 = 0',
      options: ['x = 2 or x = 3', 'x = 1 or x = 6', 'x = -2 or x = -3', 'x = 0 or x = 5'],
      correctAnswer: 0,
      explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3',
      difficulty: 'medium'
    },
    {
      id: 'q_math_001_2',
      conceptId: 'math_001',
      text: 'What is the formula for solving ax² + bx + c = 0?',
      options: ['x = -b ± √(b²-4ac) / 2a', 'x = b ± √(b²-4ac) / 2a', 'x = -b ± √(b²+4ac) / 2a', 'x = -b ± √(b²-ac) / 2a'],
      correctAnswer: 0,
      explanation: 'The quadratic formula is x = -b ± √(b²-4ac) / 2a',
      difficulty: 'easy'
    },
    {
      id: 'q_physics_001_1',
      conceptId: 'physics_001',
      text: 'Newton\'s First Law states that an object will remain at rest or in uniform motion unless acted upon by:',
      options: ['An external force', 'Gravity', 'Friction', 'Momentum'],
      correctAnswer: 0,
      explanation: 'Newton\'s First Law (Law of Inertia) states that an object will remain at rest or in uniform motion unless acted upon by an external force.',
      difficulty: 'easy'
    },
    {
      id: 'q_chem_001_1',
      conceptId: 'chem_001',
      text: 'Which type of bond involves the sharing of electrons?',
      options: ['Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond'],
      correctAnswer: 0,
      explanation: 'Covalent bonds involve the sharing of electrons between atoms.',
      difficulty: 'medium'
    },
    {
      id: 'q_bio_001_1',
      conceptId: 'bio_001',
      text: 'What is the powerhouse of the cell?',
      options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'],
      correctAnswer: 0,
      explanation: 'Mitochondria are known as the powerhouse of the cell because they produce ATP (energy).',
      difficulty: 'easy'
    }
  ];
  
  // Initialize Cognitive Engine
  useEffect(() => {
    if (!cognitiveEngine.current) {
      cognitiveEngine.current = new CognitiveEngine('user_001');
      console.log('🧠 Cognitive Engine Initialized');

      // Display initial Learning DNA
      const dna = cognitiveEngine.current.getLearningDNA();
      console.log('🧬 Learning DNA:', dna);
    }
  }, []);

  // Session Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isLearning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Session ended - go to analyze phase
            setIsLearning(false);
            enterAnalyzePhase(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLearning, timeRemaining]);
  
  // Start Smart Learning - The Single Button
  const startSmartLearning = () => {
    if (!cognitiveEngine.current) return;

    setIsLearning(true);
    setTimeRemaining(sessionDuration * 60); // Convert minutes to seconds
    setAskedQuestions(new Set()); // Reset asked questions
    cognitiveEngine.current.resetSession();
    setMentorMessage('🚀 Initiating autonomous learning... Analyzing your cognitive profile...');

    // Start the autonomous loop
    setTimeout(() => {
      enterLearnPhase();
    }, 1500);
  };
  
  // Pause learning
  const pauseLearning = () => {
    setIsLearning(false);
    setMentorMessage('⏸️ Learning paused. Your progress is automatically saved.');
  };
  
  // LEARN PHASE - Adaptive content delivery
  const enterLearnPhase = () => {
    if (!cognitiveEngine.current) return;
    
    setCurrentPhase('learn');
    
    // Get cognitive load balance
    const loadBalance = cognitiveEngine.current.balanceCognitiveLoad();
    
    // Check if break is needed
    if (loadBalance.breakNeeded) {
      setMentorMessage('🛑 You need a break! Your brain needs rest to consolidate learning.');
      setIsLearning(false);
      return;
    }
    
    // Select teaching strategy
    const strategy = cognitiveEngine.current.selectTeachingStrategy();
    const strategyDesc = cognitiveEngine.current.getStrategyDescription(strategy);
    
    // Select next concept based on memory strength and cognitive load
    const needsReview = cognitiveEngine.current.getConceptsNeedingReview();
    let selectedConcept: ConceptState;
    
    if (needsReview.length > 0) {
      const conceptId = needsReview[0];
      selectedConcept = concepts.find(c => c.id === conceptId) || concepts[0];
      setMentorMessage(`📚 Time to review "${selectedConcept.name}" - Memory strength detected as weak.`);
    } else {
      selectedConcept = concepts[Math.floor(Math.random() * concepts.length)];
      setMentorMessage(`🎯 Learning "${selectedConcept.name}" using strategy: ${strategyDesc}`);
    }
    
    setCurrentConcept(selectedConcept);
    
    // Automatically proceed to test phase after brief learning
    setTimeout(() => {
      enterTestPhase(selectedConcept);
    }, 3000);
  };
  
  // TEST PHASE - Adaptive difficulty testing
  const enterTestPhase = (concept: ConceptState) => {
    if (!cognitiveEngine.current) return;

    setCurrentPhase('test');

    // Get cognitive load balance to determine question difficulty
    const loadBalance = cognitiveEngine.current.balanceCognitiveLoad();
    const nextDifficulty = loadBalance.nextQuestionDifficulty;

    // Get questions for this concept
    const conceptQuestions = questionsDatabase.filter(q => q.conceptId === concept.id);

    // Filter by recommended difficulty and exclude already asked questions
    let filteredQuestions = conceptQuestions.filter(q =>
      q.difficulty === nextDifficulty && !askedQuestions.has(q.id)
    );

    // If no unasked questions at this difficulty, try any unasked question
    if (filteredQuestions.length === 0) {
      filteredQuestions = conceptQuestions.filter(q => !askedQuestions.has(q.id));
    }

    // If all questions have been asked, reset the asked questions set
    if (filteredQuestions.length === 0) {
      setAskedQuestions(new Set());
      filteredQuestions = conceptQuestions.filter(q => q.difficulty === nextDifficulty);
      if (filteredQuestions.length === 0) {
        filteredQuestions = conceptQuestions; // Fallback to any question
      }
    }

    const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

    // Mark this question as asked
    setAskedQuestions(prev => new Set([...prev, randomQuestion.id]));

    setCurrentQuestion(randomQuestion);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    questionStartTime.current = Date.now();

    // Cognitive load message
    if (loadBalance.shouldIncreaseChallenge) {
      setMentorMessage('🚀 You\'re doing great! Increasing difficulty to challenge you.');
    } else if (loadBalance.shouldDecreaseChallenge) {
      setMentorMessage('💪 Let\'s make this easier - building confidence first.');
    } else {
      setMentorMessage('🎯 Testing your understanding...');
    }
  };
  
  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (!cognitiveEngine.current || selectedAnswer === null || !currentQuestion || !currentConcept) return;

    const timeSpent = (Date.now() - questionStartTime.current) / 1000;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    // Record interaction in Cognitive Engine
    cognitiveEngine.current.recordInteraction(
      currentConcept.id,
      currentQuestion.id,
      isCorrect,
      timeSpent,
      currentQuestion.options[selectedAnswer],
      currentQuestion.options[currentQuestion.correctAnswer],
      0 // hintsUsed
    );

    // Update wrong answers count
    if (isCorrect) {
      setWrongAnswersCount(0); // Reset on correct answer
    } else {
      setWrongAnswersCount(prev => prev + 1);
    }

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      accuracy: ((prev.accuracy * prev.questionsAnswered + (isCorrect ? 100 : 0)) / (prev.questionsAnswered + 1)),
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    // Show feedback
    setAnswerFeedback(isCorrect ? 'correct' : 'wrong');

    // Generate next question after brief feedback display (stay in test phase)
    setTimeout(() => {
      if (currentConcept) {
        enterTestPhase(currentConcept);
      }
    }, 2000);
  };
  
  // ANALYZE PHASE - Deep cognitive analysis
  const enterAnalyzePhase = (wasCorrect: boolean) => {
    if (!cognitiveEngine.current || !currentConcept) return;

    setCurrentPhase('analyze');

    // Get error intelligence
    const errorAnalysis = cognitiveEngine.current.analyzeErrors();

    // Get cognitive insights
    const insights = cognitiveEngine.current.getCognitiveInsights();

    // Implement cognitive learning logic
    if (wasCorrect) {
      // Correct answer → Move to next topic
      setMentorMessage('✅ Excellent! Moving to the next topic to expand your knowledge.');
      setWrongAnswersCount(0); // Reset counter
      // Will move to next topic in adapt phase
    } else {
      // Wrong answer
      if (wrongAnswersCount >= 2) {
        // Multiple wrong answers → Mark topic as weak
        if (currentConcept.status !== 'struggling') {
          setCurrentConcept({ ...currentConcept, status: 'struggling' });
        }
        setMentorMessage(`🎯 I notice you're having difficulty with ${currentConcept.name}. Let me adjust our approach to help you master this concept.`);
      } else {
        setMentorMessage(`💡 ${errorAnalysis.intervention}`);
      }
    }

    // Update strategy effectiveness
    const state = cognitiveEngine.current.getCognitiveState();
    const recentPerformance = state.performanceHistory.slice(-5);
    const avgPerformance = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
    cognitiveEngine.current.updateStrategyEffectiveness(avgPerformance);

    // Automatically proceed to adapt phase
    setTimeout(() => {
      enterAdaptPhase(wasCorrect);
    }, 2000);
  };
  
  // ADAPT PHASE - System self-improvement
  const enterAdaptPhase = (wasCorrect: boolean = false) => {
    if (!cognitiveEngine.current) return;

    setCurrentPhase('adapt');

    // Get Learning DNA
    const dna = cognitiveEngine.current.getLearningDNA();

    // Get cognitive state
    const state = cognitiveEngine.current.getCognitiveState();

    // Simulate learning path
    const pathPrediction = cognitiveEngine.current.simulateLearningPath(concepts);

    // Show adaptation message
    setMentorMessage(`🧠 System adapting... Your cognitive DNA shows ${dna.processing_speed} processing speed and ${dna.concept_retention} retention.`);

    // Continue learning loop
    setTimeout(() => {
      if (isLearning) {
        // If answer was correct, move to next topic
        if (wasCorrect) {
          // Find next available topic
          const currentIndex = concepts.findIndex(c => c.id === currentConcept?.id);
          const nextConcept = concepts[(currentIndex + 1) % concepts.length];
          setCurrentConcept(nextConcept);
          setWrongAnswersCount(0);
        }
        enterLearnPhase();
      }
    }, 2000);
  };
  
  // Render cognitive insights panel
  const renderCognitiveInsights = () => {
    if (!cognitiveEngine.current) return null;
    
    const dna = cognitiveEngine.current.getLearningDNA();
    const state = cognitiveEngine.current.getCognitiveState();
    const insights = cognitiveEngine.current.getCognitiveInsights();
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Your Cognitive Profile</h2>
                  <p className="text-sm text-gray-500">Real-time brain behavior analysis</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCognitiveInsights(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Learning DNA */}
            <div className="mb-6 p-4 bg-purple-50 rounded-xl">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Learning DNA Profile
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Processing Speed:</span>
                  <span className="ml-2 font-semibold capitalize">{dna.processing_speed.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Concept Retention:</span>
                  <span className="ml-2 font-semibold capitalize">{dna.concept_retention}</span>
                </div>
                <div>
                  <span className="text-gray-600">Error Pattern:</span>
                  <span className="ml-2 font-semibold capitalize">{dna.error_pattern.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Focus Pattern:</span>
                  <span className="ml-2 font-semibold capitalize">{dna.focus_pattern.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Learning Style:</span>
                  <span className="ml-2 font-semibold capitalize">{dna.learning_style.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Recovery Speed:</span>
                  <span className="ml-2 font-semibold capitalize">{dna.recovery_speed}</span>
                </div>
              </div>
            </div>
            
            {/* Cognitive State */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Current Cognitive State
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Cognitive Load</span>
                    <span className="font-semibold">{Math.round(state.currentCognitiveLoad)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${state.currentCognitiveLoad}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Focus Level</span>
                    <span className="font-semibold">{Math.round(state.focusLevel)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${state.focusLevel}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Fatigue Level</span>
                    <span className="font-semibold">{Math.round(state.fatigueLevel)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all"
                      style={{ width: `${state.fatigueLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cognitive Insights */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-green-600" />
                Cognitive Insights
              </h3>
              <div className="space-y-2">
                {insights.map((insight, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>{insight}</span>
                  </div>
                ))}
                {insights.length === 0 && (
                  <p className="text-sm text-gray-500">Continue learning to unlock insights...</p>
                )}
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{state.questionsInSession}</div>
                  <div className="text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{state.correctInRow}</div>
                  <div className="text-gray-600">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{state.avgReactionTime.toFixed(1)}s</div>
                  <div className="text-gray-600">Avg Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render path prediction panel
  const renderPathPrediction = () => {
    if (!cognitiveEngine.current) return null;
    
    const prediction = cognitiveEngine.current.simulateLearningPath(concepts);
    
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Future Learning Path</h2>
                  <p className="text-sm text-gray-500">AI-powered outcome prediction</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPathPrediction(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Current Trajectory */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Current Trajectory: <span className="capitalize text-blue-600">{prediction.currentTrajectory}</span>
              </h3>
              <div className="text-sm text-gray-600">
                Predicted completion: <span className="font-semibold">{prediction.ifContinueCurrent.estimatedDays} days</span>
                {' '} | Estimated mastery: <span className="font-semibold">{prediction.ifContinueCurrent.estimatedMastery}%</span>
              </div>
            </div>
            
            {/* Early Warnings */}
            {prediction.earlyWarnings.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  Early Warnings
                </h3>
                <div className="space-y-2">
                  {prediction.earlyWarnings.map((warning, idx) => (
                    <div key={idx} className="text-sm text-red-700">{warning}</div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Acceleration Opportunities */}
            {prediction.opportunitiesForAcceleration.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                  <Zap className="w-4 h-4" />
                  Acceleration Opportunities
                </h3>
                <div className="space-y-2">
                  {prediction.opportunitiesForAcceleration.map((opp, idx) => (
                    <div key={idx} className="text-sm text-green-700">{opp}</div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Path Scenarios */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Path Simulations
              </h3>
              
              {/* Optimal Path */}
              <div className="p-4 border-2 border-green-500 rounded-xl bg-green-50">
                <div className="font-semibold text-green-700 mb-2">✨ Optimal Path (Recommended)</div>
                <div className="text-sm space-y-1">
                  <div>Days: <span className="font-semibold">{prediction.optimalPath.estimatedDays}</span></div>
                  <div>Mastery: <span className="font-semibold">{prediction.optimalPath.estimatedMastery}%</span></div>
                  <div>Risk: <span className="font-semibold capitalize">{prediction.optimalPath.riskLevel}</span></div>
                  <div className="mt-2 text-green-700">
                    {prediction.optimalPath.pros.map((pro, idx) => (
                      <div key={idx}>✓ {pro}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Other scenarios */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-xl bg-gray-50">
                  <div className="font-semibold text-sm mb-2">If Increase Intensity</div>
                  <div className="text-xs space-y-1">
                    <div>Days: {prediction.ifIncreaseIntensity.estimatedDays}</div>
                    <div>Mastery: {prediction.ifIncreaseIntensity.estimatedMastery}%</div>
                    <div>Risk: <span className="capitalize">{prediction.ifIncreaseIntensity.riskLevel}</span></div>
                  </div>
                </div>
                <div className="p-3 border rounded-xl bg-gray-50">
                  <div className="font-semibold text-sm mb-2">If Decrease Intensity</div>
                  <div className="text-xs space-y-1">
                    <div>Days: {prediction.ifDecreaseIntensity.estimatedDays}</div>
                    <div>Mastery: {prediction.ifDecreaseIntensity.estimatedMastery}%</div>
                    <div>Risk: <span className="capitalize">{prediction.ifDecreaseIntensity.riskLevel}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl">Cognitive Learning Engine</h1>
                  <p className="text-sm text-gray-500">Next-Generation Autonomous Intelligence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCognitiveInsights(true)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Cognitive Profile
              </button>
              <button
                onClick={() => setShowPathPrediction(true)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <LineChart className="w-4 h-4" />
                Path Prediction
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {currentPhase === 'idle' && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              We Don't Personalize Content
            </h2>
            <h3 className="text-3xl font-bold mb-6">
              We Personalize Cognition
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Revolutionary AI learning engine that adapts to how your brain actually works. 
              No decisions needed - just press one button and let the system learn you while you learn.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Cognitive State Modeling</div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Learning DNA</div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <LineChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Path Simulation</div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-semibold">Error Intelligence</div>
              </div>
            </div>

            {/* Session Duration Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Session Duration</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                {[15, 30, 45, 60].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSessionDuration(duration)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      sessionDuration === duration
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">
                Choose your preferred learning session length
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={startSmartLearning}
              className="px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start Smart Learning ({sessionDuration} min)
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Zero decisions required • Fully autonomous • Self-improving
            </p>
          </div>
        )}
        
        {/* Learning Active */}
        {currentPhase !== 'idle' && (
          <div className="max-w-4xl mx-auto">
            {/* Status Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isLearning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="font-semibold">
                      {currentPhase === 'learn' && '📚 Learning Phase'}
                      {currentPhase === 'test' && '🎯 Testing Phase'}
                      {currentPhase === 'analyze' && '🔍 Analyzing Phase'}
                      {currentPhase === 'adapt' && '🧠 Adapting Phase'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-600">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={isLearning ? pauseLearning : startSmartLearning}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isLearning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isLearning ? 'Pause' : 'Resume'}
                </button>
              </div>
              
              {/* AI Mentor Message */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{mentorMessage}</p>
              </div>
            </div>
            
            {/* Current Concept */}
            {currentConcept && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Book className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-xl">{currentConcept.name}</h3>
                    <p className="text-sm text-gray-500">{currentConcept.subject}</p>
                  </div>
                </div>
                
                {/* Mastery Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Mastery Level</span>
                    <span className="font-semibold">{currentConcept.masteryLevel}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                      style={{ width: `${currentConcept.masteryLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Learning Content - Learn Phase */}
            {currentPhase === 'learn' && currentConcept && (
              <div className="space-y-6">
                {/* PROMINENT PRACTICE INPUT BOX - AT THE TOP! */}
                <div className="bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 rounded-3xl shadow-2xl p-8 border-4 border-orange-400">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="bg-orange-500 p-4 rounded-2xl animate-bounce">
                      <Lightbulb className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900">PRACTICE HERE!</h2>
                  </div>

                  {currentConcept.id === 'math_001' && (
                    <div className="space-y-5">
                      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-300">
                        <p className="text-2xl font-bold text-gray-800 mb-3">Problem:</p>
                        <p className="text-xl text-gray-700">
                          Solve: <span className="text-3xl font-bold text-orange-600">x² = 4</span>
                        </p>
                        <p className="text-lg text-gray-600 mt-2">What is x?</p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xl font-bold text-gray-900 uppercase">
                          ✍️ ENTER YOUR ANSWER IN THE BOX BELOW:
                        </label>
                        <input
                          type="text"
                          value={practiceInput}
                          onChange={(e) => {
                            setPracticeInput(e.target.value);
                            setShowPracticeFeedback(false);
                          }}
                          placeholder="Type your answer here..."
                          className="w-full px-8 py-6 text-2xl border-4 border-orange-500 rounded-2xl focus:outline-none focus:border-orange-700 focus:ring-8 focus:ring-orange-300 transition-all shadow-xl font-semibold"
                        />
                        <button
                          onClick={() => setShowPracticeFeedback(true)}
                          className="w-full px-10 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-2xl rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse"
                        >
                          <CheckCircle2 className="w-8 h-8" />
                          CHECK MY ANSWER
                        </button>
                      </div>

                      {showPracticeFeedback && practiceInput.trim() && (
                        <div className="p-6 bg-blue-50 rounded-2xl border-4 border-blue-400 shadow-xl">
                          <p className="text-lg text-blue-900 leading-relaxed">
                            <strong className="text-2xl">💡 Answer:</strong> x can be <strong className="text-xl">+2</strong> or <strong className="text-xl">-2</strong> because both (2)² = 4 and (-2)² = 4!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentConcept.id === 'physics_001' && (
                    <div className="space-y-5">
                      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-300">
                        <p className="text-2xl font-bold text-gray-800 mb-3">Problem:</p>
                        <p className="text-xl text-gray-700">
                          Mass = 1000 kg, Acceleration = 2 m/s²
                        </p>
                        <p className="text-lg text-gray-600 mt-2">Find Force (F = ma)</p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xl font-bold text-gray-900 uppercase">
                          ✍️ ENTER YOUR ANSWER IN THE BOX BELOW:
                        </label>
                        <input
                          type="text"
                          value={practiceInput}
                          onChange={(e) => {
                            setPracticeInput(e.target.value);
                            setShowPracticeFeedback(false);
                          }}
                          placeholder="Type your answer here..."
                          className="w-full px-8 py-6 text-2xl border-4 border-orange-500 rounded-2xl focus:outline-none focus:border-orange-700 focus:ring-8 focus:ring-orange-300 transition-all shadow-xl font-semibold"
                        />
                        <button
                          onClick={() => setShowPracticeFeedback(true)}
                          className="w-full px-10 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-2xl rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse"
                        >
                          <CheckCircle2 className="w-8 h-8" />
                          CHECK MY ANSWER
                        </button>
                      </div>

                      {showPracticeFeedback && practiceInput.trim() && (
                        <div className="p-6 bg-blue-50 rounded-2xl border-4 border-blue-400 shadow-xl">
                          <p className="text-lg text-blue-900 leading-relaxed">
                            <strong className="text-2xl">💡 Answer:</strong> F = ma = 1000 × 2 = <strong className="text-xl">2000 N</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentConcept.id === 'chem_001' && (
                    <div className="space-y-5">
                      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-300">
                        <p className="text-2xl font-bold text-gray-800 mb-3">Problem:</p>
                        <p className="text-xl text-gray-700">
                          What type of bond forms in NaCl?
                        </p>
                        <p className="text-lg text-gray-600 mt-2">(Ionic, Covalent, or Metallic?)</p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xl font-bold text-gray-900 uppercase">
                          ✍️ ENTER YOUR ANSWER IN THE BOX BELOW:
                        </label>
                        <input
                          type="text"
                          value={practiceInput}
                          onChange={(e) => {
                            setPracticeInput(e.target.value);
                            setShowPracticeFeedback(false);
                          }}
                          placeholder="Type your answer here..."
                          className="w-full px-8 py-6 text-2xl border-4 border-orange-500 rounded-2xl focus:outline-none focus:border-orange-700 focus:ring-8 focus:ring-orange-300 transition-all shadow-xl font-semibold"
                        />
                        <button
                          onClick={() => setShowPracticeFeedback(true)}
                          className="w-full px-10 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-2xl rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse"
                        >
                          <CheckCircle2 className="w-8 h-8" />
                          CHECK MY ANSWER
                        </button>
                      </div>

                      {showPracticeFeedback && practiceInput.trim() && (
                        <div className="p-6 bg-blue-50 rounded-2xl border-4 border-blue-400 shadow-xl">
                          <p className="text-lg text-blue-900 leading-relaxed">
                            <strong className="text-2xl">💡 Answer:</strong> <strong className="text-xl">Ionic bond!</strong> Na (metal) transfers electron to Cl (non-metal).
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentConcept.id === 'bio_001' && (
                    <div className="space-y-5">
                      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-300">
                        <p className="text-2xl font-bold text-gray-800 mb-3">Problem:</p>
                        <p className="text-xl text-gray-700">
                          Which organelle is the "powerhouse of the cell"?
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xl font-bold text-gray-900 uppercase">
                          ✍️ ENTER YOUR ANSWER IN THE BOX BELOW:
                        </label>
                        <input
                          type="text"
                          value={practiceInput}
                          onChange={(e) => {
                            setPracticeInput(e.target.value);
                            setShowPracticeFeedback(false);
                          }}
                          placeholder="Type your answer here..."
                          className="w-full px-8 py-6 text-2xl border-4 border-orange-500 rounded-2xl focus:outline-none focus:border-orange-700 focus:ring-8 focus:ring-orange-300 transition-all shadow-xl font-semibold"
                        />
                        <button
                          onClick={() => setShowPracticeFeedback(true)}
                          className="w-full px-10 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-2xl rounded-2xl font-black hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse"
                        >
                          <CheckCircle2 className="w-8 h-8" />
                          CHECK MY ANSWER
                        </button>
                      </div>

                      {showPracticeFeedback && practiceInput.trim() && (
                        <div className="p-6 bg-blue-50 rounded-2xl border-4 border-blue-400 shadow-xl">
                          <p className="text-lg text-blue-900 leading-relaxed">
                            <strong className="text-2xl">💡 Answer:</strong> <strong className="text-xl">Mitochondria!</strong> It produces ATP (energy) for the cell.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Educational Content Below */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="mb-6">
                    <div className="text-sm text-purple-600 font-semibold mb-2">Learning Content</div>
                    <h3 className="text-xl font-bold mb-4">{currentConcept.name}</h3>
                  </div>

                  <div className="prose max-w-none">
                    {currentConcept.id === 'math_001' && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          <strong>Quadratic equations</strong> are polynomial equations of degree 2, in the form: <strong>ax² + bx + c = 0</strong>
                        </p>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="font-semibold mb-2">Key Formula:</p>
                          <p className="font-mono text-lg">x = (-b ± √(b² - 4ac)) / 2a</p>
                        </div>
                        <p className="text-gray-700">
                          <strong>Example:</strong> Solve x² - 5x + 6 = 0
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          <li>Factor: (x - 2)(x - 3) = 0</li>
                          <li>Therefore: x = 2 or x = 3</li>
                        </ul>
                      </div>
                    )}

                    {currentConcept.id === 'physics_001' && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          <strong>Newton's Laws of Motion</strong> describe the relationship between forces and motion:
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                          <p><strong>1st Law (Inertia):</strong> An object at rest stays at rest unless acted upon by a force.</p>
                          <p><strong>2nd Law:</strong> F = ma (Force = mass × acceleration)</p>
                          <p><strong>3rd Law:</strong> For every action, there's an equal and opposite reaction.</p>
                        </div>
                      </div>
                    )}

                    {currentConcept.id === 'chem_001' && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          <strong>Chemical Bonding</strong> is the attraction between atoms that allows molecules to form:
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg space-y-2">
                          <p><strong>Ionic Bonds:</strong> Transfer of electrons (metals + non-metals)</p>
                          <p><strong>Covalent Bonds:</strong> Sharing of electrons (non-metals)</p>
                          <p><strong>Metallic Bonds:</strong> Sea of delocalized electrons (metals)</p>
                        </div>
                      </div>
                    )}

                    {currentConcept.id === 'bio_001' && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          <strong>Cell Structure:</strong> Cells are the basic building blocks of all living things.
                        </p>
                        <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                          <p><strong>Nucleus:</strong> Contains DNA, controls cell activities</p>
                          <p><strong>Mitochondria:</strong> Powerhouse of the cell, produces energy</p>
                          <p><strong>Cell Membrane:</strong> Controls what enters and exits the cell</p>
                          <p><strong>Cytoplasm:</strong> Jelly-like fluid where cell processes occur</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      📚 <strong>Learning mode:</strong> Practice above, then you'll be automatically tested!
                    </p>
                  </div>
                </div>
              </div>
            )}


            {/* Question - Test Phase */}
            {currentQuestion && currentPhase === 'test' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-purple-600 font-semibold mb-2">Question</div>
                    {answerFeedback === null && (
                      <div className="text-xs text-gray-500 animate-pulse">
                        👆 Click your answer below
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-6">{currentQuestion.text}</h3>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (answerFeedback === null) {
                          setSelectedAnswer(idx);
                        }
                      }}
                      disabled={answerFeedback !== null}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        answerFeedback === null
                          ? selectedAnswer === idx
                            ? 'border-purple-600 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 cursor-pointer'
                          : answerFeedback === 'correct' && selectedAnswer === idx
                          ? 'border-green-500 bg-green-50'
                          : answerFeedback === 'wrong' && selectedAnswer === idx
                          ? 'border-red-500 bg-red-50'
                          : idx === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 opacity-50'
                      } ${answerFeedback !== null ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answerFeedback === null
                            ? selectedAnswer === idx
                              ? 'border-purple-600 bg-purple-600'
                              : 'border-gray-300'
                            : answerFeedback === 'correct' && selectedAnswer === idx
                            ? 'border-green-500 bg-green-500'
                            : answerFeedback === 'wrong' && selectedAnswer === idx
                            ? 'border-red-500 bg-red-500'
                            : idx === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {(answerFeedback !== null && (selectedAnswer === idx || idx === currentQuestion.correctAnswer)) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Submit Button */}
                {answerFeedback === null && (
                  <div className="space-y-2">
                    {selectedAnswer !== null && (
                      <div className="text-center text-sm text-green-600 font-semibold">
                        ✓ Answer selected! Ready to submit.
                      </div>
                    )}
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswer === null}
                      className={`w-full py-4 rounded-xl font-semibold transition-all ${
                        selectedAnswer === null
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {selectedAnswer === null ? '⚠️ Select an answer first' : '✓ Submit Answer'}
                    </button>
                  </div>
                )}
                
                {/* Explanation */}
                {answerFeedback !== null && (
                  <div className={`p-4 rounded-xl ${
                    answerFeedback === 'correct' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {answerFeedback === 'correct' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">Correct!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-700">Incorrect</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Session Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Session Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">{sessionStats.questionsAnswered}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{Math.round(sessionStats.accuracy)}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{sessionStats.streak}</div>
                  <div className="text-sm text-gray-600">Streak</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">{sessionStats.conceptsLearned}</div>
                  <div className="text-sm text-gray-600">Concepts</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showCognitiveInsights && renderCognitiveInsights()}
      {showPathPrediction && renderPathPrediction()}
    </div>
  );
};

export default CognitiveAutonomousLearning;
