export type LearningStageId = "early" | "foundation" | "primary" | "middle" | "secondary" | "senior" | "beyond";

export interface LearningStage {
  id: LearningStageId;
  label: string;
  ages: string;
  description: string;
}

export interface KnowledgeSubject {
  id: string;
  name: string;
  category: "Academic" | "Language" | "Creative" | "Wellbeing";
  color: string;
  stages: LearningStageId[];
  concepts: Partial<Record<LearningStageId, string[]>>;
}

export interface KnowledgeSkill {
  id: string;
  name: string;
  category: string;
  stages: LearningStageId[];
  outcome: string;
}

export const learningStages: LearningStage[] = [
  { id: "early", label: "Early explorer", ages: "Ages 3–5", description: "Play, language, number sense and curiosity" },
  { id: "foundation", label: "Foundation", ages: "Classes 1–2", description: "Reading, writing and confident basics" },
  { id: "primary", label: "Primary", ages: "Classes 3–5", description: "Strong core skills and discovery" },
  { id: "middle", label: "Middle school", ages: "Classes 6–8", description: "Concepts, connections and practice" },
  { id: "secondary", label: "Secondary", ages: "Classes 9–10", description: "Board-ready foundations and application" },
  { id: "senior", label: "Senior secondary", ages: "Classes 11–12", description: "Deep study, exams and future choices" },
  { id: "beyond", label: "Beyond school", ages: "College & life", description: "Career, practical and lifelong skills" },
];

export const regionalLanguageNames = ["Tamil", "Hindi", "Telugu", "Malayalam", "Kannada", "Bengali", "Marathi", "Gujarati", "Punjabi", "Urdu", "Odia", "Assamese"] as const;
export const extendedSchoolSubjects = ["Environmental Studies", "History", "Geography", "Political Science", "Sociology", "Psychology", "Accountancy", "Business Studies", "Economics", "Home Science", "Physical Education", "Media Studies", "Legal Studies", "Engineering Graphics", "Agriculture", "Vocational Studies"] as const;

