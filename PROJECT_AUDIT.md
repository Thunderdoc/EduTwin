# EduFlow product audit and delivery list

## Fixed in this pass

- [x] Make the learner demo a one-click login instead of only filling the form.
- [x] Normalize sign-in email addresses and recover safely from corrupted local account data.
- [x] Remove the hardcoded Supabase project identifier and anonymous key from source; use Vite environment variables.
- [x] Add a browsable Classes 1–12 curriculum map with class, board, subjects, and topic strands.
- [x] Save class, board, selected subjects, skills, and custom learning paths locally.
- [x] Preserve custom subject and skill creation for learner-controlled study plans.

## Important product gaps found

### P0 — production readiness

- [ ] Replace local-only passwords with managed authentication and secure server-side sessions.
- [ ] Add route guards for student, teacher, and administrator pages.
- [ ] Add password reset, email verification, account deletion, and session expiry.
- [ ] Define a backend schema for users, classes, enrollments, progress, assessments, and content.
- [ ] Add automated unit, integration, accessibility, and end-to-end browser tests.
- [ ] Add error monitoring, audit logs, rate limiting, abuse controls, and privacy/consent flows for minors.

### P1 — complete Classes 1–12 content

- [ ] Expand each class/board/subject into chapters, lessons, worked examples, exercises, quizzes, and answer keys.
- [ ] Store curriculum versions by academic year; map CBSE, Tamil Nadu, ICSE, and other state-board differences accurately.
- [ ] Add Tamil and other Indian-language content—not just translated interface labels.
- [ ] Add stream/elective selection for Classes 11–12 (Science, Commerce, Humanities, vocational combinations).
- [ ] Add teacher review and subject-matter-expert approval workflows.
- [ ] Add content licensing, citations, age suitability, and correction reporting.

### P1 — make learning real rather than demo data

- [ ] Replace hardcoded dashboard metrics, recommendations, and learning paths with persisted learner data.
- [ ] Connect lesson completion, quizzes, spaced revision, mastery, and weak-area recommendations.
- [ ] Connect AI tools to a safe server-side provider; never expose model keys in browser code.
- [ ] Ground AI answers in approved curriculum content and display sources.
- [ ] Add rubric-based assessments, board-exam patterns, mock tests, and teacher feedback.
- [ ] Implement reliable offline synchronization and conflict handling.

### P2 — user customization and engagement

- [ ] Let users build a timetable from selected class, subjects, exam dates, pace, and daily goal.
- [ ] Add configurable accessibility: dyslexia-friendly font, contrast, reduced motion, screen-reader labels, keyboard navigation.
- [ ] Add parent/guardian view, consent controls, teacher-class management, and role-specific dashboards.
- [ ] Add avatars, themes, dashboard widgets, learning modes, notification windows, and data-export controls.
- [ ] Add streak recovery, badges, class challenges, portfolios, projects, and goal check-ins without punitive gamification.
- [ ] Add career discovery, practical skills, financial literacy, coding, communication, arts, wellbeing, and exam planning.

## Environment setup

For optional Supabase integration, configure these outside source control:

```text
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_ANON_KEY=...
```

A production implementation should prefer a full Supabase URL variable and keep privileged/service-role keys server-side only.
