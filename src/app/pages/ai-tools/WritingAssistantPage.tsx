import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  PenTool,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  FileText,
  Brain
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

interface WritingIssue {
  id: string;
  type: 'grammar' | 'spelling' | 'style' | 'readability';
  message: string;
  original: string;
  suggestion: string;
  position: number;
}

interface WritingAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readabilityScore: number; // 0-100
  avgSentenceLength: number;
  avgWordLength: number;
  passiveVoiceCount: number;
  issues: WritingIssue[];
  tone: 'formal' | 'casual' | 'neutral';
  grade: string;
}

interface WritingHistory {
  totalDocuments: number;
  totalWords: number;
  avgReadability: number;
  improvementRate: number;
}

export default function WritingAssistantPage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<WritingHistory>({
    totalDocuments: 0,
    totalWords: 0,
    avgReadability: 0,
    improvementRate: 0
  });
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cognilearn_writing_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const analyzeText = () => {
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const result = performAnalysis(text);
      setAnalysis(result);

      // Update history
      const newHistory = {
        totalDocuments: history.totalDocuments + 1,
        totalWords: history.totalWords + result.wordCount,
        avgReadability: (history.avgReadability * history.totalDocuments + result.readabilityScore) / (history.totalDocuments + 1),
        improvementRate: Math.min(100, history.improvementRate + (result.readabilityScore > 70 ? 2 : -1))
      };
      setHistory(newHistory);
      localStorage.setItem('cognilearn_writing_history', JSON.stringify(newHistory));

      setIsAnalyzing(false);
    }, 1500);
  };

  const performAnalysis = (inputText: string): WritingAnalysis => {
    const words = inputText.trim().split(/\s+/);
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = inputText.split(/\n\n+/).filter(p => p.trim().length > 0);

    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;
    const avgSentenceLength = wordCount / Math.max(1, sentenceCount);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;

    // Detect issues
    const issues: WritingIssue[] = [];
    let issueId = 0;

    // Grammar checks
    const grammarPatterns = [
      { pattern: /\btheir\s+are\b/gi, message: 'Did you mean "they are" or "there are"?', suggestion: 'they are' },
      { pattern: /\byour\s+(going|coming|doing)\b/gi, message: 'Did you mean "you\'re"?', suggestion: 'you\'re' },
      { pattern: /\bits\s+a\b/gi, message: 'Check if you meant "it\'s" (it is)', suggestion: 'it\'s' },
      { pattern: /\ba\s+lot\s+of\b/gi, message: 'Consider using "many" or "much"', suggestion: 'many' },
      { pattern: /\bvery\s+\w+\b/gi, message: 'Consider using a stronger adjective', suggestion: '[stronger word]' }
    ];

    grammarPatterns.forEach(({ pattern, message, suggestion }) => {
      const matches = [...inputText.matchAll(pattern)];
      matches.forEach(match => {
        issues.push({
          id: `issue-${issueId++}`,
          type: 'grammar',
          message,
          original: match[0],
          suggestion,
          position: match.index || 0
        });
      });
    });

    // Spelling checks (common mistakes)
    const spellingPatterns = [
      { pattern: /\bteh\b/gi, word: 'teh', correct: 'the' },
      { pattern: /\brecieve\b/gi, word: 'recieve', correct: 'receive' },
      { pattern: /\boccured\b/gi, word: 'occured', correct: 'occurred' },
      { pattern: /\bseperate\b/gi, word: 'seperate', correct: 'separate' },
      { pattern: /\bdefinately\b/gi, word: 'definately', correct: 'definitely' }
    ];

    spellingPatterns.forEach(({ pattern, word, correct }) => {
      const matches = [...inputText.matchAll(pattern)];
      matches.forEach(match => {
        issues.push({
          id: `issue-${issueId++}`,
          type: 'spelling',
          message: `Possible spelling error`,
          original: match[0],
          suggestion: correct,
          position: match.index || 0
        });
      });
    });

    // Style checks
    if (avgSentenceLength > 25) {
      issues.push({
        id: `issue-${issueId++}`,
        type: 'readability',
        message: 'Some sentences are too long. Consider breaking them up.',
        original: 'Long sentences',
        suggestion: 'Shorter sentences improve clarity',
        position: 0
      });
    }

    // Passive voice detection
    const passivePatterns = [/\b(was|were|is|are|been|be)\s+\w+ed\b/gi];
    let passiveVoiceCount = 0;
    passivePatterns.forEach(pattern => {
      const matches = [...inputText.matchAll(pattern)];
      passiveVoiceCount += matches.length;
      if (matches.length > 0) {
        matches.slice(0, 2).forEach(match => {
          issues.push({
            id: `issue-${issueId++}`,
            type: 'style',
            message: 'Consider using active voice for clarity',
            original: match[0],
            suggestion: '[active voice]',
            position: match.index || 0
          });
        });
      }
    });

    // Readability score (simplified Flesch-Kincaid)
    const syllableScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * (avgWordLength / 3);
    const readabilityScore = Math.max(0, Math.min(100, syllableScore));

    // Determine tone
    const formalWords = /\b(moreover|furthermore|consequently|therefore|thus|hence)\b/gi;
    const casualWords = /\b(yeah|gonna|wanna|kinda|sorta|stuff|things)\b/gi;
    const formalCount = (inputText.match(formalWords) || []).length;
    const casualCount = (inputText.match(casualWords) || []).length;

    let tone: 'formal' | 'casual' | 'neutral';
    if (formalCount > casualCount + 2) tone = 'formal';
    else if (casualCount > formalCount + 2) tone = 'casual';
    else tone = 'neutral';

    // Grade level
    const gradeLevel = Math.max(1, Math.min(16, Math.round(0.39 * avgSentenceLength + 11.8 * (avgWordLength / 3) - 15.59)));
    const grade = gradeLevel <= 5 ? 'Elementary' :
      gradeLevel <= 8 ? 'Middle School' :
      gradeLevel <= 12 ? 'High School' :
      'College';

    return {
      wordCount,
      sentenceCount,
      paragraphCount,
      readabilityScore,
      avgSentenceLength,
      avgWordLength,
      passiveVoiceCount,
      issues: issues.slice(0, 15), // Limit to 15 issues
      tone,
      grade
    };
  };

  const applyFix = (issue: WritingIssue) => {
    if (issue.suggestion === '[stronger word]' || issue.suggestion === '[active voice]') {
      return; // These need manual intervention
    }
    const newText = text.replace(issue.original, issue.suggestion);
    setText(newText);
    setAnalysis(null); // Re-analyze after fix
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writing-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setText(`Artificial intelligence is revolutionizing education. Machine learning algorithms can adapt to individual learning styles and pace. This personalized approach was helping students achieve better outcomes. Moreover, AI-powered tools are providing instant feedback and assessment. The technology is making education more accessible to learners worldwide. Teachers can focus on creative and critical thinking while AI handles routine tasks. However, its important to maintain human connection in education. The future of learning will be a lot of collaboration between humans and AI systems.`);
  };

  const reset = () => {
    setText('');
    setAnalysis(null);
    setSelectedIssue(null);
  };

  if (analysis) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-6 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            <Button variant="ghost" onClick={() => setAnalysis(null)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Editing
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Analysis Complete!
                </h1>
                <p className="text-gray-600">Review suggestions and improve your writing</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Readability</p>
                      <p className={`text-2xl font-bold ${
                        analysis.readabilityScore >= 70 ? 'text-green-600' :
                        analysis.readabilityScore >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {analysis.readabilityScore.toFixed(0)}%
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Word Count</p>
                      <p className="text-2xl font-bold text-blue-600">{analysis.wordCount}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Issues Found</p>
                      <p className="text-2xl font-bold text-orange-600">{analysis.issues.length}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Grade Level</p>
                      <p className="text-lg font-bold text-purple-600">{analysis.grade}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Writing Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Sentences</span>
                    <span className="font-semibold">{analysis.sentenceCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Paragraphs</span>
                    <span className="font-semibold">{analysis.paragraphCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Avg Sentence Length</span>
                    <span className="font-semibold">{analysis.avgSentenceLength.toFixed(1)} words</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Tone</span>
                    <span className="font-semibold capitalize">{analysis.tone}</span>
                  </div>
                  {analysis.passiveVoiceCount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-yellow-800">Passive Voice Instances</span>
                      <span className="font-semibold text-yellow-900">{analysis.passiveVoiceCount}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Documents Analyzed</span>
                    <span className="font-semibold">{history.totalDocuments}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Words Written</span>
                    <span className="font-semibold">{history.totalWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Avg Readability</span>
                    <span className="font-semibold">{history.avgReadability.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-emerald-800">Improvement Rate</span>
                    <span className="font-semibold text-emerald-900">{history.improvementRate.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Suggestions & Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.issues.map(issue => (
                      <div
                        key={issue.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedIssue === issue.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => setSelectedIssue(issue.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {issue.type === 'grammar' && <AlertCircle className="w-4 h-4 text-red-500" />}
                              {issue.type === 'spelling' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                              {issue.type === 'style' && <Lightbulb className="w-4 h-4 text-blue-500" />}
                              {issue.type === 'readability' && <BookOpen className="w-4 h-4 text-purple-500" />}
                              <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                                issue.type === 'grammar' ? 'bg-red-100 text-red-700' :
                                issue.type === 'spelling' ? 'bg-orange-100 text-orange-700' :
                                issue.type === 'style' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {issue.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{issue.message}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-gray-500">
                                <span className="font-semibold">Found:</span> "{issue.original}"
                              </span>
                              {!issue.suggestion.startsWith('[') && (
                                <>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-emerald-600">
                                    <span className="font-semibold">Suggest:</span> "{issue.suggestion}"
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          {!issue.suggestion.startsWith('[') && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                applyFix(issue);
                              }}
                              className="ml-4 bg-emerald-600"
                            >
                              Apply Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.issues.length === 0 && (
              <Card className="mb-6">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
                  <p className="text-gray-600">No major issues found. Your writing looks good!</p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={() => setAnalysis(null)} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600">
                Continue Editing
              </Button>
              <Button onClick={copyText} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadText} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Document
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-6 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Tools
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Writing Assistant
              </h1>
              <p className="text-gray-600">Grammar, style, and readability improvement</p>
            </div>
          </div>

          {/* Stats */}
          {history.totalDocuments > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Documents</p>
                      <p className="text-2xl font-bold">{history.totalDocuments}</p>
                    </div>
                    <FileText className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Words Written</p>
                      <p className="text-2xl font-bold">{history.totalWords.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Readability</p>
                      <p className="text-2xl font-bold">{history.avgReadability.toFixed(0)}%</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Improvement</p>
                      <p className="text-2xl font-bold">{history.improvementRate.toFixed(0)}%</p>
                    </div>
                    <Brain className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Editor */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Write Your Content</CardTitle>
                <Button variant="ghost" size="sm" onClick={loadSample}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Load Sample
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing or paste your text here. The AI will analyze grammar, style, readability, and provide intelligent suggestions..."
                  className="min-h-96 text-base leading-relaxed"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {text.trim().split(/\s+/).filter(w => w).length} words • {text.split(/[.!?]+/).filter(s => s.trim()).length} sentences
                  </p>
                  {text.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setText('')}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={analyzeText}
                disabled={!text.trim() || isAnalyzing}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing Writing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze & Improve
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
