import{beforeEach,describe,expect,it}from'vitest';import{deleteArtifact,readPortfolio,saveArtifact}from'./portfolio';
beforeEach(()=>localStorage.clear());
describe('local learning portfolio',()=>{
 it('saves, edits, and deletes student artifacts',()=>{const artifact=saveArtifact({title:'Plant journal',kind:'project',subject:'Science',topic:'Plants',description:'Observations from my garden',teacherFeedback:'',grade:4});expect(readPortfolio()).toHaveLength(1);saveArtifact({...artifact,title:'Plant journal, revised'},undefined,artifact.id);expect(readPortfolio()[0].title).toContain('revised');expect(deleteArtifact(artifact.id)).toHaveLength(0)});
 it('isolates artifacts by learner account',()=>{saveArtifact({title:'Private work',kind:'writing',subject:'English',topic:'Story',description:'Draft',teacherFeedback:''},'one');expect(readPortfolio('two')).toHaveLength(0)});
 it('requires a title',()=>expect(()=>saveArtifact({title:' ',kind:'reflection',subject:'',topic:'',description:'',teacherFeedback:''})).toThrow());
});
