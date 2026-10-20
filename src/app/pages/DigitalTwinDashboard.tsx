import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Brain, Zap, Clock, TrendingUp, Activity, Eye, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

const knowledgeLevels = [
  { subject: 'Mathematics', level: 85, color: '#8b5cf6', id: 'math' },
  { subject: 'Physics', level: 78, color: '#3b82f6', id: 'physics' },
  { subject: 'Chemistry', level: 72, color: '#10b981', id: 'chemistry' },
  { subject: 'Biology', level: 88, color: '#f59e0b', id: 'biology' },
  { subject: 'English', level: 92, color: '#ef4444', id: 'english' },
];

const learningSpeed = [
  { name: 'Reading', value: 85, fill: '#8b5cf6', id: 'reading' },
  { name: 'Understanding', value: 78, fill: '#3b82f6', id: 'understanding' },
  { name: 'Application', value: 82, fill: '#10b981', id: 'application' },
];

const cognitiveMetrics = [
  { metric: 'Memory', score: 85, max: 100, id: 'memory' },
  { metric: 'Attention', score: 78, max: 100, id: 'attention' },
  { metric: 'Confidence', score: 92, max: 100, id: 'confidence' },
  { metric: 'Focus', score: 74, max: 100, id: 'focus' },
  { metric: 'Creativity', score: 88, max: 100, id: 'creativity' },
];

export default function DigitalTwinDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Twin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">AI-powered analysis of your learning patterns and cognitive abilities</p>
          </div>

          {/* Digital Twin Visual */}
          <Card className="shadow-lg border-0 mb-6 bg-gradient-to-br from-purple-500 to-blue-500">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl relative">
                    <Brain className="w-24 h-24 text-purple-600" />
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="text-white flex-1">
                  <h2 className="text-3xl font-bold mb-2">Alex's Digital Twin</h2>
                  <p className="text-purple-100 mb-4">Active & Learning</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <Zap className="w-6 h-6 mb-2" />
                      <p className="text-2xl font-bold">Fast Learner</p>
                      <p className="text-sm text-purple-100">Top 15% speed</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 mb-2" />
                      <p className="text-2xl font-bold">Improving</p>
                      <p className="text-sm text-purple-100">+12% this week</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <Eye className="w-6 h-6 mb-2" />
                      <p className="text-2xl font-bold">Visual</p>
                      <p className="text-sm text-purple-100">Learning style</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <Clock className="w-6 h-6 mb-2" />
                      <p className="text-2xl font-bold">Morning</p>
                      <p className="text-sm text-purple-100">Peak time</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Levels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Knowledge Levels by Subject
                </CardTitle>
                <CardDescription>Current mastery across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300} key="knowledge-levels-chart">
                  <BarChart
                    data={knowledgeLevels}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                    id="knowledge-bar-chart"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-3" />
                    <XAxis type="number" domain={[0, 100]} stroke="#6b7280" key="xaxis-3" />
                    <YAxis dataKey="subject" type="category" width={100} stroke="#6b7280" key="yaxis-3" />
                    <Tooltip key="tooltip-5" />
                    <Bar
                      key="bar-2"
                      dataKey="level"
                      fill="#8b5cf6"
                      radius={[0, 8, 8, 0]}
                      isAnimationActive={false}
                      animationDuration={0}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Speed */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Learning Speed Analysis
                </CardTitle>
                <CardDescription>How quickly you grasp new concepts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300} key="learning-speed-chart">
                  <RadialBarChart
                    innerRadius="10%"
                    outerRadius="100%"
                    data={learningSpeed}
                    startAngle={180}
                    endAngle={0}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    id="learning-speed-radial-chart"
                  >
                    <RadialBar
                      key="radial-bar-1"
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                      isAnimationActive={false}
                      animationDuration={0}
                    />
                    <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" key="legend-1" />
                    <Tooltip
                      key="tooltip-6"
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                              <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                              <p className="text-sm text-blue-600">{payload[0].value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                    Fast Learner Profile
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cognitive Metrics */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Cognitive Metrics
              </CardTitle>
              <CardDescription>Detailed analysis of your mental capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cognitiveMetrics.map((metric) => (
                  <div key={metric.metric}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{metric.metric}</span>
                      <span className="text-2xl font-bold text-purple-600">{metric.score}%</span>
                    </div>
                    <Progress value={metric.score} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">
                      {metric.score >= 85 ? 'Excellent performance' : 
                       metric.score >= 70 ? 'Good progress' : 
                       'Needs improvement'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700 mb-1">✅ Strength Identified</h4>
                  <p className="text-sm text-gray-600">
                    You excel at visual learning. Continue using diagrams and mind maps for complex topics.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700 mb-1">💡 Learning Tip</h4>
                  <p className="text-sm text-gray-600">
                    Your attention peaks between 9-11 AM. Schedule challenging topics during this time.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-700 mb-1">⚠️ Area to Focus</h4>
                  <p className="text-sm text-gray-600">
                    Memory retention drops after 45 minutes. Take short breaks and use spaced repetition.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-700 mb-1">🎯 Recommended Action</h4>
                  <p className="text-sm text-gray-600">
                    Practice more advanced calculus problems. Your current pace suggests readiness for harder challenges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}