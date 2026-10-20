-- EduFlow baseline schema for Supabase/PostgreSQL.
-- Apply through a reviewed migration, never directly from browser code.
create extension if not exists pgcrypto;

create type public.app_role as enum ('student','teacher','guardian','admin');
create type public.content_status as enum ('draft','in_review','approved','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  display_name text not null check (char_length(display_name) between 1 and 100),
  preferred_language text not null default 'English',
  grade smallint check (grade between 1 and 12),
  board text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.guardian_consents (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade,
  guardian_id uuid references public.profiles(id) on delete set null, consent_version text not null,
  status text not null check (status in ('pending','granted','withdrawn')), granted_at timestamptz, created_at timestamptz not null default now()
);
create table public.classes (
  id uuid primary key default gen_random_uuid(), teacher_id uuid not null references public.profiles(id), name text not null,
  board text not null, grade smallint not null check (grade between 1 and 12), academic_year text not null, created_at timestamptz not null default now()
);
create table public.enrollments (
  class_id uuid references public.classes(id) on delete cascade, student_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(), primary key(class_id, student_id)
);
create table public.curricula (
  id uuid primary key default gen_random_uuid(), board text not null, grade smallint not null check (grade between 1 and 12),
  subject text not null, academic_year text not null, version integer not null default 1, status public.content_status not null default 'draft',
  license text, source_url text, approved_by uuid references public.profiles(id), approved_at timestamptz,
  unique(board, grade, subject, academic_year, version)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(), curriculum_id uuid not null references public.curricula(id) on delete cascade,
  chapter integer not null, position integer not null, title text not null, language text not null default 'English',
  age_min smallint, age_max smallint, body jsonb not null default '{}'::jsonb, status public.content_status not null default 'draft',
  unique(curriculum_id, chapter, position, language)
);
create table public.assessments (
  id uuid primary key default gen_random_uuid(), lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null, rubric jsonb not null default '{}'::jsonb, questions jsonb not null default '[]'::jsonb,
  answer_key jsonb not null default '[]'::jsonb, max_score numeric not null check (max_score > 0)
);
create table public.lesson_progress (
  student_id uuid references public.profiles(id) on delete cascade, lesson_id uuid references public.lessons(id) on delete cascade,
  status text not null check (status in ('not_started','in_progress','completed','review_due')), mastery numeric not null default 0 check (mastery between 0 and 100),
  minutes_spent integer not null default 0 check (minutes_spent >= 0), next_review_at timestamptz, updated_at timestamptz not null default now(),
  primary key(student_id, lesson_id)
);
create table public.assessment_attempts (
  id uuid primary key default gen_random_uuid(), assessment_id uuid not null references public.assessments(id), student_id uuid not null references public.profiles(id),
  answers jsonb not null, score numeric not null, teacher_feedback text, submitted_at timestamptz not null default now()
);
create table public.content_corrections (
  id uuid primary key default gen_random_uuid(), lesson_id uuid references public.lessons(id) on delete cascade, reporter_id uuid references public.profiles(id),
  description text not null, status text not null default 'open' check (status in ('open','reviewing','resolved','rejected')), created_at timestamptz not null default now()
);
create table public.audit_events (
  id bigint generated always as identity primary key, actor_id uuid references public.profiles(id), action text not null,
  entity_type text not null, entity_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.guardian_consents enable row level security;
alter table public.classes enable row level security;
alter table public.enrollments enable row level security;
alter table public.curricula enable row level security;
alter table public.lessons enable row level security;
alter table public.assessments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.content_corrections enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "approved curricula readable" on public.curricula for select using (status = 'approved');
create policy "approved lessons readable" on public.lessons for select using (status = 'approved');
create policy "assessments readable with approved lesson" on public.assessments for select using (exists (select 1 from public.lessons l where l.id = lesson_id and l.status = 'approved'));
create policy "students manage own progress" on public.lesson_progress for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "students manage own attempts" on public.assessment_attempts for insert with check (student_id = auth.uid());
create policy "students read own attempts" on public.assessment_attempts for select using (student_id = auth.uid());
create policy "users report corrections" on public.content_corrections for insert with check (reporter_id = auth.uid());
create policy "users read own reports" on public.content_corrections for select using (reporter_id = auth.uid());
