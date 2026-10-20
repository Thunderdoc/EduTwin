import { describe, expect, it } from 'vitest';
import { findQuestionSet, gradeQuestionSet, questionBank } from './questionBank';
describe('starter assessment bank',()=>{
 it('contains original draft questions with valid answer keys',()=>{expect(questionBank.length).toBeGreaterThanOrEqual(15);for(const set of questionBank){expect(set.reviewStatus).toBe('original-draft');expect(set.questions.length).toBeGreaterThanOrEqual(2);for(const item of set.questions){expect(item.choices[item.answer]).toBeTruthy();expect(item.explanation.length).toBeGreaterThan(10)}}});
 it('matches supported class and subject topics only',()=>{expect(findQuestionSet('Mathematics','Algebra',8)?.id).toBe('algebra');expect(findQuestionSet('Mathematics','Algebra',4)).toBeUndefined()});
 it('scores answers and returns explanations',()=>{const set=findQuestionSet('Mathematics','Algebra',8)!;const result=gradeQuestionSet(set,[0,2]);expect(result).toMatchObject({correct:1,total:2});expect(result.results[0].correct).toBe(true);expect(result.results[1].question.explanation).toContain('Like terms')});
});
