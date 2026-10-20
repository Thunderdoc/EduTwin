import { beforeEach, describe, expect, it } from 'vitest';
import { dueReviews, getLessonProgress, progressSummary, saveLessonResult } from './learningProgress';
describe('learning progress loop', () => {
 beforeEach(()=>localStorage.clear());
 it('stores assessment evidence and mastery',()=>{ const result=saveLessonResult({grade:6,subject:'Science',topic:'Matter',correct:4,total:5,minutesSpent:20}); expect(result.mastery).toBe(80); expect(getLessonProgress(6,'Science','Matter')?.attempts).toBe(1); });
 it('schedules weaker results sooner',()=>{ const weak=saveLessonResult({grade:6,subject:'Math',topic:'Fractions',correct:1,total:5,minutesSpent:10}); expect(Date.parse(weak.nextReviewAt!)-Date.now()).toBeLessThan(2*86400000); });
 it('summarizes persisted learning',()=>{ saveLessonResult({grade:8,subject:'English',topic:'Writing',correct:5,total:5,minutesSpent:15}); expect(progressSummary(8)).toMatchObject({lessons:1,mastered:1,averageMastery:100,minutes:15}); expect(dueReviews()).toHaveLength(0); });
});
