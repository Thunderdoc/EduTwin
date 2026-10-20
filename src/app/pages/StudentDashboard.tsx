import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { 
  Brain, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Wifi,
  WifiOff,
  Target,
  Award,
  Activity,
  GraduationCap,
  Sparkles,
  Settings,
  Crown,
  Flame,
  Clock,
  Play,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState, useEffect } from 'react';
import { curriculumForGrade } from '../lib/schoolCurriculum';

const learningProgressData = [
  { day: 'Mon', score: 65, id: 'mon' },
  { day: 'Tue', score: 72, id: 'tue' },
  { day: 'Wed', score: 68, id: 'wed' },
  { day: 'Thu', score: 78, id: 'thu' },
  { day: 'Fri', score: 85, id: 'fri' },
  { day: 'Sat', score: 82, id: 'sat' },
  { day: 'Sun', score: 88, id: 'sun' },
];

const cognitiveData = [
  { subject: 'Memory', score: 85, id: 'memory' },
  { subject: 'Attention', score: 78, id: 'attention' },
  { subject: 'Confidence', score: 92, id: 'confidence' },
  { subject: 'Speed', score: 74, id: 'speed' },
  { subject: 'Comprehension', score: 88, id: 'comprehension' },
];

export default function StudentDashboard() {
  const { isOnline, language, userProfile, userPreferences, learnerProfile, selectedSubjects } = useApp();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Daily plan is derived from the assigned learner class and subjects.
  const assignedCurriculum = curriculumForGrade(learnerProfile?.grade ?? 6);
  const assignedSubjects = selectedSubjects.length ? selectedSubjects : Object.keys(assignedCurriculum.subjects);
  const todaysPlan = assignedSubjects.slice(0, 3).map((subject, index) => ({
    id: index + 1,
    subject,
    topic: (assignedCurriculum.subjects[subject] || ['Foundations and practice'])[index % (assignedCurriculum.subjects[subject]?.length || 1)],
    duration: Math.max(10, Math.round(userPreferences.dailyGoalMinutes / Math.min(4, assignedSubjects.length + 1))),
    completed: false,
    icon: ['📘', '🧠', '✍️'][index],
  })).concat([{ id: 4, subject: 'Review', topic: 'Knowledge check and spaced revision', duration: 10, completed: false, icon: '📝' }]);

  const completedTasks = todaysPlan.filter(t => t.completed).length;
  const totalTasks = todaysPlan.length;
  const dailyProgress = (completedTasks / totalTasks) * 100;
  const totalMinutes = todaysPlan.reduce((sum, t) => sum + t.duration, 0);
  const completedMinutes = todaysPlan.filter(t => t.completed).reduce((sum, t) => sum + t.duration, 0);

  // Streak data
  const streakDays = 12;
  const longestStreak = 28;

  // Weak areas
  const weakAreas = [
    { topic: 'Thermodynamics', score: 58, recommendation: '20 min revision suggested' },
    { topic: 'Organic Chemistry', score: 62, recommendation: 'Watch video tutorial' },
  ];

  // Recommended topics
  const recommendations = [
    { title: 'Advanced Calculus', reason: 'Based on your strong algebra performance', icon: '📈' },
    { title: 'Quantum Physics', reason: 'Next in your learning path', icon: '⚛️' },
  ];

  // Get greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Overall progress calculation (mock)
  const overallProgress = 67;

  const riskLevel = 'Low';
  const riskColor = riskLevel === 'Low' ? 'bg-green-500' : riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header with Greeting */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getGreeting()}, {userProfile?.name || 'Alex'}! {getGreeting() === 'Good Morning' ? '🌅' : getGreeting() === 'Good Afternoon' ? '☀️' : '🌙'}
              </h1>
              <p className="text-gray-600 mt-2">Ready to continue your learning journey?</p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              {learnerProfile && <Badge variant="outline" className="bg-white px-4 py-2"><GraduationCap className="mr-2 size-4 text-purple-600" />{learnerProfile.grade === 0 ? 'Pre-primary' : `Class ${learnerProfile.grade}`} · {learnerProfile.board}</Badge>}
              <Badge variant={isOnline ? "default" : "destructive"} className="px-4 py-2">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Online Mode
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    Offline Mode
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                {language}
              </Badge>
            </div>
          </div>

          {/* Offline Banner */}
          {!isOnline && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6 flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-800">Offline Mode Active</p>
                <p className="text-sm text-orange-600">Limited features available. Connect to internet for full experience.</p>
              </div>
            </div>
          )}

          {/* NEW: Cognitive Learning Engine Hero Card */}
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 text-white mb-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center relative">
                    <Brain className="w-12 h-12 text-white" />
                    <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-400 text-purple-900 font-bold">NEW</Badge>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white font-bold">Revolutionary</Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      Cognitive Learning Engine
                      <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                    </h2>
                    <p className="text-white/95 mb-3 max-w-2xl font-medium">
                      "We don't personalize content — we personalize cognition." Advanced AI that learns how YOUR brain works.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                        <Brain className="w-4 h-4" />
                        <span>Learning DNA</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                        <Activity className="w-4 h-4" />
                        <span>Error Intelligence</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                        <Target className="w-4 h-4" />
                        <span>Path Simulation</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate('/cognitive-learning')}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try Next-Gen AI
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Autonomous Learning Hero Card */}
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white mb-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
            <CardContent className="pt-6 pb-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      Autonomous Learning System
                      <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                    </h2>
                    <p className="text-white/90 mb-3 max-w-2xl">
                      One button. Zero decisions. Pure learning. Our AI automatically selects topics, teaches, tests, and adapts—all on its own.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        <span>Behavior-Driven</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        <span>Real-Time Adaptation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Concept Mastery</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate('/autonomous-learning')}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Smart Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Today's Learning Plan - Left Column */}
            <Card className="lg:col-span-2 shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Today's Learning Plan
                    </CardTitle>
                    <CardDescription>
                      {completedTasks} of {totalTasks} tasks completed • {completedMinutes}/{totalMinutes} min
                    </CardDescription>
                  </div>
                  <div className="relative w-20 h-20">
                    {/* Progress Circle */}
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - dailyProgress / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">{Math.round(dailyProgress)}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysPlan.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        task.completed
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl">{task.icon}</div>
                      <div className="flex-1">
                        <p className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.subject} - {task.topic}
                        </p>
                        <p className="text-sm text-gray-600">{task.duration} minutes</p>
                      </div>
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          onClick={() => navigate('/adaptive-learning')}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Stats & Streak */}
            <div className="space-y-6">
              {/* Streak Card */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Flame className="w-16 h-16 mx-auto mb-3 text-yellow-300" />
                    <p className="text-5xl font-bold mb-2">{streakDays}</p>
                    <p className="text-white/90 mb-1">Day Streak! 🔥</p>
                    <p className="text-sm text-white/70">Longest: {longestStreak} days</p>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-xs text-white/80">Keep it going! Study today to maintain your streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Ring Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-center">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mx-auto w-40 h-40">
                    {/* Large Progress Circle */}
                    <svg className="transform -rotate-90 w-40 h-40">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#gradient2)"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallProgress / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {overallProgress}%
                      </span>
                      <span className="text-xs text-gray-500">Complete</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">12</p>
                      <p className="text-xs text-gray-600">Mastered</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">8</p>
                      <p className="text-xs text-gray-600">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => navigate('/adaptive-learning')}
                >
                  <Play className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-semibold">Continue Learning</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => navigate('/ai-tools/quiz-generator')}
                >
                  <Target className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-semibold">Take Quiz</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300"
                  onClick={() => navigate('/ai-chat')}
                >
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold">Ask Doubt</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300"
                  onClick={() => navigate('/knowledge-graph')}
                >
                  <Brain className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-semibold">Knowledge Map</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weak Areas Alert & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Weak Areas */}
            <Card className="shadow-lg border-0 border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  Areas Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weakAreas.map((area, idx) => (
                    <div key={idx} className="p-4 bg-orange-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{area.topic}</p>
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {area.score}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{area.recommendation}</p>
                      <Button
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Start Revision
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Topics */}
            <Card className="shadow-lg border-0 border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Sparkles className="w-5 h-5" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl">{rec.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{rec.title}</p>
                          <p className="text-sm text-gray-600">{rec.reason}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        onClick={() => navigate('/subjects')}
                      >
                        Explore <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Digital Twin & Overview Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Digital Twin Avatar Card */}
            <Card className="lg:col-span-1 shadow-lg border-0 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Your Digital Twin
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <Brain className="w-16 h-16 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Alex's AI Twin</h3>
                <p className="text-purple-100 text-center text-sm mb-4">
                  Your personalized learning companion analyzing your progress 24/7
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/digital-twin')}
                >
                  View Twin Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Risk Level & Quick Stats */}
            <Card className="lg:col-span-2 shadow-lg border-0">
              <CardHeader>
                <CardTitle>Learning Overview</CardTitle>
                <CardDescription>Your current performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">85%</p>
                    <p className="text-sm text-gray-600">Overall Score</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-600">Topics Mastered</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">24h</p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold">Risk Level</p>
                      <p className="text-sm text-gray-600">Performance indicator</p>
                    </div>
                  </div>
                  <Badge className={`${riskColor} text-white px-4 py-1`}>
                    {riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Progress Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Learning Progress (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} key="learning-progress-chart">
                  <LineChart
                    data={learningProgressData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    id="learning-progress-line-chart"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-1" />
                    <XAxis dataKey="day" stroke="#6b7280" key="xaxis-1" />
                    <YAxis stroke="#6b7280" key="yaxis-1" />
                    <Tooltip key="tooltip-1" />
                    <Line
                      key="line-1"
                      type="monotone"
                      dataKey="score"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={false}
                      animationDuration={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cognitive Metrics */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Cognitive Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} key="cognitive-radar-chart">
                  <RadarChart
                    data={cognitiveData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    id="cognitive-radar-chart"
                  >
                    <PolarGrid stroke="#e5e7eb" key="polar-grid-1" />
                    <PolarAngleAxis dataKey="subject" stroke="#6b7280" key="polar-angle-1" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} key="polar-radius-1" />
                    <Radar
                      key="radar-1"
                      name="Score"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                      isAnimationActive={false}
                      animationDuration={0}
                    />
                    <Tooltip
                      key="tooltip-2"
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                              <p className="text-sm font-semibold">{payload[0].payload.subject}</p>
                              <p className="text-sm text-purple-600">{payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle>Strengths & Weaknesses</CardTitle>
              <CardDescription>Areas of excellence and improvement opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Strengths
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Problem Solving</span>
                      <Progress value={92} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Logical Thinking</span>
                      <Progress value={88} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span>Quick Learning</span>
                      <Progress value={85} className="w-24 h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Areas to Improve
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span>Advanced Calculus</span>
                      <Progress value={62} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span>Memory Retention</span>
                      <Progress value={68} className="w-24 h-2" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span>Essay Writing</span>
                      <Progress value={58} className="w-24 h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Button 
              size="lg" 
              className="h-24 text-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              onClick={() => navigate('/subjects')}
            >
              <GraduationCap className="w-6 h-6 mr-3" />
              Select Subjects
            </Button>
            <Button 
              size="lg" 
              className="h-24 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/adaptive-learning')}
            >
              <BookOpen className="w-6 h-6 mr-3" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-24 text-lg border-2 border-purple-300 hover:bg-purple-50"
              onClick={() => navigate('/ai-chat')}
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Ask AI Assistant
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-24 text-lg border-2 border-blue-300 hover:bg-blue-50"
              onClick={() => navigate('/timetable')}
            >
              <Calendar className="w-6 h-6 mr-3" />
              View Timetable
            </Button>
          </div>

          {/* AI Tools Banner */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden mb-6">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8" />
                  <h3 className="text-3xl font-bold">15 AI-Powered Learning Tools</h3>
                </div>
                <p className="text-purple-100 mb-6 text-lg">
                  Unlock the power of AI with Quiz Generator, Code Playground, Math Solver, and 12 more advanced tools!
                </p>
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  onClick={() => navigate('/ai-tools')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore AI Tools Hub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}