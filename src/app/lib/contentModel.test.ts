import { describe, expect, it } from 'vitest';
import { canTransitionContent, type CurriculumLesson, validateLesson } from './contentModel';

const lesson: CurriculumLesson = {
  id: 'lesson-1', board: 'CBSE', grade: 6, subject: 'Science', academicYear: '2026-27', language: 'English',
  chapter: 1, position: 1, title: 'Materials', ageRange: [10, 12], status: 'approved', correctionCount: 0,
  reviewedBy: 'reviewer-1', reviewedAt: '2026-10-20T00:00:00Z',
  citations: [{ id: 'source-1', title: 'Approved source', publisher: 'Publisher', license: 'Licensed', accessedAt: '2026-10-20' }],
  blocks: [
    { id: 'explanation-1', type: 'explanation', title: 'Overview', body: 'Lesson text', citationIds: ['source-1'] },
    { id: 'exercise-1', type: 'exercise', title: 'Practice', body: 'Question', answer: 'Answer', citationIds: ['source-1'] },
  ],
};

describe('content approval model', () => {
  it('accepts a reviewed, cited lesson with practice', () => expect(validateLesson(lesson)).toEqual([]));
  it('blocks approval without licensed sources and review metadata', () => {
    const invalid = { ...lesson, citations: [], reviewedBy: undefined, reviewedAt: undefined, blocks: [] };
    expect(validateLesson(invalid).length).toBeGreaterThanOrEqual(3);
  });
  it('allows only administrators to approve content', () => {
    expect(canTransitionContent('in_review', 'approved', 'teacher')).toBe(false);
    expect(canTransitionContent('in_review', 'approved', 'admin')).toBe(true);
  });
});
