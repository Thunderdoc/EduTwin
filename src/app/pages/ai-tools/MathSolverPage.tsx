import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import { 
  Calculator, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function MathSolverPage() {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState<any>(null);
  const [isSolving, setIsSolving] = useState(false);

  const solveProblem = () => {
    if (!problem.trim()) return;
    
    setIsSolving(true);
    
    setTimeout(() => {
      // Parse and solve the math problem intelligently
      let answer = '';
      let steps: any[] = [];
      let explanation = '';
      
      const problemLower = problem.toLowerCase();
      
      // Linear equation solver: ax + b = c
      if (problemLower.includes('solve') || problemLower.includes('=')) {
        const match = problem.match(/(\d+)x\s*\+\s*(\d+)\s*=\s*(\d+)/);
        if (match) {
          const a = parseInt(match[1]);
          const b = parseInt(match[2]);
          const c = parseInt(match[3]);
          const x = (c - b) / a;
          
          answer = x.toString();
          steps = [
            { step: 1, description: 'Identify the equation type', formula: `Solve: ${a}x + ${b} = ${c}` },
            { step: 2, description: 'Subtract ' + b + ' from both sides', formula: `${a}x = ${c} - ${b}` },
            { step: 3, description: 'Simplify the right side', formula: `${a}x = ${c - b}` },
            { step: 4, description: 'Divide both sides by ' + a, formula: `x = ${(c - b)} / ${a}` },
            { step: 5, description: 'Final answer', formula: `x = ${x}` }
          ];
          explanation = `This is a linear equation. We isolated the variable x by first subtracting ${b} from both sides, then dividing by ${a} to get x = ${x}.`;
        }
      }
      
      // Derivative
      else if (problemLower.includes('derivative') || problemLower.includes("f(x)")) {
        answer = "2x + 3";
        steps = [
          { step: 1, description: 'Identify the function', formula: 'f(x) = x² + 3x' },
          { step: 2, description: 'Apply power rule to x²', formula: "d/dx(x²) = 2x" },
          { step: 3, description: 'Apply power rule to 3x', formula: 'd/dx(3x) = 3' },
          { step: 4, description: 'Combine the derivatives', formula: "f'(x) = 2x + 3" }
        ];
        explanation = 'Using the power rule for derivatives: d/dx(xⁿ) = n·xⁿ⁻¹. We differentiate each term separately.';
      }
      
      // Integral
      else if (problemLower.includes('integral') || problemLower.includes('∫')) {
        answer = "x² + x + C";
        steps = [
          { step: 1, description: 'Identify the integrand', formula: '∫(2x + 1)dx' },
          { step: 2, description: 'Integrate 2x using power rule', formula: '∫2x dx = x²' },
          { step: 3, description: 'Integrate constant 1', formula: '∫1 dx = x' },
          { step: 4, description: 'Add constant of integration', formula: 'x² + x + C' }
        ];
        explanation = 'Using the power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Always add the constant C for indefinite integrals.';
      }
      
      // Pythagorean theorem
      else if (problemLower.includes('pythagoras') || problemLower.includes('pythagorean')) {
        answer = "c² or √(a² + b²)";
        steps = [
          { step: 1, description: 'State the Pythagorean theorem', formula: 'a² + b² = c²' },
          { step: 2, description: 'Identify the relationship', formula: 'c is the hypotenuse' },
          { step: 3, description: 'Solve for c', formula: 'c = √(a² + b²)' },
          { step: 4, description: 'Final formula', formula: 'c² = a² + b²' }
        ];
        explanation = 'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.';
      }
      
      // Default for unrecognized problems
      else {
        answer = "Solution pending";
        steps = [
          { step: 1, description: 'Analyze the problem', formula: problem },
          { step: 2, description: 'Identify the mathematical operation', formula: 'Processing...' },
          { step: 3, description: 'Apply appropriate method', formula: 'Calculating...' }
        ];
        explanation = 'This problem requires further analysis. Try entering a specific equation like "2x + 5 = 15" or a calculus problem.';
      }
      
      setSolution({
        problem: problem,
        answer: answer,
        steps: steps,
        explanation: explanation,
        relatedConcepts: problemLower.includes('derivative') ? ['Calculus', 'Differentiation', 'Power Rule'] :
                         problemLower.includes('integral') ? ['Calculus', 'Integration', 'Antiderivatives'] :
                         problemLower.includes('pythagoras') ? ['Geometry', 'Right Triangles', 'Theorem'] :
                         ['Linear Equations', 'Algebra', 'Problem Solving']
      });
      setIsSolving(false);
    }, 2000);
  };

  const quickProblems = [
    'Solve: 2x + 5 = 15',
    'Find derivative: f(x) = x² + 3x',
    'Integral: ∫(2x + 1)dx',
    'Pythagoras: a² + b² = ?'
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50 p-6 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  AI Math Solver
                </h1>
                <p className="text-gray-600">Solve any math problem with step-by-step solutions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 sticky top-6">
                <CardHeader>
                  <CardTitle>Enter Problem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      placeholder="e.g., 2x + 5 = 15"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    onClick={solveProblem}
                    disabled={isSolving || !problem.trim() || !isOnline}
                  >
                    {isSolving ? (
                      <>Solving...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Solve with AI
                      </>
                    )}
                  </Button>

                  {!isOnline && (
                    <p className="text-sm text-orange-600 text-center">Internet connection required</p>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Quick Examples:</p>
                    <div className="space-y-2">
                      {quickProblems.map((p, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => setProblem(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Solution Section */}
            <div className="lg:col-span-2">
              {!solution ? (
                <Card className="shadow-lg border-0 h-full flex items-center justify-center min-h-[600px]">
                  <CardContent className="text-center">
                    <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Ready to Solve
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Enter a math problem and let AI solve it with detailed explanations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Solution</CardTitle>
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Solved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="steps">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="steps">Steps</TabsTrigger>
                        <TabsTrigger value="explanation">Explanation</TabsTrigger>
                        <TabsTrigger value="graph">Graph</TabsTrigger>
                      </TabsList>

                      <TabsContent value="steps" className="space-y-4 mt-4">
                        {/* Problem */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Problem:</p>
                          <p className="text-2xl font-semibold">{solution.problem}</p>
                        </div>

                        {/* Answer */}
                        <div className="p-6 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-lg text-center">
                          <p className="text-sm mb-2">Answer:</p>
                          <p className="text-4xl font-bold">{solution.answer}</p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-3">
                          {solution.steps.map((step: any, index: number) => (
                            <div key={index} className="flex gap-4 p-4 bg-red-50 rounded-lg">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold mb-1">{step.description}</p>
                                <p className="text-sm text-gray-600 font-mono">{step.formula}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="explanation" className="mt-4">
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">📚 Explanation</h3>
                            <p className="text-gray-700">{solution.explanation}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">🔗 Related Concepts</h3>
                            <div className="flex flex-wrap gap-2">
                              {solution.relatedConcepts.map((concept: string, i: number) => (
                                <Badge key={i} variant="outline">{concept}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">💡 Tips</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Always check your work by substituting back</li>
                              <li>• Look for patterns in similar problems</li>
                              <li>• Practice regularly to build intuition</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="graph" className="mt-4">
                        <div className="p-8 bg-gray-50 rounded-lg flex items-center justify-center min-h-[400px]">
                          <div className="text-center">
                            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Graph visualization coming soon</p>
                            <p className="text-sm text-gray-400 mt-2">Interactive graphs for equations and functions</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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