import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp, type UserProfile } from "../context/AppContext";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Globe2,
  GraduationCap,
  KeyRound,
  Sparkles,
  UserRound,
  UsersRound,
  WifiOff,
} from "lucide-react";

const languages = ["English", "Tamil", "Hindi", "Telugu", "Malayalam"];

const learningSignals = [
  { label: "Learner model", value: "Adapts to you" },
  { label: "Review queue", value: "Always in reach" },
  { label: "Your progress", value: "Private by design" },
];

const readLocalUsers = (): Array<UserProfile & { password: string }> => {
  try {
    const value = JSON.parse(localStorage.getItem("eduflow_offline_users") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    localStorage.removeItem("eduflow_offline_users");
    return [];
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole, language, setLanguage, setIsOnline, setUserProfile } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const completeLogin = (profile: UserProfile, destination: string) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    setUserRole(profile.role);
    toast.success(`Welcome${profile.name ? `, ${profile.name.split(" ")[0]}` : ""}.`);
    navigate(destination);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const savedUsers = readLocalUsers();
    const existingUser = savedUsers.find(
      (user) => user.email.toLowerCase() === email && user.password === formData.password,
    );

    if (existingUser || (email === "student@eduflow.ai" && formData.password === "demo123")) {
      completeLogin(
        existingUser || {
          id: `demo-${Date.now()}`,
          name: "Demo Student",
          email: "student@eduflow.ai",
          role: "student",
          createdAt: new Date().toISOString(),
        },
        "/dashboard",
      );
      return;
    }

    toast.error("That sign-in didn’t match our local records.", { description: "Use the demo account or create a new local account." });
  };

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Complete each field to create your learning space.");
      return;
    }

    const savedUsers = readLocalUsers();
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (savedUsers.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      toast.error("An account with this email already exists.", { description: "Try signing in instead." });
      return;
    }

    const profile: UserProfile & { password: string } = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: normalizedEmail,
      password: formData.password,
      role: "student",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("eduflow_offline_users", JSON.stringify([...savedUsers, profile]));
    completeLogin(profile, "/onboarding-quiz");
  };

  const useDemo = () => {
    completeLogin(
      { id: "demo-student", name: "Demo Student", email: "student@eduflow.ai", role: "student", createdAt: new Date().toISOString() },
      "/dashboard",
    );
  };

  const enterOffline = () => {
    setIsOnline(false);
    completeLogin(
      { id: `offline-${Date.now()}`, name: "Offline Learner", email: "offline@local", role: "student", createdAt: new Date().toISOString() },
      "/dashboard",
    );
  };

  const enterTeacher = () => {
    completeLogin(
      { id: `teacher-${Date.now()}`, name: "Demo Teacher", email: "teacher@eduflow.ai", role: "teacher", createdAt: new Date().toISOString() },
      "/teacher",
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b1020] font-[family-name:var(--font-body)] text-slate-950 selection:bg-amber-200">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#6c63ff]/35 blur-3xl"
          animate={{ x: [0, 70, 0], y: [0, -30, 0], scale: [1, 1.16, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
          animate={{ x: [0, -55, 0], y: [0, 35, 0], scale: [1.1, 0.92, 1.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden px-10 py-10 lg:flex lg:flex-col xl:px-20">
          <motion.div
            className="flex items-center gap-3 text-white"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <div className="grid size-11 place-items-center rounded-[15px] bg-amber-300 text-[#0b1020] shadow-[0_0_0_6px_rgba(251,191,36,.10)]"><BrainCircuit size={23} strokeWidth={2.3} /></div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-0.04em]">EduFlow</p>
              <p className="font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Personal learning system</p>
            </div>
          </motion.div>

          <div className="my-auto max-w-xl py-14">
            <motion.p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.18em] text-amber-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>Learning, in motion</motion.p>
            <motion.h1
              className="mt-5 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[1.03] tracking-[-0.055em] text-white xl:text-6xl"
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.65 }}
            >
              A study rhythm that <span className="text-amber-300">keeps up with you.</span>
            </motion.h1>
            <motion.p className="mt-6 max-w-md text-lg leading-8 text-slate-300" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.55 }}>
              EduFlow notices what you know, what needs another pass, and what your mind is ready for next.
            </motion.p>

            <motion.div className="mt-12 border-y border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
              {learningSignals.map((signal, index) => (
                <div key={signal.label} className="flex items-center justify-between py-4 text-sm" >
                  <span className="flex items-center gap-3 text-slate-400"><span className="grid size-5 place-items-center rounded-full border border-white/15 font-[family-name:var(--font-mono)] text-[9px] text-amber-300">0{index + 1}</span>{signal.label}</span>
                  <span className="font-medium text-white">{signal.value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div className="flex items-center gap-2 text-sm text-slate-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}>
            <span className="relative flex size-2"><span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-400" /></span>
            Designed to keep learning available — even offline.
          </motion.div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-5 py-9 sm:px-8 lg:px-12">
          <motion.div className="w-full max-w-[430px]" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: "easeOut" }}>
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2.5"><div className="grid size-10 place-items-center rounded-xl bg-[#0b1020] text-amber-300"><BrainCircuit size={21} /></div><span className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-.04em]">EduFlow</span></div>
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.14em] text-slate-500">v2.1</span>
            </div>

            <div className="mb-8">
              <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[.15em] text-[#5d56d8]">Your learning space</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-.055em] text-[#111827]">{isLogin ? "Pick up where you left off." : "Start your learning loop."}</h2>
              <p className="mt-3 text-[15px] leading-6 text-slate-600">{isLogin ? "Sign in to see today’s next best step." : "Your plan will adapt as you learn."}</p>
            </div>

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
              {!isLogin && <Field label="Your name" icon={UserRound}><input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g. Asha Reddy" className="field-input" /></Field>}
              <Field label="Email address" icon={UserRound}><input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@example.com" className="field-input" /></Field>
              <Field label="Password" icon={KeyRound}>
                <div className="relative"><input required type={showPassword ? "text" : "password"} value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Your password" className="field-input pr-12" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1 grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d56d8]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
              </Field>

              <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><Globe2 size={15} className="text-[#5d56d8]" />Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)} className="field-input cursor-pointer appearance-none bg-[linear-gradient(45deg,transparent_50%,#64748b_50%),linear-gradient(135deg,#64748b_50%,transparent_50%)] bg-[position:calc(100%-18px)_calc(50%-2px),calc(100%-13px)_calc(50%-2px)] bg-[size:5px_5px,5px_5px] bg-no-repeat pr-10">{languages.map((item) => <option key={item}>{item}</option>)}</select></label>

              <button type="submit" className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1020] px-5 text-[15px] font-bold text-white shadow-[0_12px_26px_rgba(11,16,32,.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#202a47] hover:shadow-[0_18px_30px_rgba(11,16,32,.20)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#5d56d8]">
                {isLogin ? "Continue learning" : "Create my space"}<ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>

            {isLogin && <button type="button" onClick={useDemo} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#deddd4] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#b9b5ee] hover:bg-[#f7f6ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5d56d8]"><Sparkles size={16} className="text-[#5d56d8]" />Try the learner demo<ChevronRight size={16} /></button>}

            <div className="my-7 flex items-center gap-3"><div className="h-px flex-1 bg-[#dfddd4]" /><span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.14em] text-slate-400">or</span><div className="h-px flex-1 bg-[#dfddd4]" /></div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={enterOffline} className="secondary-action"><WifiOff size={17} />Use offline</button>
              <button type="button" onClick={enterTeacher} className="secondary-action"><UsersRound size={17} />Teacher view</button>
            </div>

            <div className="mt-8 rounded-xl bg-[#eceae2] p-4"><p className="flex items-start gap-2 text-xs leading-5 text-slate-600"><Check size={15} className="mt-0.5 shrink-0 text-emerald-700" /><span><strong className="font-semibold text-slate-800">Your pace stays yours.</strong> Core learning data is saved locally, so a dropped connection doesn’t end a study session.</span></p></div>

            <p className="mt-7 text-center text-sm text-slate-500">{isLogin ? "New to EduFlow?" : "Already have a learning space?"} <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#5149cb] underline decoration-[#b7b3ee] underline-offset-4 transition hover:text-[#322b99]">{isLogin ? "Create an account" : "Sign in"}</button></p>
            <p className="mt-6 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[.12em] text-slate-400">Built for thoughtful progress</p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: typeof UserRound; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"><Icon size={15} className="text-[#5d56d8]" />{label}</span>{children}</label>;
}
