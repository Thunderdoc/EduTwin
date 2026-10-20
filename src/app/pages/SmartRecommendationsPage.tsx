import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { useApp } from '../context/AppContext';
import { dueReviews, weakestTopics } from '../services/learningProgress';
import { 
  ArrowLeft, 
  AlertTriangle, 
  BookOpen, 
  Code, 
  Palette, 
  MessageSquare, 
  Lightbulb,
  TrendingUp,
  Star
} from 'lucide-react';


const techSkills = [
  {
    id: 'python-programming',
    title: 'Python Programming',
    icon: Code,
    level: 'Beginner to Advanced',
    duration: '8 weeks',
    description: 'Master Python from basics to advanced concepts including data science and web development',
    trending: true,
  },
  {
    id: 'web-development',
    title: 'Web Development',
    icon: Code,
    level: 'Beginner',
    duration: '12 weeks',
    description: 'Learn HTML, CSS, JavaScript, and modern frameworks like React',
    trending: true,
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    icon: Code,
    level: 'Intermediate',
    duration: '16 weeks',
    description: 'Introduction to AI concepts, neural networks, and practical ML applications',
    trending: true,
  },
];

const nonTechSkills = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: Palette,
    level: 'Beginner',
    duration: '6 weeks',
    description: 'Learn design principles, wireframing, and prototyping tools',
  },
  {
    id: 'communication-skills',
    title: 'Communication Skills',
    icon: MessageSquare,
    level: 'All Levels',
    duration: '4 weeks',
    description: 'Enhance verbal and written communication for professional success',
  },
  {
    id: 'creative-thinking',
    title: 'Creative Thinking',
    icon: Lightbulb,
    level: 'All Levels',
    duration: '5 weeks',
    description: 'Develop problem-solving and innovative thinking abilities',
  },
];

export default function SmartRecommendationsPage() {
  const navigate = useNavigate();
  const { learnerProfile } = useApp();
  const weak = weakestTopics(learnerProfile?.grade, 4);
  const reviews = dueReviews().filter((item) => learnerProfile?.grade === undefined || item.grade === learnerProfile.grade);
  const academicSuggestions = weak.length ? weak.map((item) => ({ title: item.topic, type: item.nextReviewAt && Date.parse(item.nextReviewAt) <= Date.now() ? 'Review Due' : 'Needs Practice', priority: item.mastery < 50 ? 'High' : 'Medium', reason: `${item.mastery}% saved mastery after ${item.attempts} attempt${item.attempts === 1 ? '' : 's'}`, action: reviews.some((review) => review.id === item.id) ? 'Complete a spaced review now' : `Revisit ${item.subject} and retry the check`, grade: item.grade, subject: item.subject })) : [];

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
              Smart Recommendations
            </h1>
            <p className="text-gray-600 mt-2">Study suggestions from your scored lesson checks and saved review schedule. Skill courses below are available to explore.</p>
          </div>

          {/* Academic Suggestions */}
          <Card className="shadow-lg border-0 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Academic Suggestions
              </CardTitle>
              <CardDescription>Topics with objective evidence of needing more practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {academicSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      suggestion.priority === 'High'
                        ? 'bg-red-50 border-red-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{suggestion.title}</h3>
                          <Badge
                            variant={suggestion.priority === 'High' ? 'destructive' : 'default'}
                            className="text-xs"
                          >
                            {suggestion.priority} Priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{suggestion.type}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Reason:</strong> {suggestion.reason}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Recommended Action:</strong> {suggestion.action}
                        </p>
                      </div>
                      <Button onClick={() => suggestion.subject === 'General' ? navigate('/curriculum') : navigate(`/learn/${suggestion.grade}/${encodeURIComponent(suggestion.subject)}/${encodeURIComponent(suggestion.title)}`)} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 ml-4">
                        Start Learning
                      </Button>
                    </div>
                  </div>
                ))}
                {!academicSuggestions.length && <div className="rounded-xl border border-dashed p-6 text-center"><p className="font-bold">No scored focus areas yet</p><p className="mt-1 text-sm text-slate-500">Complete an available objective knowledge check to get progress-based recommendations. Reflection-only study sessions are not treated as test scores.</p><Button onClick={() => navigate('/curriculum')} variant="outline" className="mt-4">Browse curriculum</Button></div>}
              </div>
            </CardContent>
          </Card>

          {/* Real-World Skills */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Real-World Skills</h2>
            <p className="text-gray-600 mb-6">Expand your knowledge beyond academics</p>
            
            {/* Tech Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">Tech Skills</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techSkills.map((skill, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <skill.icon className="w-6 h-6 text-white" />
                        </div>
                        {skill.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{skill.title}</CardTitle>
                      <CardDescription>{skill.level} • {skill.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
                      <Button onClick={() => navigate(`/courses/${skill.id}`)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        Explore Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Non-Tech Skills */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Non-Tech Skills</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nonTechSkills.map((skill, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-2">
                        <skill.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{skill.title}</CardTitle>
                      <CardDescription>{skill.level} • {skill.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
                      <Button onClick={() => navigate(`/courses/${skill.id}`)} variant="outline" className="w-full border-purple-300 hover:bg-purple-50">
                        Explore Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Personalized Learning Path */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">🎯 Your Personalized Learning Path</CardTitle>
              <CardDescription className="text-purple-100">
                Based on your interests, strengths, and career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Master Current Academic Topics</p>
                    <p className="text-sm text-purple-100">Focus on weak areas first</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Learn Python Programming</p>
                    <p className="text-sm text-purple-100">Start with fundamentals</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Develop Communication Skills</p>
                    <p className="text-sm text-purple-100">Parallel with technical learning</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Explore Web Development</p>
                    <p className="text-sm text-purple-100">Build real projects</p>
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