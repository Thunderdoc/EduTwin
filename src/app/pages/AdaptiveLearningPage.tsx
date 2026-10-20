import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { ArrowLeft, CheckCircle2, Circle, Lock, BookOpen, Zap, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const learningPath = [
  { id: 1, title: 'Introduction to Variables', status: 'completed', difficulty: 'beginner' },
  { id: 2, title: 'Data Types', status: 'completed', difficulty: 'beginner' },
  { id: 3, title: 'Control Flow', status: 'current', difficulty: 'intermediate' },
  { id: 4, title: 'Functions', status: 'next', difficulty: 'intermediate' },
  { id: 5, title: 'Object-Oriented Programming', status: 'locked', difficulty: 'advanced' },
  { id: 6, title: 'Error Handling', status: 'locked', difficulty: 'advanced' },
];

export default function AdaptiveLearningPage() {
  const navigate = useNavigate();
  const [learnerMode, setLearnerMode] = useState<'slow' | 'fast'>('fast');
  const [showConcepts, setShowConcepts] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);

  const handleStartChallenge = () => {
    setChallengeStarted(true);
    toast.success('Challenge Started!', {
      description: 'Complete 10 control flow problems. Timer started!',
    });
    // Here you can add navigation to a challenge page or open a challenge modal
    // navigate('/challenge/control-flow');
  };

  const handleViewConcepts = () => {
    setShowConcepts(!showConcepts);
    if (!showConcepts) {
      toast.info('Viewing Concepts', {
        description: 'Study the key concepts before starting the challenge',
      });
    }
  };

  const handleReview = (topicTitle: string) => {
    toast.success(`Opening review for "${topicTitle}"`);
    navigate('/ai-tools/quiz-generator', { state: { topic: topicTitle } });
  };

  const handleContinue = (topicTitle: string) => {
    toast.success(`Continuing with "${topicTitle}"`);
    navigate('/autonomous-learning', { state: { topic: topicTitle } });
  };

  const handlePreview = (topicTitle: string) => {
    toast.info(`Previewing "${topicTitle}"`);
    // Could navigate to a preview page or show a modal
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Adaptive Learning Path
                </h1>
                <p className="text-gray-600 mt-2">Personalized curriculum based on your learning style</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={learnerMode === 'slow' ? 'default' : 'outline'}
                  onClick={() => setLearnerMode('slow')}
                  className={learnerMode === 'slow' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Step-by-Step
                </Button>
                <Button
                  variant={learnerMode === 'fast' ? 'default' : 'outline'}
                  onClick={() => setLearnerMode('fast')}
                  className={learnerMode === 'fast' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Challenge Mode
                </Button>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle>Course: Python Programming Fundamentals</CardTitle>
              <CardDescription>Your personalized learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-2xl font-bold text-purple-600">33%</span>
                </div>
                <Progress value={33} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>2 of 6 topics completed</span>
                  <span>Estimated completion: 3 weeks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Path Timeline */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Your Learning Timeline
              </CardTitle>
              <CardDescription>
                {learnerMode === 'slow' 
                  ? 'Step-by-step approach with detailed explanations'
                  : 'Fast-paced learning with challenging exercises'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPath.map((topic, index) => (
                  <div key={topic.id} className="relative">
                    {/* Connector Line */}
                    {index < learningPath.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                    )}
                    
                    <div
                      className={`flex gap-4 p-4 rounded-lg transition-all ${
                        topic.status === 'completed'
                          ? 'bg-green-50 border border-green-200'
                          : topic.status === 'current'
                          ? 'bg-purple-50 border-2 border-purple-400 shadow-lg'
                          : topic.status === 'next'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 border border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {topic.status === 'completed' ? (
                          <CheckCircle2 className="w-12 h-12 text-green-500" />
                        ) : topic.status === 'locked' ? (
                          <Lock className="w-12 h-12 text-gray-400" />
                        ) : (
                          <Circle className={`w-12 h-12 ${
                            topic.status === 'current' ? 'text-purple-500' : 'text-blue-500'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{topic.title}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={
                                  topic.difficulty === 'beginner'
                                    ? 'border-green-500 text-green-700'
                                    : topic.difficulty === 'intermediate'
                                    ? 'border-blue-500 text-blue-700'
                                    : 'border-purple-500 text-purple-700'
                                }
                              >
                                {topic.difficulty}
                              </Badge>
                              {topic.status === 'current' && (
                                <Badge className="bg-purple-500">Current</Badge>
                              )}
                              {topic.status === 'next' && (
                                <Badge variant="outline">Next Up</Badge>
                              )}
                            </div>
                          </div>
                          
                          {topic.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReview(topic.title)}
                            >
                              Review
                            </Button>
                          )}
                          {topic.status === 'current' && (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-purple-600"
                              onClick={() => handleContinue(topic.title)}
                            >
                              Continue
                            </Button>
                          )}
                          {topic.status === 'next' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(topic.title)}
                            >
                              Preview
                            </Button>
                          )}
                        </div>
                        
                        {/* Content based on learner mode */}
                        {topic.status === 'current' && (
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            {learnerMode === 'slow' ? (
                              <div>
                                <h4 className="font-semibold mb-2">Step-by-Step Learning</h4>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Watch introduction video (5 min)</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-purple-500" />
                                    <span>Read detailed explanation with examples</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-gray-400" />
                                    <span>Practice with guided exercises</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-gray-400" />
                                    <span>Take quiz to test understanding</span>
                                  </li>
                                </ul>
                              </div>
                            ) : (
                              <div>
                                <h4 className="font-semibold mb-2">Challenge Mode</h4>
                                <div className="space-y-2">
                                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-sm font-medium text-yellow-800">⚡ Quick Challenge</p>
                                    <p className="text-sm text-yellow-700">
                                      Complete 10 control flow problems in under 30 minutes
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                                      onClick={handleStartChallenge}
                                      disabled={challengeStarted}
                                    >
                                      {challengeStarted ? 'Challenge In Progress...' : 'Start Challenge'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={handleViewConcepts}
                                    >
                                      {showConcepts ? 'Hide Concepts' : 'View Concepts'}
                                    </Button>
                                  </div>

                                  {/* Concepts Section */}
                                  {showConcepts && (
                                    <div className="mt-4 p-4 bg-white border-2 border-purple-200 rounded-lg">
                                      <h5 className="font-bold text-purple-700 mb-3">Key Concepts: Control Flow</h5>
                                      <div className="space-y-3 text-sm">
                                        <div>
                                          <p className="font-semibold text-blue-700">1. If/Else Statements</p>
                                          <p className="text-gray-600 ml-4">Execute different code blocks based on conditions</p>
                                          <code className="block mt-1 ml-4 p-2 bg-gray-100 rounded text-xs">
                                            if condition:<br/>
                                            &nbsp;&nbsp;# do something<br/>
                                            else:<br/>
                                            &nbsp;&nbsp;# do something else
                                          </code>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-blue-700">2. Loops (for/while)</p>
                                          <p className="text-gray-600 ml-4">Repeat actions multiple times</p>
                                          <code className="block mt-1 ml-4 p-2 bg-gray-100 rounded text-xs">
                                            for i in range(5):<br/>
                                            &nbsp;&nbsp;print(i)
                                          </code>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-blue-700">3. Break and Continue</p>
                                          <p className="text-gray-600 ml-4">Control loop execution flow</p>
                                        </div>
                                        <Button
                                          size="sm"
                                          className="mt-2 w-full bg-purple-600"
                                          onClick={() => {
                                            toast.success('Opening detailed tutorial...');
                                            // Navigate to detailed concepts page
                                          }}
                                        >
                                          View Full Tutorial
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Challenge Progress */}
                                  {challengeStarted && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg">
                                      <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-bold text-blue-700">Challenge Progress</h5>
                                        <span className="text-2xl font-bold text-purple-600">0/10</span>
                                      </div>
                                      <Progress value={0} className="h-2 mb-2" />
                                      <div className="flex justify-between text-xs text-gray-600 mb-3">
                                        <span>Problems Solved: 0</span>
                                        <span>Time Remaining: 30:00</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                                          onClick={() => {
                                            toast.info('Opening problem #1...');
                                            // Navigate to first problem
                                          }}
                                        >
                                          Begin Problem #1
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setChallengeStarted(false);
                                            toast.info('Challenge paused');
                                          }}
                                        >
                                          Pause
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-700">Master Current Topic</p>
                    <p className="text-sm text-blue-600">Achieve 80% on practice quiz</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-semibold text-purple-700">Preview Next Topic</p>
                    <p className="text-sm text-purple-600">Get familiar with functions</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-700">Review Fundamentals</p>
                    <p className="text-sm text-green-600">Strengthen your foundation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Learning Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>💡</span>
                    </div>
                    <div>
                      <p className="font-medium">Practice Daily</p>
                      <p className="text-sm text-gray-600">15-30 minutes of coding every day</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>🎯</span>
                    </div>
                    <div>
                      <p className="font-medium">Focus on Understanding</p>
                      <p className="text-sm text-gray-600">Don't just memorize, understand why</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>🔄</span>
                    </div>
                    <div>
                      <p className="font-medium">Review Regularly</p>
                      <p className="text-sm text-gray-600">Revisit completed topics weekly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}