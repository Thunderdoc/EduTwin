import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { 
  Brain, 
  Send, 
  ArrowLeft, 
  Lightbulb, 
  Zap, 
  BookOpen, 
  Languages,
  User,
  Bot,
  WifiOff
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const offlineQuickActions = [
  { label: 'Learn Python', icon: BookOpen, prompt: 'Teach me Python basics' },
  { label: 'Explain HTML', icon: BookOpen, prompt: 'Explain HTML fundamentals' },
  { label: 'Study Tips', icon: Lightbulb, prompt: 'Give me study tips' },
  { label: 'Memory Tricks', icon: Brain, prompt: 'Share memory techniques' },
];

export default function AIChatPage() {
  const { isOnline, language } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your AI learning assistant. How can I help you learn today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [responseHistory, setResponseHistory] = useState<Map<string, number>>(new Map());

  // Helper function to add variety to responses
  const getVariation = (baseResponses: string[], key: string): string => {
    const count = responseHistory.get(key) || 0;
    const index = count % baseResponses.length;
    setResponseHistory(new Map(responseHistory.set(key, count + 1)));
    return baseResponses[index];
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate AI response with intelligent context-aware responses
    setTimeout(() => {
      let aiResponseText = '';
      const lowerText = messageText.toLowerCase();

      // Extract sentiment and intent
      const isLearning = lowerText.includes('learn') || lowerText.includes('teach') || lowerText.includes('understand');
      const isStuck = lowerText.includes('stuck') || lowerText.includes('confused') || lowerText.includes('lost') || lowerText.includes('help');
      const isAsking = lowerText.includes('what') || lowerText.includes('how') || lowerText.includes('why') || lowerText.includes('?');
      const needsExample = lowerText.includes('example') || lowerText.includes('show me') || lowerText.includes('demonstrate');

      // Detect question type and provide contextual answers with variations
      if (lowerText.includes('python')) {
        let pythonResponse = getVariation([
          'Python is a versatile, high-level programming language known for its simple, readable syntax. It\'s perfect for beginners and widely used in web development, data science, AI/ML, automation, and more. Key features include: dynamic typing, extensive libraries (NumPy, pandas, Django), and strong community support.',
          'Let me tell you about Python! 🐍 It\'s an incredibly popular programming language created by Guido van Rossum. Python excels at: data analysis (pandas, NumPy), web development (Django, Flask), automation, and artificial intelligence. Its clean syntax makes it beginner-friendly while remaining powerful for experts.',
          'Python is my favorite language to teach! It reads almost like English, making it ideal for beginners. Major use cases: web backends, data science, machine learning, scripting, and automation. Popular frameworks include Django (web), TensorFlow (AI), and Pandas (data). Fun fact: Python is named after Monty Python, not the snake!'
        ], 'python');

        // Add contextual follow-up based on intent
        if (isLearning) {
          pythonResponse += '\n\n**Starting Python:**\n1. Install Python from python.org\n2. Learn basics: variables, loops, functions\n3. Practice on small projects\n4. Use online resources (Python.org tutorials)\n\nShould I guide you through the first steps?';
        } else if (isStuck) {
          pythonResponse += '\n\n**Having trouble with Python?**\n• Share the specific error or concept\n• Tell me what you\'re trying to do\n• Show me your code (if any)\n\nI\'ll help you understand and fix it!';
        } else if (needsExample) {
          pythonResponse += '\n\n**Quick Python Example:**\n```python\n# Hello World\nprint("Hello, World!")\n\n# Variables\nname = "Alice"\nage = 25\n\n# Function\ndef greet(person):\n    return f"Hello, {person}!"\n\nprint(greet(name))\n```\n\nWant more examples?';
        } else {
          pythonResponse += '\n\nWhat aspect of Python interests you most?';
        }
        aiResponseText = pythonResponse;
      } else if (lowerText.includes('javascript') || lowerText.includes('js')) {
        aiResponseText = getVariation([
          'JavaScript is the programming language of the web! It runs in browsers and enables interactive websites. With JS, you can manipulate HTML/CSS, handle events, make API calls, and build full applications using frameworks like React, Vue, or Angular. Modern JavaScript (ES6+) includes features like arrow functions, promises, async/await, and modules.',
          'JavaScript (JS) powers the modern web! Originally designed for browsers, it now runs everywhere thanks to Node.js. Key features: event-driven, asynchronous programming, DOM manipulation, and a rich ecosystem. Popular frameworks: React (Facebook), Vue (lightweight), Angular (Google). ES6+ brought game-changing features like arrow functions, destructuring, and async/await. Where should we start?',
          'Let\'s explore JavaScript! 🚀 It\'s the only language that runs natively in all web browsers, making it essential for web development. JavaScript enables: dynamic websites, server-side development (Node.js), mobile apps (React Native), and even desktop apps (Electron). The language has evolved tremendously with ES6+ features. What would you like to learn about JS?'
        ], 'javascript');
      } else if (lowerText.includes('html')) {
        aiResponseText = getVariation([
          'HTML (HyperText Markup Language) is the foundation of all web pages. It structures content using tags like <div>, <p>, <h1>-<h6>, <img>, <a>, and <form>. HTML5 introduced semantic elements like <header>, <nav>, <article>, <section>, and <footer> for better page structure and SEO. HTML isn\'t a programming language—it\'s a markup language that defines page structure.',
          'HTML is where every web page begins! Think of it as the skeleton of a website. You use tags (elements) to structure content: headings (<h1>-<h6>), paragraphs (<p>), images (<img>), links (<a>), and more. HTML5 brought semantic tags like <header>, <nav>, <main>, <article> for better organization and accessibility. It\'s easy to learn but powerful when combined with CSS and JavaScript!',
          'Let me break down HTML for you! It\'s a markup language that defines the structure and content of web pages. Every website you visit is built with HTML at its core. Key concepts: elements/tags, attributes, semantic structure, and forms. HTML5 is the current version with support for video, audio, and advanced graphics. Want to see some examples?'
        ], 'html');
      } else if (lowerText.includes('css')) {
        aiResponseText = getVariation([
          'CSS (Cascading Style Sheets) styles and layouts web pages. It controls colors, fonts, spacing, positioning, animations, and responsive design. Key concepts include: selectors, box model, flexbox, grid, media queries, transitions, and animations. Modern CSS frameworks like Tailwind CSS make styling faster and more consistent.',
          '🎨 CSS is the styling language of the web! Think of HTML as the structure and CSS as the paint and decoration. You can control: colors, fonts, layouts (flexbox, grid), spacing (margin, padding), positioning (absolute, relative), animations, and responsive design (mobile-first). Modern approaches include utility-first frameworks (Tailwind) and CSS-in-JS. What styling challenge are you facing?',
          'CSS brings websites to life! Key areas to master: **Selectors** (targeting elements), **Box Model** (margin, border, padding, content), **Flexbox** (1D layouts), **Grid** (2D layouts), **Positioning** (static, relative, absolute, fixed), **Responsive Design** (media queries), and **Animations** (transitions, keyframes). Modern CSS is incredibly powerful! Want to learn a specific technique?'
        ], 'css');
      } else if (lowerText.includes('react')) {
        aiResponseText = getVariation([
          'React is a popular JavaScript library for building user interfaces, developed by Facebook. It uses components (reusable UI pieces), JSX (HTML-like syntax in JS), hooks (useState, useEffect), and virtual DOM for efficient rendering. React follows a declarative approach and enables building SPAs (Single Page Applications) with great performance.',
          '⚛️ React revolutionized UI development! Created by Facebook, it uses a **component-based** architecture where you build reusable pieces. Key concepts: **JSX** (write HTML in JavaScript), **Hooks** (useState for state, useEffect for side effects), **Props** (pass data down), **Virtual DOM** (efficient updates). React powers Facebook, Instagram, Netflix, and thousands more. Ready to build your first React app?',
          'React is the most popular JavaScript library for building modern UIs! Core principles: **Components** (building blocks), **State Management** (useState, useReducer), **Effects** (useEffect for data fetching), **Props** (data flow), **Context API** (global state), and **Lifecycle** (mounting, updating, unmounting). The ecosystem includes React Router (navigation), Redux (state), and Next.js (framework). What React concept interests you?'
        ], 'react');
      } else if (lowerText.includes('math') || lowerText.includes('mathematics')) {
        aiResponseText = getVariation([
          'Mathematics is the science of numbers, patterns, and logic. Key areas include: algebra (equations, variables), geometry (shapes, angles), calculus (derivatives, integrals), statistics (data analysis), and trigonometry (triangles, waves). Math builds critical thinking and problem-solving skills essential for science, engineering, and data science.',
          '📐 Mathematics is the universal language of the universe! Major branches: **Algebra** (solving equations, variables), **Geometry** (shapes, angles, theorems), **Calculus** (rates of change, areas under curves), **Statistics** (probability, data analysis), **Trigonometry** (triangles, waves, periodic functions), and **Linear Algebra** (vectors, matrices). Math powers everything from physics to computer graphics! Which area challenges you most?',
          'Math is problem-solving at its finest! Core areas: **Arithmetic** (basics), **Algebra** (abstract problem-solving), **Geometry** (spatial reasoning), **Calculus** (change and motion), **Statistics** (data & probability), **Discrete Math** (logic, sets, graphs). Real-world applications: encryption (number theory), AI (linear algebra), finance (calculus), games (trigonometry). What math topic are you studying?'
        ], 'math');
      } else if (lowerText.includes('physics')) {
        aiResponseText = getVariation([
          'Physics studies matter, energy, and their interactions. Major branches include: mechanics (motion, forces), thermodynamics (heat, energy), electromagnetism (electricity, magnetism), optics (light), and quantum physics (atomic behavior). Physics explains everything from falling objects to black holes and forms the foundation for engineering and technology.',
          '⚡ Physics explains HOW the universe works! Key areas: **Mechanics** (Newton\'s laws, motion, energy), **Thermodynamics** (heat, entropy, energy transfer), **Electromagnetism** (electricity, magnetism, waves), **Optics** (light, lenses, reflection), **Quantum Mechanics** (atomic scale weirdness), **Relativity** (space-time, E=mc²). Physics powers all technology - from smartphones to rockets! What fascinates you?',
          'Physics is the fundamental science! Study these branches: **Classical Mechanics** (forces, motion, energy), **Electricity & Magnetism** (circuits, fields, waves), **Waves & Optics** (sound, light, interference), **Thermodynamics** (heat engines, entropy), **Modern Physics** (relativity, quantum). Applications: engineering, electronics, aerospace, renewable energy. Which physics concept do you want to explore?'
        ], 'physics');
      } else if (lowerText.includes('chemistry')) {
        aiResponseText = getVariation([
          'Chemistry is the study of matter, its properties, and transformations. It includes: organic chemistry (carbon compounds), inorganic chemistry (minerals, metals), physical chemistry (energy, kinetics), analytical chemistry (composition analysis), and biochemistry (biological molecules). Chemistry is essential for medicine, materials science, and environmental studies.',
          '🧪 Chemistry is the central science connecting physics, biology, and medicine! Major branches: **Organic Chemistry** (carbon, life molecules), **Inorganic Chemistry** (metals, minerals, catalysts), **Physical Chemistry** (thermodynamics, kinetics, quantum), **Analytical Chemistry** (identifying substances), **Biochemistry** (biological processes). Chemistry creates medicines, materials, and solutions to global challenges! What interests you?',
          'Chemistry transforms matter! Core areas: **General Chemistry** (atoms, bonds, reactions), **Organic** (carbon-based molecules, pharmaceuticals), **Inorganic** (metals, coordination compounds), **Physical** (energy, rates, equilibrium), **Analytical** (lab techniques, spectroscopy). Real applications: drug development, battery technology, materials engineering, environmental protection. Which chemistry topic are you studying?'
        ], 'chemistry');
      } else if (lowerText.includes('biology')) {
        aiResponseText = getVariation([
          'Biology studies living organisms and life processes. Main areas include: cell biology (cellular structure/function), genetics (DNA, heredity), ecology (organisms and environments), physiology (body systems), evolution (species development), and microbiology (bacteria, viruses). Biology is crucial for medicine, biotechnology, and understanding our natural world.',
          '🧬 Biology is the science of life! Key fields: **Cell Biology** (cellular structures, organelles), **Genetics** (DNA, genes, inheritance), **Ecology** (ecosystems, environmental interactions), **Physiology** (organ systems, body functions), **Evolution** (natural selection, adaptation), **Microbiology** (bacteria, viruses, fungi). Modern biology powers medicine, genetics, and conservation! What aspect of life science interests you?',
          'Biology reveals how life works! Major branches: **Molecular Biology** (DNA, proteins, gene expression), **Cellular** (cell structure/division), **Anatomy & Physiology** (body systems), **Ecology** (populations, ecosystems), **Evolution** (species change over time), **Genetics** (heredity patterns). Applications: CRISPR gene editing, vaccine development, conservation biology. Which biological topic are you exploring?'
        ], 'biology');
      } else if (lowerText.includes('study tips') || lowerText.includes('how to study')) {
        aiResponseText = getVariation([
          '🎯 Effective Study Tips:\n1. **Spaced Repetition** - Review material at increasing intervals\n2. **Active Recall** - Test yourself instead of re-reading\n3. **Pomodoro Technique** - 25-min focus + 5-min break cycles\n4. **Teach Others** - Explaining concepts solidifies understanding\n5. **Mix Subjects** - Interleaved practice improves retention\n6. **Sleep Well** - Memory consolidation happens during sleep\n7. **Stay Hydrated** - Dehydration impairs cognitive function',
          '📚 Science-Backed Study Strategies:\n1. **Active Learning** - Engage with material actively, not passively\n2. **Distributed Practice** - Study over multiple sessions, not all at once\n3. **Practice Testing** - Quiz yourself frequently\n4. **Elaborative Interrogation** - Ask yourself "why" and "how"\n5. **Self-Explanation** - Explain concepts in your own words\n6. **Interleaving** - Mix different topics in one session\n7. **Rest & Recovery** - Take breaks, exercise, sleep 7-9 hours',
          '💡 Proven Study Techniques for Success:\n1. **Feynman Technique** - Teach like you\'re explaining to a child\n2. **SQ3R Method** - Survey, Question, Read, Recite, Review\n3. **Focus Sessions** - 50-minute deep work with 10-minute breaks\n4. **Retrieval Practice** - Close books and recall information\n5. **Concept Mapping** - Draw connections between ideas\n6. **Study Environment** - Dedicated, quiet space with good lighting\n7. **Accountability** - Study groups or partners for motivation'
        ], 'study_tips');
      } else if (lowerText.includes('memory') || lowerText.includes('remember')) {
        aiResponseText = getVariation([
          '🧠 Powerful Memory Techniques:\n1. **Mnemonics** - Create acronyms or phrases (ROY G BIV for rainbow colors)\n2. **Chunking** - Break large info into smaller groups (phone numbers)\n3. **Visualization** - Create mental images of concepts\n4. **Method of Loci** - Associate info with familiar locations\n5. **Association** - Link new info to existing knowledge\n6. **Repetition** - Review multiple times over days/weeks\n7. **Elaboration** - Explain WHY something works',
          '🎯 Memory Enhancement Strategies:\n1. **Story Method** - Create narratives connecting facts\n2. **Acronyms & Acrostics** - First letters form memorable words/sentences\n3. **Sensory Encoding** - Use multiple senses (visual, auditory, kinesthetic)\n4. **Memory Palace** - Mental walk through familiar places\n5. **Rhymes & Songs** - Music makes information stick\n6. **Spaced Review** - Review at 1 day, 1 week, 1 month intervals\n7. **Emotional Connection** - Attach feelings to memories',
          '💪 Boost Your Memory Power:\n1. **Dual Coding** - Combine words with images/diagrams\n2. **Peg System** - Associate numbers with concrete objects\n3. **Mind Mapping** - Visual brainstorming with connections\n4. **Active Retrieval** - Force recall without looking at notes\n5. **Sleep & Exercise** - Physical health improves memory\n6. **Reduce Interference** - Study similar subjects at different times\n7. **Teach Someone** - Best way to cement knowledge'
        ], 'memory');
      } else if (lowerText.includes('focus') || lowerText.includes('concentration')) {
        aiResponseText = getVariation([
          '🎯 Boost Your Focus:\n1. **Eliminate Distractions** - Phone on silent, close unnecessary tabs\n2. **Time Blocking** - Dedicate specific times for deep work\n3. **Single-Tasking** - Focus on one thing at a time\n4. **Take Breaks** - 5-10 min breaks prevent burnout\n5. **Exercise** - Physical activity improves mental clarity\n6. **Meditation** - Even 5 mins daily enhances concentration\n7. **Optimize Environment** - Good lighting, comfortable temperature, minimal noise',
          '🧘 Master Your Focus:\n1. **Digital Detox** - Remove phone from study area\n2. **Pomodoro Method** - 25 min work + 5 min break\n3. **Priority Matrix** - Focus on important, not just urgent\n4. **White Noise** - Block distracting sounds\n5. **Hydration** - Drink water every hour\n6. **Power Naps** - 15-20 min recharge when tired\n7. **Accountability** - Tell someone your focus goal',
          '⚡ Concentration Hacks:\n1. **Morning Peak** - Tackle hardest work early\n2. **No Multitasking** - Brain works best on one thing\n3. **Exercise First** - 10 min movement before studying\n4. **Clear Workspace** - Minimize visual clutter\n5. **Background Music** - Lo-fi or classical (no lyrics)\n6. **Breathing Techniques** - 4-7-8 breath for calm\n7. **Set Intentions** - Know exactly what you\'re doing'
        ], 'focus');
      } else if (lowerText.includes('motivation') || lowerText.includes('motivate')) {
        aiResponseText = getVariation([
          '💪 Stay Motivated:\n1. **Set Clear Goals** - Define specific, achievable targets\n2. **Track Progress** - Visualize your improvements\n3. **Reward Yourself** - Celebrate small wins\n4. **Find Your Why** - Connect learning to your bigger purpose\n5. **Study Buddies** - Accountability partners help\n6. **Variety** - Mix learning methods to stay engaged\n7. **Growth Mindset** - Embrace challenges as opportunities',
          '🚀 Motivation Boosters:\n1. **Vision Board** - Visual your goals daily\n2. **Small Wins** - Break big goals into tiny victories\n3. **Social Proof** - Share goals publicly\n4. **Identity** - Be the person who does X\n5. **Dopamine Hits** - Reward after completing tasks\n6. **Role Models** - Follow inspiring achievers\n7. **Why Power** - Remember your deeper reason',
          '🔥 Stay Fired Up:\n1. **Morning Ritual** - Start with win (make bed, exercise)\n2. **Progress Tracking** - Streaks, charts, check marks\n3. **Accountability Partner** - Report daily to friend\n4. **Energy Management** - Work with your natural rhythms\n5. **Inspiration Diet** - Consume motivating content\n6. **Future Self** - Write letter from future you\n7. **Momentum** - Do something, anything, to start'
        ], 'motivation');
      } else if (lowerText.includes('time management') || lowerText.includes('schedule')) {
        aiResponseText = getVariation([
          '⏰ Master Time Management:\n1. **Prioritize** - Use Eisenhower Matrix (urgent/important)\n2. **Plan Ahead** - Weekly/daily schedules\n3. **Set Deadlines** - Self-imposed deadlines create urgency\n4. **Batch Similar Tasks** - Group related activities\n5. **Say No** - Protect your study time\n6. **Use Tools** - Calendars, timers, task managers\n7. **Morning Routine** - Start days with high-priority tasks',
          '📅 Time Management Mastery:\n1. **Time Blocking** - Assign blocks for specific tasks\n2. **Eat the Frog** - Hardest task first thing\n3. **Two-Minute Rule** - If <2 min, do it now\n4. **Energy Audit** - Match tasks to energy levels\n5. **Buffer Time** - Add 20% extra time to estimates\n6. **Weekly Review** - Plan Sunday for next week\n7. **Digital Calendar** - Color-code by category',
          '⚡ Time Optimization:\n1. **MIT (Most Important Tasks)** - 3 priorities daily\n2. **Parkinson\'s Law** - Set tight deadlines\n3. **Batch Processing** - Group similar tasks together\n4. **Pareto Principle** - Focus on 20% that gives 80% results\n5. **Time Auditing** - Track how you spend time\n6. **Automation** - Automate repetitive tasks\n7. **Say No** - Protect your valuable time'
        ], 'time');
      } else if (lowerText.includes('career') || lowerText.includes('job')) {
        aiResponseText = getVariation([
          '💼 Career Guidance:\nExplore these paths based on your interests:\n- **STEM**: Engineering, Data Science, Medicine, Research\n- **Creative**: Design, Writing, Marketing, Arts\n- **Business**: Finance, Management, Entrepreneurship\n- **Technology**: Software Development, Cybersecurity, AI/ML\n- **Social**: Teaching, Psychology, Social Work\n\nKey steps: 1) Identify your passions 2) Build relevant skills 3) Network actively 4) Gain experience through internships 5) Keep learning',
          '🎯 Career Path Finder:\n\n**High-Demand Fields 2025:**\n• **AI/ML Engineer** - $100K-150K\n• **Data Scientist** - $90K-140K\n• **Full-Stack Developer** - $80K-130K\n• **Cloud Architect** - $120K-180K\n• **UX Designer** - $70K-110K\n• **Product Manager** - $100K-150K\n\n**Getting Started:**\n1. Skills assessment\n2. Build portfolio/projects\n3. Network (LinkedIn, events)\n4. Internships/freelance\n5. Interview practice\n\nWhich field interests you?',
          '🚀 Career Planning:\n\n**Tech Career Tracks:**\n📊 **Data Path**: Analyst → Scientist → ML Engineer\n💻 **Engineering Path**: Junior Dev → Senior → Lead → Architect\n🎨 **Design Path**: UI Designer → UX → Product Designer\n📱 **Product Path**: Associate PM → PM → Senior PM\n\n**Success Formula:**\n✓ Technical skills (coding, tools)\n✓ Soft skills (communication, teamwork)\n✓ Portfolio (3-5 strong projects)\n✓ Networking (conferences, online)\n✓ Continuous learning (trends, tech)\n\nWhere do you see yourself?'
        ], 'career');
      } else if (lowerText.includes('data science') || lowerText.includes('machine learning') || lowerText.includes('ai')) {
        aiResponseText = getVariation([
          '🤖 AI & Data Science:\nData Science analyzes data to extract insights using statistics, programming (Python/R), and visualization. Machine Learning enables computers to learn from data without explicit programming. Key concepts:\n- **Supervised Learning**: Trained with labeled data (classification, regression)\n- **Unsupervised Learning**: Finds patterns in unlabeled data (clustering)\n- **Deep Learning**: Neural networks for complex patterns (images, text)\n\nStart with: Python, pandas, NumPy, scikit-learn, TensorFlow',
          '🧠 AI/ML Learning Path:\n\n**Phase 1: Foundations (2-3 months)**\n• Python programming\n• Statistics & probability\n• Linear algebra basics\n• pandas, NumPy\n\n**Phase 2: Machine Learning (3-4 months)**\n• Supervised learning (regression, classification)\n• Unsupervised learning (clustering, PCA)\n• scikit-learn library\n• Feature engineering\n\n**Phase 3: Deep Learning (4-6 months)**\n• Neural networks\n• CNNs (computer vision)\n• RNNs/Transformers (NLP)\n• TensorFlow/PyTorch\n\n**Projects:**\nBuild 3-5 projects: prediction model, NLP chatbot, image classifier\n\nWhere should we start?',
          '📊 Data Science Roadmap:\n\n**Skills Breakdown:**\n1. **Programming** (Python/R) - 30%\n2. **Statistics** (hypothesis testing, distributions) - 25%\n3. **ML Algorithms** (classification, regression, clustering) - 25%\n4. **Visualization** (matplotlib, seaborn, Tableau) - 10%\n5. **Domain Knowledge** (business context) - 10%\n\n**Popular Algorithms:**\n• Linear/Logistic Regression\n• Decision Trees & Random Forest\n• K-Means Clustering\n• Neural Networks\n• Gradient Boosting (XGBoost)\n\n**Hot Areas:**\n✨ Large Language Models (GPT, BERT)\n✨ Computer Vision (YOLO, Stable Diffusion)\n✨ Reinforcement Learning\n\nWhich area excites you?'
        ], 'ai_ml');
      } else if (lowerText.includes('example') || lowerText.includes('show me')) {
        aiResponseText = 'I\'d be happy to provide an example! Could you specify which topic you\'d like an example for? For instance:\n- Programming code examples (Python, JavaScript, etc.)\n- Math problem walkthroughs\n- Science experiments\n- Essay structures\n- Real-world applications of concepts\n\nJust let me know what you\'re studying!';
      } else if (lowerText.includes('explain simply') || lowerText.includes('eli5')) {
        aiResponseText = 'I\'ll break it down into simple terms! What specific topic would you like me to explain? I can simplify concepts from any subject - just ask about:\n- Programming concepts\n- Scientific theories\n- Mathematical formulas\n- Historical events\n- Or anything else you\'re learning!';
      } else if (lowerText.includes('detail') || lowerText.includes('in-depth')) {
        aiResponseText = 'I can provide a detailed, in-depth explanation! Please specify which topic you\'d like me to dive deep into:\n- Technical concepts\n- Theoretical frameworks\n- Step-by-step processes\n- Advanced applications\n- Research-level explanations\n\nWhat would you like to explore in detail?';
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        aiResponseText = getVariation([
          'Hello! 👋 I\'m your AI learning assistant, ready to help you master any subject! I can:\n✅ Explain concepts simply or in detail\n✅ Provide study strategies and memory techniques\n✅ Help with programming, math, science, and more\n✅ Offer career guidance and motivation\n✅ Create learning plans tailored to you\n\nWhat would you like to learn about today?',
          'Hi there! Great to see you! 🌟 I\'m here to supercharge your learning journey. Whether you need help with:\n• Programming (Python, JavaScript, Web Dev)\n• Sciences (Physics, Chemistry, Biology)\n• Math (Calculus, Algebra, Statistics)\n• Study techniques and productivity\n• Career advice and skill development\n\nI\'ve got you covered! What\'s on your mind?',
          'Hey! Welcome back to your learning space! 🎓 I\'m your personal AI tutor ready to assist with anything from basic concepts to advanced topics. My superpowers include breaking down complex ideas, providing study tips, explaining code, and keeping you motivated. What can I help you learn today?'
        ], 'hello');
      } else if (lowerText.includes('help')) {
        aiResponseText = getVariation([
          '🤝 I\'m here to help! I can assist you with:\n\n📚 **Subjects**: Math, Science, Programming, Languages, History\n🎯 **Study Skills**: Memory techniques, time management, focus strategies\n💻 **Technology**: Python, JavaScript, Web Dev, AI/ML, Data Science\n🎓 **Academic**: Essay writing, research, exam prep\n🚀 **Career**: Path guidance, skill building, interview prep\n\nWhat specific topic do you need help with?',
          'Absolutely, I\'m here to help you succeed! 💪 I specialize in:\n\n🔹 **Technical Skills**: Programming, databases, algorithms, web development\n🔹 **Sciences**: Physics, chemistry, biology, mathematics\n🔹 **Learning Skills**: Memory techniques, productivity hacks, exam strategies\n🔹 **Career Growth**: Tech careers, interview prep, skill roadmaps\n\nTell me what you\'re working on and I\'ll guide you through it!',
          'You\'ve got a friend in learning! 🌟 My expertise covers:\n\n✨ **Programming**: Python, JavaScript, Java, web technologies\n✨ **STEM**: Math, physics, chemistry, biology\n✨ **Study Science**: Effective learning methods, retention techniques\n✨ **Career Development**: Tech paths, portfolio building, interviews\n\nWhat challenge are you facing? Let\'s tackle it together!'
        ], 'help');
      } else if (lowerText.includes('thank')) {
        aiResponseText = getVariation([
          'You\'re very welcome! 😊 I\'m always here to help you learn and grow. If you have more questions or need clarification on anything, don\'t hesitate to ask. Happy learning! 🎓✨',
          'My pleasure! That\'s what I\'m here for! 🌟 Learning is a journey, and I\'m excited to be part of yours. Feel free to come back anytime with questions. Keep up the great work! 💪',
          'You\'re welcome! 🙌 It makes me happy to help you learn. Remember, there are no silly questions here - curiosity is the key to mastery! Don\'t hesitate to ask anything else. You\'re doing great! 🚀'
        ], 'thanks');
      } else if (lowerText.includes('web') || lowerText.includes('website') || lowerText.includes('html') || lowerText.includes('css')) {
        aiResponseText = '🌐 **Web Development Fundamentals:**\n\n**Three Core Technologies:**\n1. **HTML** - Structure (skeleton)\n2. **CSS** - Styling (appearance)\n3. **JavaScript** - Interactivity (behavior)\n\n**Getting Started:**\n• Start with HTML basics (tags, elements, attributes)\n• Learn CSS for styling (colors, layouts, responsive design)\n• Add JavaScript for dynamic features\n• Practice building small projects\n• Explore frameworks (React, Vue, Angular)\n\n**Resources:**\nMDN Web Docs, freeCodeCamp, W3Schools\n\nWant to dive deeper into any specific web technology?';
      } else if (lowerText.includes('algorithm') || lowerText.includes('data structure')) {
        aiResponseText = '💻 **Algorithms & Data Structures:**\n\n**Essential Data Structures:**\n• Arrays & Lists\n• Stacks & Queues\n• Trees & Graphs\n• Hash Tables\n• Heaps\n\n**Common Algorithms:**\n• Sorting (Quick, Merge, Bubble)\n• Searching (Binary, Linear)\n• Recursion\n• Dynamic Programming\n• Graph Traversal (BFS, DFS)\n\n**Why Important?**\n✓ Efficient code\n✓ Technical interviews\n✓ Problem-solving skills\n✓ System optimization\n\n**Learning Path:**\n1. Master basics (arrays, loops)\n2. Understand Big O notation\n3. Practice on LeetCode/HackerRank\n4. Study common patterns\n5. Build projects\n\nWhich data structure interests you most?';
      } else if (lowerText.includes('database') || lowerText.includes('sql')) {
        aiResponseText = '🗄️ **Databases Explained:**\n\n**Types of Databases:**\n\n1. **SQL (Relational)**\n   • MySQL, PostgreSQL, SQL Server\n   • Structured data, tables\n   • ACID compliance\n\n2. **NoSQL (Non-relational)**\n   • MongoDB, Cassandra, Redis\n   • Flexible schema\n   • Scalability\n\n**SQL Basics:**\n```sql\nSELECT * FROM users WHERE age > 18;\nINSERT INTO products VALUES (...);\nUPDATE orders SET status = \'shipped\';\nDELETE FROM cart WHERE user_id = 123;\n```\n\n**Key Concepts:**\n• Tables, Rows, Columns\n• Primary & Foreign Keys\n• Joins (INNER, LEFT, RIGHT)\n• Indexing for performance\n• Normalization\n\n**When to Use:**\n• SQL: Banking, E-commerce, Structured data\n• NoSQL: Social media, Real-time apps, Big data\n\nNeed help with specific SQL queries?';
      } else if (lowerText.includes('design') || lowerText.includes('ui') || lowerText.includes('ux')) {
        aiResponseText = '🎨 **UI/UX Design Principles:**\n\n**Core Principles:**\n1. **Clarity** - Clear, understandable interface\n2. **Consistency** - Uniform design patterns\n3. **Feedback** - Visual responses to actions\n4. **Efficiency** - Minimize user effort\n5. **Accessibility** - Usable by everyone\n\n**Design Process:**\n1. Research (user needs, competitors)\n2. Wireframing (structure)\n3. Prototyping (interactive mockup)\n4. Testing (user feedback)\n5. Iteration (improvements)\n\n**Tools:**\n• Figma (collaborative design)\n• Adobe XD (prototyping)\n• Sketch (Mac design tool)\n• InVision (prototypes)\n\n**Color Theory:**\n• Primary, secondary, tertiary colors\n• Contrast for readability\n• Emotional associations\n• Accessibility (WCAG standards)\n\n**Typography:**\n• Font pairing\n• Hierarchy (headings, body)\n• Readability\n• Responsive sizing\n\nWant to learn more about any specific design aspect?';
      } else if (lowerText.includes('git') || lowerText.includes('github') || lowerText.includes('version control')) {
        aiResponseText = '🔧 **Git & Version Control:**\n\n**What is Git?**\nA distributed version control system for tracking code changes and collaborating with others.\n\n**Essential Commands:**\n```bash\ngit init              # Start new repository\ngit clone <url>       # Copy repository\ngit add .             # Stage changes\ngit commit -m "msg"   # Save changes\ngit push              # Upload to remote\ngit pull              # Download updates\ngit branch            # List branches\ngit checkout -b new   # Create branch\ngit merge             # Combine branches\n```\n\n**Workflow:**\n1. Create/clone repository\n2. Make changes to files\n3. Stage changes (git add)\n4. Commit with message\n5. Push to GitHub\n6. Create pull request\n7. Review and merge\n\n**Best Practices:**\n✓ Commit often with clear messages\n✓ Use branches for features\n✓ Pull before push\n✓ Review before merging\n✓ Write good commit messages\n\n**GitHub Features:**\n• Repositories\n• Pull Requests\n• Issues & Projects\n• Actions (CI/CD)\n• Pages (hosting)\n\nNeed help with specific Git commands?';
      } else if (lowerText.includes('node') || lowerText.includes('backend') || lowerText.includes('api')) {
        aiResponseText = '⚙️ **Backend Development & APIs:**\n\n**What is Backend?**\nServer-side development handling logic, databases, authentication, and APIs.\n\n**Popular Technologies:**\n• **Node.js** - JavaScript runtime\n• **Express** - Web framework\n• **Django** - Python framework\n• **Spring Boot** - Java framework\n• **Ruby on Rails** - Ruby framework\n\n**REST API Basics:**\n```javascript\nGET    /api/users      # Get all users\nGET    /api/users/1    # Get user by ID\nPOST   /api/users      # Create user\nPUT    /api/users/1    # Update user\nDELETE /api/users/1    # Delete user\n```\n\n**Key Concepts:**\n• Request/Response cycle\n• HTTP methods (GET, POST, PUT, DELETE)\n• Status codes (200, 404, 500)\n• Authentication (JWT, OAuth)\n• Database integration\n• Middleware\n\n**Simple Express Example:**\n```javascript\nconst express = require(\'express\');\nconst app = express();\n\napp.get(\'/api/hello\', (req, res) => {\n  res.json({ message: \'Hello World\' });\n});\n\napp.listen(3000);\n```\n\nWant to build your first API?';
      } else if (lowerText.includes('book') || lowerText.includes('recommend')) {
        aiResponseText = '📚 **Learning Resource Recommendations:**\n\n**Programming:**\n• "Clean Code" by Robert Martin\n• "The Pragmatic Programmer"\n• "You Don\'t Know JS" series\n• "Introduction to Algorithms" (CLRS)\n\n**Web Development:**\n• freeCodeCamp (free)\n• The Odin Project (free)\n• MDN Web Docs (reference)\n• CSS-Tricks (tutorials)\n\n**Online Platforms:**\n• Coursera - University courses\n• Udemy - Practical skills\n• edX - Academic learning\n• Codecademy - Interactive coding\n• Khan Academy - Free education\n\n**YouTube Channels:**\n• Traversy Media (web dev)\n• The Net Ninja (tutorials)\n• Fireship (quick guides)\n• CS Dojo (programming)\n• 3Blue1Brown (math/CS)\n\n**Practice Platforms:**\n• LeetCode - Coding interviews\n• HackerRank - Challenges\n• Codewars - Problem solving\n• Project Euler - Math problems\n\nWhat subject are you looking to learn?';
      } else if (lowerText.includes('project') || lowerText.includes('portfolio')) {
        aiResponseText = '🚀 **Project Ideas for Your Portfolio:**\n\n**Beginner Projects:**\n1. **Todo List App** - CRUD operations\n2. **Weather App** - API integration\n3. **Calculator** - Basic JavaScript\n4. **Portfolio Website** - HTML/CSS\n5. **Quiz Game** - Logic & UI\n\n**Intermediate Projects:**\n1. **E-commerce Site** - Full-stack\n2. **Blog Platform** - CMS features\n3. **Social Media Clone** - Authentication\n4. **Chat Application** - Real-time\n5. **Budget Tracker** - Data visualization\n\n**Advanced Projects:**\n1. **Video Streaming Platform**\n2. **AI-Powered App** - ML integration\n3. **Multiplayer Game** - WebSockets\n4. **Blockchain Application**\n5. **Cloud-based SaaS**\n\n**Portfolio Tips:**\n✓ 3-5 quality projects\n✓ Live demos + GitHub code\n✓ Clean, responsive design\n✓ Good documentation\n✓ Showcase problem-solving\n\n**What to Include:**\n• Project description\n• Technologies used\n• Challenges & solutions\n• Screenshots/demos\n• Code repository link\n\nReady to start building?';
      } else if (lowerText.includes('salary') || lowerText.includes('pay')) {
        aiResponseText = '💰 **Tech Career & Salary Insights:**\n\n**Average Salaries (Entry-Level):**\n• **Software Engineer**: $70K-90K\n• **Web Developer**: $60K-80K\n• **Data Scientist**: $80K-100K\n• **UX Designer**: $65K-85K\n• **DevOps Engineer**: $75K-95K\n\n**Senior Level (5+ years):**\n• **Senior Engineer**: $120K-180K\n• **Lead Developer**: $130K-200K\n• **Engineering Manager**: $150K-220K\n• **Principal Engineer**: $180K-300K\n\n**Factors Affecting Salary:**\n✓ Location (SF, NYC higher)\n✓ Company size (FAANG pays more)\n✓ Experience & skills\n✓ Education & certifications\n✓ Negotiation skills\n\n**High-Demand Skills:**\n• Cloud (AWS, Azure, GCP)\n• AI/ML & Data Science\n• Cybersecurity\n• Mobile Development\n• Full-Stack Development\n\n**Career Growth:**\nJunior → Mid → Senior → Lead → Principal → Architect/Manager\n\n**Tips for Higher Pay:**\n1. Build strong portfolio\n2. Learn in-demand skills\n3. Network actively\n4. Switch companies strategically\n5. Negotiate effectively\n\nWhich tech career path interests you?';
      } else {
        // More intelligent generic response that actually references the user's message
        const words = messageText.toLowerCase().split(' ');
        const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'should', 'could', 'would', 'is', 'are', 'do', 'does'];
        const isQuestion = questionWords.some(qw => words.includes(qw)) || messageText.includes('?');

        // Extract key topics from the message
        const topics = [];
        const topicKeywords = {
          'programming': ['code', 'program', 'coding', 'software', 'developer', 'app', 'function', 'variable'],
          'web': ['website', 'web', 'html', 'css', 'frontend', 'backend', 'browser'],
          'math': ['math', 'calculate', 'equation', 'solve', 'number', 'formula'],
          'science': ['science', 'experiment', 'theory', 'research', 'physics', 'chemistry', 'biology'],
          'learning': ['learn', 'study', 'understand', 'practice', 'improve', 'master', 'remember'],
          'career': ['job', 'career', 'work', 'salary', 'interview', 'resume', 'company'],
          'data': ['data', 'analysis', 'statistics', 'ml', 'ai', 'model', 'dataset']
        };

        for (const [topic, keywords] of Object.entries(topicKeywords)) {
          if (keywords.some(kw => messageText.toLowerCase().includes(kw))) {
            topics.push(topic);
          }
        }

        if (isQuestion) {
          // Generate a response that acknowledges their specific question
          const responses = [
            `I see you're asking about "${messageText}". ${topics.length > 0 ? `This relates to ${topics.join(' and ')}.` : 'Let me help you with this.'}\n\n${isOnline
              ? `To give you the best answer:\n\n✓ Could you provide more context about what you're trying to achieve?\n✓ What's your current level with this topic?\n✓ Are you looking for a quick overview or detailed explanation?\n✓ Any specific part that's confusing you?\n\nI'm here to explain concepts, provide examples, or guide you step-by-step!`
              : 'In offline mode, I can help with basic concepts. Try the quick action buttons or connect online for detailed help.'}`
            ,
            `You asked: "${messageText}"\n\n${topics.length > 0 ? `I can see this is about ${topics.join(' and ')}.` : 'Interesting question!'} ${isOnline
              ? `\n\n**Let me understand what you need:**\n\n• Are you stuck on something specific?\n• Do you want examples or explanations?\n• Should I keep it simple or go deep?\n• What's the bigger picture - why are you learning this?\n\n**I can help with:**\n🎓 Step-by-step tutorials\n💡 Real-world examples\n🔍 Detailed explanations\n🚀 Learning roadmaps\n\nWhat would help you most?`
              : '\n\nFor the best answer, please connect online or use the quick action buttons below.'}`
            ,
            `"${messageText}" - ${topics.length > 0 ? `Great question about ${topics.join(' and ')}!` : 'Let me help you understand this.'}\n\n${isOnline
              ? `**Here's how I can assist:**\n\n📚 If you're learning something new → I'll break it down simply\n🐛 If you're stuck on a problem → I'll help debug and explain\n🎯 If you want to improve → I'll share proven strategies\n💭 If you're confused → I'll clarify with examples\n\n**To give the perfect answer, tell me:**\n• What specifically do you want to know?\n• What have you tried so far?\n• Where are you getting stuck?\n\nI'm ready to explain, show examples, or walk you through it!`
              : '\n\nOffline mode is active. Connect to internet for personalized, detailed responses.'}`
          ];
          aiResponseText = responses[responseHistory.get('generic_question') || 0];
          setResponseHistory(new Map(responseHistory.set('generic_question', ((responseHistory.get('generic_question') || 0) + 1) % responses.length)));
        } else {
          // User made a statement - respond conversationally and contextually
          const responses = [
            `Got it: "${messageText}"\n\n${topics.length > 0 ? `I see you mentioned ${topics.join(' and ')}.` : 'Thanks for sharing that!'} ${isOnline
              ? '**I\'m here to help you learn!** To assist you better, please:\n\n📝 **Ask a question like:**\n• "What is [topic]?"\n• "How do I learn [skill]?"\n• "Explain [concept]"\n• "Give me study tips for [subject]"\n\n💬 **Or try these:**\n• "Help me with Python"\n• "Explain calculus"\n• "Study tips for exams"\n• "Career advice for tech"\n\n**I excel at:**\n✓ Explaining complex topics simply\n✓ Providing step-by-step guides\n✓ Suggesting study strategies\n✓ Offering career guidance\n✓ Answering academic questions\n\nWhat would you like to learn about today?'
              : '**In offline mode**, try:\n• Quick action buttons below\n• Simple questions about core topics\n• Connect to internet for full AI capabilities'}`,
            `"${messageText}" - ${topics.length > 0 ? `Thanks for mentioning ${topics.join(' and ')}.` : 'I hear you!'}\n\n${isOnline
              ? '**Let\'s start your learning journey!** 🚀\n\n💡 **Try asking me:**\n• "Teach me [subject/topic]"\n• "How do I get better at [skill]?"\n• "Explain [concept] simply"\n• "What should I learn first for [goal]?"\n\n🎓 **Popular requests:**\n• "Python for beginners"\n• "Web development roadmap"\n• "Study techniques that work"\n• "Tech career paths"\n\n**What I do best:**\n✨ Break down complex topics\n✨ Create learning roadmaps\n✨ Share proven study methods\n✨ Guide career decisions\n✨ Explain with real examples\n\nHow can I help you grow today?'
              : '**Offline mode is active**\n\nBest options:\n• Quick actions below\n• Basic topic questions\n• Go online for detailed help'}`,
            `I understand: "${messageText}"\n\n${topics.length > 0 ? `${topics[0].charAt(0).toUpperCase() + topics[0].slice(1)} is a great topic!` : 'Interesting point!'} ${isOnline
              ? '**Ready to assist!** 🎯\n\n🔥 **Make the most of our chat:**\n• Ask specific questions\n• Request examples when needed\n• Tell me your current level\n• Ask for study/practice tips\n\n📚 **Question formats that work:**\n• "What\'s the best way to learn [X]?"\n• "Can you explain [concept]?"\n• "Show me examples of [topic]"\n• "How do [A] and [B] differ?"\n\n**My superpowers:**\n🎨 Simplifying complex ideas\n📊 Providing structured learning paths\n💻 Teaching programming & tech\n🧠 Sharing memory/study techniques\n\nWhat knowledge are you seeking?'
              : '**Limited offline mode**\n\nOptions:\n• Quick buttons work\n• Basic questions OK\n• Online = full features'}`
          ];
          aiResponseText = responses[responseHistory.get('generic_statement') || 0];
          setResponseHistory(new Map(responseHistory.set('generic_statement', ((responseHistory.get('generic_statement') || 0) + 1) % responses.length)));
        }
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    const actionMessage: Message = {
      id: messages.length + 1,
      text: action,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, actionMessage]);

    setTimeout(() => {
      let responseText = '';
      if (action.includes('Python')) {
        responseText = 'Python is a high-level programming language. Start with variables, data types, and basic syntax. Would you like specific examples?';
      } else if (action.includes('HTML')) {
        responseText = 'HTML (HyperText Markup Language) structures web content. Key elements include tags like <div>, <p>, <h1>. Want to learn more?';
      } else if (action.includes('Study Tips')) {
        responseText = '1) Use spaced repetition 2) Take regular breaks 3) Teach others 4) Practice active recall 5) Stay consistent!';
      } else if (action.includes('Memory')) {
        responseText = 'Try these: 1) Mnemonics 2) Chunking 3) Visualization 4) Association 5) Repetition. Which one interests you?';
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Learning Assistant
                </h1>
                <p className="text-gray-600 mt-2">Ask anything, learn everything</p>
              </div>
              <Badge variant={isOnline ? "default" : "destructive"} className="px-4 py-2">
                {isOnline ? 'Online Mode' : 'Offline Mode'}
              </Badge>
            </div>
          </div>

          {/* Offline Mode Banner */}
          {!isOnline && (
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6 flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-800">You are in Offline Mode</p>
                <p className="text-sm text-orange-600">Limited AI support available. Use quick actions below.</p>
              </div>
            </div>
          )}

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
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[70%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p>{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Type your question here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSend()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Action Buttons */}
                {isOnline ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSend('Explain this simply')}>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Explain Simply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSend('Explain in detail')}>
                      <Zap className="w-4 h-4 mr-2" />
                      Explain Fast
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSend('Give me a memory trick')}>
                      <Brain className="w-4 h-4 mr-2" />
                      Memory Trick
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSend('Give me an example')}>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Give Example
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Quick Actions (Offline):</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {offlineQuickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action.prompt)}
                        >
                          <action.icon className="w-4 h-4 mr-2" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI System Info */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                AI Assistant Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900">📚 Current Mode: Smart Mock Responses</p>
                  <p className="text-xs text-gray-600 mt-1">
                    This assistant uses intelligent pattern matching and pre-written educational content. It detects topics, understands context, and provides varied responses.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-900">⚡ Enable Real AI (Coming Soon)</p>
                  <p className="text-xs text-gray-600 mt-1">
                    To use actual GPT-4, Gemini, or Claude models, you'll need to add your API keys in Settings. Real AI provides unlimited knowledge and truly understands your questions.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">Current Language:</p>
                  <Badge variant="outline" className="px-3 py-1">{language}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}