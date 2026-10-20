import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useNavigate, useLocation } from 'react-router';
import { Navigation } from '../components/Navigation';
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Brain,
  Award,
  Download,
  CalendarClock,
  Send
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';
import { useState } from 'react';

const studentList = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: '👨‍🎓',
    overallScore: 85,
    riskLevel: 'Low',
    trend: 'up',
    weakTopics: ['Advanced Calculus'],
    strengths: ['Problem Solving', 'Quick Learning'],
  },
  {
    id: 2,
    name: 'Emma Wilson',
    avatar: '👩‍🎓',
    overallScore: 62,
    riskLevel: 'High',
    trend: 'down',
    weakTopics: ['Physics', 'Mathematics'],
    strengths: ['English', 'Biology'],
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: '👨‍🎓',
    overallScore: 78,
    riskLevel: 'Medium',
    trend: 'stable',
    weakTopics: ['Chemistry'],
    strengths: ['Mathematics', 'Logical Thinking'],
  },
  {
    id: 4,
    name: 'Sophia Davis',
    avatar: '👩‍🎓',
    overallScore: 92,
    riskLevel: 'Low',
    trend: 'up',
    weakTopics: [],
    strengths: ['All Subjects', 'Fast Learner'],
  },
  {
    id: 5,
    name: 'James Miller',
    avatar: '👨‍🎓',
    overallScore: 58,
    riskLevel: 'High',
    trend: 'down',
    weakTopics: ['English', 'Essay Writing'],
    strengths: ['Computer Science'],
  },
];

const classPerformanceData = [
  { subject: 'Math', average: 75, id: 'math' },
  { subject: 'Physics', average: 68, id: 'physics' },
  { subject: 'Chemistry', average: 72, id: 'chemistry' },
  { subject: 'Biology', average: 80, id: 'biology' },
  { subject: 'English', average: 76, id: 'english' },
];

