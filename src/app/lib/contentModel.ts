export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'archived';
export type LessonBlockType = 'explanation' | 'worked_example' | 'exercise' | 'quiz' | 'summary';

export interface Citation { id: string; title: string; publisher: string; url?: string; license: string; accessedAt: string }
export interface LessonBlock { id: string; type: LessonBlockType; title: string; body: string; answer?: string; citationIds: string[] }
export interface CurriculumLesson {
  id: string; board: string; grade: number; subject: string; academicYear: string; language: string;
  chapter: number; position: number; title: string; ageRange: [number, number]; status: ContentStatus;
  blocks: LessonBlock[]; citations: Citation[]; reviewedBy?: string; reviewedAt?: string; correctionCount: number;
}

export function validateLesson(lesson: CurriculumLesson): string[] {
  const errors: string[] = [];
  if (lesson.grade < 1 || lesson.grade > 12) errors.push('Grade must be between 1 and 12.');
  if (!lesson.title.trim()) errors.push('A lesson title is required.');
  if (!/^\d{4}-\d{2}$/.test(lesson.academicYear)) errors.push('Academic year must use YYYY-YY.');
  if (lesson.blocks.length === 0) errors.push('At least one lesson block is required.');
  const citationIds = new Set(lesson.citations.map((item) => item.id));
  lesson.blocks.forEach((block) => block.citationIds.forEach((id) => { if (!citationIds.has(id)) errors.push(`Unknown citation ${id}.`); }));
  if (lesson.status === 'approved') {
    if (!lesson.reviewedBy || !lesson.reviewedAt) errors.push('Approved lessons require reviewer identity and time.');
    if (!lesson.citations.length) errors.push('Approved lessons require at least one licensed citation.');
    if (!lesson.blocks.some((item) => item.type === 'exercise')) errors.push('Approved lessons require practice.');
  }
  return [...new Set(errors)];
}

export function canTransitionContent(from: ContentStatus, to: ContentStatus, role: 'teacher' | 'admin') {
  const transitions: Record<ContentStatus, ContentStatus[]> = { draft: ['in_review', 'archived'], in_review: ['draft', 'approved', 'archived'], approved: ['in_review', 'archived'], archived: ['draft'] };
  return transitions[from].includes(to) && (to !== 'approved' || role === 'admin');
}
