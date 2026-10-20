import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { PenTool, ArrowLeft, Sparkles, Download, Copy, CheckCircle } from 'lucide-react';

export default function EssayWriterPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [essayType, setEssayType] = useState('argumentative');
  const [wordCount, setWordCount] = useState('500');
  const [tone, setTone] = useState('academic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [essay, setEssay] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEssay = () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const mockEssay = `# ${topic}

## Introduction

${topic} is a significant subject that has garnered considerable attention in recent years. This ${essayType} essay explores the various dimensions of this topic, examining its implications, challenges, and potential solutions. Understanding ${topic} requires a comprehensive analysis of multiple perspectives and evidence-based arguments.

## Body Paragraph 1: Background and Context

To fully appreciate the complexities of ${topic}, it is essential to first establish its historical and contextual foundations. Research has shown that ${topic} emerged as a critical area of study due to several interconnected factors. These include technological advancements, societal changes, and evolving educational paradigms that have shaped our current understanding.

The significance of ${topic} cannot be overstated. It affects various aspects of modern life, from individual decision-making to broader institutional policies. Scholars and practitioners alike have recognized the need for deeper investigation into this area, leading to a growing body of research and practical applications.

## Body Paragraph 2: Key Arguments and Evidence

When examining ${topic}, several key arguments emerge that warrant careful consideration. First and foremost, evidence suggests that ${topic} plays a crucial role in shaping outcomes across multiple domains. Studies have demonstrated correlations between effective implementation of principles related to ${topic} and improved results in both academic and professional settings.

Furthermore, the multifaceted nature of ${topic} requires an interdisciplinary approach. Drawing from fields such as psychology, sociology, technology, and education, we can develop a more nuanced understanding of the challenges and opportunities it presents. This comprehensive perspective enables stakeholders to make informed decisions and develop effective strategies.

## Body Paragraph 3: Challenges and Counterarguments

Despite its importance, ${topic} is not without its challenges and critics. Some argue that the emphasis on ${topic} may overshadow other equally important considerations. Additionally, implementation difficulties, resource constraints, and varying contextual factors can complicate efforts to address ${topic} effectively.

It is important to acknowledge these counterarguments and address them constructively. By recognizing potential limitations and obstacles, we can develop more robust and realistic approaches that account for diverse perspectives and circumstances. This balanced view strengthens rather than weakens the overall argument for the significance of ${topic}.

## Conclusion

In conclusion, ${topic} represents a critical area of inquiry and action that demands continued attention and thoughtful engagement. Through careful analysis of the evidence, consideration of multiple viewpoints, and recognition of both opportunities and challenges, we can work toward more effective approaches and solutions.

The future of ${topic} depends on our collective ability to learn from research, adapt to changing circumstances, and maintain a commitment to evidence-based practices. As we move forward, it will be essential to foster dialogue, encourage innovation, and remain open to new insights that can enhance our understanding and implementation of principles related to ${topic}.

---
*Generated Essay - ${wordCount} words (approximate)*
*Type: ${essayType.charAt(0).toUpperCase() + essayType.slice(1)} Essay*
*Tone: ${tone.charAt(0).toUpperCase() + tone.slice(1)}*`;

      setEssay(mockEssay);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(essay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Essay Writer
                </h1>
                <p className="text-gray-600">Generate high-quality essays and articles with AI</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Essay Settings
                </CardTitle>
                <CardDescription>Configure your essay parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Essay Topic *</Label>
                  <Input
                    placeholder="Enter your essay topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Essay Type</Label>
                  <Select value={essayType} onValueChange={setEssayType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="argumentative">Argumentative</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="expository">Expository</SelectItem>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                      <SelectItem value="narrative">Narrative</SelectItem>
                      <SelectItem value="analytical">Analytical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Word Count</Label>
                  <Select value={wordCount} onValueChange={setWordCount}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">250 words</SelectItem>
                      <SelectItem value="500">500 words</SelectItem>
                      <SelectItem value="750">750 words</SelectItem>
                      <SelectItem value="1000">1000 words</SelectItem>
                      <SelectItem value="1500">1500 words</SelectItem>
                      <SelectItem value="2000">2000 words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateEssay}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Essay'}
                </Button>

                {essay && (
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download as PDF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Essay Display */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Generated Essay</CardTitle>
                  <CardDescription>
                    {essay ? 'Your AI-generated essay is ready' : 'Configure settings and click Generate Essay'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {essay ? (
                    <div className="bg-white p-8 rounded-lg border-2 border-gray-200 min-h-96">
                      <div className="prose prose-sm max-w-none">
                        {essay.split('\n').map((line, index) => {
                          if (line.startsWith('# ')) {
                            return <h1 key={index} className="text-3xl font-bold mb-4">{line.substring(2)}</h1>;
                          } else if (line.startsWith('## ')) {
                            return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.substring(3)}</h2>;
                          } else if (line.startsWith('---')) {
                            return <hr key={index} className="my-4" />;
                          } else if (line.startsWith('*') && line.endsWith('*')) {
                            return <p key={index} className="text-sm text-gray-500 italic">{line.slice(1, -1)}</p>;
                          } else if (line.trim()) {
                            return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
                          }
                          return <br key={index} />;
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400">
                      <PenTool className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No essay generated yet</p>
                      <p className="text-sm">Enter a topic and click Generate Essay to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
