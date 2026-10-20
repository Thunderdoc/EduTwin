import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Zap, Target, CheckCircle, Circle, AlertCircle, TrendingUp, Brain, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface TopicNode {
  id: string;
  name: string;
  level: 'mastered' | 'learning' | 'locked';
  progress: number;
  prerequisites: string[];
  children: string[];
}

const knowledgeGraph: Record<string, TopicNode> = {
  'numbers': {
    id: 'numbers',
    name: 'Numbers & Operations',
    level: 'mastered',
    progress: 100,
    prerequisites: [],
    children: ['algebra', 'fractions'],
  },
  'fractions': {
    id: 'fractions',
    name: 'Fractions & Decimals',
    level: 'mastered',
    progress: 100,
    prerequisites: ['numbers'],
    children: ['algebra'],
  },
  'algebra': {
    id: 'algebra',
    name: 'Algebra Basics',
    level: 'learning',
    progress: 65,
    prerequisites: ['numbers', 'fractions'],
    children: ['calculus', 'trigonometry'],
  },
  'geometry': {
    id: 'geometry',
    name: 'Geometry',
    level: 'learning',
    progress: 45,
    prerequisites: ['numbers'],
    children: ['trigonometry', 'calculus'],
  },
  'trigonometry': {
    id: 'trigonometry',
    name: 'Trigonometry',
    level: 'locked',
    progress: 0,
    prerequisites: ['algebra', 'geometry'],
    children: ['calculus'],
  },
  'calculus': {
    id: 'calculus',
    name: 'Calculus',
    level: 'locked',
    progress: 0,
    prerequisites: ['algebra', 'trigonometry'],
    children: [],
  },
  'physics-basics': {
    id: 'physics-basics',
    name: 'Physics Fundamentals',
    level: 'learning',
    progress: 30,
    prerequisites: ['algebra'],
    children: ['mechanics', 'electricity'],
  },
  'mechanics': {
    id: 'mechanics',
    name: 'Mechanics',
    level: 'locked',
    progress: 0,
    prerequisites: ['physics-basics', 'calculus'],
    children: [],
  },
  'electricity': {
    id: 'electricity',
    name: 'Electricity & Magnetism',
    level: 'locked',
    progress: 0,
    prerequisites: ['physics-basics', 'calculus'],
    children: [],
  },
};

