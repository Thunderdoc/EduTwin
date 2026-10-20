import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  Zap,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  List,
  AlignLeft,
  Lightbulb
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

interface SummaryResult {
  id: string;
  originalText: string;
  summary: string;
  keyPoints: string[];
  readingTime: number; // original in minutes
  summaryTime: number; // summary in seconds
  compressionRatio: number; // percentage
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timestamp: number;
  mode: 'brief' | 'detailed' | 'key-points';
}

interface SummaryHistory {
  totalSummaries: number;
  totalTimeSaved: number; // minutes
  avgCompressionRatio: number;
  favoriteMode: string;
}

export default function SummarizerPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [summaryMode, setSummaryMode] = useState<'brief' | 'detailed' | 'key-points'>('brief');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [history, setHistory] = useState<SummaryHistory>({
    totalSummaries: 0,
    totalTimeSaved: 0,
    avgCompressionRatio: 0,
    favoriteMode: 'brief'
  });
  const [savedSummaries, setSavedSummaries] = useState<SummaryResult[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cognilearn_summary_history');
    if (saved) {
      const data = JSON.parse(saved);
      setSavedSummaries(data);
      calculateHistory(data);
    }
  }, []);

  const calculateHistory = (summaries: SummaryResult[]) => {
    if (summaries.length === 0) return;

    const totalTimeSaved = summaries.reduce((sum, s) => sum + (s.readingTime - s.summaryTime / 60), 0);
    const avgCompressionRatio = summaries.reduce((sum, s) => sum + s.compressionRatio, 0) / summaries.length;

    const modeCounts = summaries.reduce((acc, s) => {
      acc[s.mode] = (acc[s.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'brief';

    setHistory({
      totalSummaries: summaries.length,
      totalTimeSaved,
      avgCompressionRatio,
      favoriteMode
    });
  };

  const estimateReadingTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // Average reading speed: 200 words/min
  };

  const analyzeDifficulty = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
    const avgWordLength = text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.split(/\s+/).length / sentences.length;

    if (avgWordLength > 6 || avgSentenceLength > 20) return 'advanced';
    if (avgWordLength > 5 || avgSentenceLength > 15) return 'intermediate';
    return 'beginner';
  };

  const generateBriefSummary = (text: string): string => {
    // Simulate AI summarization with intelligent sentence selection
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalSentences = sentences.length;

    if (totalSentences <= 3) return text;

    // Extract key sentences (first, middle, last for coherence)
    const keySentences = [
      sentences[0],
      sentences[Math.floor(totalSentences / 2)],
      sentences[totalSentences - 1]
    ];

    return keySentences.join('. ') + '.';
  };

  const generateDetailedSummary = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalSentences = sentences.length;

    if (totalSentences <= 5) return text;

    // Select ~50% of sentences evenly distributed
    const step = Math.floor(totalSentences / Math.ceil(totalSentences * 0.5));
    const selectedSentences = sentences.filter((_, idx) => idx % step === 0);

    return selectedSentences.join('. ') + '.';
  };

  const extractKeyPoints = (text: string): string[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Extract important sentences based on position and keywords
    const keywordIndicators = ['important', 'key', 'main', 'essential', 'crucial', 'significant', 'first', 'second', 'third', 'finally', 'therefore', 'thus', 'however', 'because'];

    const scoredSentences = sentences.map((sentence, idx) => {
      let score = 0;

      // Position scoring (beginning and end are important)
      if (idx === 0 || idx === sentences.length - 1) score += 3;
      if (idx < sentences.length * 0.2 || idx > sentences.length * 0.8) score += 2;

      // Keyword scoring
      const lowerSentence = sentence.toLowerCase();
      keywordIndicators.forEach(keyword => {
        if (lowerSentence.includes(keyword)) score += 2;
      });

      // Length scoring (avoid too short or too long)
      const words = sentence.split(/\s+/).length;
      if (words >= 8 && words <= 25) score += 1;

      return { sentence: sentence.trim(), score };
    });

    // Sort by score and take top 5-7 points
    const topPoints = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(7, Math.max(3, Math.ceil(sentences.length * 0.3))))
      .map(item => item.sentence);

    return topPoints;
  };

  const generateSummary = () => {
    if (!inputText.trim() || inputText.trim().split(/\s+/).length < 20) {
      alert('Please enter at least 20 words to generate a meaningful summary.');
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const readingTime = estimateReadingTime(inputText);
      const difficulty = analyzeDifficulty(inputText);

      let summary = '';
      let keyPoints: string[] = [];

      if (summaryMode === 'brief') {
        summary = generateBriefSummary(inputText);
        keyPoints = [];
      } else if (summaryMode === 'detailed') {
        summary = generateDetailedSummary(inputText);
        keyPoints = [];
      } else {
        keyPoints = extractKeyPoints(inputText);
        summary = 'Key points extracted from the text.';
      }

      const summaryTime = estimateReadingTime(summary) * 60; // in seconds
      const compressionRatio = ((inputText.length - summary.length) / inputText.length) * 100;

      const newResult: SummaryResult = {
        id: `summary-${Date.now()}`,
        originalText: inputText,
        summary: summaryMode === 'key-points' ? '' : summary,
        keyPoints,
        readingTime,
        summaryTime,
        compressionRatio: Math.max(0, compressionRatio),
        difficulty,
        timestamp: Date.now(),
        mode: summaryMode
      };

      setResult(newResult);

      // Save to history
      const newSummaries = [...savedSummaries, newResult];
      setSavedSummaries(newSummaries);
      localStorage.setItem('cognilearn_summary_history', JSON.stringify(newSummaries));
      calculateHistory(newSummaries);

      setIsProcessing(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadSummary = () => {
    if (!result) return;

    let content = '';
    if (result.mode === 'key-points') {
      content = `KEY POINTS\n\n${result.keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n\n')}`;
    } else {
      content = `SUMMARY\n\n${result.summary}\n\n---\n\nORIGINAL TEXT\n\n${result.originalText}`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInputText('');
    setResult(null);
    setSummaryMode('brief');
  };

  // Sample text for demo
  const loadSampleText = () => {
    setInputText(`Artificial Intelligence (AI) has become one of the most transformative technologies of the 21st century, revolutionizing industries from healthcare to finance. Machine learning, a subset of AI, enables computers to learn from data without being explicitly programmed. Deep learning, which uses neural networks with multiple layers, has achieved remarkable success in image recognition, natural language processing, and game playing. The development of large language models has opened new possibilities for human-computer interaction, making AI assistants more capable and accessible. However, ethical considerations around AI deployment remain crucial, including concerns about bias, privacy, and job displacement. As AI continues to advance, it is essential to develop frameworks that ensure responsible and beneficial use of these powerful technologies. The future of AI holds immense potential for solving complex global challenges, from climate change to disease prevention, while also requiring careful consideration of its societal impact.`);
  };

  if (result) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-6 lg:ml-64">
          <div className="max-w-5xl mx-auto">
            <Button variant="ghost" onClick={reset} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Create New Summary
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Summary Generated!
                </h1>
                <p className="text-gray-600">Your content has been intelligently summarized</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {(result.readingTime - result.summaryTime / 60).toFixed(1)} min
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Compression</p>
                      <p className="text-2xl font-bold text-teal-600">
                        {result.compressionRatio.toFixed(0)}%
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Difficulty</p>
                      <p className="text-lg font-bold capitalize text-purple-600">
                        {result.difficulty}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Read Time</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.ceil(result.summaryTime / 60)} min
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Result */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {result.mode === 'key-points' ? (
                      <>
                        <List className="w-5 h-5" />
                        Key Points
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Summary
                      </>
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.mode === 'key-points' ? result.keyPoints.join('\n') : result.summary)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadSummary}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.mode === 'key-points' ? (
                  <div className="space-y-3">
                    {result.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-emerald-50 rounded-lg">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-800">{point}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-gray-800 leading-relaxed text-lg">{result.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Original Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlignLeft className="w-5 h-5" />
                  Original Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                  <p className="text-gray-600 text-sm leading-relaxed">{result.originalText}</p>
                </div>
              </CardContent>
            </Card>
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Text Summarizer
              </h1>
              <p className="text-gray-600">Intelligent summarization with behavior analytics</p>
            </div>
          </div>

          {/* Statistics */}
          {history.totalSummaries > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Summaries</p>
                      <p className="text-2xl font-bold">{history.totalSummaries}</p>
                    </div>
                    <FileText className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-2xl font-bold">{history.totalTimeSaved.toFixed(0)} min</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Compression</p>
                      <p className="text-2xl font-bold">{history.avgCompressionRatio.toFixed(0)}%</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Favorite Mode</p>
                      <p className="text-lg font-bold capitalize">{history.favoriteMode}</p>
                    </div>
                    <Lightbulb className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Paste Your Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold">Enter or paste text to summarize</label>
                  <Button variant="ghost" size="sm" onClick={loadSampleText}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your article, essay, research paper, or any long-form content here..."
                  className="min-h-64 text-base"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {inputText.trim().split(/\s+/).filter(w => w).length} words • {estimateReadingTime(inputText)} min read
                  </p>
                  {inputText.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setInputText('')}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary Mode Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3">Summary Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSummaryMode('brief')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      summaryMode === 'brief'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <Zap className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                    <p className="font-semibold mb-1">Brief</p>
                    <p className="text-xs text-gray-600">Quick overview with essential points only</p>
                  </button>
                  <button
                    onClick={() => setSummaryMode('detailed')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      summaryMode === 'detailed'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                    <p className="font-semibold mb-1">Detailed</p>
                    <p className="text-xs text-gray-600">Comprehensive summary with more context</p>
                  </button>
                  <button
                    onClick={() => setSummaryMode('key-points')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      summaryMode === 'key-points'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <List className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold mb-1">Key Points</p>
                    <p className="text-xs text-gray-600">Bulleted list of main ideas</p>
                  </button>
                </div>
              </div>

              <Button
                onClick={generateSummary}
                disabled={!inputText.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Smart Summary
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
