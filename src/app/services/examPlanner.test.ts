import {beforeEach,describe,expect,it} from 'vitest';
import {daysUntil,deleteExam,makeRevisionPlan,readExams,saveExam} from './examPlanner';
beforeEach(()=>localStorage.clear());
describe('local exam planner',()=>{
 it('validates and persists exam syllabus',()=>{const exams=saveExam({title:'Math test',date:'2027-02-10',subjects:['Math','Math'],topics:['Algebra','Algebra']});expect(exams).toHaveLength(1);expect(exams[0].subjects).toEqual(['Math']);expect(readExams()[0].topics).toEqual(['Algebra']);});
 it('creates a plan prioritizing reviews, weak areas, and entered topics',()=>{const exam=saveExam({title:'Test',date:'2026-10-25',subjects:['Science'],topics:['Cells']})[0];const plan=makeRevisionPlan(exam,[{subject:'Math',topic:'Fractions',mastery:40}],[{subject:'English',topic:'Poetry'}],45,new Date('2026-10-20T12:00:00'));expect(plan).toHaveLength(5);expect(plan[0].items[0].reason).toContain('review');expect(plan[1].items[0].topic).toBe('Fractions');});
 it('deletes an exam and calculates countdowns',()=>{const exam=saveExam({title:'Test',date:'2026-10-24',subjects:[],topics:[]})[0];expect(daysUntil(exam.date,new Date('2026-10-20T12:00:00'))).toBe(4);expect(deleteExam(exam.id)).toHaveLength(0);});
 it('rejects impossible calendar dates',()=>expect(()=>saveExam({title:'Invalid date',date:'2027-02-30',subjects:[],topics:[]})).toThrow());
});
