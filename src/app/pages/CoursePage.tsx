import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { ArrowLeft, BookOpen, Check, CheckCircle2, Clock, Play, RotateCcw, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../components/Navigation';
import { useApp } from '../context/AppContext';
import { Progress } from '../components/ui/progress';
import { findSkillCourse } from '../lib/courseCatalog';

export default function CoursePage() {
  const { courseId } = useParams();
  const course = findSkillCourse(courseId);
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const storageKey = `eduflow_course_progress_${encodeURIComponent(userProfile?.id || 'anonymous')}_${courseId}`;
  const [completed, setCompleted] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; } });
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const lessons = useMemo(() => course?.modules.flatMap((item) => item.lessons) || [], [course]);
  if (!course) return <Navigate to="/recommendations" replace />;
  const current = lessons.find((lesson) => lesson.id === activeLesson) || lessons.find((lesson) => !completed.includes(lesson.id)) || lessons[0];
  const percentage = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;
  const toggleComplete = (id: string) => {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id];
    setCompleted(next); localStorage.setItem(storageKey, JSON.stringify(next));
    if (!completed.includes(id)) toast.success('Lesson completed', { description: 'Your course progress has been saved on this device.' });
  };

  return <><Navigation /><main id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-5 pb-24 pt-20 lg:ml-64 lg:p-8">
    <div className="mx-auto max-w-7xl"><button onClick={() => navigate('/recommendations')} className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-purple-700"><ArrowLeft size={16} />All recommendations</button>
      <header className={`rounded-3xl bg-gradient-to-r ${course.color} p-7 text-white shadow-xl sm:p-10`}><div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/75">Skill course · {course.duration}</p><h1 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-5xl">{course.title}</h1><p className="mt-4 max-w-2xl leading-7 text-white/85">{course.description}</p><div className="mt-5 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-white/15 px-3 py-1.5">{course.level}</span><span className="rounded-full bg-white/15 px-3 py-1.5">{course.modules.length} modules</span><span className="rounded-full bg-white/15 px-3 py-1.5">{lessons.length} lessons</span></div></div><div className="rounded-2xl bg-white/15 p-5 backdrop-blur"><div className="flex justify-between text-sm font-bold"><span>Your progress</span><span>{percentage}%</span></div><Progress value={percentage} className="mt-3 bg-white/20" /><p className="mt-3 text-xs text-white/75">{completed.length} of {lessons.length} lessons complete</p></div></div></header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]"><aside className="space-y-4">{course.modules.map((courseModule, moduleIndex) => { const done = courseModule.lessons.filter((lesson) => completed.includes(lesson.id)).length; return <section key={courseModule.id} className="overflow-hidden rounded-2xl border border-white bg-white shadow-sm"><div className="border-b bg-slate-50 p-4"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wide text-purple-600">Module {moduleIndex + 1}</p><span className="text-xs text-slate-400">{done}/{courseModule.lessons.length}</span></div><h2 className="mt-1 font-extrabold">{courseModule.title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{courseModule.outcome}</p></div><div className="p-2">{courseModule.lessons.map((lesson) => <button key={lesson.id} onClick={() => setActiveLesson(lesson.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${current?.id === lesson.id ? 'bg-purple-50' : 'hover:bg-slate-50'}`}><span className={`grid size-7 shrink-0 place-items-center rounded-full ${completed.includes(lesson.id) ? 'bg-emerald-500 text-white' : 'border border-slate-300 text-slate-400'}`}>{completed.includes(lesson.id) ? <Check size={14} /> : <Play size={12} />}</span><span className="min-w-0 flex-1"><strong className="block text-sm">{lesson.title}</strong><span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} />{lesson.minutes} min</span></span></button>)}</div></section>})}</aside>

        {current && <section className="h-fit rounded-3xl border border-white bg-white p-6 shadow-lg sm:p-8 xl:sticky xl:top-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-purple-600">Current lesson</p><h2 className="mt-2 text-3xl font-black tracking-tight">{current.title}</h2></div>{completed.includes(current.id) && <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><CheckCircle2 size={14} />Complete</span>}</div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2"><LessonBlock icon={BookOpen} title="Learn" text={current.summary} /><LessonBlock icon={Target} title="Apply" text={current.activity} /></div>
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5"><h3 className="font-extrabold">Reflection check</h3><p className="mt-2 text-sm leading-6 text-slate-600">Explain the main idea in your own words. Then describe one place where you could apply it. If either answer is unclear, review the lesson before marking it complete.</p></div>
          <div className="mt-7 flex flex-wrap gap-3"><button onClick={() => toggleComplete(current.id)} className={`flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white ${completed.includes(current.id) ? 'bg-slate-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>{completed.includes(current.id) ? <><RotateCcw size={16} />Mark incomplete</> : <><Check size={16} />Complete lesson</>}</button>{completed.includes(current.id) && lessons.find((lesson) => !completed.includes(lesson.id)) && <button onClick={() => setActiveLesson(lessons.find((lesson) => !completed.includes(lesson.id))!.id)} className="rounded-xl border border-purple-200 px-5 py-3 font-bold text-purple-700">Continue to next lesson</button>}</div>
        </section>}
      </div>
    </div>
  </main></>;
}

function LessonBlock({ icon: Icon, title, text }: { icon: typeof BookOpen; title: string; text: string }) { return <article className="rounded-2xl bg-slate-50 p-5"><Icon className="size-5 text-purple-600" /><h3 className="mt-3 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>; }
