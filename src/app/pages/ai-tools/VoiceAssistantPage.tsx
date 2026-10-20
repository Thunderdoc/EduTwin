import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Mic,
  MicOff,
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  MessageSquare,
  BookOpen,
  Clock,
  Zap,
  TrendingUp,
  Save,
  Download,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Bot,
  Send
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface BookmarkedTranscript {
  id: string;
  text: string;
  timestamp: number;
  mode: 'tts' | 'stt' | 'chat';
}

interface VoiceSettings {
  rate: number; // 0.5 to 2
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  voice: string;
}

interface VoiceSession {
  id: string;
  text: string;
  duration: number; // seconds
  timestamp: number;
  mode: 'tts' | 'stt' | 'chat';
}

interface VoiceStats {
  totalSessions: number;
  totalDuration: number;
  favoriteMode: 'tts' | 'stt' | 'chat';
  textsSpoken: number;
}

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'tts' | 'stt' | 'chat'>('chat'); // text-to-speech, speech-to-text, or chat
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: 'default'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [stats, setStats] = useState<VoiceStats>({
    totalSessions: 0,
    totalDuration: 0,
    favoriteMode: 'chat',
    textsSpoken: 0
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [bookmarkedTranscripts, setBookmarkedTranscripts] = useState<BookmarkedTranscript[]>([]);
  const [aiAssistantMode, setAiAssistantMode] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (mode === 'chat' && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, mode]);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    // Load history
    const saved = localStorage.getItem('eduflow_voice_sessions');
    if (saved) {
      const data = JSON.parse(saved);
      setSessions(data);
      calculateStats(data);
    }

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('eduflow_voice_bookmarks');
    if (savedBookmarks) {
      setBookmarkedTranscripts(JSON.parse(savedBookmarks));
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const calculateStats = (sessionList: VoiceSession[]) => {
    if (sessionList.length === 0) return;

    const totalDuration = sessionList.reduce((sum, s) => sum + s.duration, 0);
    const modeCounts = sessionList.reduce((acc, s) => {
      acc[s.mode] = (acc[s.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteMode = (modeCounts['tts'] || 0) > (modeCounts['stt'] || 0) ? 'tts' : 'stt';
    const textsSpoken = sessionList.filter(s => s.mode === 'tts').length;

    setStats({
      totalSessions: sessionList.length,
      totalDuration,
      favoriteMode,
      textsSpoken
    });
  };

  const speak = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }

    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      if (settings.voice !== 'default') {
        const voice = availableVoices.find(v => v.name === settings.voice);
        if (voice) utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setSessionStartTime(Date.now());
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);

        // Save session
        const duration = (Date.now() - sessionStartTime) / 1000;
        const newSession: VoiceSession = {
          id: `session-${Date.now()}`,
          text,
          duration,
          timestamp: Date.now(),
          mode: 'tts'
        };

        const updated = [newSession, ...sessions].slice(0, 50);
        setSessions(updated);
        localStorage.setItem('eduflow_voice_sessions', JSON.stringify(updated));
        calculateStats(updated);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in your browser');
    }
  };

  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.', {
        duration: 7000
      });
      setMicPermissionDenied(true);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSessionStartTime(Date.now());
      // Clear permission denied state when successfully started
      setMicPermissionDenied(false);
      setShowPermissionHelp(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      // Handle specific error types
      switch (event.error) {
        case 'not-allowed':
          setMicPermissionDenied(true);
          setShowPermissionHelp(true);
          toast.error('Microphone access denied. Please grant permission to use speech recognition.', {
            duration: 5000,
            action: {
              label: 'How to Fix',
              onClick: () => setShowPermissionHelp(true)
            }
          });
          break;
        case 'no-speech':
          toast.error('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          toast.error('No microphone detected. Please check your audio device.');
          break;
        case 'network':
          toast.error('Network error. Speech recognition requires an internet connection.');
          break;
        case 'aborted':
          // User stopped intentionally, no error needed
          break;
        default:
          toast.error(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      if (transcript.trim()) {
        // Save session
        const duration = (Date.now() - sessionStartTime) / 1000;
        const newSession: VoiceSession = {
          id: `session-${Date.now()}`,
          text: transcript,
          duration,
          timestamp: Date.now(),
          mode: 'stt'
        };

        const updated = [newSession, ...sessions].slice(0, 50);
        setSessions(updated);
        localStorage.setItem('eduflow_voice_sessions', JSON.stringify(updated));
        calculateStats(updated);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const loadSample = () => {
    setText(`Welcome to EduFlow, your personalized learning platform. Today we will explore the fundamental concepts of Artificial Intelligence. Machine learning is a subset of AI that enables computers to learn from data without being explicitly programmed. Neural networks are inspired by the human brain and consist of interconnected nodes that process information. Deep learning uses multiple layers of neural networks to solve complex problems. Let's begin our learning journey!`);
  };

  const saveSession = () => {
    const textToSave = mode === 'tts' ? text : transcript;
    if (!textToSave.trim()) return;

    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-session-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bookmarkTranscript = () => {
    const textToBookmark = mode === 'tts' ? text : transcript;
    if (!textToBookmark.trim()) {
      toast.error('No text to bookmark');
      return;
    }

    const newBookmark: BookmarkedTranscript = {
      id: `bookmark-${Date.now()}`,
      text: textToBookmark,
      timestamp: Date.now(),
      mode
    };

    const updated = [newBookmark, ...bookmarkedTranscripts];
    setBookmarkedTranscripts(updated);
    localStorage.setItem('cognilearn_voice_bookmarks', JSON.stringify(updated));
    toast.success('Transcript bookmarked!');
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarkedTranscripts.filter(b => b.id !== id);
    setBookmarkedTranscripts(updated);
    localStorage.setItem('cognilearn_voice_bookmarks', JSON.stringify(updated));
    toast.success('Bookmark removed');
  };

  const processAICommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Simple AI command processing
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      const response = 'Hello! I\'m your AI learning assistant. How can I help you today?';
      setText(response);
      speak();
    } else if (lowerCommand.includes('help')) {
      const response = 'I can help you with: reading text aloud, transcribing your speech, bookmarking important notes, and answering questions about your learning. Just speak naturally!';
      setText(response);
      speak();
    } else if (lowerCommand.includes('quiz') || lowerCommand.includes('test')) {
      const response = 'I can help you prepare for a quiz! Try saying: "Start a quiz on mathematics" or "Test me on physics concepts".';
      setText(response);
      speak();
    } else if (lowerCommand.includes('bookmark') || lowerCommand.includes('save this')) {
      bookmarkTranscript();
      const response = 'I\'ve bookmarked that for you!';
      setText(response);
      speak();
    } else if (lowerCommand.includes('read') || lowerCommand.includes('speak')) {
      const response = 'Sure! Enter any text in the text area and I\'ll read it aloud for you.';
      setText(response);
      speak();
    } else {
      const response = `I heard: "${command}". I'm learning to understand more commands every day. Try asking for help to see what I can do!`;
      setText(response);
      speak();
    }
  };

  const toggleAIAssistant = () => {
    setAiAssistantMode(!aiAssistantMode);
    if (!aiAssistantMode) {
      toast.success('AI Assistant mode enabled! I can now respond to your voice commands.');
      // Automatically start listening when AI mode is enabled
      if (mode === 'stt') {
        startListening();
      }
    } else {
      toast.info('AI Assistant mode disabled');
      stopListening();
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      text: chatInput,
      sender: 'user',
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const aiResponse = generateAIResponse(chatInput);
    const aiMessage: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      text: aiResponse,
      sender: 'ai',
      timestamp: Date.now() + 100
    };

    setTimeout(() => {
      setChatMessages(prev => [...prev, aiMessage]);
    }, 500);

    setChatInput('');
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Educational responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return 'Hello! I\'m your AI learning assistant. I can help you with study materials, answer questions, or discuss topics. What would you like to learn about today?';
    }
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return 'I can help you with:\n• Answering questions about various subjects\n• Explaining complex concepts\n• Creating study plans\n• Providing learning tips\n• Discussing homework or assignments\n\nJust ask me anything!';
    }
    if (lowerInput.includes('math') || lowerInput.includes('calculate')) {
      return 'Mathematics is a fascinating subject! I can help with algebra, geometry, calculus, statistics, and more. What specific math topic would you like to explore?';
    }
    if (lowerInput.includes('science') || lowerInput.includes('physics') || lowerInput.includes('chemistry') || lowerInput.includes('biology')) {
      return 'Science helps us understand the world around us! I\'d be happy to discuss physics concepts, chemical reactions, biological processes, or any other scientific topic. What interests you?';
    }
    if (lowerInput.includes('history')) {
      return 'History gives us perspective on how we got here. I can discuss different time periods, civilizations, historical events, and their impact. What historical topic would you like to explore?';
    }
    if (lowerInput.includes('english') || lowerInput.includes('grammar') || lowerInput.includes('writing')) {
      return 'Language and writing are powerful tools! I can help with grammar, essay writing, literature analysis, vocabulary, and more. What do you need help with?';
    }
    if (lowerInput.includes('study') || lowerInput.includes('learn') || lowerInput.includes('exam') || lowerInput.includes('test')) {
      return 'Effective studying is key to success! I recommend:\n• Break study sessions into 25-30 minute intervals\n• Use active recall and spaced repetition\n• Practice with past papers\n• Explain concepts to others\n• Take regular breaks\n\nWhat subject are you preparing for?';
    }
    if (lowerInput.includes('motivation') || lowerInput.includes('tired') || lowerInput.includes('lazy')) {
      return 'It\'s normal to feel unmotivated sometimes! Try:\n• Setting small, achievable goals\n• Creating a study routine\n• Finding a study buddy\n• Rewarding yourself after completing tasks\n• Remember your long-term goals\n\nYou\'ve got this! What subject should we tackle first?';
    }
    if (lowerInput.includes('thank')) {
      return 'You\'re welcome! I\'m always here to help with your learning journey. Feel free to ask me anything anytime!';
    }

    // Default response
    return `That\'s an interesting question about "${userInput}"! As your AI learning assistant, I\'m here to help you explore this topic. Could you provide more details or let me know what specific aspect you\'d like to understand better?`;
  };

  // Process transcript for AI commands when in AI assistant mode
  useEffect(() => {
    if (aiAssistantMode && transcript.trim() && !isListening) {
      processAICommand(transcript);
      setTranscript(''); // Clear transcript after processing
    }
  }, [transcript, isListening, aiAssistantMode]);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 p-6 lg:ml-64">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Tools
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                AI Voice Assistant
              </h1>
              <p className="text-gray-600">Hands-free learning with text-to-speech and voice commands</p>
            </div>
          </div>

          {/* Microphone Permission Help */}
          {showPermissionHelp && (
            <Card className="mb-6 border-2 border-red-300 bg-red-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MicOff className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                      <CardTitle className="text-red-800">Microphone Access Required</CardTitle>
                      <p className="text-sm text-red-700 mt-2">
                        To use speech-to-text features, you need to grant microphone permission to this website.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPermissionHelp(false)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-red-800">
                  <div>
                    <h4 className="font-bold mb-2">How to Enable Microphone Access:</h4>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">🌐 Google Chrome / Microsoft Edge:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
                        <li>Click the lock icon (🔒) or camera icon in the address bar</li>
                        <li>Find "Microphone" in the permissions list</li>
                        <li>Change it from "Block" to "Allow"</li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800 mb-1">🧭 Safari:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
                        <li>Go to Safari → Settings → Websites → Microphone</li>
                        <li>Find this website in the list</li>
                        <li>Change permission to "Allow"</li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800 mb-1">🦊 Firefox:</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
                        <li>Click the microphone icon with an "X" in the address bar</li>
                        <li>Click "Clear Blocking" or permissions settings</li>
                        <li>Allow microphone access when prompted</li>
                        <li>Refresh this page</li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-blue-100 rounded-lg p-3 text-blue-800">
                    <p className="font-semibold mb-1">💡 Quick Tip:</p>
                    <p className="text-sm">
                      After updating permissions, try clicking the microphone button again. You may see a browser prompt asking for permission - click "Allow".
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => {
                        setMicPermissionDenied(false);
                        setShowPermissionHelp(false);
                        if (mode === 'stt') {
                          setTimeout(() => startListening(), 500);
                        }
                      }}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      I've Enabled Access - Try Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPermissionHelp(false)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                    <MessageSquare className="w-8 h-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Duration</p>
                      <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
                    </div>
                    <Clock className="w-8 h-8 text-cyan-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Texts Spoken</p>
                      <p className="text-2xl font-bold">{stats.textsSpoken}</p>
                    </div>
                    <Volume2 className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Favorite Mode</p>
                      <p className="text-lg font-bold capitalize">
                        {stats.favoriteMode === 'tts' ? 'Speaking' : stats.favoriteMode === 'stt' ? 'Listening' : 'Chat'}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mode Selection */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setMode('tts')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    mode === 'tts'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <Volume2 className="w-8 h-8 mx-auto mb-3 text-teal-600" />
                  <p className="font-bold text-lg mb-1">Text-to-Speech</p>
                  <p className="text-sm text-gray-600">Listen to your study materials</p>
                </button>
                <button
                  onClick={() => setMode('stt')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    mode === 'stt'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <Mic className="w-8 h-8 mx-auto mb-3 text-cyan-600" />
                  <p className="font-bold text-lg mb-1">Speech-to-Text</p>
                  <p className="text-sm text-gray-600">Voice notes and dictation</p>
                </button>
                <button
                  onClick={() => setMode('chat')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    mode === 'chat'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <Bot className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <p className="font-bold text-lg mb-1">AI Chat</p>
                  <p className="text-sm text-gray-600">Chat with AI assistant</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Microphone Permission Info Banner - shown when STT mode is selected and no permission error yet */}
          {mode === 'stt' && !micPermissionDenied && !showPermissionHelp && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Mic className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">🎤 Microphone Access Required</p>
                    <p>
                      When you click "Start Listening", your browser will ask for microphone permission.
                      Click "Allow" to use voice dictation. Your audio is processed locally and not stored.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Interface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="md:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {mode === 'tts' ? 'Text-to-Speech' : mode === 'stt' ? 'Speech-to-Text' : 'AI Chat Assistant'}
                    </CardTitle>
                    {mode === 'tts' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mode === 'tts' ? (
                    <>
                      {showSettings && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Speed: {settings.rate.toFixed(1)}x
                            </label>
                            <input
                              type="range"
                              min="0.5"
                              max="2"
                              step="0.1"
                              value={settings.rate}
                              onChange={(e) => setSettings({ ...settings, rate: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">
                              Pitch: {settings.pitch.toFixed(1)}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              value={settings.pitch}
                              onChange={(e) => setSettings({ ...settings, pitch: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Voice</label>
                            <select
                              value={settings.voice}
                              onChange={(e) => setSettings({ ...settings, voice: e.target.value })}
                              className="w-full p-2 border-2 border-gray-200 rounded-lg"
                            >
                              <option value="default">Default</option>
                              {availableVoices.slice(0, 10).map(voice => (
                                <option key={voice.name} value={voice.name}>
                                  {voice.name} ({voice.lang})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-semibold">Enter text to speak</label>
                          <Button variant="ghost" size="sm" onClick={loadSample}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Sample
                          </Button>
                        </div>
                        <Textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Type or paste your study material here..."
                          className="min-h-64 text-base"
                          disabled={isSpeaking}
                        />
                        <p className="text-sm text-gray-500 mt-2">{text.length} characters</p>
                      </div>

                      <div className="flex gap-3">
                        {!isSpeaking ? (
                          <Button
                            onClick={speak}
                            disabled={!text.trim()}
                            className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Speak
                          </Button>
                        ) : (
                          <>
                            {isPaused ? (
                              <Button
                                onClick={resumeSpeech}
                                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </Button>
                            ) : (
                              <Button
                                onClick={pauseSpeech}
                                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </Button>
                            )}
                            <Button onClick={stopSpeech} variant="outline">
                              <VolumeX className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button onClick={() => setText('')} variant="outline">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={bookmarkTranscript}
                          variant="outline"
                          disabled={!text.trim()}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : mode === 'stt' ? (
                    <>
                      {micPermissionDenied && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                          <div className="flex items-center gap-2 text-red-800">
                            <MicOff className="w-5 h-5" />
                            <p className="font-semibold">Microphone access is blocked</p>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            Please enable microphone permissions in your browser to use this feature.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => setShowPermissionHelp(true)}
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                          >
                            Show Help
                          </Button>
                        </div>
                      )}

                      <div className="text-center py-12">
                        <div
                          className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                            micPermissionDenied
                              ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                              : isListening
                              ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse'
                              : 'bg-gradient-to-br from-teal-500 to-cyan-500'
                          }`}
                        >
                          {micPermissionDenied ? (
                            <MicOff className="w-16 h-16 text-white" />
                          ) : isListening ? (
                            <MicOff className="w-16 h-16 text-white" />
                          ) : (
                            <Mic className="w-16 h-16 text-white" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {micPermissionDenied
                            ? 'Permission Required'
                            : isListening
                            ? 'Listening...'
                            : 'Ready to Listen'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {micPermissionDenied
                            ? 'Enable microphone access to use voice dictation'
                            : isListening
                            ? 'Speak clearly into your microphone'
                            : 'Click the button below to start voice dictation'}
                        </p>
                        {!isListening ? (
                          <Button
                            onClick={startListening}
                            disabled={micPermissionDenied}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Mic className="w-5 h-5 mr-2" />
                            Start Listening
                          </Button>
                        ) : (
                          <Button
                            onClick={stopListening}
                            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-6 text-lg"
                          >
                            <MicOff className="w-5 h-5 mr-2" />
                            Stop Listening
                          </Button>
                        )}
                      </div>

                      {transcript && (
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Transcript</label>
                          <div className="p-4 bg-gray-50 rounded-lg min-h-32 max-h-64 overflow-y-auto">
                            <p className="text-base leading-relaxed">{transcript}</p>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <Button onClick={saveSession} variant="outline" className="flex-1">
                              <Save className="w-4 h-4 mr-2" />
                              Save Transcript
                            </Button>
                            <Button
                              onClick={bookmarkTranscript}
                              variant="outline"
                              disabled={!transcript.trim()}
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => setTranscript('')} variant="outline">
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* AI Chat Interface */}
                      <div className="flex flex-col h-[600px]">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg mb-4">
                          {chatMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                              <Bot className="w-16 h-16 mb-4 text-gray-400" />
                              <p className="text-lg font-semibold mb-2">Start a conversation</p>
                              <p className="text-sm text-center max-w-md">
                                Ask me anything about your studies! I can help with homework, explain concepts, or discuss any topic.
                              </p>
                            </div>
                          ) : (
                            chatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    message.sender === 'user'
                                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                                      : 'bg-white border-2 border-gray-200 text-gray-800'
                                  }`}
                                >
                                  {message.sender === 'ai' && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <Bot className="w-4 h-4 text-purple-600" />
                                      <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                                    </div>
                                  )}
                                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-teal-100' : 'text-gray-400'}`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                          <div ref={chatMessagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleChatSend();
                              }
                            }}
                            placeholder="Ask me anything about your studies..."
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                          />
                          <Button
                            onClick={handleChatSend}
                            disabled={!chatInput.trim()}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6"
                          >
                            <Send className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* AI Assistant Toggle */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">AI Voice Assistant</p>
                        <p className="text-sm text-gray-600">Respond to voice commands</p>
                      </div>
                    </div>
                    <Button
                      onClick={toggleAIAssistant}
                      className={aiAssistantMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                      variant={aiAssistantMode ? 'default' : 'outline'}
                    >
                      {aiAssistantMode ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History Panel */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {sessions.slice(0, 10).map(session => (
                        <div
                          key={session.id}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-teal-50 transition"
                          onClick={() => {
                            if (session.mode === 'tts') {
                              setMode('tts');
                              setText(session.text);
                            } else {
                              setMode('stt');
                              setTranscript(session.text);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {session.mode === 'tts' ? (
                              <Volume2 className="w-4 h-4 text-teal-600" />
                            ) : (
                              <Mic className="w-4 h-4 text-cyan-600" />
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDuration(session.duration)} • {new Date(session.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{session.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">No sessions yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Bookmarked Transcripts */}
              {bookmarkedTranscripts.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookmarkCheck className="w-5 h-5 text-purple-600" />
                      Bookmarked Transcripts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {bookmarkedTranscripts.map(bookmark => (
                        <div
                          key={bookmark.id}
                          className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              {bookmark.mode === 'tts' ? (
                                <Volume2 className="w-4 h-4 text-purple-600" />
                              ) : (
                                <Mic className="w-4 h-4 text-purple-600" />
                              )}
                              <span className="text-xs text-gray-600">
                                {new Date(bookmark.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <button
                              onClick={() => removeBookmark(bookmark.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-700">{bookmark.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