export const knowledgeSubjects: KnowledgeSubject[] = [
  { id: "math", name: "Mathematics", category: "Academic", color: "bg-blue-600", stages: ["early", "foundation", "primary", "middle", "secondary", "senior", "beyond"], concepts: { early: ["Patterns", "Counting", "Shapes"], foundation: ["Addition & subtraction", "Place value", "Measurement"], primary: ["Fractions", "Multiplication", "Geometry"], middle: ["Integers", "Algebra", "Data handling"], secondary: ["Polynomials", "Coordinate geometry", "Statistics"], senior: ["Calculus", "Vectors", "Probability"], beyond: ["Quantitative reasoning", "Financial maths", "Data literacy"] } },
  { id: "science", name: "Science", category: "Academic", color: "bg-emerald-600", stages: ["early", "foundation", "primary", "middle", "secondary"], concepts: { early: ["Living things", "Weather", "Senses"], foundation: ["Plants & animals", "Materials", "Our body"], primary: ["Forces", "Habitats", "Matter"], middle: ["Motion", "Cells", "Atoms"], secondary: ["Energy", "Life processes", "Chemical reactions"] } },
  { id: "physics", name: "Physics", category: "Academic", color: "bg-violet-600", stages: ["middle", "secondary", "senior", "beyond"], concepts: { middle: ["Force & pressure", "Light", "Electricity"], secondary: ["Motion", "Work & energy", "Current electricity"], senior: ["Mechanics", "Waves", "Electromagnetism", "Modern physics"], beyond: ["Engineering basics", "Electronics", "Scientific modelling"] } },
  { id: "chemistry", name: "Chemistry", category: "Academic", color: "bg-fuchsia-600", stages: ["middle", "secondary", "senior", "beyond"], concepts: { middle: ["Matter", "Separation", "Metals & non-metals"], secondary: ["Atoms & molecules", "Acids & bases", "Carbon compounds"], senior: ["Physical chemistry", "Organic chemistry", "Inorganic chemistry"], beyond: ["Lab safety", "Materials", "Environmental chemistry"] } },
  { id: "biology", name: "Biology", category: "Academic", color: "bg-lime-700", stages: ["middle", "secondary", "senior", "beyond"], concepts: { middle: ["Cell structure", "Nutrition", "Reproduction"], secondary: ["Tissues", "Heredity", "Ecosystems"], senior: ["Human physiology", "Genetics", "Evolution"], beyond: ["Health science", "Biotechnology", "Ecology"] } },
  { id: "english", name: "English", category: "Language", color: "bg-rose-600", stages: ["early", "foundation", "primary", "middle", "secondary", "senior", "beyond"], concepts: { early: ["Listening", "Vocabulary", "Storytelling"], foundation: ["Phonics", "Sentences", "Reading fluency"], primary: ["Grammar", "Comprehension", "Writing"], middle: ["Literature", "Composition", "Speaking"], secondary: ["Critical reading", "Argument writing", "Poetry"], senior: ["Analysis", "Research writing", "Communication"], beyond: ["Professional writing", "Presentations", "Media literacy"] } },
  { id: "indian-languages", name: "Indian Languages", category: "Language", color: "bg-orange-600", stages: ["early", "foundation", "primary", "middle", "secondary", "senior"], concepts: { early: ["Sounds", "Rhymes", "Everyday words"], foundation: ["Letters", "Reading", "Conversation"], primary: ["Grammar", "Stories", "Writing"], middle: ["Prose", "Poetry", "Expression"], secondary: ["Literature", "Composition", "Translation"], senior: ["Critical reading", "Formal writing", "Culture"] } },
  { id: "social-science", name: "Social Science", category: "Academic", color: "bg-amber-600", stages: ["primary", "middle", "secondary", "senior", "beyond"], concepts: { primary: ["Communities", "Maps", "Civic sense"], middle: ["Ancient history", "Geography", "Government"], secondary: ["Democracy", "Resources", "Indian history"], senior: ["Political science", "Sociology", "World history"], beyond: ["Citizenship", "Current affairs", "Research skills"] } },
  { id: "economics", name: "Economics & Commerce", category: "Academic", color: "bg-teal-700", stages: ["secondary", "senior", "beyond"], concepts: { secondary: ["Markets", "Money", "Consumer awareness"], senior: ["Microeconomics", "Macroeconomics", "Accountancy", "Business studies"], beyond: ["Budgeting", "Tax basics", "Entrepreneurship"] } },
  { id: "computer-science", name: "Computer Science", category: "Academic", color: "bg-indigo-700", stages: ["primary", "middle", "secondary", "senior", "beyond"], concepts: { primary: ["Digital safety", "Logic", "Creative computing"], middle: ["Algorithms", "Programming basics", "Networks"], secondary: ["Python", "Data", "Cyber safety"], senior: ["Data structures", "Databases", "Web development"], beyond: ["AI literacy", "Software projects", "Digital citizenship"] } },
  { id: "arts", name: "Art, Design & Music", category: "Creative", color: "bg-pink-600", stages: ["early", "foundation", "primary", "middle", "secondary", "senior", "beyond"], concepts: { early: ["Colour", "Rhythm", "Making"], foundation: ["Drawing", "Songs", "Imagination"], primary: ["Craft", "Visual stories", "Performance"], middle: ["Design process", "Music theory", "Portfolio"], secondary: ["Composition", "Visual communication", "Practice"], senior: ["Creative portfolio", "Art history", "Production"], beyond: ["Design thinking", "Creative tools", "Personal practice"] } },
  { id: "health", name: "Health & Wellbeing", category: "Wellbeing", color: "bg-cyan-700", stages: ["early", "foundation", "primary", "middle", "secondary", "senior", "beyond"], concepts: { early: ["Feelings", "Movement", "Healthy habits"], foundation: ["Safety", "Food", "Friendship"], primary: ["Fitness", "Body care", "Mindfulness"], middle: ["Puberty", "Nutrition", "Stress skills"], secondary: ["Mental wellbeing", "First aid", "Healthy routines"], senior: ["Life balance", "Relationships", "Self-care"], beyond: ["Wellness planning", "Resilience", "Community health"] } },
  ...extendedSchoolSubjects.map((name, index): KnowledgeSubject => ({ id: `subject-${name.toLowerCase().replace(/\s+/g, '-')}`, name, category: "Academic", color: ["bg-blue-700", "bg-emerald-700", "bg-violet-700", "bg-teal-700"][index % 4], stages: name === "Environmental Studies" ? ["early", "foundation", "primary"] : ["middle", "secondary", "senior", "beyond"], concepts: { early: ["My world", "People and places", "Nature"], foundation: ["Home and community", "Living world", "Environment and safety"], primary: ["Communities", "Resources", "Inquiry projects"], middle: ["Foundations", "Evidence and methods", "Real-world applications"], secondary: ["Core concepts", "Analysis", "Board-focused practice"], senior: ["Advanced theory", "Case studies", "Projects and exam preparation"], beyond: ["Practical literacy", "Career pathways", "Applied projects"] } })),
  ...regionalLanguageNames.map((name, index): KnowledgeSubject => ({ id: `language-${name.toLowerCase().replace(/\s+/g, '-')}`, name, category: "Language", color: ["bg-orange-600", "bg-rose-600", "bg-amber-600", "bg-fuchsia-600"][index % 4], stages: ["early", "foundation", "primary", "middle", "secondary", "senior"], concepts: { early: ["Sounds and rhymes", "Everyday words", "Listening and speaking"], foundation: ["Script and letters", "Reading fluency", "Simple sentences"], primary: ["Grammar", "Stories and poetry", "Creative writing"], middle: ["Prose and poetry", "Composition", "Speaking and culture"], secondary: ["Literature", "Comprehension", "Formal and creative writing"], senior: ["Critical reading", "Advanced literature", "Research and communication"] } })),
];

