import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Languages,
  ArrowLeft,
  ArrowRight,
  Copy,
  Volume2,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Globe,
  Sparkles,
  MessageSquare,
  History
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';

interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

interface TranslationStats {
  totalTranslations: number;
  favoriteSourceLang: string;
  favoriteTargetLang: string;
  totalChars: number;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' }
];

const sampleTranslations: Record<string, Record<string, string>> = {
  'hello': {
    es: 'Hola',
    fr: 'Bonjour',
    de: 'Hallo',
    it: 'Ciao',
    pt: 'Olá',
    ru: 'Привет',
    ja: 'こんにちは',
    ko: '안녕하세요',
    zh: '你好',
    ar: 'مرحبا',
    hi: 'नमस्ते',
    te: 'హలో',
    ta: 'வணக்கம்',
    tr: 'Merhaba',
    nl: 'Hallo',
    pl: 'Cześć',
    sv: 'Hej',
    no: 'Hei',
    da: 'Hej',
    fi: 'Hei',
    el: 'Γεια σου'
  },
  'learning': {
    es: 'aprendizaje',
    fr: 'apprentissage',
    de: 'Lernen',
    it: 'apprendimento',
    pt: 'aprendizagem',
    ru: 'обучение',
    ja: '学習',
    ko: '학습',
    zh: '学习',
    ar: 'تعلم',
    hi: 'सीखना',
    te: 'నేర్చుకోవడం',
    ta: 'கற்றல்',
    tr: 'öğrenme',
    nl: 'leren',
    pl: 'uczenie się',
    sv: 'lärande',
    no: 'læring',
    da: 'læring',
    fi: 'oppiminen',
    el: 'μάθηση'
  }
};

