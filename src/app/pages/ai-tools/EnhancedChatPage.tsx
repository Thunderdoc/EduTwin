import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Brain,
  Mic,
  Image as ImageIcon
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function EnhancedChatPage() {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your enhanced AI learning assistant powered by GPT-4. I can help you with:

• Explaining complex topics in simple terms
• Solving problems step-by-step
• Creating study materials
• Answering questions in any subject
• Providing learning strategies

What would you like to learn today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate enhanced AI response with intelligent context analysis
    setTimeout(() => {
      let aiResponse = '';
      const lowerInput = inputText.toLowerCase();

      // Programming Languages
      if (lowerInput.includes('python')) {
        aiResponse = `Great choice! Python is one of the most versatile programming languages. Let me break it down for you:

**What is Python?**
Python is a high-level, interpreted programming language known for its simplicity and readability.

**Key Features:**
1. **Easy to Learn**: Clean syntax that reads like English
2. **Versatile**: Used in web dev, data science, AI, automation
3. **Powerful Libraries**: NumPy, Pandas, TensorFlow, Django

**Quick Example:**
\\\`\\\`\\\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\\\`\\\`\\\`

**Next Steps:**
1. Install Python from python.org
2. Try basic syntax (variables, loops, functions)
3. Build small projects
4. Explore libraries relevant to your interests

Would you like me to explain any specific Python concept in detail?`;
      }

      // JavaScript
      else if (lowerInput.includes('javascript') || lowerInput.includes('js ')) {
        aiResponse = `JavaScript is the language of the web! Here's everything you need to know:

**What is JavaScript?**
A high-level, interpreted programming language that makes web pages interactive.

**Key Concepts:**
• **Variables**: let, const, var
• **Functions**: Regular, arrow, async
• **DOM Manipulation**: Interact with HTML/CSS
• **Events**: Click, scroll, keyboard input
• **Modern Features**: ES6+, promises, async/await

**Quick Example:**
\\\`\\\`\\\`javascript
const greet = (name) => {
  return \\\`Hello, \\\${name}!\\\`;
};
console.log(greet("World"));
\\\`\\\`\\\`

**Popular Frameworks:**
React, Vue, Angular, Node.js, Express

Want to dive deeper into any specific JavaScript concept?`;
      }

      // React
      else if (lowerInput.includes('react')) {
        aiResponse = `React is a powerful library for building user interfaces! Here's what makes it special:

**What is React?**
A JavaScript library developed by Meta for building interactive UIs with reusable components.

**Core Concepts:**
1. **Components**: Reusable UI pieces
2. **JSX**: HTML-like syntax in JavaScript
3. **State**: Data that changes over time (useState)
4. **Effects**: Side effects handling (useEffect)
5. **Props**: Data passed between components

**Simple Example:**
\\\`\\\`\\\`jsx
function Welcome({ name }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}
\\\`\\\`\\\`

**Why Use React?**
✓ Component reusability
✓ Virtual DOM for performance
✓ Huge ecosystem
✓ Great developer tools

Need help with a specific React topic?`;
      }

      // Math/Calculus
      else if (lowerInput.includes('calculus') || lowerInput.includes('derivative') || lowerInput.includes('integral')) {
        aiResponse = `Calculus is the mathematics of change! Let me explain:

**What is Calculus?**
The study of continuous change, focusing on rates of change (derivatives) and accumulation (integrals).

**Two Main Branches:**

1. **Differential Calculus** (Derivatives)
   • Measures rate of change
   • Slope of tangent lines
   • Example: velocity is derivative of position

2. **Integral Calculus** (Integrals)
   • Measures accumulation
   • Area under curves
   • Example: distance is integral of velocity

**Key Rules:**
• **Power Rule**: d/dx(xⁿ) = n·xⁿ⁻¹
• **Chain Rule**: d/dx(f(g(x))) = f'(g(x))·g'(x)
• **Product Rule**: d/dx(u·v) = u'v + uv'

**Real Applications:**
Physics (motion), Economics (optimization), Engineering (systems), Biology (growth rates)

Which calculus concept would you like to explore in depth?`;
      }

      // Machine Learning / AI
      else if (lowerInput.includes('machine learning') || lowerInput.includes('ml') || lowerInput.includes('artificial intelligence') || lowerInput.includes(' ai')) {
        aiResponse = `Machine Learning is transforming technology! Here's a comprehensive overview:

**What is Machine Learning?**
A subset of AI where computers learn patterns from data without explicit programming.

**Three Main Types:**

1. **Supervised Learning**
   • Trained with labeled data
   • Examples: Classification, Regression
   • Use cases: Spam detection, price prediction

2. **Unsupervised Learning**
   • Finds patterns in unlabeled data
   • Examples: Clustering, Dimensionality reduction
   • Use cases: Customer segmentation, anomaly detection

3. **Reinforcement Learning**
   • Learns through trial and error
   • Examples: Game AI, robotics
   • Use cases: Self-driving cars, chess engines

**Popular Algorithms:**
• Linear Regression
• Decision Trees
• Neural Networks
• Support Vector Machines
• k-Nearest Neighbors

**Getting Started:**
1. Learn Python
2. Study statistics & linear algebra
3. Practice with scikit-learn
4. Explore deep learning (TensorFlow/PyTorch)

What aspect of ML interests you most?`;
      }

      // Data Science
      else if (lowerInput.includes('data science') || lowerInput.includes('data analysis')) {
        aiResponse = `Data Science is one of the most in-demand fields! Here's everything you need:

**What is Data Science?**
The practice of extracting insights and knowledge from structured/unstructured data.

**Core Skills:**
1. **Programming**: Python, R, SQL
2. **Statistics**: Probability, hypothesis testing
3. **Machine Learning**: Predictive models
4. **Visualization**: Matplotlib, Tableau, Power BI
5. **Big Data**: Spark, Hadoop

**Typical Workflow:**
1. **Collect** data from various sources
2. **Clean** and preprocess data
3. **Explore** with statistical analysis
4. **Model** using ML algorithms
5. **Visualize** insights
6. **Communicate** findings

**Key Libraries (Python):**
• pandas (data manipulation)
• NumPy (numerical computing)
• scikit-learn (ML)
• Matplotlib/Seaborn (visualization)
• TensorFlow (deep learning)

**Career Path:**
Junior Analyst → Data Scientist → Senior DS → Lead DS → Chief Data Officer

Ready to start your data science journey?`;
      }

      // Study techniques
      else if (lowerInput.includes('study') || lowerInput.includes('learn better') || lowerInput.includes('memory')) {
        aiResponse = `Let me share proven study techniques that actually work:

**🎯 Active Learning Strategies:**

1. **Spaced Repetition**
   • Review material at increasing intervals
   • Day 1, Day 3, Day 7, Day 14, Day 30
   • Best for long-term retention

2. **Active Recall**
   • Test yourself WITHOUT looking at notes
   • More effective than re-reading
   • Use flashcards, practice questions

3. **Pomodoro Technique**
   • 25 minutes focused work
   • 5 minute break
   • Repeat 4 times, then 15-30 min break

4. **Feynman Technique**
   • Explain concept in simple terms
   • Identify gaps in understanding
   • Research and simplify further

**🧠 Memory Enhancement:**
• **Chunking**: Break info into smaller groups
• **Mnemonics**: Create memorable acronyms
• **Visualization**: Create mental images
• **Association**: Link to existing knowledge

**⚡ Quick Tips:**
✓ Study in 25-50 minute blocks
✓ Get 7-9 hours sleep
✓ Exercise regularly
✓ Stay hydrated
✓ Teach others what you learn
✓ Mix subjects (interleaved practice)

Which technique would you like to try first?`;
      }

      // Exam preparation
      else if (lowerInput.includes('exam') || lowerInput.includes('test prep')) {
        aiResponse = `Ace your exams with this comprehensive preparation strategy:

**📅 4-Week Exam Prep Plan:**

**Week 1: Assessment**
• Review syllabus and past exams
• Identify weak areas
• Create study schedule
• Gather all materials

**Week 2-3: Deep Study**
• Focus on difficult topics
• Practice problems daily
• Create summary notes
• Form study groups

**Week 4: Intensive Review**
• Take full practice tests
• Review mistakes thoroughly
• Memorize key concepts
• Reduce study hours (avoid burnout)

**🎯 Day Before Exam:**
✓ Light review only
✓ Organize materials
✓ Get full night's sleep
✓ Prepare clothes/snacks
✗ NO cramming
✗ NO all-nighters

**📝 During Exam:**
1. Read all instructions carefully
2. Budget time per section
3. Answer easy questions first
4. Mark difficult ones, return later
5. Check your work if time remains

**💡 Subject-Specific Tips:**
• **Math**: Practice problems > theory
• **Science**: Understand concepts, not just facts
• **Languages**: Read extensively, practice writing
• **History**: Create timelines, connect events

What subject are you preparing for?`;
      }

      // Career/Jobs
      else if (lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('interview')) {
        aiResponse = `Let me guide you through career planning and job preparation:

**🚀 Career Path Development:**

**1. Self-Assessment**
   • Identify your interests and strengths
   • Take career aptitude tests
   • Consider work-life balance preferences
   • Define success criteria

**2. Skill Building**
   • Technical skills (programming, data analysis)
   • Soft skills (communication, leadership)
   • Industry certifications
   • Continuous learning mindset

**3. Networking**
   • LinkedIn profile optimization
   • Industry events and conferences
   • Professional associations
   • Informational interviews

**💼 Job Search Strategy:**
✓ Tailor resume for each job
✓ Write compelling cover letters
✓ Build portfolio/projects
✓ Practice elevator pitch
✓ Leverage referrals

**🎤 Interview Preparation:**

**Common Questions:**
• "Tell me about yourself"
• "Why this company?"
• "Your greatest strength/weakness"
• "Where do you see yourself in 5 years?"
• Behavioral (STAR method)

**Technical Interviews:**
• Data structures & algorithms
• System design
• Coding challenges
• Domain knowledge

**After Interview:**
• Send thank-you email within 24 hours
• Follow up after 1 week if no response
• Continue job search (don't wait)

Which aspect of career development interests you most?`;
      }

      // Generic "explain" request
      else if (lowerInput.includes('explain')) {
        aiResponse = `I'd be happy to explain! To give you the best explanation, could you tell me:

1. **Your current level**: Beginner, Intermediate, or Advanced?
2. **Preferred style**: Simple analogy, technical details, or visual examples?
3. **Context**: What you already know about this topic?

This helps me tailor the explanation to your learning style! 🎯`;
      }

      // Hello/Greetings
      else if (lowerInput.includes('hello') || lowerInput.includes('hi ') || lowerInput.includes('hey')) {
        aiResponse = `Hello! 👋 I'm your enhanced AI learning assistant powered by GPT-4. I'm here to help you master any subject!

**I can help you with:**
📚 Programming (Python, JavaScript, React, etc.)
🧮 Math & Science (Calculus, Physics, Chemistry)
💻 Technology (AI, Data Science, Web Dev)
📖 Study Techniques & Memory Tricks
🎯 Exam Preparation Strategies
💼 Career Guidance & Interview Prep

**Popular Topics Right Now:**
• Machine Learning fundamentals
• React development
• Calculus basics
• Study optimization
• Career planning

What would you like to learn about today? Be specific for the best results!`;
      }

      // Thank you
      else if (lowerInput.includes('thank')) {
        aiResponse = `You're very welcome! 😊 I'm glad I could help!

Remember:
✓ Learning is a journey, not a destination
✓ Ask questions whenever you're stuck
✓ Practice makes perfect
✓ Every expert was once a beginner

Feel free to ask me anything else - I'm here 24/7 to support your learning! 🎓✨`;
      }

      // Help
      else if (lowerInput.includes('help')) {
        aiResponse = `I'm here to help you learn effectively! Here's how I can assist:

**💻 Technical Topics:**
• Programming: Python, JavaScript, Java, C++, React
• Web Development: HTML, CSS, Frontend/Backend
• Data Science: ML, AI, Analytics, Statistics
• Databases: SQL, NoSQL, Database design

**📚 Academic Subjects:**
• Mathematics: Algebra, Calculus, Statistics
• Sciences: Physics, Chemistry, Biology
• Computer Science: Algorithms, Data Structures
• Languages: Grammar, Vocabulary, Writing

**🎯 Learning Support:**
• Study techniques & time management
• Memory improvement strategies
• Exam preparation tips
• Project ideas & guidance

**💡 How to Get Best Results:**
1. Be specific in your questions
2. Mention your current level
3. Ask for examples when needed
4. Request step-by-step explanations

**Example Good Questions:**
✓ "Explain Python decorators with examples"
✓ "How do I solve quadratic equations step-by-step?"
✓ "What's the best way to prepare for coding interviews?"

What would you like to learn about?`;
      }

      // Default - More intelligent fallback
      else {
        // Try to extract key concepts from the question
        const keywords = inputText.split(' ').filter(word => word.length > 4);
        const topic = keywords.length > 0 ? keywords[0] : inputText;

        aiResponse = `Great question about "${inputText}"! Let me provide you with a comprehensive answer.

**Understanding ${topic}:**

While I don't have a pre-programmed response for this specific query, I can help you explore it systematically:

**1. Define the Concept**
First, let's establish what exactly you're asking about. ${topic} can be approached from multiple angles.

**2. Key Questions to Consider:**
• What is the core definition or principle?
• What problem does it solve?
• How is it applied in practice?
• What are common misconceptions?

**3. Learning Approach:**
✓ Start with fundamentals
✓ Find practical examples
✓ Practice hands-on
✓ Connect to related concepts

**💡 To give you a better answer:**
Could you provide more context? For example:
• Are you learning this for school/work/personal interest?
• What's your current level of understanding?
• What specific aspect interests you most?
• Would you like theoretical explanation or practical examples?

**Or try asking:**
• "Explain ${topic} simply"
• "Give me examples of ${topic}"
• "How do I learn ${topic} step by step?"
• "What are the applications of ${topic}?"

I'm here to help you learn - just give me a bit more detail! 🎯`;
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickPrompts = [
    'Explain quantum physics simply',
    'Help me with calculus',
    'Teach me machine learning',
    'Study tips for exams'
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-6 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Enhanced AI Chat
                  </h1>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <Sparkles className="w-3 h-3 mr-1" />
                    GPT-4
                  </Badge>
                </div>
                <p className="text-gray-600">Advanced conversational AI for personalized learning</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="shadow-lg border-0 mb-6">
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[75%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                          : 'bg-white border shadow-sm text-gray-800'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border shadow-sm p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-gray-50">
                <div className="flex gap-2 mb-3">
                  <Button variant="outline" size="sm" disabled={!isOnline}>
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Ask anything..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                    disabled={!isOnline}
                  />
                  <Button variant="outline" size="sm" disabled={!isOnline}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSend}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    disabled={!isOnline || !inputText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInputText(prompt);
                        setTimeout(() => handleSend(), 100);
                      }}
                      disabled={!isOnline}
                      className="text-xs"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      {prompt}
                    </Button>
                  ))}
                </div>

                {!isOnline && (
                  <p className="text-sm text-orange-600 text-center mt-2">
                    Internet connection required for AI chat
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Context-Aware
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Remembers conversation history for better responses</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Multi-Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Expert knowledge across all academic subjects</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  Adaptive Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Adjusts explanation style to your level</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
