import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { ArrowLeft, Brain, Clock, Lightbulb, RotateCcw, Play, Pause, CheckCircle2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const spacedRepetitionCards = [
  { term: 'Variable', nextReview: 'Today', mastery: 80 },
  { term: 'Function', nextReview: 'Tomorrow', mastery: 65 },
  { term: 'Loop', nextReview: 'In 3 days', mastery: 90 },
  { term: 'Array', nextReview: 'In 1 week', mastery: 95 },
];

const memoryTricks = [
  {
    topic: 'OSI Model Layers',
    mnemonic: 'Please Do Not Throw Sausage Pizza Away',
    meaning: 'Physical, Data Link, Network, Transport, Session, Presentation, Application',
  },
  {
    topic: 'Order of Operations',
    mnemonic: 'PEMDAS - Please Excuse My Dear Aunt Sally',
    meaning: 'Parentheses, Exponents, Multiplication, Division, Addition, Subtraction',
  },
  {
    topic: 'Planets Order',
    mnemonic: 'My Very Educated Mother Just Served Us Noodles',
    meaning: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune',
  },
];

export default function CognitiveToolsPage() {
  const navigate = useNavigate();
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [customMinutes, setCustomMinutes] = useState('25');
  const [showSettings, setShowSettings] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prevTime) => {
          if (prevTime <= 1) {
            setIsPomodoroActive(false);
            // Play notification sound or show alert
            toast.success(
              sessionType === 'work'
                ? '🎉 Work session complete! Time for a break.'
                : '✨ Break over! Ready to focus again?',
              { duration: 5000 }
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroActive, pomodoroTime, sessionType]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomTimeChange = () => {
    const minutes = parseInt(customMinutes);
    if (isNaN(minutes) || minutes < 1 || minutes > 120) {
      toast.error('Please enter a valid time between 1-120 minutes');
      return;
    }
    const newTime = minutes * 60;
    setPomodoroTime(newTime);
    setInitialTime(newTime);
    setShowSettings(false);
    toast.success(`Timer set to ${minutes} minutes`);
  };

  const handlePresetTime = (minutes: number, type: 'work' | 'break') => {
    const newTime = minutes * 60;
    setPomodoroTime(newTime);
    setInitialTime(newTime);
    setSessionType(type);
    setIsPomodoroActive(false);
    toast.success(`${type === 'work' ? 'Work' : 'Break'} session set to ${minutes} minutes`);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cognitive Tools Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Enhance your learning with science-backed techniques</p>
          </div>

          {/* Pomodoro Timer */}
          <Card className="shadow-lg border-0 mb-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Focus Timer (Pomodoro)
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    {sessionType === 'work' ? 'Focus session' : 'Break time'} • Customizable duration
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showSettings ? 'Hide' : 'Settings'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  {sessionType === 'work' ? '🎯 Work Session' : '☕ Break Time'}
                </Badge>
                <div className="text-7xl font-bold mb-4">{formatTime(pomodoroTime)}</div>

                {/* Progress bar */}
                <div className="mb-6 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${(pomodoroTime / initialTime) * 100}%` }}
                  />
                </div>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="mb-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <h4 className="font-semibold mb-3">Quick Presets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePresetTime(25, 'work')}
                      >
                        25 min Work
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePresetTime(5, 'break')}
                      >
                        5 min Break
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePresetTime(50, 'work')}
                      >
                        50 min Work
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePresetTime(10, 'break')}
                      >
                        10 min Break
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(e.target.value)}
                        placeholder="Custom minutes"
                        className="flex-1 bg-white/90 text-gray-900"
                      />
                      <Select
                        value={sessionType}
                        onValueChange={(value: 'work' | 'break') => setSessionType(value)}
                      >
                        <SelectTrigger className="w-32 bg-white/90 text-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="break">Break</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCustomTimeChange}
                      >
                        Set
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setIsPomodoroActive(!isPomodoroActive)}
                    disabled={pomodoroTime === 0}
                  >
                    {isPomodoroActive ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        {pomodoroTime === 0 ? 'Completed' : 'Start'}
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => {
                      setPomodoroTime(initialTime);
                      setIsPomodoroActive(false);
                    }}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
                <div className="mt-4 text-sm text-purple-100">
                  {isPomodoroActive
                    ? `${sessionType === 'work' ? 'Stay focused!' : 'Enjoy your break!'} • ${formatTime(pomodoroTime)} remaining`
                    : pomodoroTime === 0
                    ? 'Session complete! 🎉'
                    : 'Press Start to begin your session'}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Spaced Repetition Tracker */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  Spaced Repetition Tracker
                </CardTitle>
                <CardDescription>Review concepts at optimal intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spacedRepetitionCards.map((card, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{card.term}</h4>
                          <p className="text-sm text-gray-600">Next review: {card.nextReview}</p>
                        </div>
                        <Badge variant={card.nextReview === 'Today' ? 'default' : 'outline'}>
                          {card.nextReview === 'Today' ? 'Due Now' : 'Scheduled'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Mastery</span>
                          <span className="font-semibold text-purple-600">{card.mastery}%</span>
                        </div>
                        <Progress value={card.mastery} className="h-2" />
                      </div>
                      {card.nextReview === 'Today' && (
                        <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600">
                          Review Now
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Recall Quiz */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Active Recall Quiz
                </CardTitle>
                <CardDescription>Test your knowledge without looking at notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <h4 className="font-semibold mb-3">Question: What is a variable in programming?</h4>
                    <div className="space-y-2">
                      {['A container for storing data', 'A type of loop', 'A function parameter', 'A constant value'].map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveQuizIndex(index)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              activeQuizIndex === index
                                ? index === 0
                                  ? 'bg-green-100 border-green-500'
                                  : 'bg-red-100 border-red-500'
                                : 'bg-white border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            {option}
                            {activeQuizIndex === index && index === 0 && (
                              <CheckCircle2 className="inline ml-2 w-4 h-4 text-green-600" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                    {activeQuizIndex !== null && (
                      <div className="mt-3 text-sm">
                        {activeQuizIndex === 0 ? (
                          <p className="text-green-700">✅ Correct! A variable stores data that can change.</p>
                        ) : (
                          <p className="text-red-700">❌ Try again. Think about what stores data.</p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Next Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Memory Tricks Section */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Memory Tricks & Mnemonics
              </CardTitle>
              <CardDescription>Remember complex concepts with simple phrases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {memoryTricks.map((trick, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-lg mb-2 text-yellow-800">{trick.topic}</h4>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-yellow-600 mb-1">"{trick.mnemonic}"</p>
                    </div>
                    <p className="text-sm text-gray-700">{trick.meaning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Explain Like a Child Feature */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                "Explain Like a Child" Feature
              </CardTitle>
              <CardDescription>Complex topics explained in the simplest way possible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">🧒 What is Recursion?</h4>
                  <p className="text-gray-700">
                    Imagine you're standing between two mirrors. You see yourself, then you see yourself in the mirror
                    behind you, and again and again! That's recursion - when something refers to itself. In programming,
                    it's when a function calls itself to solve a problem step by step.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900 mb-2">🧒 What is an Algorithm?</h4>
                  <p className="text-gray-700">
                    Think of making a sandwich. You follow steps: get bread, add peanut butter, add jelly, close sandwich.
                    An algorithm is just a set of steps to solve a problem, like a recipe!
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Request Simple Explanation for Another Topic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}