export default function TranslatorPage() {
  const navigate = useNavigate();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);
  const [stats, setStats] = useState<TranslationStats>({
    totalTranslations: 0,
    favoriteSourceLang: 'en',
    favoriteTargetLang: 'es',
    totalChars: 0
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cognilearn_translations');
    if (saved) {
      const translations = JSON.parse(saved);
      setHistory(translations);
      calculateStats(translations);
    }
  }, []);

  const calculateStats = (translations: Translation[]) => {
    if (translations.length === 0) return;

    const sourceLangCounts: Record<string, number> = {};
    const targetLangCounts: Record<string, number> = {};
    let totalChars = 0;

    translations.forEach(t => {
      sourceLangCounts[t.sourceLang] = (sourceLangCounts[t.sourceLang] || 0) + 1;
      targetLangCounts[t.targetLang] = (targetLangCounts[t.targetLang] || 0) + 1;
      totalChars += t.sourceText.length;
    });

    const favoriteSourceLang = Object.entries(sourceLangCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'en';
    const favoriteTargetLang = Object.entries(targetLangCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'es';

    setStats({
      totalTranslations: translations.length,
      favoriteSourceLang,
      favoriteTargetLang,
      totalChars
    });
  };

  const simulateTranslation = (text: string, from: string, to: string): string => {
    if (!text.trim()) return '';

    // Simple keyword-based translation simulation
    const lowerText = text.toLowerCase();

    // Check for common phrases
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      const translated = sampleTranslations['hello'][to] || 'Hello';
      return text.replace(/hello|hi/gi, translated);
    }

    if (lowerText.includes('learning') || lowerText.includes('study')) {
      const translated = sampleTranslations['learning'][to] || 'learning';
      return text.replace(/learning|study/gi, translated);
    }

    // Educational content translation
    const translations: Record<string, Record<string, string>> = {
      en: {
        es: text.replace(/education/gi, 'educación')
          .replace(/student/gi, 'estudiante')
          .replace(/teacher/gi, 'profesor')
          .replace(/book/gi, 'libro')
          .replace(/school/gi, 'escuela')
          .replace(/mathematics/gi, 'matemáticas')
          .replace(/science/gi, 'ciencia')
          .replace(/artificial intelligence/gi, 'inteligencia artificial')
          .replace(/machine learning/gi, 'aprendizaje automático'),
        fr: text.replace(/education/gi, 'éducation')
          .replace(/student/gi, 'étudiant')
          .replace(/teacher/gi, 'professeur')
          .replace(/book/gi, 'livre')
          .replace(/school/gi, 'école')
          .replace(/mathematics/gi, 'mathématiques')
          .replace(/science/gi, 'science')
          .replace(/artificial intelligence/gi, 'intelligence artificielle')
          .replace(/machine learning/gi, 'apprentissage automatique'),
        de: text.replace(/education/gi, 'Bildung')
          .replace(/student/gi, 'Student')
          .replace(/teacher/gi, 'Lehrer')
          .replace(/book/gi, 'Buch')
          .replace(/school/gi, 'Schule')
          .replace(/mathematics/gi, 'Mathematik')
          .replace(/science/gi, 'Wissenschaft')
          .replace(/artificial intelligence/gi, 'künstliche Intelligenz')
          .replace(/machine learning/gi, 'maschinelles Lernen')
      }
    };

    // Return translated or indicate translation
    if (translations[from] && translations[from][to]) {
      return translations[from][to];
    }

    // Default: indicate translation with language markers
    const toLangName = languages.find(l => l.code === to)?.name || to;
    return `[${toLangName}] ${text}`;
  };

  const translate = () => {
    if (!sourceText.trim()) {
      alert('Please enter text to translate');
      return;
    }

    setIsTranslating(true);

    setTimeout(() => {
      const translated = simulateTranslation(sourceText, sourceLang, targetLang);
      setTranslatedText(translated);

      // Save to history
      const newTranslation: Translation = {
        id: `trans-${Date.now()}`,
        sourceText,
        translatedText: translated,
        sourceLang,
        targetLang,
        timestamp: Date.now()
      };

      const updatedHistory = [newTranslation, ...history].slice(0, 50); // Keep last 50
      setHistory(updatedHistory);
      localStorage.setItem('cognilearn_translations', JSON.stringify(updatedHistory));
      calculateStats(updatedHistory);

      setIsTranslating(false);
    }, 1200);
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser');
    }
  };

  const loadFromHistory = (translation: Translation) => {
    setSourceText(translation.sourceText);
    setTranslatedText(translation.translatedText);
    setSourceLang(translation.sourceLang);
    setTargetLang(translation.targetLang);
    setShowHistory(false);
  };

  const loadSample = () => {
    setSourceText('Artificial Intelligence is transforming education. Students can now learn at their own pace with personalized content. Machine learning algorithms adapt to individual learning styles.');
    setSourceLang('en');
    setTargetLang('es');
  };

  const reset = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const sourceLangData = languages.find(l => l.code === sourceLang);
  const targetLangData = languages.find(l => l.code === targetLang);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-lime-50 p-6 lg:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            {history.length > 0 && (
              <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
                <History className="w-4 h-4 mr-2" />
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent">
                AI Smart Translator
              </h1>
              <p className="text-gray-600">Multi-language learning support with instant translation</p>
            </div>
          </div>

          {/* Stats */}
          {stats.totalTranslations > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Translations</p>
                      <p className="text-2xl font-bold">{stats.totalTranslations}</p>
                    </div>
                    <Languages className="w-8 h-8 text-lime-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Chars Translated</p>
                      <p className="text-2xl font-bold">{stats.totalChars.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Most Used From</p>
                      <p className="text-lg font-bold">
                        {languages.find(l => l.code === stats.favoriteSourceLang)?.flag} {languages.find(l => l.code === stats.favoriteSourceLang)?.name}
                      </p>
                    </div>
                    <Globe className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Most Used To</p>
                      <p className="text-lg font-bold">
                        {languages.find(l => l.code === stats.favoriteTargetLang)?.flag} {languages.find(l => l.code === stats.favoriteTargetLang)?.name}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Translation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map(trans => (
                    <div
                      key={trans.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-lime-300 transition cursor-pointer"
                      onClick={() => loadFromHistory(trans)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold">
                          {languages.find(l => l.code === trans.sourceLang)?.flag} {languages.find(l => l.code === trans.sourceLang)?.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold">
                          {languages.find(l => l.code === trans.targetLang)?.flag} {languages.find(l => l.code === trans.targetLang)?.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(trans.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{trans.sourceText}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Translator */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {/* Language Selection */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">From</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-lime-500 outline-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swapLanguages}
                  className="mt-8 p-3 bg-lime-100 hover:bg-lime-200 rounded-lg transition"
                >
                  <ArrowRight className="w-5 h-5 text-lime-600" />
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">To</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-lime-500 outline-none"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Translation Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Source */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">
                      {sourceLangData?.flag} {sourceLangData?.name}
                    </label>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={loadSample}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Sample
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(sourceText, sourceLang)}
                        disabled={!sourceText.trim()}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className="min-h-64 text-base"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {sourceText.length} characters
                  </p>
                </div>

                {/* Translation */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">
                      {targetLangData?.flag} {targetLangData?.name}
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(translatedText)}
                        disabled={!translatedText}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(translatedText, targetLang)}
                        disabled={!translatedText}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="min-h-64 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                    {translatedText ? (
                      <p className="text-base leading-relaxed">{translatedText}</p>
                    ) : (
                      <p className="text-gray-400 italic">Translation will appear here...</p>
                    )}
                  </div>
                  {translatedText && (
                    <p className="text-sm text-gray-500 mt-2">
                      {translatedText.length} characters
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={translate}
                  disabled={!sourceText.trim() || isTranslating}
                  className="flex-1 bg-gradient-to-r from-lime-600 to-green-600 text-white py-6 text-lg"
                >
                  {isTranslating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="w-5 h-5 mr-2" />
                      Translate
                    </>
                  )}
                </Button>
                <Button onClick={reset} variant="outline" className="px-6">
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-lime-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-lime-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-lime-800 mb-1">Learning Tip</p>
                    <p className="text-sm text-lime-700">
                      Use the translator to understand study materials in different languages. Practice by translating key concepts back and forth!
                    </p>
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
