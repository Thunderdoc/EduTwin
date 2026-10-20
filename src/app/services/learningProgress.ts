export type MasteryStatus = 'not_started' | 'learning' | 'practising' | 'mastered' | 'review_due';
export interface LessonProgress { id: string; grade: number; subject: string; topic: string; status: MasteryStatus; mastery: number; attempts: number; correct: number; total: number; minutesSpent: number; lastStudiedAt: string; nextReviewAt?: string }
const KEY = 'eduflow_lesson_progress';

export function readProgress(): LessonProgress[] { try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
export function lessonId(grade: number, subject: string, topic: string) { return `${grade}:${subject}:${topic}`.toLowerCase().replace(/[^a-z0-9:]+/g, '-'); }
export function getLessonProgress(grade: number, subject: string, topic: string) { return readProgress().find((item) => item.id === lessonId(grade, subject, topic)); }
export function saveLessonResult(input: { grade: number; subject: string; topic: string; correct: number; total: number; minutesSpent: number }): LessonProgress {
  const all = readProgress(); const id = lessonId(input.grade, input.subject, input.topic); const previous = all.find((item) => item.id === id);
  const ratio = input.total ? input.correct / input.total : 0; const mastery = Math.round(Math.min(100, Math.max(previous?.mastery || 0, ratio * 100)));
  const days = mastery >= 85 ? 7 : mastery >= 60 ? 3 : 1; const review = new Date(Date.now() + days * 86400000).toISOString();
  const record: LessonProgress = { id, grade: input.grade, subject: input.subject, topic: input.topic, status: mastery >= 85 ? 'mastered' : 'practising', mastery, attempts: (previous?.attempts || 0) + 1, correct: (previous?.correct || 0) + input.correct, total: (previous?.total || 0) + input.total, minutesSpent: (previous?.minutesSpent || 0) + input.minutesSpent, lastStudiedAt: new Date().toISOString(), nextReviewAt: review };
  localStorage.setItem(KEY, JSON.stringify([...all.filter((item) => item.id !== id), record])); window.dispatchEvent(new CustomEvent('eduflow-progress', { detail: record })); return record;
}
export function dueReviews(now = Date.now()) { return readProgress().filter((item) => item.nextReviewAt && Date.parse(item.nextReviewAt) <= now); }
export function progressSummary(grade?: number) { const records = readProgress().filter((item) => grade === undefined || item.grade === grade); return { lessons: records.length, mastered: records.filter((item) => item.mastery >= 85).length, averageMastery: records.length ? Math.round(records.reduce((sum, item) => sum + item.mastery, 0) / records.length) : 0, minutes: records.reduce((sum, item) => sum + item.minutesSpent, 0), reviewsDue: dueReviews().length }; }
