import { describe, expect, it } from 'vitest';
import { findSkillCourse, skillCourses } from './courseCatalog';

describe('skill course catalog', () => {
  it('provides every recommended course as a real course', () => {
    expect(skillCourses.map((course) => course.id)).toEqual(['python-programming','web-development','ai-machine-learning','ui-ux-design','communication-skills','creative-thinking']);
  });
  it('gives each course modules, lessons, activities, and duration', () => {
    skillCourses.forEach((course) => {
      expect(course.modules.length).toBeGreaterThanOrEqual(4);
      course.modules.forEach((module) => module.lessons.forEach((lesson) => {
        expect(lesson.summary.length).toBeGreaterThan(20);
        expect(lesson.activity.length).toBeGreaterThan(15);
        expect(lesson.minutes).toBeGreaterThan(0);
      }));
    });
  });
  it('finds a course by URL id', () => expect(findSkillCourse('python-programming')?.title).toBe('Python Programming'));
});
