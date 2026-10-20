import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import { 
  Code, 
  ArrowLeft, 
  Play, 
  Terminal,
  Sparkles,
  Copy,
  RefreshCw,
  Bug
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

export default function CodePlaygroundPage() {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(`# Python Calculator
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# Test the functions
print("Addition: 5 + 3 =", add(5, 3))
print("Subtraction: 10 - 4 =", subtract(10, 4))`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    setTimeout(() => {
      // Simulate code execution
      if (language === 'python') {
        setOutput(`Addition: 5 + 3 = 8
Subtraction: 10 - 4 = 6

✅ Program executed successfully!
⏱️ Execution time: 0.043s`);
      } else if (language === 'javascript') {
        setOutput(`[Output]
Result: 42
✅ Code executed successfully!`);
      } else {
        setOutput(`<!DOCTYPE html>
<html>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>

✅ HTML rendered successfully!`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const getAISuggestion = () => {
    setAiSuggestion('Loading AI suggestions...');
    
    setTimeout(() => {
      setAiSuggestion(`🤖 AI Code Assistant Suggestions:

1. **Optimization**: Consider using type hints for better code clarity:
   \`def add(a: int, b: int) -> int:\`

2. **Best Practice**: Add docstrings to your functions:
   \`"""Add two numbers and return the result."""\`

3. **Enhancement**: Add error handling for non-numeric inputs:
   \`try:
       return a + b
   except TypeError:
       return "Invalid input"\`

4. **Testing**: Consider adding unit tests for your functions

Would you like me to refactor your code with these suggestions?`);
    }, 1500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const codeTemplates: Record<string, string> = {
    python: `# Python Example
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
    javascript: `// JavaScript Example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>`
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 p-6 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  AI Code Playground
                </h1>
                <p className="text-gray-600">Write, run, and debug code with AI assistance</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Code Editor</CardTitle>
                    <div className="flex gap-2">
                      <Select value={language} onValueChange={(val) => {
                        setLanguage(val);
                        setCode(codeTemplates[val]);
                        setOutput('');
                      }}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="python">🐍 Python</SelectItem>
                          <SelectItem value="javascript">💛 JavaScript</SelectItem>
                          <SelectItem value="html">🌐 HTML/CSS</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={copyCode}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm min-h-[400px] bg-gray-900 text-green-400 border-0"
                    placeholder="Write your code here..."
                  />
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      onClick={runCode}
                      disabled={isRunning || !code.trim()}
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={getAISuggestion} disabled={!isOnline}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Suggest
                    </Button>
                    <Button variant="outline">
                      <Bug className="w-4 h-4 mr-2" />
                      Debug
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Console */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Output Console
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px]">
                    {output || '> Ready to execute code...\n> Click "Run Code" to see output'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Assistant Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="suggestions">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                      <TabsTrigger value="help">Help</TabsTrigger>
                    </TabsList>
                    <TabsContent value="suggestions" className="space-y-3">
                      {aiSuggestion ? (
                        <div className="text-sm whitespace-pre-wrap bg-orange-50 p-4 rounded-lg">
                          {aiSuggestion}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-8">
                          Click "AI Suggest" to get code improvement recommendations
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="help" className="space-y-3">
                      <div className="text-sm space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold mb-1">💡 Quick Tips</h4>
                          <ul className="text-xs space-y-1 text-gray-600">
                            <li>• Use Ctrl+Enter to run code</li>
                            <li>• Click AI Suggest for improvements</li>
                            <li>• Debug mode shows line-by-line execution</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-semibold mb-1">📚 Documentation</h4>
                          <p className="text-xs text-gray-600">
                            Access language-specific docs and examples
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold mb-1">🎯 Exercises</h4>
                          <p className="text-xs text-gray-600">
                            Practice with coding challenges
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <Code className="w-4 h-4 mr-2" />
                    Load Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Code
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <Bug className="w-4 h-4 mr-2" />
                    Find Bugs
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <Terminal className="w-4 h-4 mr-2" />
                    Explain Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