export default function KnowledgeGraphPage() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  const getTopicColor = (level: string) => {
    switch (level) {
      case 'mastered':
        return 'from-green-500 to-emerald-500';
      case 'learning':
        return 'from-yellow-500 to-orange-500';
      case 'locked':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getTopicIcon = (level: string) => {
    switch (level) {
      case 'mastered':
        return <CheckCircle className="w-6 h-6 text-white" />;
      case 'learning':
        return <TrendingUp className="w-6 h-6 text-white" />;
      case 'locked':
        return <Circle className="w-6 h-6 text-white" />;
      default:
        return <Circle className="w-6 h-6 text-white" />;
    }
  };

  const selectedTopicData = selectedTopic ? knowledgeGraph[selectedTopic] : null;

  const stats = {
    mastered: Object.values(knowledgeGraph).filter((t) => t.level === 'mastered').length,
    learning: Object.values(knowledgeGraph).filter((t) => t.level === 'learning').length,
    locked: Object.values(knowledgeGraph).filter((t) => t.level === 'locked').length,
    total: Object.keys(knowledgeGraph).length,
  };

  const overallProgress = Math.round(
    (Object.values(knowledgeGraph).reduce((sum, topic) => sum + topic.progress, 0) /
      Object.keys(knowledgeGraph).length)
  );

  const handleContinueLearning = (topic: TopicNode) => {
    if (topic.level === 'locked') {
      toast.info(`Complete prerequisites first: ${topic.prerequisites.map(id => knowledgeGraph[id].name).join(', ')}`);
    } else {
      toast.success(`Starting learning session for ${topic.name}!`);
      navigate('/autonomous-learning', { state: { topic: topic.name } });
    }
  };

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
                Knowledge Graph
              </h1>
              <p className="text-gray-600">Visualize your learning journey</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'tree'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tree View
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.mastered}</p>
                <p className="text-sm text-gray-600">Mastered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.learning}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.locked}</p>
                <p className="text-sm text-gray-600">Locked</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
                <p className="text-sm text-gray-600">Overall Progress</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Knowledge Graph Visualization */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Learning Path</h2>
              <p className="text-sm text-gray-600">
                Click on any topic to see details and recommendations
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.values(knowledgeGraph).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`relative bg-gradient-to-br ${getTopicColor(
                      topic.level
                    )} rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all ${
                      selectedTopic === topic.id ? 'ring-4 ring-purple-300' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      {getTopicIcon(topic.level)}
                      <h3 className="text-white font-semibold mt-2 text-sm">{topic.name}</h3>
                      {topic.level !== 'locked' && (
                        <div className="mt-2 w-full bg-white/30 rounded-full h-2">
                          <div
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                      )}
                      <p className="text-xs text-white/80 mt-1">
                        {topic.level === 'locked' ? 'Locked' : `${topic.progress}%`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Object.values(knowledgeGraph)
                  .filter(topic => topic.prerequisites.length === 0)
                  .map((topic) => (
                    <div key={topic.id} className="space-y-2">
                      <button
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`w-full flex items-center gap-3 bg-gradient-to-r ${getTopicColor(
                          topic.level
                        )} rounded-xl p-3 shadow-lg hover:shadow-xl transition-all ${
                          selectedTopic === topic.id ? 'ring-4 ring-purple-300' : ''
                        }`}
                      >
                        {getTopicIcon(topic.level)}
                        <div className="flex-1 text-left">
                          <h3 className="text-white font-semibold text-sm">{topic.name}</h3>
                          {topic.level !== 'locked' && (
                            <div className="mt-1 w-full bg-white/30 rounded-full h-1.5">
                              <div
                                className="bg-white rounded-full h-1.5"
                                style={{ width: `${topic.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-white/80">
                          {topic.level === 'locked' ? 'Locked' : `${topic.progress}%`}
                        </span>
                      </button>
                      {topic.children.length > 0 && (
                        <div className="ml-6 pl-4 border-l-2 border-purple-300 space-y-2">
                          {topic.children.map(childId => {
                            const child = knowledgeGraph[childId];
                            return (
                              <button
                                key={child.id}
                                onClick={() => setSelectedTopic(child.id)}
                                className={`w-full flex items-center gap-3 bg-gradient-to-r ${getTopicColor(
                                  child.level
                                )} rounded-xl p-3 shadow-lg hover:shadow-xl transition-all ${
                                  selectedTopic === child.id ? 'ring-4 ring-purple-300' : ''
                                }`}
                              >
                                {getTopicIcon(child.level)}
                                <div className="flex-1 text-left">
                                  <h3 className="text-white font-semibold text-sm">{child.name}</h3>
                                  {child.level !== 'locked' && (
                                    <div className="mt-1 w-full bg-white/30 rounded-full h-1.5">
                                      <div
                                        className="bg-white rounded-full h-1.5"
                                        style={{ width: `${child.progress}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-white/80">
                                  {child.level === 'locked' ? 'Locked' : `${child.progress}%`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Topic Details Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {selectedTopicData ? (
              <div>
                <div
                  className={`bg-gradient-to-br ${getTopicColor(
                    selectedTopicData.level
                  )} rounded-2xl p-4 mb-4 text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getTopicIcon(selectedTopicData.level)}
                    <h3 className="font-bold text-lg">{selectedTopicData.name}</h3>
                  </div>
                  {selectedTopicData.level !== 'locked' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{selectedTopicData.progress}%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2"
                          style={{ width: `${selectedTopicData.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedTopicData.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        Prerequisites
                      </h4>
                      <div className="space-y-2">
                        {selectedTopicData.prerequisites.map((prereqId) => {
                          const prereq = knowledgeGraph[prereqId];
                          return (
                            <div
                              key={prereqId}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                            >
                              {getTopicIcon(prereq.level)}
                              <span className="text-sm text-gray-700">{prereq.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedTopicData.children.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        Next Topics
                      </h4>
                      <div className="space-y-2">
                        {selectedTopicData.children.map((childId) => {
                          const child = knowledgeGraph[childId];
                          return (
                            <div
                              key={childId}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                            >
                              {getTopicIcon(child.level)}
                              <span className="text-sm text-gray-700">{child.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleContinueLearning(selectedTopicData)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl py-3 font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    {selectedTopicData.level === 'locked' ? 'View Prerequisites' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a topic to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
