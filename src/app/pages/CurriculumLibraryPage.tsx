import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, CheckCircle2, ChevronRight, FileQuestion, Languages, Library, Search, ShieldCheck } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { curriculumForGrade, regionalLanguages } from '../lib/schoolCurriculum';
import { extendedSchoolSubjects, knowledgeSubjects } from '../lib/knowledgeCatalog';

const deliveryLanguages = ['English', ...regionalLanguages];

function lessonParts(subject: string, topic: string, grade: number) {
  const level = grade === 0 ? 'early learner' : `Class ${grade}`;
  return [
    { label: 'Learn', text: `Build a clear ${level} understanding of ${topic.toLowerCase()} through guided explanation and vocabulary.` },
    { label: 'See it', text: `Connect ${topic.toLowerCase()} to an age-appropriate example from daily life, stories, data, or observation.` },
    { label: 'Practise', text: `Complete a supported activity, then an independent ${subject.toLowerCase()} practice task.` },
    { label: 'Check', text: `Use a short knowledge check and explain the answer in your own words.` },
  ];
}

export default function CurriculumLibraryPage() {
  const navigate = useNavigate();
  const [grade, setGrade] = useState(6);
  const [language, setLanguage] = useState('English');
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const curriculum = curriculumForGrade(grade);

  const subjects = useMemo(() => {
    const core = Object.keys(curriculum.subjects);
    const stageSubjects = knowledgeSubjects.filter((item) => item.stages.includes(curriculum.stage)).map((item) => item.name);
    return [...new Set([...core, ...stageSubjects, ...extendedSchoolSubjects])].filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  }, [curriculum, search]);

  const selected = subjects.includes(activeSubject) ? activeSubject : subjects[0];
  const catalogSubject = knowledgeSubjects.find((item) => item.name === selected);
  const topics = curriculum.subjects[selected] || catalogSubject?.concepts[curriculum.stage] || ['Foundations', 'Applications', 'Practice and projects'];

  return <><Navigation /><main id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-5 pb-24 pt-20 lg:ml-64 lg:p-10">
    <div className="mx-auto max-w-7xl">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-purple-700 p-7 text-white shadow-xl sm:p-10"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-100"><Library size={15} />Curriculum library</p><h1 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-5xl">Pre-primary to Class 12, in one learning map.</h1><p className="mt-4 max-w-2xl leading-7 text-blue-100">Explore CBSE-aligned original learning pathways across core academics, languages, creative subjects, technology, wellbeing, and senior-secondary choices.</p></div><div className="flex flex-wrap gap-2"><Badge className="border-white/20 bg-white/10 text-white"><Languages className="mr-1 size-3" />13 delivery languages</Badge><Badge className="border-white/20 bg-white/10 text-white"><ShieldCheck className="mr-1 size-3" />Review-ready structure</Badge></div></div></header>

      <section className="mt-6 rounded-2xl border border-white bg-white p-5 shadow-sm"><div className="grid gap-5 lg:grid-cols-[1fr_280px]"><div><p className="text-sm font-bold text-slate-700">Choose learner level</p><div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7 xl:grid-cols-[repeat(13,minmax(0,1fr))]">{Array.from({ length: 13 }, (_, item) => item).map((item) => <button key={item} onClick={() => setGrade(item)} className={`rounded-xl border px-2 py-2.5 text-xs font-bold ${grade === item ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-200 hover:border-purple-400'}`}>{item === 0 ? 'Pre-K' : item}</button>)}</div></div><label className="block text-sm font-bold text-slate-700">Learning language<select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-medium">{deliveryLanguages.map((item) => <option key={item}>{item}</option>)}</select></label></div></section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[310px_1fr]">
        <aside className="rounded-2xl border border-white bg-white p-4 shadow-sm"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find any subject" className="pl-9" /></div><div className="mt-4 max-h-[620px] space-y-1 overflow-y-auto pr-1">{subjects.map((subject) => <button key={subject} onClick={() => setActiveSubject(subject)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${selected === subject ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-50'}`}><span>{subject}</span><ChevronRight size={15} /></button>)}</div></aside>

        <section className="rounded-2xl border border-white bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-purple-600">{grade === 0 ? 'Pre-primary' : `Class ${grade}`} · {language}</p><h2 className="mt-2 text-3xl font-black tracking-tight">{selected || 'Choose a subject'}</h2><p className="mt-2 text-sm text-slate-500">Concept pathway with explanation, examples, practice, and knowledge checks.</p></div><Badge variant="outline" className="w-fit border-amber-300 bg-amber-50 text-amber-800">CBSE-aligned · original material</Badge></div>
          <div className="mt-6 space-y-4">{topics.map((topic, index) => <article key={topic} className="rounded-2xl border border-slate-200 p-5 transition hover:border-purple-300 hover:shadow-md"><div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-extrabold">{topic}</h3><span className="text-xs font-semibold text-slate-400">4-part lesson</span></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{lessonParts(selected, topic, grade).map((part) => <div key={part.label} className="rounded-xl bg-slate-50 p-3"><p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-purple-700">{part.label === 'Check' ? <FileQuestion size={14} /> : part.label === 'Learn' ? <BookOpen size={14} /> : <CheckCircle2 size={14} />}{part.label}</p><p className="mt-1.5 text-sm leading-5 text-slate-600">{part.text}</p></div>)}</div><button onClick={() => navigate(`/learn/${grade}/${encodeURIComponent(selected)}/${encodeURIComponent(topic)}`)} className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white">Start lesson</button></div></div></article>)}</div>
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><strong>Content status:</strong> this library is an original curriculum framework, not a reproduction of NCERT textbooks. Final textbook alignment, translations, answer keys, and official claims require licensed sources and educator approval.</p>
        </section>
      </div>
    </div>
  </main></>;
}
