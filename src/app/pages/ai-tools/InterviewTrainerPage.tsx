import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  UserCheck,
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  Target,
  Clock,
  Award,
  MessageSquare,
  Brain,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

interface Question {
  id: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  tips: string[];
  idealAnswer: string;
}

interface Answer {
  questionId: string;
  answer: string;
  timeSpent: number;
  score: number; // 0-100
  feedback: string[];
  strengths: string[];
  improvements: string[];
}

interface InterviewSession {
  id: string;
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  answers: Answer[];
  overallScore: number;
  timestamp: number;
  duration: number;
}

interface InterviewStats {
  totalSessions: number;
  avgScore: number;
  bestScore: number;
  totalQuestions: number;
  improvementRate: number;
}

const questionBank: Question[] = [
  // Technical - Easy
  {
    id: 'tech-e1',
    category: 'technical',
    difficulty: 'easy',
    question: 'What is the difference between var, let, and const in JavaScript?',
    tips: ['Explain scope differences', 'Mention hoisting', 'Discuss reassignment rules'],
    idealAnswer: 'var has function scope and is hoisted, let and const have block scope. const cannot be reassigned after initialization, while let can be. All three are hoisted but let and const are in a temporal dead zone until initialization.'
  },
  {
    id: 'tech-e2',
    category: 'technical',
    difficulty: 'easy',
    question: 'Explain what an API is and why it\'s important.',
    tips: ['Define API clearly', 'Give practical examples', 'Explain benefits'],
    idealAnswer: 'An API (Application Programming Interface) is a set of rules that allows different software applications to communicate with each other. It\'s important because it enables integration, promotes code reusability, and allows developers to leverage existing services without understanding their internal implementation.'
  },
  // Technical - Medium
  {
    id: 'tech-m1',
    category: 'technical',
    difficulty: 'medium',
    question: 'What is the difference between SQL and NoSQL databases? When would you use each?',
    tips: ['Compare structure', 'Discuss scalability', 'Mention use cases'],
    idealAnswer: 'SQL databases are relational with predefined schemas, ACID compliant, and vertically scalable. NoSQL databases are non-relational with flexible schemas, eventually consistent, and horizontally scalable. Use SQL for complex queries and transactions; use NoSQL for large-scale, rapidly changing data with simple queries.'
  },
  {
    id: 'tech-m2',
    category: 'technical',
    difficulty: 'medium',
    question: 'Explain the concept of Big O notation and why it matters.',
    tips: ['Define time complexity', 'Give examples', 'Explain practical impact'],
    idealAnswer: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity as input size grows. It matters because it helps predict performance at scale and guides optimization decisions. Common complexities include O(1) constant, O(log n) logarithmic, O(n) linear, and O(n²) quadratic.'
  },
  // Behavioral - Easy
  {
    id: 'behav-e1',
    category: 'behavioral',
    difficulty: 'easy',
    question: 'Tell me about yourself.',
    tips: ['Be concise (2-3 minutes)', 'Focus on relevant experience', 'Show enthusiasm'],
    idealAnswer: 'Structure your answer with: present (current role/skills), past (relevant experience), and future (why you\'re interested in this role). Highlight key achievements and align with the position requirements.'
  },
  {
    id: 'behav-e2',
    category: 'behavioral',
    difficulty: 'easy',
    question: 'Why do you want to work for our company?',
    tips: ['Research the company', 'Align with values', 'Be specific'],
    idealAnswer: 'Mention specific aspects of the company (products, culture, mission) that resonate with you. Connect your skills and goals with the company\'s direction. Show genuine interest and enthusiasm.'
  },
  // Behavioral - Medium
  {
    id: 'behav-m1',
    category: 'behavioral',
    difficulty: 'medium',
    question: 'Describe a time when you had to work with a difficult team member.',
    tips: ['Use STAR method', 'Focus on resolution', 'Show maturity'],
    idealAnswer: 'Situation: Describe the context. Task: Your role and challenge. Action: Steps you took to address the issue (communication, empathy, compromise). Result: Positive outcome and lessons learned about teamwork and conflict resolution.'
  },
  {
    id: 'behav-m2',
    category: 'behavioral',
    difficulty: 'medium',
    question: 'Tell me about a time you failed and what you learned from it.',
    tips: ['Choose real failure', 'Take responsibility', 'Emphasize learning'],
    idealAnswer: 'Select a genuine failure where you learned significantly. Explain what went wrong, acknowledge your role, describe concrete steps taken to improve, and show how it made you better. Demonstrate growth mindset and resilience.'
  },
  // Situational - Easy
  {
    id: 'sit-e1',
    category: 'situational',
    difficulty: 'easy',
    question: 'How would you prioritize multiple urgent tasks?',
    tips: ['Show organization skills', 'Mention communication', 'Demonstrate decisiveness'],
    idealAnswer: 'I would assess each task\'s impact and deadline, communicate with stakeholders to clarify priorities, break down large tasks into smaller steps, and focus on high-impact items first while keeping everyone informed of progress.'
  },
  {
    id: 'sit-e2',
    category: 'situational',
    difficulty: 'easy',
    question: 'What would you do if you disagreed with your manager\'s decision?',
    tips: ['Show respect', 'Emphasize communication', 'Be professional'],
    idealAnswer: 'I would respectfully share my perspective with supporting data, listen to their reasoning, and if the decision stands, I would commit to executing it professionally while staying open to feedback and learning.'
  },
  // Situational - Hard
  {
    id: 'sit-h1',
    category: 'situational',
    difficulty: 'hard',
    question: 'How would you handle discovering a major security vulnerability in production code right before a major launch?',
    tips: ['Show technical judgment', 'Balance urgency with thoroughness', 'Consider stakeholders'],
    idealAnswer: 'I would immediately assess the vulnerability\'s severity, inform relevant stakeholders including security and management, recommend delaying launch if it\'s critical, propose a mitigation plan with timeline, and ensure proper testing before deployment. Safety and security take priority over deadlines.'
  }
];

