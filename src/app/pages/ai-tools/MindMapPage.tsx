import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Network,
  ArrowLeft,
  Sparkles,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  ZoomIn,
  ZoomOut,
  Save,
  Share2,
  Brain,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

interface MindMapNode {
  id: string;
  text: string;
  level: number;
  parentId: string | null;
  color: string;
  x: number;
  y: number;
}

interface SavedMindMap {
  id: string;
  title: string;
  topic: string;
  nodes: MindMapNode[];
  timestamp: number;
  nodeCount: number;
}

const nodeColors = [
  'from-blue-500 to-purple-500',
  'from-green-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-yellow-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-purple-500'
];

export default function MindMapPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'input' | 'generate' | 'visualize'>('input');
  const [topic, setTopic] = useState('');
  const [detailsText, setDetailsText] = useState('');
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedMaps, setSavedMaps] = useState<SavedMindMap[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number; moved: boolean } | null>(null);

  const pointerToCanvasPercent = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const screenX = ((clientX - rect.left) / rect.width) * 100;
    const screenY = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: 50 + (screenX - 50) / zoom,
      y: 50 + (screenY - 50) / zoom,
    };
  };

  const startNodeDrag = (event: React.PointerEvent<HTMLDivElement>, node: MindMapNode) => {
    if (event.button !== 0) return;
    const point = pointerToCanvasPercent(event.clientX, event.clientY);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: node.id, offsetX: node.x - point.x, offsetY: node.y - point.y, moved: false };
    setDraggingNode(node.id);
    setSelectedNode(node.id);
  };

  const moveNode = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointerToCanvasPercent(event.clientX, event.clientY);
    if (!point) return;
    drag.moved = true;
    const x = Math.max(3, Math.min(97, point.x + drag.offsetX));
    const y = Math.max(4, Math.min(96, point.y + drag.offsetY));
    setNodes(current => current.map(node => node.id === drag.id ? { ...node, x, y } : node));
  };

  const stopNodeDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setDraggingNode(null);
  };

  // Load saved mind maps
  useEffect(() => {
    const saved = localStorage.getItem('cognilearn_mindmaps');
    if (saved) {
      setSavedMaps(JSON.parse(saved));
    }
  }, []);

  const generateMindMap = () => {
    if (!topic.trim()) {
      alert('Please enter a topic to generate a mind map');
      return;
    }

    setIsGenerating(true);
    setPhase('generate');

    // Simulate AI processing
    setTimeout(() => {
      const generatedNodes = createMindMapFromTopic(topic, detailsText);
      setNodes(generatedNodes);
      setPhase('visualize');
      setIsGenerating(false);
    }, 2000);
  };

  const createMindMapFromTopic = (mainTopic: string, details: string): MindMapNode[] => {
    const newNodes: MindMapNode[] = [];

    // Central node
    newNodes.push({
      id: 'root',
      text: mainTopic,
      level: 0,
      parentId: null,
      color: nodeColors[0],
      x: 50,
      y: 50
    });

    // Generate sub-topics based on common learning categories
    const subTopics = generateSubTopics(mainTopic, details);

    subTopics.forEach((subTopic, idx) => {
      const angle = (360 / subTopics.length) * idx;
      const radians = (angle * Math.PI) / 180;
      const distance = 25;

      const x = 50 + distance * Math.cos(radians);
      const y = 50 + distance * Math.sin(radians);

      const subNodeId = `sub-${idx}`;
      newNodes.push({
        id: subNodeId,
        text: subTopic.text,
        level: 1,
        parentId: 'root',
        color: nodeColors[(idx + 1) % nodeColors.length],
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y))
      });

      // Add child concepts
      subTopic.children.forEach((child, childIdx) => {
        const childAngle = angle + (childIdx - subTopic.children.length / 2) * 30;
        const childRadians = (childAngle * Math.PI) / 180;
        const childDistance = 20;

        const childX = x + childDistance * Math.cos(childRadians);
        const childY = y + childDistance * Math.sin(childRadians);

        newNodes.push({
          id: `${subNodeId}-child-${childIdx}`,
          text: child,
          level: 2,
          parentId: subNodeId,
          color: nodeColors[(idx + 1) % nodeColors.length],
          x: Math.max(5, Math.min(95, childX)),
          y: Math.max(5, Math.min(95, childY))
        });
      });
    });

    return newNodes;
  };

  const generateSubTopics = (topic: string, details: string) => {
    // Intelligent sub-topic generation based on topic keywords
    const topicLower = topic.toLowerCase();

    // Subject-specific sub-topics
    if (topicLower.includes('math') || topicLower.includes('algebra') || topicLower.includes('calculus')) {
      return [
        { text: 'Fundamentals', children: ['Definitions', 'Axioms', 'Principles'] },
        { text: 'Key Concepts', children: ['Equations', 'Variables', 'Functions'] },
        { text: 'Applications', children: ['Problem Solving', 'Real World', 'Examples'] },
        { text: 'Advanced Topics', children: ['Proofs', 'Theorems', 'Extensions'] }
      ];
    } else if (topicLower.includes('phys') || topicLower.includes('science')) {
      return [
        { text: 'Theory', children: ['Laws', 'Principles', 'Models'] },
        { text: 'Experiments', children: ['Methods', 'Observations', 'Results'] },
        { text: 'Applications', children: ['Technology', 'Engineering', 'Daily Life'] },
        { text: 'Related Fields', children: ['Chemistry', 'Biology', 'Math'] }
      ];
    } else if (topicLower.includes('history') || topicLower.includes('social')) {
      return [
        { text: 'Timeline', children: ['Ancient', 'Medieval', 'Modern'] },
        { text: 'Key Events', children: ['Wars', 'Revolutions', 'Discoveries'] },
        { text: 'Important Figures', children: ['Leaders', 'Scientists', 'Artists'] },
        { text: 'Impact', children: ['Cultural', 'Economic', 'Political'] }
      ];
    } else if (topicLower.includes('program') || topicLower.includes('code') || topicLower.includes('software')) {
      return [
        { text: 'Basics', children: ['Syntax', 'Variables', 'Data Types'] },
        { text: 'Control Flow', children: ['Loops', 'Conditionals', 'Functions'] },
        { text: 'Data Structures', children: ['Arrays', 'Objects', 'Lists'] },
        { text: 'Best Practices', children: ['Design', 'Testing', 'Documentation'] }
      ];
    } else if (topicLower.includes('language') || topicLower.includes('english') || topicLower.includes('literature')) {
      return [
        { text: 'Grammar', children: ['Syntax', 'Parts of Speech', 'Sentence Structure'] },
        { text: 'Vocabulary', children: ['Words', 'Phrases', 'Idioms'] },
        { text: 'Writing', children: ['Essays', 'Stories', 'Poetry'] },
        { text: 'Reading', children: ['Comprehension', 'Analysis', 'Interpretation'] }
      ];
    } else {
      // Generic structure
      return [
        { text: 'Introduction', children: ['Background', 'Definition', 'Importance'] },
        { text: 'Core Concepts', children: ['Key Ideas', 'Principles', 'Rules'] },
        { text: 'Examples', children: ['Case Studies', 'Scenarios', 'Practice'] },
        { text: 'Summary', children: ['Review', 'Takeaways', 'Next Steps'] }
      ];
    }
  };

  const addNode = (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      text: 'New Concept',
      level: parent.level + 1,
      parentId: parentId,
      color: parent.color,
      x: parent.x + (Math.random() - 0.5) * 20,
      y: parent.y + (Math.random() - 0.5) * 20
    };

    setNodes([...nodes, newNode]);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'root') {
      alert('Cannot delete the root node');
      return;
    }

    // Delete node and all its children
    const toDelete = new Set([nodeId]);
    let changed = true;

    while (changed) {
      changed = false;
      nodes.forEach(node => {
        if (node.parentId && toDelete.has(node.parentId) && !toDelete.has(node.id)) {
          toDelete.add(node.id);
          changed = true;
        }
      });
    }

    setNodes(nodes.filter(n => !toDelete.has(n.id)));
    setSelectedNode(null);
  };

  const updateNodeText = (nodeId: string, newText: string) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, text: newText } : n));
  };

  const saveMindMap = () => {
    const newMap: SavedMindMap = {
      id: `map-${Date.now()}`,
      title: topic,
      topic,
      nodes,
      timestamp: Date.now(),
      nodeCount: nodes.length
    };

    const updated = [...savedMaps, newMap];
    setSavedMaps(updated);
    localStorage.setItem('cognilearn_mindmaps', JSON.stringify(updated));
    alert('Mind map saved successfully!');
  };

  const loadMindMap = (map: SavedMindMap) => {
    setTopic(map.topic);
    setNodes(map.nodes);
    setPhase('visualize');
    setShowSaved(false);
  };

  const downloadMindMap = () => {
    const content = `${topic}\n\n${generateTextRepresentation(nodes)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTextRepresentation = (nodeList: MindMapNode[]): string => {
    const root = nodeList.find(n => n.id === 'root');
    if (!root) return '';

    let result = `${root.text}\n`;

    const addChildren = (parentId: string, indent: number) => {
      const children = nodeList.filter(n => n.parentId === parentId);
      children.forEach(child => {
        result += `${'  '.repeat(indent)}├─ ${child.text}\n`;
        addChildren(child.id, indent + 1);
      });
    };

    addChildren('root', 1);
    return result;
  };

  const reset = () => {
    setPhase('input');
    setTopic('');
    setDetailsText('');
    setNodes([]);
    setSelectedNode(null);
    setZoom(1);
  };

  const loadSample = () => {
    setTopic('Artificial Intelligence');
    setDetailsText('Exploring machine learning, neural networks, and AI applications');
  };

  // Input Phase
  if (phase === 'input' || phase === 'generate') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-fuchsia-50 p-6 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  AI Mind Map Generator
                </h1>
                <p className="text-gray-600">Visual concept mapping for better understanding</p>
              </div>
            </div>

            {/* Saved Maps Overview */}
            {savedMaps.length > 0 && !showSaved && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Saved Mind Maps</p>
                      <p className="text-2xl font-bold">{savedMaps.length}</p>
                    </div>
                    <Button onClick={() => setShowSaved(true)} variant="outline">
                      View Saved Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {showSaved ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Saved Mind Maps</CardTitle>
                    <Button variant="ghost" onClick={() => setShowSaved(false)}>Close</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedMaps.map(map => (
                      <div
                        key={map.id}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-fuchsia-300 transition cursor-pointer"
                        onClick={() => loadMindMap(map)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{map.title}</p>
                            <p className="text-sm text-gray-600">{map.nodeCount} nodes • {new Date(map.timestamp).toLocaleDateString()}</p>
                          </div>
                          <Network className="w-5 h-5 text-fuchsia-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Create Your Mind Map</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold">Main Topic</label>
                      <Button variant="ghost" size="sm" onClick={loadSample}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Load Sample
                      </Button>
                    </div>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter the main topic (e.g., Photosynthesis, World War II, JavaScript)"
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Additional Details (Optional)</label>
                    <Textarea
                      value={detailsText}
                      onChange={(e) => setDetailsText(e.target.value)}
                      placeholder="Add any specific concepts, subtopics, or areas you want to focus on..."
                      className="min-h-32"
                    />
                  </div>

                  <Button
                    onClick={generateMindMap}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-6 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating Mind Map...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Mind Map
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </>
    );
  }

  // Visualization Phase
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-fuchsia-50 p-6 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={reset}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Map
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{topic}</h1>
                <p className="text-sm text-gray-600">{nodes.length} concepts mapped</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={saveMindMap}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={downloadMindMap}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Mind Map Canvas */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div ref={canvasRef} className="relative w-full h-[600px] bg-white rounded-lg border-2 border-gray-200 overflow-hidden select-none touch-none">
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                >
                  {/* Draw connections */}
                  {nodes.map(node => {
                    if (!node.parentId) return null;
                    const parent = nodes.find(n => n.id === node.parentId);
                    if (!parent) return null;

                    return (
                      <line
                        key={`line-${node.id}`}
                        x1={`${parent.x}%`}
                        y1={`${parent.y}%`}
                        x2={`${node.x}%`}
                        y2={`${node.y}%`}
                        stroke="#d1d5db"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

                {/* Draw nodes */}
                <div
                  className="absolute inset-0"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                >
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      className={`absolute cursor-grab ${draggingNode === node.id ? 'z-20 cursor-grabbing' : selectedNode === node.id ? 'z-10' : ''}`}
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: `translate(-50%, -50%) ${selectedNode === node.id && draggingNode !== node.id ? 'scale(1.08)' : ''}`,
                        transition: draggingNode === node.id ? 'none' : 'transform 150ms ease',
                        touchAction: 'none'
                      }}
                      onPointerDown={(event) => startNodeDrag(event, node)}
                      onPointerMove={moveNode}
                      onPointerUp={stopNodeDrag}
                      onPointerCancel={stopNodeDrag}
                      onClick={() => setSelectedNode(node.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Move or select ${node.text}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg bg-gradient-to-r ${node.color} text-white shadow-lg ${
                          node.level === 0 ? 'text-lg font-bold' : 'text-sm'
                        }`}
                        style={{
                          minWidth: node.level === 0 ? '120px' : '80px',
                          textAlign: 'center'
                        }}
                      >
                        {node.text}
                      </div>
                      {selectedNode === node.id && node.id !== 'root' && (
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newText = prompt('Edit text:', node.text);
                              if (newText) updateNodeText(node.id, newText);
                            }}
                            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {selectedNode === node.id && node.level < 2 && (
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            addNode(node.id);
                          }}
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-4 bg-fuchsia-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>💡 How to use:</strong> Drag any node to rearrange the map—the connecting lines follow automatically. Click a node to edit, delete, or add child concepts. Dragging works with a mouse, pen, or touch. Zoom in/out using the controls above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
