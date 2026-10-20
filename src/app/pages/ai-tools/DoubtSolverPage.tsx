import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  HelpCircle,
  ArrowLeft,
  Send,
  Bookmark,
  BookmarkCheck,
  Lightbulb,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Copy,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface Doubt {
  id: number;
  question: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  answer: string;
  steps: string[];
  relatedConcepts: string[];
  followUpQuestions: string[];
  isBookmarked: boolean;
  timestamp: Date;
}

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'General Knowledge'
];

export default function DoubtSolverPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);

  const detectDifficulty = (question: string): 'Easy' | 'Medium' | 'Hard' => {
    const hardKeywords = ['prove', 'derive', 'integrate', 'differential', 'theorem', 'complex'];
    const mediumKeywords = ['explain', 'calculate', 'solve', 'find', 'determine'];

    const lowerQuestion = question.toLowerCase();
    if (hardKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'Hard';
    } else if (mediumKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'Medium';
    }
    return 'Easy';
  };

  const generateAnswer = (question: string, subject: string): Doubt => {
    const difficulty = detectDifficulty(question);

    // Generate contextual answer based on subject
    let answer = '';
    let steps: string[] = [];
    let relatedConcepts: string[] = [];
    let followUpQuestions: string[] = [];

    if (subject === 'Mathematics') {
      answer = `The solution to "${question}" involves understanding fundamental mathematical principles. Let me break this down for you step by step.`;
      steps = [
        'Identify the given information and what needs to be found',
        'Apply the relevant mathematical formula or theorem',
        'Perform the calculations systematically',
        'Verify the result by substituting back or cross-checking',
        'State the final answer with appropriate units (if applicable)'
      ];
      relatedConcepts = ['Algebra', 'Geometry', 'Calculus', 'Number Theory'];
      followUpQuestions = [
        'How does this concept apply to real-world scenarios?',
        'What are the variations of this problem?',
        'Can this be solved using an alternative method?'
      ];
    } else if (subject === 'Physics') {
      answer = `To understand "${question}", we need to apply physics principles and laws. Here's a comprehensive explanation.`;
      steps = [
        'Define the physical system and identify forces/variables',
        'Write down the relevant physics equations',
        'Substitute known values and solve for unknowns',
        'Check dimensional analysis and units',
        'Interpret the result in physical context'
      ];
      relatedConcepts = ['Newton\'s Laws', 'Energy Conservation', 'Kinematics', 'Thermodynamics'];
      followUpQuestions = [
        'How would this change under different conditions?',
        'What practical applications does this have?',
        'What are the assumptions in this solution?'
      ];
    } else if (subject === 'Chemistry') {
      answer = `The answer to "${question}" requires understanding chemical principles. Let me explain this systematically.`;
      steps = [
        'Identify the chemical reaction or process involved',
        'Write balanced chemical equations',
        'Apply stoichiometry and mole concepts',
        'Calculate quantities using appropriate formulas',
        'Verify results with chemical logic'
      ];
      relatedConcepts = ['Chemical Bonding', 'Periodic Table', 'Reaction Kinetics', 'Equilibrium'];
      followUpQuestions = [
        'What happens if we change the temperature?',
        'How does this relate to other chemical reactions?',
        'What are the industrial applications?'
      ];
    } else if (subject === 'Computer Science') {
      answer = `To solve "${question}", we need to apply programming and computational thinking. Here's the approach:`;
      steps = [
        'Understand the problem requirements',
        'Design the algorithm or data structure',
        'Implement the solution with proper syntax',
        'Test with edge cases and sample inputs',
        'Optimize for time and space complexity'
      ];
      relatedConcepts = ['Data Structures', 'Algorithms', 'Complexity Analysis', 'Design Patterns'];
      followUpQuestions = [
        'What is the time complexity of this solution?',
        'Can we optimize this further?',
        'How would this scale with larger inputs?'
      ];
    } else {
      answer = `Great question about "${question}"! Let me provide you with a detailed explanation based on ${subject} concepts.`;
      steps = [
        'Break down the question into key components',
        'Apply relevant theories and principles',
        'Provide examples and context',
        'Connect to broader concepts',
        'Summarize the key takeaways'
      ];
      relatedConcepts = ['Core Concepts', 'Fundamental Principles', 'Applications', 'Advanced Topics'];
      followUpQuestions = [
        'How does this connect to other topics?',
        'What are practical examples?',
        'What should I study next?'
      ];
    }

    return {
      id: Date.now(),
      question,
      subject,
      difficulty,
      answer,
      steps,
      relatedConcepts,
      followUpQuestions,
      isBookmarked: false,
      timestamp: new Date()
    };
  };

  const handleAskDoubt = () => {
    if (!question.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      const newDoubt = generateAnswer(question, selectedSubject);
      setDoubts([newDoubt, ...doubts]);
      setSelectedDoubt(newDoubt);
      setQuestion('');
      setIsProcessing(false);
    }, 1500);
  };

  const toggleBookmark = (id: number) => {
    setDoubts(doubts.map(doubt =>
      doubt.id === id ? { ...doubt, isBookmarked: !doubt.isBookmarked } : doubt
    ));
    if (selectedDoubt && selectedDoubt.id === id) {
      setSelectedDoubt({ ...selectedDoubt, isBookmarked: !selectedDoubt.isBookmarked });
    }
  };

  const clearHistory = () => {
    setDoubts([]);
    setSelectedDoubt(null);
  };

  const handleFollowUpQuestion = (followUpQ: string) => {
    setQuestion(followUpQ);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  AI Doubt Solver
                </h1>
                <p className="text-gray-600">Ask any academic question and get instant AI-powered answers</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                    Ask Your Doubt
                  </CardTitle>
                  <CardDescription>Get instant answers from AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Question</label>
                    <Textarea
                      placeholder="e.g., What is the quadratic formula and when do we use it?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={6}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleAskDoubt();
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to submit</p>
                  </div>

                  <Button
                    onClick={handleAskDoubt}
                    disabled={isProcessing || !question.trim()}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Get Answer'}
                  </Button>
                </CardContent>
              </Card>

              {/* History Section */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Recent Doubts
                    </CardTitle>
                    {doubts.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearHistory}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <CardDescription>{doubts.length} questions asked</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {doubts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No doubts asked yet</p>
                    </div>
                  ) : (
                    doubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        onClick={() => setSelectedDoubt(doubt)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedDoubt?.id === doubt.id
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {doubt.subject}
                          </Badge>
                          <div className="flex gap-1">
                            <Badge className={`${getDifficultyColor(doubt.difficulty)} text-white text-xs`}>
                              {doubt.difficulty}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(doubt.id);
                              }}
                            >
                              {doubt.isBookmarked ? (
                                <BookmarkCheck className="w-3 h-3 text-pink-600" />
                              ) : (
                                <Bookmark className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-medium line-clamp-2">{doubt.question}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doubt.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Answer Display Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Answer & Explanation</CardTitle>
                  <CardDescription>
                    {selectedDoubt
                      ? 'Detailed solution with step-by-step explanation'
                      : 'Select a doubt from history or ask a new question'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDoubt ? (
                    <div className="space-y-6">
                      {/* Question */}
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-2 border-pink-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex gap-2">
                            <Badge variant="outline">{selectedDoubt.subject}</Badge>
                            <Badge className={`${getDifficultyColor(selectedDoubt.difficulty)} text-white`}>
                              {selectedDoubt.difficulty}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleBookmark(selectedDoubt.id)}
                          >
                            {selectedDoubt.isBookmarked ? (
                              <BookmarkCheck className="w-4 h-4 text-pink-600" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">Question:</h3>
                        <p className="text-gray-700">{selectedDoubt.question}</p>
                      </div>

                      {/* Answer */}
                      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg text-gray-900">Answer:</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{selectedDoubt.answer}</p>
                      </div>

                      {/* Step-by-Step Solution */}
                      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-lg text-gray-900">Step-by-Step Solution:</h3>
                        </div>
                        <ol className="space-y-2">
                          {selectedDoubt.steps.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Related Concepts */}
                      <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-lg text-gray-900">Related Concepts:</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoubt.relatedConcepts.map((concept, index) => (
                            <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                              {concept}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Follow-up Questions */}
                      <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-lg text-gray-900">Follow-up Questions:</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedDoubt.followUpQuestions.map((followUp, index) => (
                            <button
                              key={index}
                              onClick={() => handleFollowUpQuestion(followUp)}
                              className="w-full text-left p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                            >
                              <p className="text-sm text-gray-700">{followUp}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Q: ${selectedDoubt.question}\n\nA: ${selectedDoubt.answer}\n\nSteps:\n${selectedDoubt.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
                            );
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Answer
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setQuestion('')}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Ask Another
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400">
                      <HelpCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No doubt selected</p>
                      <p className="text-sm">Ask a question or select from your history</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Tips */}
          <Card className="shadow-lg border-0 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                Pro Tips for Better Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Be Specific</h4>
                    <p className="text-sm text-gray-600">Include context and details in your question for more accurate answers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Choose Right Subject</h4>
                    <p className="text-sm text-gray-600">Select the correct subject for more relevant and focused explanations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Use Follow-ups</h4>
                    <p className="text-sm text-gray-600">Click on suggested follow-up questions to deepen your understanding</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
