import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { useApp } from '../context/AppContext';
import React from 'react';
import {
  Brain,
  MessageSquare,
  FileText,
  Code,
  PenTool,
  Calculator,
  CreditCard,
  Mic,
  HelpCircle,
  ClipboardCheck,
  BookOpen,
  Languages,
  Network,
  CheckCircle,
  UserCheck,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

interface AITool {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  bgGradient: string;
  category: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const aiTools: AITool[] = [
  {
    id: 'chat',
    title: 'AI Chat Assistant',
    description: 'Advanced conversational AI with GPT-4 for personalized learning',
    icon: MessageSquare,
    route: '/ai-tools/chat',
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-cyan-500',
    category: 'Learning'
  },
  {
    id: 'quiz',
    title: 'Quiz Generator',
    description: 'Auto-generate quizzes on any topic with instant feedback',
    icon: ClipboardCheck,
    route: '/ai-tools/quiz-generator',
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-pink-500',
    category: 'Assessment',
    isNew: true
  },
  {
    id: 'notes',
    title: 'Notes Generator',
    description: 'Convert any topic into structured study notes automatically',
    icon: FileText,
    route: '/ai-tools/notes-generator',
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-emerald-500',
    category: 'Learning'
  },
  {
    id: 'code',
    title: 'Code Playground',
    description: 'Write, run, and debug code with AI assistance',
    icon: Code,
    route: '/ai-tools/code-playground',
    color: 'text-orange-600',
    bgGradient: 'from-orange-500 to-red-500',
    category: 'Programming',
    isNew: true
  },
  {
    id: 'essay',
    title: 'Essay Writer',
    description: 'Generate high-quality essays and articles with AI',
    icon: PenTool,
    route: '/ai-tools/essay-writer',
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-500 to-purple-500',
    category: 'Writing'
  },
  {
    id: 'math',
    title: 'Math Solver',
    description: 'Solve complex math problems with step-by-step explanations',
    icon: Calculator,
    route: '/ai-tools/math-solver',
    color: 'text-red-600',
    bgGradient: 'from-red-500 to-pink-500',
    category: 'Mathematics'
  },
  {
    id: 'flashcards',
    title: 'Flashcard Generator',
    description: 'Create smart flashcards with spaced repetition',
    icon: CreditCard,
    route: '/ai-tools/flashcards',
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-500 to-orange-500',
    category: 'Learning'
  },
  {
    id: 'voice',
    title: 'Voice Assistant',
    description: 'Text-to-speech and voice commands for hands-free learning',
    icon: Mic,
    route: '/ai-tools/voice-assistant',
    color: 'text-teal-600',
    bgGradient: 'from-teal-500 to-cyan-500',
    category: 'Accessibility',
    isPremium: true
  },
  {
    id: 'doubt',
    title: 'Doubt Solver',
    description: 'Ask any academic question and get instant answers',
    icon: HelpCircle,
    route: '/ai-tools/doubt-solver',
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 to-rose-500',
    category: 'Learning'
  },
  {
    id: 'mock-test',
    title: 'Mock Test Generator',
    description: 'Create practice tests with performance analytics',
    icon: ClipboardCheck,
    route: '/ai-tools/mock-test',
    color: 'text-violet-600',
    bgGradient: 'from-violet-500 to-purple-500',
    category: 'Assessment'
  },
  {
    id: 'summarizer',
    title: 'Summary Generator',
    description: 'Summarize long articles, videos, and documents instantly',
    icon: BookOpen,
    route: '/ai-tools/summarizer',
    color: 'text-cyan-600',
    bgGradient: 'from-cyan-500 to-blue-500',
    category: 'Productivity'
  },
  {
    id: 'translator',
    title: 'Smart Translator',
    description: 'Translate study materials in 50+ languages',
    icon: Languages,
    route: '/ai-tools/translator',
    color: 'text-lime-600',
    bgGradient: 'from-lime-500 to-green-500',
    category: 'Languages'
  },
  {
    id: 'mindmap',
    title: 'Mind Map Generator',
    description: 'Create visual concept maps for better understanding',
    icon: Network,
    route: '/ai-tools/mind-map',
    color: 'text-fuchsia-600',
    bgGradient: 'from-fuchsia-500 to-pink-500',
    category: 'Visualization',
    isNew: true
  },
  {
    id: 'writing',
    title: 'Writing Assistant',
    description: 'Grammar checking, style improvement, and readability analysis',
    icon: CheckCircle,
    route: '/ai-tools/writing-assistant',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500 to-teal-500',
    category: 'Writing'
  },
  {
    id: 'interview',
    title: 'Interview Trainer',
    description: 'Practice job interviews with AI feedback',
    icon: UserCheck,
    route: '/ai-tools/interview-trainer',
    color: 'text-sky-600',
    bgGradient: 'from-sky-500 to-blue-500',
    category: 'Career',
    isPremium: true
  }
];

const categories = ['All', 'Learning', 'Assessment', 'Writing', 'Programming', 'Career'];

export default function AIToolsHub() {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredTools = selectedCategory === 'All' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === selectedCategory);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              AI-Powered Learning Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              15 cutting-edge AI tools to supercharge your learning experience
            </p>
            <Badge variant={isOnline ? "default" : "destructive"} className="mt-4 px-4 py-2">
              {isOnline ? '🟢 All Tools Available' : '🔴 Limited Features (Offline)'}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">15</CardTitle>
                <CardDescription className="text-blue-100">AI Tools</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">GPT-4</CardTitle>
                <CardDescription className="text-purple-100">AI Model</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">50+</CardTitle>
                <CardDescription className="text-green-100">Languages</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">24/7</CardTitle>
                <CardDescription className="text-orange-100">Available</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* AI Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card 
                key={tool.id} 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-14 h-14 bg-gradient-to-br ${tool.bgGradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex gap-2">
                      {tool.isNew && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          NEW
                        </Badge>
                      )}
                      {tool.isPremium && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          <Zap className="w-3 h-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:shadow-lg"
                    onClick={() => navigate(tool.route)}
                  >
                    Launch Tool
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Integration Info */}
          <Card className="border-0 shadow-lg mt-12 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                AI Models & Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">🤖 OpenAI GPT-4</h3>
                  <p className="text-sm text-gray-600">Advanced language understanding and generation</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🧠 Google Gemini</h3>
                  <p className="text-sm text-gray-600">Multimodal AI for text, images, and code</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">⚡ Claude 3.5</h3>
                  <p className="text-sm text-gray-600">Long-context conversations and analysis</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Currently using smart mock responses. To enable real AI, add your API keys in Settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}