import { describe, expect, it } from 'vitest';
import { curriculumForGrade, gradeCurricula, supportedBoards } from './schoolCurriculum';

describe('school curriculum catalog', () => {
  it('covers every class from 1 through 12 exactly once', () => {
    expect(gradeCurricula.map((item) => item.grade)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
  });

  it('maps grades to the expected learning stage', () => {
    expect(curriculumForGrade(1).stage).toBe('foundation');
    expect(curriculumForGrade(6).stage).toBe('middle');
    expect(curriculumForGrade(10).stage).toBe('secondary');
    expect(curriculumForGrade(12).stage).toBe('senior');
  });

  it('provides topic strands for every subject', () => {
    gradeCurricula.forEach((grade) => Object.values(grade.subjects).forEach((topics) => expect(topics.length).toBeGreaterThanOrEqual(3)));
  });

  it('includes the explicitly supported boards', () => {
    expect(supportedBoards).toEqual(expect.arrayContaining(['CBSE', 'Tamil Nadu', 'ICSE']));
  });
});
