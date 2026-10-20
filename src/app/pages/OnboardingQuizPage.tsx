import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Brain, Target, Clock, Languages, BookOpen, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question: string;
  category: 'learning-style' | 'goal' | 'level' | 'schedule' | 'language' | 'interests';
  options: { value: string; label: string; icon?: React.ReactNode }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'learning-style',
    question: 'How do you prefer to learn new concepts?',
    options: [
      { value: 'visual', label: 'Visual (Videos, diagrams, images)' },
      { value: 'auditory', label: 'Auditory (Podcasts, lectures, discussions)' },
      { value: 'reading', label: 'Reading (Articles, textbooks, notes)' },
      { value: 'kinesthetic', label: 'Kinesthetic (Hands-on practice, experiments)' },
    ],
  },
  {
    id: 2,
    category: 'goal',
    question: 'What is your primary learning goal?',
    options: [
      { value: 'exam-prep', label: 'Exam Preparation' },
      { value: 'skill-building', label: 'Skill Building' },
      { value: 'hobby', label: 'Hobby Learning' },
      { value: 'career', label: 'Career Development' },
    ],
  },
  {
    id: 3,
    category: 'level',
    question: 'What is your current knowledge level?',
    options: [
      { value: 'beginner', label: 'Beginner (Just starting out)' },
      { value: 'intermediate', label: 'Intermediate (Some experience)' },
      { value: 'advanced', label: 'Advanced (Expert level)' },
    ],
  },
  {
    id: 4,
    category: 'schedule',
    question: 'When do you prefer to study?',
    options: [
      { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
      { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
      { value: 'evening', label: 'Evening (6 PM - 10 PM)' },
      { value: 'night', label: 'Night (10 PM - 2 AM)' },
    ],
  },
  {
    id: 5,
    category: 'schedule',
    question: 'How much time can you dedicate daily?',
    options: [
      { value: '15', label: '15 minutes' },
      { value: '30', label: '30 minutes' },
      { value: '60', label: '1 hour' },
      { value: '120', label: '2+ hours' },
    ],
  },
  {
    id: 6,
    category: 'language',
    question: 'What is your preferred learning language?',
    options: [
      { value: 'English', label: 'English' },
      { value: 'Tamil', label: 'தமிழ் (Tamil)' },
      { value: 'Hindi', label: 'हिंदी (Hindi)' },
      { value: 'Telugu', label: 'తెలుగు (Telugu)' },
      { value: 'Malayalam', label: 'മലയാളം (Malayalam)' },
    ],
  },
];

export default function OnboardingQuizPage() {
  const navigate = useNavigate();
  const { updateUserPreferences, setLanguage, userProfile } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      processQuizResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const processQuizResults = () => {
    // Process answers and update user preferences
    const learningStyle = answers[1] as 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    const studyTime = answers[4] as 'morning' | 'afternoon' | 'evening' | 'night';
    const dailyMinutes = parseInt(answers[5] || '60');
    const level = answers[3] as 'beginner' | 'intermediate' | 'advanced';
    const language = answers[6] || 'English';

    // Update preferences
    updateUserPreferences({
      preferredStudyTime: studyTime,
      dailyGoalMinutes: dailyMinutes,
      difficultyLevel: level,
    });

    // Set language
    setLanguage(language);

    // Save learning style to localStorage
    localStorage.setItem('cognilearn_learning_style', learningStyle);
    localStorage.setItem('cognilearn_learning_goal', answers[2] || 'skill-building');

    setShowResults(true);
    toast.success('Profile personalized successfully!');
  };

  const getLearningStyleDescription = () => {
    const style = answers[1];
    const descriptions = {
      visual: 'We\'ll prioritize videos, diagrams, and visual content for you.',
      auditory: 'We\'ll focus on audio lessons, podcasts, and verbal explanations.',
      reading: 'We\'ll provide text-based materials, articles, and comprehensive notes.',
      kinesthetic: 'We\'ll emphasize hands-on practice, interactive exercises, and real-world applications.',
    };
    return descriptions[style as keyof typeof descriptions] || '';
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Your Learning Profile is Ready!
            </h1>
            <p className="text-gray-600 mb-8">
              Welcome {userProfile?.name || 'there'}! We've personalized CogniLearn AI just for you.
            </p>

            <div className="space-y-4 mb-8 text-left bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Learning Style</p>
                  <p className="text-sm text-gray-600">{getLearningStyleDescription()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Daily Schedule</p>
                  <p className="text-sm text-gray-600">
                    {answers[5]} minutes of learning during {answers[4]} hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Difficulty Level</p>
                  <p className="text-sm text-gray-600">
                    Content tailored for {answers[3]} level
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-8 py-4 font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Start Learning Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isAnswered = answers[question.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            {question.category === 'learning-style' && <Brain className="w-8 h-8 text-purple-500" />}
            {question.category === 'goal' && <Target className="w-8 h-8 text-blue-500" />}
            {question.category === 'level' && <BookOpen className="w-8 h-8 text-green-500" />}
            {question.category === 'schedule' && <Clock className="w-8 h-8 text-orange-500" />}
            {question.category === 'language' && <Languages className="w-8 h-8 text-pink-500" />}
            <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
          </div>

          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[question.id] === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  {answers[question.id] === option.value && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentQuestion > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isAnswered
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