const roles = [
  { value: 'software', label: 'Software Engineer', icon: '💻' },
  { value: 'data', label: 'Data Scientist', icon: '📊' },
  { value: 'product', label: 'Product Manager', icon: '📱' },
  { value: 'design', label: 'UX Designer', icon: '🎨' },
  { value: 'marketing', label: 'Marketing', icon: '📢' },
  { value: 'general', label: 'General Interview', icon: '👔' }
];

export default function InterviewTrainerPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'setup' | 'interview' | 'results'>('setup');
  const [selectedRole, setSelectedRole] = useState('software');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<InterviewSession[]>([]);
  const [stats, setStats] = useState<InterviewStats>({
    totalSessions: 0,
    avgScore: 0,
    bestScore: 0,
    totalQuestions: 0,
    improvementRate: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('cognilearn_interview_history');
    if (saved) {
      const history = JSON.parse(saved);
      setSessionHistory(history);
      calculateStats(history);
    }
  }, []);

  const calculateStats = (history: InterviewSession[]) => {
    if (history.length === 0) return;

    const totalQuestions = history.reduce((sum, s) => sum + s.questions.length, 0);
    const avgScore = history.reduce((sum, s) => sum + s.overallScore, 0) / history.length;
    const bestScore = Math.max(...history.map(s => s.overallScore));

    // Calculate improvement by comparing first half vs second half
    const mid = Math.floor(history.length / 2);
    const firstHalf = history.slice(0, mid);
    const secondHalf = history.slice(mid);
    const firstAvg = firstHalf.reduce((sum, s) => sum + s.overallScore, 0) / Math.max(1, firstHalf.length);
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.overallScore, 0) / Math.max(1, secondHalf.length);
    const improvementRate = Math.max(0, ((secondAvg - firstAvg) / Math.max(1, firstAvg)) * 100);

    setStats({
      totalSessions: history.length,
      avgScore,
      bestScore,
      totalQuestions,
      improvementRate
    });
  };

  const startInterview = () => {
    // Select questions based on difficulty and count
    const filteredQuestions = questionBank.filter(q =>
      difficulty === 'easy' ? q.difficulty === 'easy' :
      difficulty === 'medium' ? q.difficulty === 'easy' || q.difficulty === 'medium' :
      true // hard includes all
    );

    const selected = shuffleArray(filteredQuestions).slice(0, questionCount);
    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setQuestionStartTime(Date.now());
    setPhase('interview');
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const evaluateAnswer = (question: Question, answer: string): Answer => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    // Scoring logic
    let score = 50; // Base score
    const answerLower = answer.toLowerCase();
    const idealLower = question.idealAnswer.toLowerCase();

    // Length check
    if (answer.split(/\s+/).length >= 30) score += 10;
    else if (answer.split(/\s+/).length < 15) score -= 10;

    // Keyword matching from ideal answer
    const keywords = idealLower.split(/\s+/).filter(w => w.length > 5);
    const matchCount = keywords.filter(kw => answerLower.includes(kw)).length;
    score += (matchCount / keywords.length) * 30;

    // Check tips coverage
    const tipsMatched = question.tips.filter(tip => {
      const tipKeywords = tip.toLowerCase().split(/\s+/);
      return tipKeywords.some(kw => answerLower.includes(kw));
    });
    score += (tipsMatched.length / question.tips.length) * 10;

    score = Math.max(0, Math.min(100, score));

    // Generate feedback
    const feedback: string[] = [];
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (score >= 80) {
      strengths.push('Comprehensive and well-structured answer');
      strengths.push('Covered key concepts effectively');
    } else if (score >= 60) {
      strengths.push('Good understanding demonstrated');
      feedback.push('Consider adding more specific examples');
    } else {
      feedback.push('Answer could be more detailed');
      improvements.push('Review the key concepts for this topic');
    }

    if (answer.split(/\s+/).length < 20) {
      improvements.push('Provide more detailed explanations');
    }

    if (timeSpent < 30) {
      feedback.push('Take more time to think through your answer');
    } else if (timeSpent > 180) {
      feedback.push('Try to be more concise in your responses');
    }

    // Category-specific feedback
    if (question.category === 'behavioral') {
      if (!answerLower.includes('situation') && !answerLower.includes('action')) {
        improvements.push('Use the STAR method: Situation, Task, Action, Result');
      }
    }

    return {
      questionId: question.id,
      answer,
      timeSpent,
      score,
      feedback,
      strengths,
      improvements
    };
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const evaluation = evaluateAnswer(currentQuestion, currentAnswer);
    const newAnswers = [...answers, evaluation];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setQuestionStartTime(Date.now());
    } else {
      completeInterview(newAnswers);
    }
  };

  const completeInterview = (finalAnswers: Answer[]) => {
    const overallScore = finalAnswers.reduce((sum, a) => sum + a.score, 0) / finalAnswers.length;
    const totalDuration = finalAnswers.reduce((sum, a) => sum + a.timeSpent, 0);

    const newSession: InterviewSession = {
      id: `interview-${Date.now()}`,
      role: selectedRole,
      difficulty,
      questions,
      answers: finalAnswers,
      overallScore,
      timestamp: Date.now(),
      duration: totalDuration
    };

    const updatedHistory = [newSession, ...sessionHistory].slice(0, 20);
    setSessionHistory(updatedHistory);
    localStorage.setItem('cognilearn_interview_history', JSON.stringify(updatedHistory));
    calculateStats(updatedHistory);

    setPhase('results');
  };

  const reset = () => {
    setPhase('setup');
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setAnswers([]);
    setQuestions([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Phase
  if (phase === 'setup') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-50 p-6 lg:ml-64">
          <div className="max-w-5xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  AI Interview Trainer
                </h1>
                <p className="text-gray-600">Practice interviews with intelligent feedback</p>
              </div>
            </div>

            {/* Stats */}
            {stats.totalSessions > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Sessions</p>
                        <p className="text-2xl font-bold">{stats.totalSessions}</p>
                      </div>
                      <Award className="w-8 h-8 text-sky-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Score</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.avgScore.toFixed(0)}%</p>
                      </div>
                      <Target className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Best Score</p>
                        <p className="text-2xl font-bold text-green-600">{stats.bestScore.toFixed(0)}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Improvement</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.improvementRate.toFixed(0)}%</p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Setup Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Configure Your Interview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Interview Role</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roles.map(role => (
                      <button
                        key={role.value}
                        onClick={() => setSelectedRole(role.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedRole === role.value
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-sky-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{role.icon}</div>
                        <p className="text-sm font-medium">{role.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'easy', label: 'Beginner', desc: 'Basic questions' },
                      { value: 'medium', label: 'Intermediate', desc: 'Mixed difficulty' },
                      { value: 'hard', label: 'Advanced', desc: 'Challenging questions' }
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setDifficulty(value as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          difficulty === value
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-sky-300'
                        }`}
                      >
                        <p className="font-semibold mb-1">{label}</p>
                        <p className="text-xs text-gray-600">{desc}</p>
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
                    min="3"
                    max="10"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3 (Quick)</span>
                    <span>5 (Standard)</span>
                    <span>10 (Comprehensive)</span>
                  </div>
                </div>

                <Button
                  onClick={startInterview}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Interview Phase
  if (phase === 'interview') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-50 p-6 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentQuestion.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                    currentQuestion.category === 'behavioral' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {currentQuestion.category.toUpperCase()}
                  </span>
                </div>
                <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-sky-50 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sky-800 mb-2">Tips for a great answer:</p>
                      <ul className="space-y-1">
                        {currentQuestion.tips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-sky-700">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Your Answer</label>
                  <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Take your time and be thorough."
                    className="min-h-64 text-base"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      {currentAnswer.split(/\s+/).filter(w => w).length} words
                    </p>
                    <p className="text-sm text-gray-500">
                      Time: {formatTime((Date.now() - questionStartTime) / 1000)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="w-full mt-6 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-6 text-lg"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Results Phase
  if (phase === 'results') {
    const session = sessionHistory[0]; // Most recent
    const overallScore = session.overallScore;

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-50 p-6 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-500 rounded-full mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Interview Complete!
              </h1>
              <p className="text-gray-600">Here's your detailed performance analysis</p>
            </div>

            {/* Overall Score */}
            <Card className="mb-6">
              <CardContent className="py-12 text-center">
                <div className={`text-6xl font-bold mb-4 ${
                  overallScore >= 80 ? 'text-green-600' :
                  overallScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {overallScore.toFixed(0)}%
                </div>
                <p className="text-xl font-semibold mb-2">
                  {overallScore >= 80 ? 'Excellent Performance!' :
                   overallScore >= 60 ? 'Good Job!' :
                   'Keep Practicing!'}
                </p>
                <p className="text-gray-600">
                  {session.questions.length} questions • {formatTime(session.duration)}
                </p>
              </CardContent>
            </Card>

            {/* Question-by-Question Results */}
            <div className="space-y-4 mb-6">
              {session.questions.map((question, idx) => {
                const answer = session.answers[idx];
                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold">Q{idx + 1}.</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              question.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                              question.category === 'behavioral' ? 'bg-purple-100 text-purple-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {question.category}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{question.question}</CardTitle>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-3xl font-bold ${
                            answer.score >= 80 ? 'text-green-600' :
                            answer.score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {answer.score.toFixed(0)}
                          </div>
                          <p className="text-xs text-gray-500">{formatTime(answer.timeSpent)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {answer.strengths.length > 0 && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-green-800 mb-1">Strengths</p>
                              <ul className="text-sm text-green-700 space-y-1">
                                {answer.strengths.map((s, i) => (
                                  <li key={i}>• {s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      {answer.improvements.length > 0 && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-yellow-800 mb-1">Areas to Improve</p>
                              <ul className="text-sm text-yellow-700 space-y-1">
                                {answer.improvements.map((i, idx) => (
                                  <li key={idx}>• {i}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                      {answer.feedback.length > 0 && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-blue-800 mb-1">Feedback</p>
                              <ul className="text-sm text-blue-700 space-y-1">
                                {answer.feedback.map((f, i) => (
                                  <li key={i}>• {f}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={reset} className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
              <Button onClick={() => navigate('/ai-tools')} variant="outline">
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
