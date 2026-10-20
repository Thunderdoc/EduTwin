import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart, Clock, Target, Brain, Calendar, Award, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock analytics data
  const weeklyStudyData = [
    { id: 'mon', day: 'Mon', hours: 2.5, target: 2 },
    { id: 'tue', day: 'Tue', hours: 3.2, target: 2 },
    { id: 'wed', day: 'Wed', hours: 1.8, target: 2 },
    { id: 'thu', day: 'Thu', hours: 2.9, target: 2 },
    { id: 'fri', day: 'Fri', hours: 3.5, target: 2 },
    { id: 'sat', day: 'Sat', hours: 4.2, target: 2 },
    { id: 'sun', day: 'Sun', hours: 3.0, target: 2 },
  ];

  const subjectProgressData = [
    { id: 'math', subject: 'Mathematics', progress: 85, color: '#8b5cf6' },
    { id: 'physics', subject: 'Physics', progress: 72, color: '#3b82f6' },
    { id: 'chemistry', subject: 'Chemistry', progress: 68, color: '#10b981' },
    { id: 'biology', subject: 'Biology', progress: 90, color: '#f59e0b' },
    { id: 'english', subject: 'English', progress: 78, color: '#ec4899' },
  ];

  const skillRadarData = [
    { id: 'problem-solving', skill: 'Problem Solving', value: 85, fullMark: 100 },
    { id: 'critical-thinking', skill: 'Critical Thinking', value: 78, fullMark: 100 },
    { id: 'memory', skill: 'Memory', value: 92, fullMark: 100 },
    { id: 'creativity', skill: 'Creativity', value: 70, fullMark: 100 },
    { id: 'focus', skill: 'Focus', value: 88, fullMark: 100 },
    { id: 'speed', skill: 'Speed', value: 75, fullMark: 100 },
  ];

  const performanceTrendData = [
    { id: 'week1', week: 'Week 1', score: 65 },
    { id: 'week2', week: 'Week 2', score: 70 },
    { id: 'week3', week: 'Week 3', score: 68 },
    { id: 'week4', week: 'Week 4', score: 75 },
    { id: 'week5', week: 'Week 5', score: 78 },
    { id: 'week6', week: 'Week 6', score: 82 },
    { id: 'week7', week: 'Week 7', score: 85 },
    { id: 'week8', week: 'Week 8', score: 88 },
  ];

  const learningStyleDistribution = [
    { id: 'visual', name: 'Visual', value: 40, color: '#8b5cf6' },
    { id: 'auditory', name: 'Auditory', value: 25, color: '#3b82f6' },
    { id: 'reading', name: 'Reading', value: 20, color: '#10b981' },
    { id: 'kinesthetic', name: 'Kinesthetic', value: 15, color: '#f59e0b' },
  ];

  const weekStats = {
    totalHours: 21.1,
    change: '+12%',
    avgScore: 82,
    scoreChange: '+5%',
    topicsCompleted: 24,
    topicsChange: '+8',
    streakDays: 12,
    streakChange: '+3',
  };

  const strengthsWeaknesses = {
    strengths: [
      { id: 'calculus', topic: 'Calculus', score: 92, trend: 'up' },
      { id: 'biology-basics', topic: 'Biology Basics', score: 90, trend: 'up' },
      { id: 'grammar', topic: 'Grammar', score: 88, trend: 'stable' },
    ],
    weaknesses: [
      { id: 'organic-chem', topic: 'Organic Chemistry', score: 58, trend: 'down' },
      { id: 'thermodynamics', topic: 'Thermodynamics', score: 62, trend: 'stable' },
      { id: 'trigonometry', topic: 'Trigonometry', score: 65, trend: 'up' },
    ],
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Learning Analytics
              </h1>
              <p className="text-gray-600">Track your progress and insights</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === 'week'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === 'month'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === 'year'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {weekStats.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weekStats.totalHours}h</p>
            <p className="text-sm text-gray-600">Study Time</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-500" />
              <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {weekStats.scoreChange}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weekStats.avgScore}%</p>
            <p className="text-sm text-gray-600">Avg Score</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-green-500" />
              <span className="text-green-600 text-sm font-semibold">
                {weekStats.topicsChange}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weekStats.topicsCompleted}</p>
            <p className="text-sm text-gray-600">Topics Completed</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-orange-500" />
              <span className="text-green-600 text-sm font-semibold">
                {weekStats.streakChange}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weekStats.streakDays}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Study Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Weekly Study Hours
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyStudyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar key="hours-bar" dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar key="target-bar" dataKey="target" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  key="score-line"
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Subject Progress
            </h3>
            <div className="space-y-4">
              {subjectProgressData.map((subject) => (
                <div key={subject.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{subject.subject}</span>
                    <span className="text-gray-600">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Radar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Cognitive Skills
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  key="skills-radar"
                  name="Skills"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Your Strengths
            </h3>
            <div className="space-y-3">
              {strengthsWeaknesses.strengths.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{item.topic}</p>
                    <p className="text-sm text-gray-600">Score: {item.score}%</p>
                  </div>
                  {item.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {strengthsWeaknesses.weaknesses.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{item.topic}</p>
                    <p className="text-sm text-gray-600">Score: {item.score}%</p>
                  </div>
                  {item.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
                  {item.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl py-3 font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
              Get Personalized Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
