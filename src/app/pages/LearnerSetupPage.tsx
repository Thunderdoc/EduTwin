import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, BookOpen, Check, Clock, GraduationCap, Languages, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useApp, type LearnerProfile } from '../context/AppContext';
import { curriculumForGrade, regionalLanguages, supportedBoards, type SchoolBoard } from '../lib/schoolCurriculum';

const goals = ['Keep up with school', 'Strengthen weak topics', 'Prepare for exams', 'Learn ahead', 'Improve language skills', 'Build practical skills'];
const streams = ['Science', 'Commerce', 'Humanities', 'Vocational', 'Custom'] as const;
const media = ['English', ...regionalLanguages];

export default function LearnerSetupPage() {
  const navigate = useNavigate();
  const { language, setLanguage, learnerProfile, setLearnerProfile, setSelectedSubjects, updateUserPreferences } = useApp();
  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState(learnerProfile?.grade ?? 6);
  const [board, setBoard] = useState<SchoolBoard>(learnerProfile?.board ?? 'CBSE');
  const [medium, setMedium] = useState(learnerProfile?.medium ?? language);
  const [firstLanguage, setFirstLanguage] = useState(learnerProfile?.firstLanguage ?? language);
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>(learnerProfile?.additionalLanguages ?? []);
  const [stream, setStream] = useState<LearnerProfile['stream']>(learnerProfile?.stream);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(learnerProfile?.goals ?? ['Keep up with school']);
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [examDate, setExamDate] = useState(learnerProfile?.examDate ?? '');
  const curriculum = useMemo(() => curriculumForGrade(grade), [grade]);

  const toggle = (item: string, current: string[], setter: (value: string[]) => void) => setter(current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  const finish = () => {
    if (grade >= 11 && !stream) return toast.error('Choose a Class 11–12 stream or custom combination.');
    const profile: LearnerProfile = { grade, board, academicYear: '2026-27', medium, firstLanguage, additionalLanguages, stream, goals: selectedGoals, examDate: examDate || undefined, setupComplete: true };
    setLearnerProfile(profile); setLanguage(medium); setSelectedSubjects(Object.keys(curriculum.subjects)); updateUserPreferences({ dailyGoalMinutes: dailyMinutes });
    localStorage.setItem('eduflow_grade', String(grade)); localStorage.setItem('eduflow_board', board); localStorage.setItem('eduflow_learning_stage', curriculum.stage);
    toast.success('Your learning space is ready.', { description: `${grade === 0 ? 'Pre-primary' : `Class ${grade}`} · ${board} · ${medium}` });
    navigate('/onboarding-quiz');
  };

  return <main id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-4 sm:p-8">
    <div className="mx-auto max-w-5xl"><header className="flex items-center justify-between py-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white"><GraduationCap /></span><div><strong className="text-xl">Set up your learning space</strong><p className="text-sm text-slate-500">Step {step} of 3</p></div></div><div className="flex gap-1">{[1,2,3].map((item) => <span key={item} className={`h-2 w-12 rounded-full ${item <= step ? 'bg-purple-600' : 'bg-slate-200'}`} />)}</div></header>
      <section className="mt-6 rounded-3xl border border-white bg-white p-6 shadow-xl sm:p-9">
        {step === 1 && <><StepTitle icon={GraduationCap} eyebrow="Your curriculum" title="Where are you learning now?" text="This assigns your class and automatically builds the right subject starting point." /><label className="mt-8 block text-sm font-bold">Class level</label><div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7 xl:grid-cols-[repeat(13,minmax(0,1fr))]">{Array.from({length:13},(_,i)=>i).map((item)=><button key={item} onClick={()=>setGrade(item)} className={`rounded-xl border p-3 text-sm font-bold ${grade===item?'border-purple-600 bg-purple-600 text-white':'border-slate-200 hover:border-purple-400'}`}>{item===0?'Pre-K':item}</button>)}</div><div className="mt-7 grid gap-5 sm:grid-cols-2"><SelectField label="Education board" value={board} onChange={(value)=>setBoard(value as SchoolBoard)} options={supportedBoards}/><SelectField label="Academic year" value="2026-27" onChange={()=>{}} options={['2026-27']}/></div>{grade>=11&&<div className="mt-7"><p className="text-sm font-bold">Senior-secondary stream</p><div className="mt-3 flex flex-wrap gap-2">{streams.map((item)=><button key={item} onClick={()=>setStream(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${stream===item?'border-purple-600 bg-purple-100 text-purple-800':'border-slate-200'}`}>{item}</button>)}</div></div>}</>}
        {step === 2 && <><StepTitle icon={Languages} eyebrow="Language and subjects" title="How should EduFlow teach you?" text="Choose the lesson language separately from the languages you study as subjects." /><div className="mt-8 grid gap-5 sm:grid-cols-2"><SelectField label="Medium of instruction" value={medium} onChange={setMedium} options={media}/><SelectField label="First language subject" value={firstLanguage} onChange={setFirstLanguage} options={media}/></div><div className="mt-7"><p className="text-sm font-bold">Additional language subjects</p><div className="mt-3 flex flex-wrap gap-2">{regionalLanguages.filter((item)=>item!==firstLanguage).map((item)=><button key={item} onClick={()=>toggle(item,additionalLanguages,setAdditionalLanguages)} className={`rounded-full border px-3 py-2 text-sm ${additionalLanguages.includes(item)?'border-blue-600 bg-blue-50 text-blue-700':'border-slate-200'}`}>{additionalLanguages.includes(item)&&<Check className="mr-1 inline size-3"/>}{item}</button>)}</div></div><div className="mt-7 rounded-2xl bg-slate-50 p-5"><p className="flex items-center gap-2 font-bold"><BookOpen className="size-5 text-purple-600"/>Subjects assigned for {grade===0?'Pre-primary':`Class ${grade}`}</p><div className="mt-3 flex flex-wrap gap-2">{Object.keys(curriculum.subjects).map((item)=><span key={item} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium shadow-sm">{item}</span>)}</div><p className="mt-3 text-xs text-slate-500">You can add electives and personal interests later in My Subjects.</p></div></>}
        {step === 3 && <><StepTitle icon={Target} eyebrow="Goals and rhythm" title="What should your plan optimize for?" text="EduFlow will use these choices for your dashboard, timetable, recommendations, and review queue." /><div className="mt-8 grid gap-3 sm:grid-cols-2">{goals.map((item)=><button key={item} onClick={()=>toggle(item,selectedGoals,setSelectedGoals)} className={`flex items-center justify-between rounded-xl border p-4 text-left font-semibold ${selectedGoals.includes(item)?'border-purple-500 bg-purple-50':'border-slate-200'}`}>{item}{selectedGoals.includes(item)&&<Check className="size-4 text-purple-600"/>}</button>)}</div><div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-bold"><span className="flex items-center gap-2"><Clock size={16}/>Daily study target</span><select value={dailyMinutes} onChange={(e)=>setDailyMinutes(Number(e.target.value))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3">{[20,30,45,60,90,120].map((item)=><option key={item} value={item}>{item} minutes</option>)}</select></label><label className="block text-sm font-bold">Next important exam<input type="date" value={examDate} onChange={(e)=>setExamDate(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label></div></>}
        <div className="mt-9 flex justify-between border-t pt-6"><button disabled={step===1} onClick={()=>setStep(step-1)} className="rounded-xl px-5 py-3 font-bold text-slate-500 disabled:opacity-0">Back</button>{step<3?<button onClick={()=>setStep(step+1)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white">Continue<ArrowRight size={17}/></button>:<button onClick={finish} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white">Build my learning plan<ArrowRight size={17}/></button>}</div>
      </section>
    </div>
  </main>;
}

function StepTitle({icon:Icon,eyebrow,title,text}:{icon:typeof GraduationCap;eyebrow:string;title:string;text:string}){return <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-purple-600"><Icon size={15}/>{eyebrow}</p><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl leading-7 text-slate-500">{text}</p></div>}
function SelectField({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:readonly string[]}){return <label className="block text-sm font-bold">{label}<select value={value} onChange={(e)=>onChange(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">{options.map((item)=><option key={item}>{item}</option>)}</select></label>}
