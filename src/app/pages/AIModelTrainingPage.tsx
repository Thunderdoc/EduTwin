import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import {
  Brain,
  Cpu,
  Zap,
  TrendingUp,
  Activity,
  Database,
  Settings,
  Play,
  Pause,
  StopCircle,
  Save,
  Upload,
  Download,
  RefreshCw,
  BarChart3,
  Network,
  Layers,
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Code,
  FileText,
  Eye,
  Gauge,
  Shield,
  Shuffle,
  Maximize2,
  Filter,
  TrendingDown,
  XCircle,
  Info,
  Flame,
  BarChart,
  LineChart as LineChartIcon,
  Waves,
  Box,
  Microscope
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

// Training data for visualization
const generateTrainingData = (epochs: number) => {
  return Array.from({ length: epochs }, (_, i) => ({
    id: `epoch-${i + 1}`,
    epoch: i + 1,
    loss: Math.max(0.05, 2.5 * Math.exp(-i * 0.15) + Math.random() * 0.1),
    accuracy: Math.min(99, 50 + 45 * (1 - Math.exp(-i * 0.12)) + Math.random() * 2),
    valLoss: Math.max(0.08, 2.8 * Math.exp(-i * 0.13) + Math.random() * 0.15),
    valAccuracy: Math.min(98, 48 + 43 * (1 - Math.exp(-i * 0.11)) + Math.random() * 2.5),
    learningRate: 0.001 * Math.exp(-i * 0.05)
  }));
};

const modelArchitectures = [
  {
    id: 'cnn',
    name: 'Convolutional Neural Network (CNN)',
    description: 'Best for image recognition and computer vision tasks',
    layers: 15,
    parameters: '25.5M',
    icon: '🖼️',
    accuracy: '95.2%'
  },
  {
    id: 'rnn',
    name: 'Recurrent Neural Network (RNN)',
    description: 'Ideal for sequential data and time series',
    layers: 12,
    parameters: '18.3M',
    icon: '⏱️',
    accuracy: '92.8%'
  },
  {
    id: 'transformer',
    name: 'Transformer Model',
    description: 'State-of-the-art for NLP and language understanding',
    layers: 24,
    parameters: '110M',
    icon: '🔤',
    accuracy: '98.1%'
  },
  {
    id: 'lstm',
    name: 'Long Short-Term Memory (LSTM)',
    description: 'Advanced sequential learning with memory',
    layers: 10,
    parameters: '15.7M',
    icon: '🧠',
    accuracy: '93.5%'
  },
  {
    id: 'gan',
    name: 'Generative Adversarial Network (GAN)',
    description: 'For generating synthetic data and images',
    layers: 20,
    parameters: '42.1M',
    icon: '🎨',
    accuracy: '89.4%'
  },
  {
    id: 'resnet',
    name: 'Residual Network (ResNet)',
    description: 'Deep learning with skip connections',
    layers: 50,
    parameters: '65.2M',
    icon: '🔗',
    accuracy: '96.7%'
  }
];

const performanceMetrics = [
  { id: 'metric-1', metric: 'Precision', value: 94.5, color: '#8b5cf6' },
  { id: 'metric-2', metric: 'Recall', value: 92.3, color: '#ec4899' },
  { id: 'metric-3', metric: 'F1-Score', value: 93.4, color: '#3b82f6' },
  { id: 'metric-4', metric: 'AUC-ROC', value: 96.7, color: '#10b981' },
  { id: 'metric-5', metric: 'Specificity', value: 91.8, color: '#f59e0b' }
];

const confusionMatrixData = [
  { id: 'row-1', actual: 'Class A', predicted: 'Class A', value: 950 },
  { id: 'row-2', actual: 'Class A', predicted: 'Class B', value: 30 },
  { id: 'row-3', actual: 'Class A', predicted: 'Class C', value: 20 },
  { id: 'row-4', actual: 'Class B', predicted: 'Class A', value: 25 },
  { id: 'row-5', actual: 'Class B', predicted: 'Class B', value: 940 },
  { id: 'row-6', actual: 'Class B', predicted: 'Class C', value: 35 },
  { id: 'row-7', actual: 'Class C', predicted: 'Class A', value: 15 },
  { id: 'row-8', actual: 'Class C', predicted: 'Class B', value: 40 },
  { id: 'row-9', actual: 'Class C', predicted: 'Class C', value: 945 }
];

const layerPerformance = [
  { id: 'layer-1', layer: 'Input', neurons: 784, activation: 'None', output: 784 },
  { id: 'layer-2', layer: 'Dense 1', neurons: 512, activation: 'ReLU', output: 512 },
  { id: 'layer-3', layer: 'Dropout', neurons: 512, activation: 'None', output: 512 },
  { id: 'layer-4', layer: 'Dense 2', neurons: 256, activation: 'ReLU', output: 256 },
  { id: 'layer-5', layer: 'Dropout', neurons: 256, activation: 'None', output: 256 },
  { id: 'layer-6', layer: 'Dense 3', neurons: 128, activation: 'ReLU', output: 128 },
  { id: 'layer-7', layer: 'Output', neurons: 10, activation: 'Softmax', output: 10 }
];

export default function AIModelTrainingPage() {
  const { language } = useApp();
  const [selectedModel, setSelectedModel] = useState('transformer');
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(50);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState(0.001);
  const [trainingData, setTrainingData] = useState(generateTrainingData(0));
  const [trainingProgress, setTrainingProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && !isPaused && currentEpoch < totalEpochs) {
      interval = setInterval(() => {
        setCurrentEpoch(prev => {
          const newEpoch = prev + 1;
          if (newEpoch >= totalEpochs) {
            setIsTraining(false);
            return totalEpochs;
          }
          return newEpoch;
        });
        setTrainingData(prev => {
          const newData = generateTrainingData(currentEpoch + 1);
          return newData;
        });
        setTrainingProgress(((currentEpoch + 1) / totalEpochs) * 100);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isTraining, isPaused, currentEpoch, totalEpochs]);

  const handleStartTraining = () => {
    if (currentEpoch === 0 || currentEpoch >= totalEpochs) {
      setCurrentEpoch(0);
      setTrainingData(generateTrainingData(0));
      setTrainingProgress(0);
    }
    setIsTraining(true);
    setIsPaused(false);
  };

  const handlePauseTraining = () => {
    setIsPaused(!isPaused);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setIsPaused(false);
  };

  const handleResetTraining = () => {
    setIsTraining(false);
    setIsPaused(false);
    setCurrentEpoch(0);
    setTrainingData(generateTrainingData(0));
    setTrainingProgress(0);
  };

  const currentModelData = modelArchitectures.find(m => m.id === selectedModel);
  const currentMetrics = trainingData[trainingData.length - 1] || {
    loss: 0,
    accuracy: 0,
    valLoss: 0,
    valAccuracy: 0,
    learningRate: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <Brain className="w-10 h-10 text-purple-600" />
              AI Model Training Lab
            </h1>
            <p className="text-gray-600 mt-2">Deep learning model training, evaluation, and optimization platform</p>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm">
            <Activity className="w-4 h-4 mr-2" />
            {isTraining ? 'Training Active' : 'Ready'}
          </Badge>
        </div>

        {/* Training Status Banner */}
        {isTraining && (
          <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300">
            <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
            <AlertTitle className="text-lg font-bold text-blue-900">
              Training in Progress - Epoch {currentEpoch}/{totalEpochs}
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <Progress value={trainingProgress} className="h-3" />
              <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                <div>
                  <span className="text-gray-600">Loss:</span>
                  <span className="font-bold text-blue-600 ml-2">{currentMetrics.loss.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-bold text-green-600 ml-2">{currentMetrics.accuracy.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Val Loss:</span>
                  <span className="font-bold text-orange-600 ml-2">{currentMetrics.valLoss.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Val Accuracy:</span>
                  <span className="font-bold text-purple-600 ml-2">{currentMetrics.valAccuracy.toFixed(2)}%</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar - Configuration */}
          <div className="space-y-6">
            
            {/* Model Selection */}
            <Card className="shadow-xl border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" />
                  Model Architecture
                </CardTitle>
                <CardDescription>Choose your neural network type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelArchitectures.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.icon} {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentModelData && (
                  <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-700">{currentModelData.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-2 rounded-lg">
                        <div className="text-gray-500 text-xs">Layers</div>
                        <div className="font-bold text-purple-600">{currentModelData.layers}</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <div className="text-gray-500 text-xs">Parameters</div>
                        <div className="font-bold text-blue-600">{currentModelData.parameters}</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg col-span-2">
                        <div className="text-gray-500 text-xs">Avg. Accuracy</div>
                        <div className="font-bold text-green-600">{currentModelData.accuracy}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hyperparameters */}
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Hyperparameters
                </CardTitle>
                <CardDescription>Configure training parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Epochs</span>
                    <span className="text-sm font-bold text-blue-600">{totalEpochs}</span>
                  </Label>
                  <Slider
                    value={[totalEpochs]}
                    onValueChange={(value) => setTotalEpochs(value[0])}
                    min={10}
                    max={200}
                    step={10}
                    className="py-2"
                    disabled={isTraining}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Batch Size</span>
                    <span className="text-sm font-bold text-purple-600">{batchSize}</span>
                  </Label>
                  <Slider
                    value={[batchSize]}
                    onValueChange={(value) => setBatchSize(value[0])}
                    min={8}
                    max={128}
                    step={8}
                    className="py-2"
                    disabled={isTraining}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Learning Rate</span>
                    <span className="text-sm font-bold text-pink-600">{learningRate.toFixed(4)}</span>
                  </Label>
                  <Slider
                    value={[learningRate * 10000]}
                    onValueChange={(value) => setLearningRate(value[0] / 10000)}
                    min={1}
                    max={100}
                    step={1}
                    className="py-2"
                    disabled={isTraining}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Optimizer</Label>
                  <Select defaultValue="adam" disabled={isTraining}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adam">Adam</SelectItem>
                      <SelectItem value="sgd">SGD</SelectItem>
                      <SelectItem value="rmsprop">RMSprop</SelectItem>
                      <SelectItem value="adamw">AdamW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Loss Function</Label>
                  <Select defaultValue="crossentropy" disabled={isTraining}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crossentropy">Cross Entropy</SelectItem>
                      <SelectItem value="mse">Mean Squared Error</SelectItem>
                      <SelectItem value="mae">Mean Absolute Error</SelectItem>
                      <SelectItem value="hinge">Hinge Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Training Controls */}
            <Card className="shadow-xl border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-green-600" />
                  Training Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <Button
                  onClick={handleStartTraining}
                  disabled={isTraining && !isPaused}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {currentEpoch === 0 ? 'Start Training' : 'Resume Training'}
                </Button>

                <Button
                  onClick={handlePauseTraining}
                  disabled={!isTraining}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>

                <Button
                  onClick={handleStopTraining}
                  disabled={!isTraining}
                  variant="outline"
                  className="w-full h-12 border-2 border-red-200 hover:bg-red-50"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Training
                </Button>

                <Button
                  onClick={handleResetTraining}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="h-10">
                    <Save className="w-4 h-4 mr-2" />
                    Save Model
                  </Button>
                  <Button variant="outline" size="sm" className="h-10">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-lg border-2 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Loss</p>
                      <p className="text-2xl font-bold text-blue-600">{currentMetrics.loss.toFixed(3)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                      <p className="text-2xl font-bold text-green-600">{currentMetrics.accuracy.toFixed(1)}%</p>
                    </div>
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Epoch</p>
                      <p className="text-2xl font-bold text-purple-600">{currentEpoch}/{totalEpochs}</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Val Loss</p>
                      <p className="text-2xl font-bold text-orange-600">{currentMetrics.valLoss.toFixed(3)}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for Different Views */}
            <Tabs defaultValue="training" className="w-full">
              <TabsList className="grid grid-cols-5 w-full h-12">
                <TabsTrigger value="training" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                  <Activity className="w-4 h-4 mr-2" />
                  Training
                </TabsTrigger>
                <TabsTrigger value="deep" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                  <Microscope className="w-4 h-4 mr-2" />
                  Deep Training
                </TabsTrigger>
                <TabsTrigger value="metrics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="architecture" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                  <Layers className="w-4 h-4 mr-2" />
                  Architecture
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Analysis
                </TabsTrigger>
              </TabsList>

              {/* Training Tab */}
              <TabsContent value="training" className="space-y-6 mt-6">
                <Card className="shadow-xl border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Loss & Accuracy Curves
                    </CardTitle>
                    <CardDescription>Real-time training and validation metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300} key="loss-chart">
                      <LineChart
                        data={trainingData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                        id="training-loss-chart"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-4" />
                        <XAxis dataKey="epoch" stroke="#6b7280" key="xaxis-4" />
                        <YAxis stroke="#6b7280" key="yaxis-4" />
                        <Tooltip
                          key="tooltip-7"
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend key="legend-2" />
                        <Line
                          key="line-2"
                          type="monotone"
                          dataKey="loss"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Training Loss"
                          dot={false}
                          isAnimationActive={false}
                          animationDuration={0}
                        />
                        <Line
                          key="line-3"
                          type="monotone"
                          dataKey="valLoss"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          name="Validation Loss"
                          dot={false}
                          isAnimationActive={false}
                          animationDuration={0}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300} className="mt-6" key="accuracy-chart">
                      <AreaChart
                        data={trainingData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                        id="training-accuracy-chart"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-5" />
                        <XAxis dataKey="epoch" stroke="#6b7280" key="xaxis-5" />
                        <YAxis stroke="#6b7280" key="yaxis-5" />
                        <Tooltip
                          key="tooltip-8"
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend key="legend-3" />
                        <Area
                          key="area-1"
                          type="monotone"
                          dataKey="accuracy"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                          strokeWidth={3}
                          name="Training Accuracy"
                          isAnimationActive={false}
                          animationDuration={0}
                        />
                        <Area
                          key="area-2"
                          type="monotone"
                          dataKey="valAccuracy"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.3}
                          strokeWidth={3}
                          name="Validation Accuracy"
                          isAnimationActive={false}
                          animationDuration={0}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-2 border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-purple-600" />
                      Learning Rate Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={200} key="learning-rate-chart">
                      <LineChart
                        data={trainingData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                        id="learning-rate-line-chart"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-6" />
                        <XAxis dataKey="epoch" stroke="#6b7280" key="xaxis-6" />
                        <YAxis stroke="#6b7280" key="yaxis-6" />
                        <Tooltip
                          key="tooltip-9"
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          key="line-4"
                          type="monotone"
                          dataKey="learningRate"
                          stroke="#ec4899"
                          strokeWidth={3}
                          name="Learning Rate"
                          isAnimationActive={false}
                          animationDuration={0}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Deep Training Tab - Advanced Techniques */}
              <TabsContent value="deep" className="space-y-6 mt-6">
                {/* Transfer Learning Section */}
                <Card className="shadow-xl border-2 border-cyan-100">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <Shuffle className="w-5 h-5 text-cyan-600" />
                      Transfer Learning & Pre-trained Models
                    </CardTitle>
                    <CardDescription>Leverage pre-trained models for faster and better training</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-cyan-200 hover:border-cyan-400 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-cyan-600">ResNet-50</Badge>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">ImageNet weights, 25M parameters</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Load Model
                        </Button>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-600">BERT-Base</Badge>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">NLP tasks, 110M parameters</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Load Model
                        </Button>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">VGG-16</Badge>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Computer vision, 138M params</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Load Model
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          Fine-tuning Strategy
                        </Label>
                        <Select defaultValue="full">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Fine-tuning</SelectItem>
                            <SelectItem value="freeze">Freeze Base Layers</SelectItem>
                            <SelectItem value="partial">Partial Freeze (Last 5 layers)</SelectItem>
                            <SelectItem value="adapter">Adapter Layers Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          Transfer Learning Rate
                        </Label>
                        <Input type="number" defaultValue="0.0001" step="0.0001" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Regularization & Data Augmentation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-xl border-2 border-purple-100">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        Regularization
                      </CardTitle>
                      <CardDescription>Prevent overfitting</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">L2 Regularization</span>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">L1 Regularization</span>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Dropout (0.5)</span>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center justify-between">
                          <span>Regularization Strength (λ)</span>
                          <span className="text-sm font-bold text-purple-600">0.01</span>
                        </Label>
                        <Slider defaultValue={[10]} min={1} max={100} step={1} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-2 border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardTitle className="flex items-center gap-2">
                        <Maximize2 className="w-5 h-5 text-blue-600" />
                        Data Augmentation
                      </CardTitle>
                      <CardDescription>Increase data variety</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shuffle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Random Rotation (±15°)</span>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Maximize2 className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Random Zoom (0.8-1.2x)</span>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Horizontal Flip</span>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-2">
                        <Label>Augmentation Probability</Label>
                        <Slider defaultValue={[80]} min={0} max={100} step={5} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Advanced Training Strategies */}
                <Card className="shadow-xl border-2 border-green-100">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-green-600" />
                      Advanced Training Strategies
                    </CardTitle>
                    <CardDescription>Cutting-edge optimization techniques</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">Early Stopping</h4>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Stop when val loss plateaus</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Patience:</span>
                            <span className="font-bold text-blue-600">10 epochs</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Min Delta:</span>
                            <span className="font-bold text-blue-600">0.001</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">LR Scheduling</h4>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Adaptive learning rate</p>
                        <Select defaultValue="cosine">
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cosine">Cosine Annealing</SelectItem>
                            <SelectItem value="step">Step Decay</SelectItem>
                            <SelectItem value="exponential">Exponential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">Mixed Precision</h4>
                          <Switch />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">FP16/FP32 training</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Speed Boost:</span>
                            <span className="font-bold text-green-600">2-3x</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Memory:</span>
                            <span className="font-bold text-green-600">-50%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">Gradient Clipping</h4>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Prevent exploding gradients</p>
                        <div className="space-y-1">
                          <Label className="text-xs">Clip Value:</Label>
                          <Input type="number" defaultValue="1.0" className="h-8 text-xs" />
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">Weight Decay</h4>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">L2 penalty on weights</p>
                        <div className="space-y-1">
                          <Label className="text-xs">Decay Rate:</Label>
                          <Input type="number" defaultValue="0.0001" step="0.0001" className="h-8 text-xs" />
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">Warmup Strategy</h4>
                          <Switch />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Gradual LR increase</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Warmup Steps:</span>
                            <span className="font-bold text-indigo-600">1000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hyperparameter Auto-Tuning */}
                <Card className="shadow-xl border-2 border-orange-100">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      Automated Hyperparameter Tuning
                    </CardTitle>
                    <CardDescription>Let AI find optimal hyperparameters</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-900">AutoML Optimization</AlertTitle>
                      <AlertDescription className="text-blue-800 text-sm">
                        Search for best hyperparameters using Bayesian Optimization or Grid Search
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Search Strategy</Label>
                        <Select defaultValue="bayesian">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bayesian">Bayesian Optimization</SelectItem>
                            <SelectItem value="grid">Grid Search</SelectItem>
                            <SelectItem value="random">Random Search</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Max Trials</Label>
                        <Input type="number" defaultValue="50" min="10" max="200" />
                      </div>

                      <div className="space-y-2">
                        <Label>Optimization Metric</Label>
                        <Select defaultValue="val_accuracy">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="val_accuracy">Validation Accuracy</SelectItem>
                            <SelectItem value="val_loss">Validation Loss</SelectItem>
                            <SelectItem value="f1">F1 Score</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      <Zap className="w-4 h-4 mr-2" />
                      Start Auto-Tuning (Est: 2-4 hours)
                    </Button>
                  </CardContent>
                </Card>

                {/* Model Ensemble */}
                <Card className="shadow-xl border-2 border-pink-100">
                  <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5 text-pink-600" />
                      Model Ensemble & Comparison
                    </CardTitle>
                    <CardDescription>Compare and combine multiple models</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2">
                            <th className="text-left p-2">Model</th>
                            <th className="text-center p-2">Accuracy</th>
                            <th className="text-center p-2">Loss</th>
                            <th className="text-center p-2">Ensemble</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">ResNet-50</td>
                            <td className="text-center p-2 text-green-600 font-bold">96.2%</td>
                            <td className="text-center p-2">0.082</td>
                            <td className="text-center p-2"><Switch defaultChecked /></td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">Transformer</td>
                            <td className="text-center p-2 text-green-600 font-bold">98.1%</td>
                            <td className="text-center p-2">0.045</td>
                            <td className="text-center p-2"><Switch defaultChecked /></td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">LSTM</td>
                            <td className="text-center p-2 text-green-600 font-bold">93.5%</td>
                            <td className="text-center p-2">0.132</td>
                            <td className="text-center p-2"><Switch /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900">Ensemble Performance</h4>
                          <p className="text-xs text-gray-600 mt-1">Expected accuracy</p>
                        </div>
                        <div className="text-2xl font-bold text-green-600">97.8%</div>
                      </div>
                    </div>

                    <Button className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                      <Network className="w-4 h-4 mr-2" />
                      Create Ensemble Model
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-xl border-2 border-green-100">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={300} key="performance-bar-chart">
                        <BarChart
                          data={performanceMetrics}
                          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                          id="performance-metrics-bar-chart"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="grid-7" />
                          <XAxis dataKey="metric" stroke="#6b7280" key="xaxis-7" />
                          <YAxis stroke="#6b7280" key="yaxis-7" />
                          <Tooltip
                            key="tooltip-10"
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '2px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar
                            key="bar-3"
                            dataKey="value"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                            isAnimationActive={false}
                            animationDuration={0}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-2 border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Radar Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ResponsiveContainer width="100%" height={300} key="performance-radar-chart">
                        <RadarChart
                          data={performanceMetrics}
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                          id="performance-metrics-radar-chart"
                        >
                          <PolarGrid stroke="#e5e7eb" key="polar-grid-2" />
                          <PolarAngleAxis dataKey="metric" stroke="#6b7280" key="polar-angle-2" />
                          <PolarRadiusAxis stroke="#6b7280" key="polar-radius-2" />
                          <Radar
                            key="radar-2"
                            name="Performance"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.5}
                            isAnimationActive={false}
                            animationDuration={0}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-xl border-2 border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      Detailed Metrics Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {performanceMetrics.map(metric => (
                        <div key={metric.id} className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
                            <span className="text-xl font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Architecture Tab */}
              <TabsContent value="architecture" className="space-y-6 mt-6">
                <Card className="shadow-xl border-2 border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-600" />
                      Neural Network Layers
                    </CardTitle>
                    <CardDescription>Detailed layer configuration and data flow</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {layerPerformance.map((layer, index) => (
                        <div key={layer.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500">Layer Type</div>
                              <div className="font-bold text-gray-900">{layer.layer}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Neurons</div>
                              <div className="font-bold text-blue-600">{layer.neurons}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Activation</div>
                              <div className="font-bold text-purple-600">{layer.activation}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Output Shape</div>
                              <div className="font-bold text-green-600">{layer.output}</div>
                            </div>
                          </div>
                          <GitBranch className="w-6 h-6 text-purple-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-xl border-2 border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        Model Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Total Parameters</span>
                        <span className="font-bold text-blue-600">25.5M</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Trainable Parameters</span>
                        <span className="font-bold text-green-600">24.8M</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Non-Trainable</span>
                        <span className="font-bold text-purple-600">700K</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Model Size</span>
                        <span className="font-bold text-orange-600">102 MB</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-2 border-green-100">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-green-600" />
                        Code Export
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <Button variant="outline" className="w-full justify-start h-12 border-2">
                        <FileText className="w-4 h-4 mr-2" />
                        Export to PyTorch
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-2">
                        <FileText className="w-4 h-4 mr-2" />
                        Export to TensorFlow
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-2">
                        <FileText className="w-4 h-4 mr-2" />
                        Export to ONNX
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 border-2">
                        <Code className="w-4 h-4 mr-2" />
                        View Model Code
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="space-y-6 mt-6">
                <Card className="shadow-xl border-2 border-orange-100">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-orange-600" />
                      Confusion Matrix (Simulated)
                    </CardTitle>
                    <CardDescription>Model prediction analysis across classes</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="p-3 bg-gray-100 font-bold border">Actual / Predicted</th>
                            <th className="p-3 bg-blue-50 font-bold border">Class A</th>
                            <th className="p-3 bg-green-50 font-bold border">Class B</th>
                            <th className="p-3 bg-purple-50 font-bold border">Class C</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 bg-blue-50 font-bold border">Class A</td>
                            <td className="p-3 text-center bg-green-100 border font-bold text-green-700">950</td>
                            <td className="p-3 text-center bg-red-50 border text-red-600">30</td>
                            <td className="p-3 text-center bg-red-50 border text-red-600">20</td>
                          </tr>
                          <tr>
                            <td className="p-3 bg-green-50 font-bold border">Class B</td>
                            <td className="p-3 text-center bg-red-50 border text-red-600">25</td>
                            <td className="p-3 text-center bg-green-100 border font-bold text-green-700">940</td>
                            <td className="p-3 text-center bg-red-50 border text-red-600">35</td>
                          </tr>
                          <tr>
                            <td className="p-3 bg-purple-50 font-bold border">Class C</td>
                            <td className="p-3 text-center bg-red-50 border text-red-600">15</td>
                            <td className="p-3 text-center bg-red-50 border text-red-600">40</td>
                            <td className="p-3 text-center bg-green-100 border font-bold text-green-700">945</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-xl border-2 border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardTitle className="text-lg">Training Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">Model converging well with minimal overfitting</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">Validation accuracy trending upward consistently</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">Consider early stopping at epoch 80</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-2 border-green-100">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="text-lg">Optimization Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">Try increasing batch size to 64 for faster training</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">Add dropout layers to reduce overfitting</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700">Consider data augmentation for better generalization</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-2 border-purple-100">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="text-lg">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Test Data
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Zap className="w-4 h-4 mr-2" />
                          Run Inference
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Deploy Model
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}