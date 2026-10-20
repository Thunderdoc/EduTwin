export type SchoolBoard = "CBSE" | "Tamil Nadu" | "ICSE" | "State board";

export interface GradeCurriculum {
  grade: number;
  stage: "foundation" | "primary" | "middle" | "secondary" | "senior";
  subjects: Record<string, string[]>;
}

const commonPrimary = (grade: number): Record<string, string[]> => ({
  Mathematics: grade <= 2 ? ["Numbers and place value", "Addition and subtraction", "Shapes and measurement"] : ["Number operations", "Fractions and decimals", "Geometry and data handling"],
  English: ["Reading comprehension", "Grammar and vocabulary", "Writing and speaking"],
  "Environmental Studies": ["Family and community", "Plants and animals", "Earth, resources and safety"],
  "Indian Language": ["Reading fluency", "Grammar", "Stories, poetry and writing"],
  "Digital Skills": ["Device basics", "Digital safety", "Logic and creative computing"],
  "Art & Wellbeing": ["Visual art and music", "Movement and health", "Social-emotional learning"],
});

export const gradeCurricula: GradeCurriculum[] = Array.from({ length: 12 }, (_, index) => {
  const grade = index + 1;
  if (grade <= 5) return { grade, stage: grade <= 2 ? "foundation" : "primary", subjects: commonPrimary(grade) };
  if (grade <= 8) return { grade, stage: "middle", subjects: {
    Mathematics: ["Number systems", "Algebra", "Geometry, mensuration and data"],
    Science: ["Physics in daily life", "Matter and materials", "Life processes and ecology"],
    English: ["Literature", "Grammar and composition", "Listening and speaking"],
    "Social Science": ["History", "Geography", "Civics and economics"],
    "Indian Language": ["Prose and poetry", "Grammar", "Creative and formal writing"],
    "Computer Science": ["Computational thinking", "Programming basics", "Internet and cyber safety"],
    "Art, PE & Life Skills": ["Creative practice", "Physical education", "Communication and financial basics"],
  }};
  if (grade <= 10) return { grade, stage: "secondary", subjects: {
    Mathematics: ["Real numbers and algebra", "Geometry and trigonometry", "Statistics and probability"],
    Science: ["Motion, energy and electricity", "Chemical reactions and carbon", "Life processes, heredity and environment"],
    English: ["Literature and critical reading", "Analytical writing", "Grammar and communication"],
    "Social Science": ["India and the contemporary world", "Resources and geography", "Democratic politics and economics"],
    "Indian Language": ["Literature", "Grammar and comprehension", "Creative and formal writing"],
    "Information Technology": ["Digital documentation", "Data and programming", "Employability and cyber safety"],
  }};
  return { grade, stage: "senior", subjects: {
    Mathematics: ["Sets, relations and algebra", "Calculus", "Vectors, probability and statistics"],
    Physics: ["Mechanics and thermodynamics", "Electricity, magnetism and optics", "Modern physics and electronics"],
    Chemistry: ["Physical chemistry", "Organic chemistry", "Inorganic chemistry"],
    Biology: ["Cell biology and physiology", "Genetics and evolution", "Ecology and biotechnology"],
    "Computer Science": ["Python programming", "Data structures and databases", "Networks and computational thinking"],
    "Commerce & Accountancy": ["Financial accounting", "Business studies", "Economics and entrepreneurship"],
    Humanities: ["History and political science", "Geography and sociology", "Psychology and economics"],
    English: ["Literature", "Academic and creative writing", "Research and communication"],
  }};
});

export const supportedBoards: SchoolBoard[] = ["CBSE", "Tamil Nadu", "ICSE", "State board"];

export function curriculumForGrade(grade: number) {
  return gradeCurricula.find((item) => item.grade === grade) || gradeCurricula[5];
}