const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#10b981', id: 'low' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b', id: 'medium' },
  { name: 'High Risk', value: 25, color: '#ef4444', id: 'high' },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const currentView = location.pathname === '/teacher/performance'
    ? 'performance'
    : location.pathname === '/teacher/interventions'
    ? 'interventions'
    : 'students';

  const getRiskColor = (risk: string) => {
    return risk === 'Low' ? 'bg-green-500' : risk === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';
  };

  const handleDetailedReport = (studentId: number, studentName: string) => {
    toast.success(`Loading detailed report for ${studentName}`);
    // In a real app, this would navigate to a detailed report page
  };

  const handleExportReport = () => {
    toast.success('Exporting class report...');
    // In a real app, this would trigger a download
    setTimeout(() => {
      toast.success('Class report exported successfully!');
    }, 1500);
  };

  const handleScheduleInterventions = () => {
    navigate('/teacher/interventions');
  };

  const handleSendNotifications = () => {
    toast.success('Opening notification center...');
    // In a real app, this would open a notification dialog
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentView === 'performance' ? 'Performance Analytics' : currentView === 'interventions' ? 'Schedule Interventions' : 'Teacher Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {currentView === 'performance'
                  ? 'Analyze class and individual performance metrics'
                  : currentView === 'interventions'
                  ? 'Plan and schedule learning interventions'
                  : 'Monitor student progress and identify at-risk learners'}
              </p>
            </div>
            <Badge className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Class 10-A
            </Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">32</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Class Average</p>
                  <p className="text-3xl font-bold text-purple-600">74%</p>
                </div>
                <Award className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">At Risk</p>
                  <p className="text-3xl font-bold text-red-600">8</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Now</p>
                  <p className="text-3xl font-bold text-green-600">18</p>
                </div>
                <Clock className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Analytics View */}
        {currentView === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Class Performance by Subject
              </CardTitle>
              <CardDescription>Average scores across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300} key="class-performance-chart">
                <BarChart
                  data={classPerformanceData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  id="class-performance-bar-chart"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-2" />
                  <XAxis dataKey="subject" stroke="#6b7280" key="xaxis-2" />
                  <YAxis domain={[0, 100]} stroke="#6b7280" key="yaxis-2" />
                  <Tooltip key="tooltip-3" />
                  <Bar
                    key="bar-1"
                    dataKey="average"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={false}
                    animationDuration={0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Risk Level Distribution
              </CardTitle>
              <CardDescription>Student performance risk categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300} key="risk-distribution-chart">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} id="risk-pie-chart">
                  <Pie
                    key="pie-1"
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                    animationDuration={0}
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="tooltip-4" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Student List View */}
        {currentView === 'students' && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Student Performance Overview
            </CardTitle>
            <CardDescription>Detailed view of individual student progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentList.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    student.riskLevel === 'High'
                      ? 'bg-red-50 border-red-200'
                      : student.riskLevel === 'Medium'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{student.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{student.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getRiskColor(student.riskLevel)} text-white`}>
                              {student.riskLevel} Risk
                            </Badge>
                            {student.trend === 'up' && (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            )}
                            {student.trend === 'down' && (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                          <p className="text-3xl font-bold text-purple-600">{student.overallScore}%</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Progress value={student.overallScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-600" />
                            Strengths
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {student.strengths.map((strength, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-green-500 text-green-700">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            <AlertTriangle className="w-4 h-4 inline mr-1 text-orange-600" />
                            Weak Topics
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {student.weakTopics.length > 0 ? (
                              student.weakTopics.map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-red-500 text-red-700">
                                  {topic}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">None identified</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                          onClick={() => handleDetailedReport(student.id, student.name)}
                        >
                          Detailed Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Interventions View */}
        {currentView === 'interventions' && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-purple-600" />
              Schedule Learning Interventions
            </CardTitle>
            <CardDescription>Plan targeted support for at-risk students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* At-Risk Students Section */}
              <div>
                <h3 className="font-semibold text-lg mb-4">At-Risk Students Requiring Intervention</h3>
                <div className="space-y-3">
                  {studentList
                    .filter((student) => student.riskLevel === 'High' || student.riskLevel === 'Medium')
                    .map((student) => (
                      <div
                        key={student.id}
                        className={`p-4 rounded-lg border-2 ${
                          student.riskLevel === 'High'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{student.avatar}</div>
                            <div>
                              <h4 className="font-bold">{student.name}</h4>
                              <p className="text-sm text-gray-600">
                                Score: {student.overallScore}% | Weak Topics: {student.weakTopics.join(', ') || 'None'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-purple-600"
                              onClick={() => setSelectedStudent(student.id)}
                            >
                              <CalendarClock className="w-4 h-4 mr-1" />
                              Schedule Session
                            </Button>
                          </div>
                        </div>
                        {selectedStudent === student.id && (
                          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                            <h5 className="font-semibold mb-3">Schedule Intervention Session</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Intervention Type
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg">
                                  <option>One-on-One Tutoring</option>
                                  <option>Small Group Session</option>
                                  <option>Peer Mentoring</option>
                                  <option>Resource Assignment</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Focus Area
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg">
                                  {student.weakTopics.map((topic, idx) => (
                                    <option key={idx}>{topic}</option>
                                  ))}
                                  <option>General Support</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Date & Time
                                </label>
                                <input
                                  type="datetime-local"
                                  className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                  Duration (minutes)
                                </label>
                                <input
                                  type="number"
                                  placeholder="30"
                                  className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                Notes
                              </label>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                rows={3}
                                placeholder="Add notes about the intervention plan..."
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600"
                                onClick={() => {
                                  toast.success(`Intervention scheduled for ${student.name}`);
                                  setSelectedStudent(null);
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Schedule Intervention
                              </Button>
                              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => toast.success('Opening bulk intervention scheduler...')}
                >
                  <CalendarClock className="w-4 h-4 mr-2" />
                  Bulk Schedule
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toast.success('Loading intervention history...')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View History
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSendNotifications}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Notify Students
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Action Buttons - Show on Students view only */}
        {currentView === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Class Report
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleScheduleInterventions}
          >
            <CalendarClock className="w-4 h-4 mr-2" />
            Schedule Interventions
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleSendNotifications}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Notifications
          </Button>
        </div>
        )}
      </div>
      </div>
    </>
  );
}