export const knowledgeSkills: KnowledgeSkill[] = [
  { id: "study-skills", name: "How to Learn", category: "Learning", stages: ["foundation", "primary", "middle", "secondary", "senior", "beyond"], outcome: "Recall, focus, notes and study planning" },
  { id: "communication", name: "Communication", category: "Life skills", stages: ["early", "foundation", "primary", "middle", "secondary", "senior", "beyond"], outcome: "Speak clearly, listen well and work with others" },
  { id: "financial-literacy", name: "Financial Literacy", category: "Life skills", stages: ["primary", "middle", "secondary", "senior", "beyond"], outcome: "Money choices, saving, budgeting and consumer awareness" },
  { id: "coding", name: "Coding & Digital Making", category: "Technology", stages: ["primary", "middle", "secondary", "senior", "beyond"], outcome: "Build with code, logic and safe digital habits" },
  { id: "ai-literacy", name: "AI Literacy", category: "Technology", stages: ["middle", "secondary", "senior", "beyond"], outcome: "Use AI thoughtfully, safely and critically" },
  { id: "creative-media", name: "Creative Media", category: "Creative", stages: ["primary", "middle", "secondary", "senior", "beyond"], outcome: "Create images, video, audio and stories" },
  { id: "public-speaking", name: "Public Speaking", category: "Communication", stages: ["primary", "middle", "secondary", "senior", "beyond"], outcome: "Share ideas with confidence and structure" },
  { id: "entrepreneurship", name: "Entrepreneurship", category: "Career", stages: ["secondary", "senior", "beyond"], outcome: "Turn a problem into a tested, responsible idea" },
  { id: "career-readiness", name: "Career Readiness", category: "Career", stages: ["secondary", "senior", "beyond"], outcome: "Explore pathways, portfolios and future opportunities" },
];
