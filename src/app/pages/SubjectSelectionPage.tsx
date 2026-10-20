import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Navigation } from "../components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useApp } from "../context/AppContext";
import { knowledgeSkills, knowledgeSubjects, learningStages, type LearningStageId } from "../lib/knowledgeCatalog";
import { curriculumForGrade, supportedBoards, type SchoolBoard } from "../lib/schoolCurriculum";
import { BookOpen, BrainCircuit, Check, ChevronRight, CirclePlus, Compass, GraduationCap, Plus, Search, Sparkles, X } from "lucide-react";

export default function SubjectSelectionPage() {
  const navigate = useNavigate();
  const { selectedSubjects, setSelectedSubjects, selectedSkills, setSelectedSkills } = useApp();
  const [stage, setStage] = useState<LearningStageId>("middle");
  const [grade, setGrade] = useState(6);
  const [board, setBoard] = useState<SchoolBoard>("CBSE");
  const [search, setSearch] = useState("");
  const [focusedSubject, setFocusedSubject] = useState(knowledgeSubjects[0].id);
  const [customSubjects, setCustomSubjects] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [customName, setCustomName] = useState("");
  const [customKind, setCustomKind] = useState<"subject" | "skill">("subject");

  useEffect(() => {
    const savedStage = localStorage.getItem("eduflow_learning_stage") as LearningStageId | null;
    if (savedStage && learningStages.some((item) => item.id === savedStage)) setStage(savedStage);
    const savedGrade = Number(localStorage.getItem("eduflow_grade"));
    if (savedGrade >= 1 && savedGrade <= 12) setGrade(savedGrade);
    const savedBoard = localStorage.getItem("eduflow_board") as SchoolBoard | null;
    if (savedBoard && supportedBoards.includes(savedBoard)) setBoard(savedBoard);
    const savedSubjects = JSON.parse(localStorage.getItem("eduflow_custom_subjects") || "[]");
    const savedSkills = JSON.parse(localStorage.getItem("eduflow_custom_skills") || "[]");
    setCustomSubjects(savedSubjects.map((item: { name?: string } | string) => typeof item === "string" ? item : item.name).filter(Boolean));
    setCustomSkills(savedSkills.map((item: { name?: string } | string) => typeof item === "string" ? item : item.name).filter(Boolean));
  }, []);

  const chooseStage = (id: LearningStageId) => {
    setStage(id);
    localStorage.setItem("eduflow_learning_stage", id);
  };
  const chooseGrade = (nextGrade: number) => {
    const curriculum = curriculumForGrade(nextGrade);
    setGrade(nextGrade);
    chooseStage(curriculum.stage);
    localStorage.setItem("eduflow_grade", String(nextGrade));
  };
  const chooseBoard = (nextBoard: SchoolBoard) => {
    setBoard(nextBoard);
    localStorage.setItem("eduflow_board", nextBoard);
  };
  const toggle = (name: string, values: string[], setValues: (items: string[]) => void) => {
    setValues(values.includes(name) ? values.filter((item) => item !== name) : [...values, name]);
  };
  const allSubjects = useMemo(() => [...knowledgeSubjects, ...customSubjects.map((name, index) => ({ id: `custom-subject-${index}`, name, category: "Academic" as const, color: "bg-slate-600", stages: learningStages.map((item) => item.id), concepts: { [stage]: ["Your custom learning path", "Practice set", "Personal projects"] } }))], [customSubjects, stage]);
  const allSkills = useMemo(() => [...knowledgeSkills, ...customSkills.map((name, index) => ({ id: `custom-skill-${index}`, name, category: "Custom", stages: learningStages.map((item) => item.id), outcome: "A custom goal designed for this learner" }))], [customSkills]);
  const subjects = useMemo(() => allSubjects.filter((subject) => subject.stages.includes(stage) && subject.name.toLowerCase().includes(search.toLowerCase())), [allSubjects, stage, search]);
  const skills = useMemo(() => allSkills.filter((skill) => skill.stages.includes(stage) && `${skill.name} ${skill.category}`.toLowerCase().includes(search.toLowerCase())), [allSkills, stage, search]);
  const currentSubject = allSubjects.find((item) => item.id === focusedSubject) || subjects[0];
  const activeStage = learningStages.find((item) => item.id === stage)!;
  const addCustomPath = () => {
    const name = customName.trim();
    if (!name) return;
    if (customKind === "subject") {
      if (!customSubjects.includes(name)) {
        const next = [...customSubjects, name];
        setCustomSubjects(next);
        localStorage.setItem("eduflow_custom_subjects", JSON.stringify(next.map((item) => ({ id: `custom-${item}`, name: item }))));
      }
      toggle(name, selectedSubjects, setSelectedSubjects);
    } else {
      if (!customSkills.includes(name)) {
        const next = [...customSkills, name];
        setCustomSkills(next);
        localStorage.setItem("eduflow_custom_skills", JSON.stringify(next.map((item) => ({ id: `custom-${item}`, name: item }))));
      }
      toggle(name, selectedSkills, setSelectedSkills);
    }
    setCustomName("");
    toast.success(`${name} is now part of this learning map.`);
  };

  return <><Navigation /><main className="min-h-screen bg-[#f8f7f2] p-5 pb-24 pt-20 font-[family-name:var(--font-body)] lg:ml-64 lg:p-10">
    <div className="mx-auto max-w-7xl">
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-[#10182f] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-10 -top-16 size-64 rounded-full bg-[#6058d8]/40 blur-3xl" />
        <div className="relative max-w-2xl"><p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[.17em] text-amber-300">EduFlow knowledge library</p><h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">One learning map. Every stage ahead.</h1><p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-300">Choose a stage and EduFlow will shape subjects, prerequisite concepts, practice and revision around the learner — from first stories to career-ready skills.</p></div>
        <div className="relative mt-7 flex flex-wrap gap-2"><Badge className="border-0 bg-white/10 px-3 py-1.5 text-white"><BrainCircuit className="mr-1.5 size-3.5" />Adaptive by design</Badge><Badge className="border-0 bg-white/10 px-3 py-1.5 text-white"><Check className="mr-1.5 size-3.5 text-emerald-300" />Available offline</Badge></div>
      </motion.header>

      <section className="mt-7"><div className="mb-3 flex items-end justify-between gap-4"><div><p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[.14em] text-[#625bd4]">01 / learning stage</p><h2 className="mt-1 text-xl font-extrabold tracking-[-.03em] text-slate-900">Where is the learner now?</h2></div><p className="hidden text-sm text-slate-500 sm:block">This choice is saved on this device.</p></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">{learningStages.map((item) => <button key={item.id} onClick={() => chooseStage(item.id)} className={`rounded-2xl border p-4 text-left transition duration-200 ${stage === item.id ? "border-[#6058d8] bg-[#eeedff] shadow-[0_8px_22px_rgba(96,88,216,.12)]" : "border-[#dfddd4] bg-white hover:-translate-y-0.5 hover:border-slate-300"}`}><p className="text-sm font-bold text-slate-900">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.ages}</p>{stage === item.id && <Check className="mt-3 size-4 text-[#5149cb]" />}</button>)}</div></section>

      <section className="mt-7 rounded-3xl border border-[#deddd4] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[.14em] text-[#625bd4]">School curriculum · Classes 1–12</p><h2 className="mt-1 text-xl font-extrabold tracking-[-.03em] text-slate-900">Choose your exact class and board</h2><p className="mt-1 text-sm text-slate-500">This changes the concepts shown below and is saved on this device.</p></div><label className="text-sm font-semibold text-slate-700">Board<select value={board} onChange={(event) => chooseBoard(event.target.value as SchoolBoard)} className="ml-3 rounded-xl border border-[#deddd4] bg-white px-3 py-2">{supportedBoards.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">{Array.from({ length: 12 }, (_, index) => index + 1).map((item) => <button key={item} onClick={() => chooseGrade(item)} className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${grade === item ? "border-[#6058d8] bg-[#6058d8] text-white" : "border-[#dfddd4] hover:border-[#6058d8]"}`}>Class {item}</button>)}</div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Object.entries(curriculumForGrade(grade).subjects).map(([name, topics]) => <button key={name} onClick={() => { if (!selectedSubjects.includes(name)) setSelectedSubjects([...selectedSubjects, name]); }} className="rounded-2xl bg-[#f5f4ef] p-4 text-left transition hover:bg-[#eeedff]"><div className="flex items-center justify-between"><h3 className="font-bold text-slate-900">{name}</h3>{selectedSubjects.includes(name) && <Check className="size-4 text-[#5149cb]" />}</div><p className="mt-2 text-xs leading-5 text-slate-600">{topics.join(" · ")}</p></button>)}</div>
      </section>

      <div className="mt-8 grid gap-7 xl:grid-cols-[1fr_300px]"><section><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[.14em] text-[#625bd4]">02 / choose a path</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-.04em] text-slate-900">{activeStage.label} knowledge map</h2><p className="mt-1 text-sm text-slate-600">{activeStage.description}</p></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a subject or skill" className="h-11 border-[#deddd4] bg-white pl-9" /></div></div>
        <Tabs defaultValue="subjects" className="mt-6"><TabsList className="h-11 bg-[#eceae2] p-1"><TabsTrigger value="subjects" className="rounded-lg px-4 data-[state=active]:bg-white"><BookOpen className="mr-2 size-4" />Subjects ({subjects.length})</TabsTrigger><TabsTrigger value="skills" className="rounded-lg px-4 data-[state=active]:bg-white"><Sparkles className="mr-2 size-4" />Life & career skills ({skills.length})</TabsTrigger></TabsList>
          <TabsContent value="subjects" className="mt-4"><div className="grid gap-3 md:grid-cols-2">{subjects.map((subject, index) => { const selected = selectedSubjects.includes(subject.name); return <motion.button key={subject.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} onClick={() => { setFocusedSubject(subject.id); toggle(subject.name, selectedSubjects, setSelectedSubjects); }} className={`group rounded-2xl border p-5 text-left transition ${selected ? "border-[#6058d8] bg-[#eeedff]" : "border-[#dfddd4] bg-white hover:border-[#b8b3ed]"}`}><div className="flex items-start justify-between gap-4"><span className={`grid size-10 place-items-center rounded-xl ${subject.color} text-sm font-extrabold text-white`}>{subject.name.slice(0, 1)}</span>{selected ? <span className="grid size-6 place-items-center rounded-full bg-[#6058d8] text-white"><Check size={14} /></span> : <CirclePlus className="size-5 text-slate-400 transition group-hover:text-[#6058d8]" />}</div><h3 className="mt-5 font-bold text-slate-900">{subject.name}</h3><p className="mt-1 text-xs text-slate-500">{subject.concepts[stage]?.slice(0, 3).join(" · ")}</p></motion.button>})}</div>{subjects.length === 0 && <EmptyState label="No subjects match that search yet." />}</TabsContent>
          <TabsContent value="skills" className="mt-4"><div className="grid gap-3 md:grid-cols-2">{skills.map((skill, index) => { const selected = selectedSkills.includes(skill.name); return <motion.button key={skill.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} onClick={() => toggle(skill.name, selectedSkills, setSelectedSkills)} className={`rounded-2xl border p-5 text-left transition ${selected ? "border-[#6058d8] bg-[#eeedff]" : "border-[#dfddd4] bg-white hover:border-[#b8b3ed]"}`}><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-[#eceae2] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.1em] text-slate-600">{skill.category}</span>{selected ? <span className="grid size-6 place-items-center rounded-full bg-[#6058d8] text-white"><Check size={14} /></span> : <CirclePlus className="size-5 text-slate-400" />}</div><h3 className="mt-5 font-bold text-slate-900">{skill.name}</h3><p className="mt-1 text-sm leading-5 text-slate-600">{skill.outcome}</p></motion.button>})}</div>{skills.length === 0 && <EmptyState label="No skills match that search yet." />}</TabsContent>
        </Tabs></section>

        <aside className="space-y-4 xl:pt-[60px]"><div className="rounded-2xl border border-[#deddd4] bg-white p-5"><p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.14em] text-[#625bd4]">Concept preview</p>{currentSubject && <><h3 className="mt-3 text-lg font-extrabold tracking-[-.03em] text-slate-900">{currentSubject.name}</h3><p className="mt-1 text-sm text-slate-500">Core concepts for {activeStage.label.toLowerCase()}:</p><div className="mt-4 flex flex-wrap gap-2">{(currentSubject.concepts[stage] || []).map((concept) => <span key={concept} className="rounded-lg bg-[#f3f2ee] px-2.5 py-1.5 text-xs font-medium text-slate-700">{concept}</span>)}</div></>}</div>
          <div className="rounded-2xl bg-[#1e2750] p-5 text-white"><Compass className="size-5 text-amber-300" /><h3 className="mt-3 font-bold">Ready for a focused session?</h3><p className="mt-1 text-sm leading-5 text-slate-300">Your chosen subjects become the Smart Engine’s starting context.</p><Button onClick={() => { if (!selectedSubjects.length && !selectedSkills.length) { toast.error("Choose at least one subject or skill first."); return; } navigate("/autonomous-learning"); }} className="mt-5 w-full bg-amber-300 font-bold text-[#111827] hover:bg-amber-200">Start my learning loop<ChevronRight className="ml-1 size-4" /></Button></div>
          <div className="rounded-2xl border border-dashed border-[#c9c6bb] p-5"><div className="flex items-center gap-2 text-slate-800"><GraduationCap className="size-5 text-[#6058d8]" /><span className="font-bold">Your selection</span></div><p className="mt-2 text-sm text-slate-600">{selectedSubjects.length} subjects · {selectedSkills.length} skills</p>{(selectedSubjects.length + selectedSkills.length) > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{[...selectedSubjects, ...selectedSkills].slice(0, 6).map((item) => <Badge key={item} variant="secondary" className="bg-[#eeedff] text-[#383180]">{item}<X className="ml-1 size-3" /></Badge>)}</div>}<div className="mt-5 border-t border-[#e7e4db] pt-4"><p className="text-sm font-bold text-slate-800">Create a custom path</p><div className="mt-3 flex rounded-lg bg-[#f1f0eb] p-1"><button onClick={() => setCustomKind("subject")} className={`flex-1 rounded-md py-1.5 text-xs font-semibold ${customKind === "subject" ? "bg-white text-[#5149cb] shadow-sm" : "text-slate-500"}`}>Subject</button><button onClick={() => setCustomKind("skill")} className={`flex-1 rounded-md py-1.5 text-xs font-semibold ${customKind === "skill" ? "bg-white text-[#5149cb] shadow-sm" : "text-slate-500"}`}>Skill</button></div><div className="mt-2 flex gap-2"><Input value={customName} onChange={(event) => setCustomName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addCustomPath(); }} placeholder={customKind === "subject" ? "e.g. Astronomy" : "e.g. Photography"} className="h-9 bg-white text-sm" /><button onClick={addCustomPath} className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#6058d8] text-white hover:bg-[#5149cb]" aria-label="Add custom learning path"><Plus size={17} /></button></div></div></div>
        </aside></div>
    </div></main></>;
}

function EmptyState({ label }: { label: string }) { return <div className="rounded-2xl border border-dashed border-[#d7d4ca] py-12 text-center text-sm text-slate-500">{label}</div>; }
