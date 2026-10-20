import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, BookOpen, Brain, Check, Eye, EyeOff, Globe2, GraduationCap, KeyRound, Languages, ShieldCheck, Sparkles, UserRound, UsersRound, WifiOff } from 'lucide-react';
import { useApp, type UserProfile } from '../context/AppContext';
import { authenticateLocalAccount, createLocalAccount, readAccounts } from '../services/localAuth';

const languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'Assamese'];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsAuthenticated, setUserRole, language, setLanguage, setIsOnline, setUserProfile, learnerProfile } = useApp();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeLogin = (profile: UserProfile, destination: string) => {
    setUserProfile(profile); setIsAuthenticated(true); setUserRole(profile.role);
    toast.success(`Welcome${profile.name ? `, ${profile.name.split(' ')[0]}` : ''}.`);
    navigate(destination);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); setIsSubmitting(true);
    try {
      const email = formData.email.trim().toLowerCase();
      const existingUser = await authenticateLocalAccount(email, formData.password);
      if (existingUser || (email === 'student@eduflow.ai' && formData.password === 'demo123')) {
        const isDemo = !existingUser;
        completeLogin(existingUser || { id: 'demo-student', name: 'Demo Student', email: 'student@eduflow.ai', role: 'student', createdAt: new Date().toISOString() }, isDemo || learnerProfile?.setupComplete ? '/dashboard' : '/setup');
        return;
      }
      toast.error('That sign-in did not match our local records.', { description: 'Use the learner demo or create a new account.' });
    } finally { setIsSubmitting(false); }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) return void toast.error('Complete each field to create your learning space.');
    if (!acceptedTerms) return void toast.error('Please confirm the privacy and responsible-use notice.');
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (readAccounts().some((user) => user.email.toLowerCase() === normalizedEmail)) return void toast.error('An account with this email already exists.');
    setIsSubmitting(true);
    try {
      const profile: UserProfile = { id: crypto.randomUUID(), name: formData.name.trim(), email: normalizedEmail, role: 'student', createdAt: new Date().toISOString() };
      await createLocalAccount(profile, formData.password);
      completeLogin(profile, '/setup');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not create this account.'); }
    finally { setIsSubmitting(false); }
  };

  const useDemo = () => completeLogin({ id: 'demo-student', name: 'Demo Student', email: 'student@eduflow.ai', role: 'student', createdAt: new Date().toISOString() }, '/dashboard');
  const enterOffline = () => { setIsOnline(false); completeLogin({ id: `offline-${Date.now()}`, name: 'Offline Learner', email: 'offline@local', role: 'student', createdAt: new Date().toISOString() }, '/dashboard'); };
  const enterTeacher = () => completeLogin({ id: 'demo-teacher', name: 'Demo Teacher', email: 'teacher@eduflow.ai', role: 'teacher', createdAt: new Date().toISOString() }, '/teacher');

  return <main id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"><Brain size={23} /></span><span><strong className="block text-xl tracking-tight">EduFlow</strong><span className="text-xs text-slate-500">Smart learning platform</span></span></Link>
        <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white"><ArrowLeft size={16} />Home</Link>
      </header>

      <div className="grid min-h-[calc(100vh-100px)] gap-8 py-8 lg:grid-cols-[1fr_480px] lg:items-center">
        <section className="hidden lg:block">
          <div className="max-w-xl"><span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm"><Sparkles size={14} />ONE LEARNING SPACE · EVERY CLASS</span><h1 className="mt-6 text-6xl font-black leading-[1.03] tracking-[-.055em] text-slate-900">Your path from first words to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">future-ready skills.</span></h1><p className="mt-6 text-lg leading-8 text-slate-600">Start at pre-primary or any class through Class 12. Shape your subjects, language, pace, practice, and revision in one connected workspace.</p></div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4">{[
            [GraduationCap, 'Pre-primary to Class 12', 'Class, board and stream-aware paths'],
            [Languages, '13 interface languages', 'English and 12 Indian regional languages'],
            [BookOpen, 'Subjects and life skills', 'Academic, creative, digital and career learning'],
            [ShieldCheck, 'Learner-controlled', 'Local data controls and accessibility settings'],
          ].map(([Icon, title, text]) => { const FeatureIcon = Icon as typeof GraduationCap; return <article key={title as string} className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur"><FeatureIcon className="size-5 text-purple-600" /><h2 className="mt-4 font-bold">{title as string}</h2><p className="mt-1 text-sm leading-5 text-slate-500">{text as string}</p></article>; })}</div>
        </section>

        <section className="rounded-3xl border border-white bg-white p-6 shadow-[0_24px_70px_rgba(76,68,160,.16)] sm:p-8">
          <div className="flex rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Account action"><button type="button" role="tab" aria-selected={isLogin} onClick={() => setIsLogin(true)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${isLogin ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}>Sign in</button><button type="button" role="tab" aria-selected={!isLogin} onClick={() => setIsLogin(false)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${!isLogin ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}>Create account</button></div>
          <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.15em] text-purple-600">Your learning space</p><h2 className="mt-2 text-3xl font-black tracking-tight">{isLogin ? 'Welcome back' : 'Build your learning path'}</h2><p className="mt-2 text-sm text-slate-500">{isLogin ? 'Continue from your next best learning step.' : 'Start with your class, language, and goals.'}</p></div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="mt-7 space-y-4">
            {!isLogin && <Field label="Learner name" icon={UserRound}><input required autoComplete="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g. Asha" className="login-input" /></Field>}
            <Field label="Email address" icon={UserRound}><input required type="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@example.com" className="login-input" /></Field>
            <Field label="Password" icon={KeyRound}><div className="relative"><input required type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder={isLogin ? 'Your password' : 'At least 8 characters'} className="login-input pr-12" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1 grid size-10 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></Field>
            <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-bold"><Globe2 size={15} className="text-purple-600" />Learning language</span><select value={language} onChange={(event) => setLanguage(event.target.value)} className="login-input">{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
            {!isLogin && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/60 p-3 text-xs leading-5 text-slate-600"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 size-4 accent-purple-600" /><span>I understand this prototype saves my local account on this device. A parent or guardian should assist younger learners.</span></label>}
            <button disabled={isSubmitting} type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">{isSubmitting ? 'Please wait…' : isLogin ? 'Continue learning' : 'Create my learning space'}<ArrowRight size={17} /></button>
          </form>

          {isLogin && <><button onClick={useDemo} type="button" className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 font-bold text-purple-700 hover:bg-purple-100"><Sparkles size={16} />Open learner demo</button><div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Other views</span><span className="h-px flex-1 bg-slate-200" /></div><div className="grid grid-cols-2 gap-3"><button type="button" onClick={enterOffline} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold hover:bg-slate-50"><WifiOff size={16} />Offline</button><button type="button" onClick={enterTeacher} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold hover:bg-slate-50"><UsersRound size={16} />Teacher demo</button></div></>}
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><Check className="mt-0.5 size-4 shrink-0" />Your class, language, subjects, and accessibility choices stay under your control.</p>
        </section>
      </div>
    </div>
  </main>;
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof UserRound; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-bold"><Icon size={15} className="text-purple-600" />{label}</span>{children}</label>;
}
