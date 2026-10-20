import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
  bookmarked?: boolean;
}

export default function QuizGeneratorPage() {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState('5');
  const [quizType, setQuizType] = useState('multiple-choice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Question templates for variety
    const questionTemplates = [
      `What is the primary purpose of {topic}?`,
      `Which of the following best describes {topic}?`,
      `How does {topic} contribute to its field?`,
      `What are the key characteristics of {topic}?`,
      `Which statement about {topic} is most accurate?`,
      `What is the main advantage of using {topic}?`,
      `In what scenario would you apply {topic}?`,
      `What fundamental principle underlies {topic}?`,
      `Which concept is closely related to {topic}?`,
      `What distinguishes {topic} from similar concepts?`,
      `What is the historical significance of {topic}?`,
      `How has {topic} evolved over time?`,
      `What problem does {topic} solve?`,
      `Which component is essential to {topic}?`,
      `What is the correct implementation of {topic}?`
    ];
    
    const answerPrefixes = [
      ['It enables', 'It provides', 'It creates', 'It manages'],
      ['The system that', 'The process of', 'The method for', 'The framework of'],
      ['Through efficient', 'By implementing', 'Via structured', 'Using optimized'],
      ['Scalability, reliability', 'Efficiency, accuracy', 'Flexibility, performance', 'Security, stability'],
      ['Primary focus on', 'Core emphasis on', 'Main priority is', 'Key objective is'],
      ['Improved performance', 'Better scalability', 'Enhanced security', 'Greater flexibility'],
      ['Data processing', 'System integration', 'User interaction', 'Resource management'],
      ['Separation of concerns', 'Modularity and reusability', 'Abstraction and encapsulation', 'Efficiency and optimization'],
      ['Data structures', 'Algorithms', 'Design patterns', 'Programming paradigms'],
      ['Its unique approach', 'Its specific implementation', 'Its particular methodology', 'Its distinct architecture']
    ];
    
    // Simulate API call
    setTimeout(() => {
      const mockQuestions: Question[] = Array.from({ length: parseInt(numQuestions) }, (_, i) => {
        const templateIndex = i % questionTemplates.length;
        const template = questionTemplates[templateIndex];
        const questionText = template.replace('{topic}', topic);
        
        // Generate varied options based on difficulty
        const correctIndex = Math.floor(Math.random() * 4);
        const answerSet = answerPrefixes[i % answerPrefixes.length];
        
        const options = [
          `${answerSet[0]} ${topic.toLowerCase()} functionality`,
          `${answerSet[1]} ${topic.toLowerCase()} operations`,
          `${answerSet[2]} ${topic.toLowerCase()} processes`,
          `${answerSet[3]} ${topic.toLowerCase()} mechanisms`
        ];
        
        return {
          id: i + 1,
          question: questionText,
          options: options,
          correctAnswer: correctIndex,
          explanation: `This answer correctly identifies the key aspect of ${topic}. ${options[correctIndex]} represents the fundamental concept that ${difficulty === 'easy' ? 'beginners' : difficulty === 'medium' ? 'intermediate learners' : 'advanced students'} should understand.`
        };
      });
      
      setQuestions(mockQuestions);
      setIsGenerating(false);
      setShowResults(false);
    }, 2000);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, userAnswer: answerIndex } : q
    ));
  };

  const submitQuiz = () => {
    const correctAnswers = questions.filter(q => q.userAnswer === q.correctAnswer).length;
    setScore((correctAnswers / questions.length) * 100);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setShowResults(false);
    setScore(0);
    setTopic('');
  };

  const toggleBookmark = (questionId: number) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, bookmarked: !q.bookmarked } : q
    ));
    const question = questions.find(q => q.id === questionId);
    if (question?.bookmarked) {
      toast.success('Bookmark removed');
    } else {
      toast.success('Question bookmarked for later review');
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-6 lg:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Quiz Generator
                </h1>
                <p className="text-gray-600">Generate custom quizzes on any topic instantly</p>
              </div>
            </div>
          </div>

          {/* Generator Form */}
          {questions.length === 0 && (
            <Card className="shadow-lg border-0 mb-6">
              <CardHeader>
                <CardTitle>Create Your Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <Input
                    placeholder="e.g., Python Programming, World War 2, Photosynthesis"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Questions</label>
                    <Select value={numQuestions} onValueChange={setNumQuestions}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quiz Type</label>
                    <Select value={quizType} onValueChange={setQuizType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={generateQuiz}
                  disabled={isGenerating || !topic.trim() || !isOnline}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Quiz with AI
                    </>
                  )}
                </Button>
                {!isOnline && (
                  <p className="text-sm text-orange-600 text-center">Internet connection required for AI generation</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quiz Questions */}
          {questions.length > 0 && !showResults && (
            <>
              <Card className="shadow-lg border-0 mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Quiz: {topic}</CardTitle>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                      {difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((q) => (
                    <div key={q.id} className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg flex-1">
                          Question {q.id}: {q.question}
                        </h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleBookmark(q.id)}
                          className="ml-2"
                        >
                          {q.bookmarked ? (
                            <BookmarkCheck className="w-5 h-5 text-purple-600 fill-purple-600" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-gray-400 hover:text-purple-600" />
                          )}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {q.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={q.userAnswer === index ? "default" : "outline"}
                            className={`w-full justify-start text-left ${
                              q.userAnswer === index ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''
                            }`}
                            onClick={() => handleAnswerSelect(q.id, index)}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={submitQuiz}
                  disabled={questions.some(q => q.userAnswer === undefined)}
                >
                  Submit Quiz
                </Button>
                <Button variant="outline" onClick={resetQuiz}>
                  Reset
                </Button>
              </div>
            </>
          )}

          {/* Results */}
          {showResults && (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-center">Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold mb-2 ${
                    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {score.toFixed(0)}%
                  </div>
                  <p className="text-gray-600">
                    {questions.filter(q => q.userAnswer === q.correctAnswer).length} out of {questions.length} correct
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {questions.map((q) => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3 mb-2">
                        {q.userAnswer === q.correctAnswer ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{q.question}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Your answer:</strong> {q.options[q.userAnswer!]}
                          </p>
                          {q.userAnswer !== q.correctAnswer && (
                            <p className="text-sm text-green-600 mb-2">
                              <strong>Correct answer:</strong> {q.options[q.correctAnswer]}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={resetQuiz}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Quiz
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}