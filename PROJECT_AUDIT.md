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

- [~] Replace local-only passwords with managed authentication and secure server-side sessions. The provider-neutral local adapter now uses PBKDF2-SHA256 (210,000 iterations), migrates legacy plaintext records, and never stores new plaintext passwords; hosted identity and server sessions still require deployment.
- [x] Add client route guards for student and teacher pages; unauthorized roles are redirected safely. Administrator routes remain a backend-era feature because no admin UI exists.
- [~] Account deletion and 12-hour local session expiry are implemented. Password reset and email verification require the managed authentication service described below.
- [x] Define a reviewed Supabase/PostgreSQL baseline schema for profiles, classes, enrollments, curricula, lessons, progress, assessments, corrections, consent, and audit events (`supabase/schema.sql`).
- [~] Add automated unit, integration, accessibility, and end-to-end browser tests. Vitest unit tests now cover authentication, Classes 1–12 catalog integrity, and curriculum approval rules; CI runs tests, a high/critical dependency audit, and the production build. Browser E2E and automated accessibility scans remain.
- [~] Add error monitoring, audit logs, rate limiting, abuse controls, and privacy/consent flows for minors. A local crash boundary/log and backend audit/consent tables now exist; hosted monitoring and edge rate limiting require deployment infrastructure.

### P1 — complete Classes 1–12 content

- [ ] Expand each class/board/subject into chapters, lessons, worked examples, exercises, quizzes, and answer keys.
- [ ] Store curriculum versions by academic year; map CBSE, Tamil Nadu, ICSE, and other state-board differences accurately.
- [ ] Add Tamil and other Indian-language content—not just translated interface labels.
- [ ] Add stream/elective selection for Classes 11–12 (Science, Commerce, Humanities, vocational combinations).
- [~] Add teacher review and subject-matter-expert approval workflows. Typed draft/review/approval transitions and administrator-only approval validation now exist; the hosted reviewer UI remains.
- [~] Add content licensing, citations, age suitability, and correction reporting. The content model enforces citations, licensing metadata, age ranges, reviewer metadata, practice, and correction counts; authoritative content still must be imported and reviewed.

### P1 — make learning real rather than demo data

- [ ] Replace hardcoded dashboard metrics, recommendations, and learning paths with persisted learner data.
- [ ] Connect lesson completion, quizzes, spaced revision, mastery, and weak-area recommendations.
- [~] Connect AI tools to a safe server-side provider; never expose model keys in browser code. A provider-neutral, cookie-authenticated gateway client and server contract now exist; deployment must supply `VITE_AI_GATEWAY_URL` and the server implementation.
- [~] Ground AI answers in approved curriculum content and display sources. The gateway contract requires approved context, citations, moderation, limits, and validated source-bearing responses; existing demo generators still need migration to the deployed endpoint.
- [ ] Add rubric-based assessments, board-exam patterns, mock tests, and teacher feedback.
- [ ] Implement reliable offline synchronization and conflict handling.

### P2 — user customization and engagement

- [ ] Let users build a timetable from selected class, subjects, exam dates, pace, and daily goal.
- [~] Add configurable accessibility: reading-friendly font, high contrast, reduced motion, responsive font sizes, a skip link, and stronger focus indicators are implemented; a full WCAG audit remains.
- [~] Add parent/guardian view, consent controls, teacher-class management, and role-specific dashboards. Student/teacher authorization and consent/class backend tables exist; guardian and class-management screens remain.
- [~] Add avatars, themes, dashboard widgets, learning modes, notification windows, and data-export controls. Themes, learning preferences, notification settings, editable profile details, data export, and deletion now work; avatar upload and dashboard-widget layout remain.
- [ ] Add streak recovery, badges, class challenges, portfolios, projects, and goal check-ins without punitive gamification.
- [ ] Add career discovery, practical skills, financial literacy, coding, communication, arts, wellbeing, and exam planning.

## Environment setup

For optional Supabase integration, configure these outside source control:

```text
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_ANON_KEY=...
```

A production implementation should prefer a full Supabase URL variable and keep privileged/service-role keys server-side only.

## Deployment-dependent work

Items involving managed authentication, email delivery, hosted AI, teacher moderation, monitoring, and rate limiting cannot be truthfully completed in a static browser repository alone. They require a provisioned Supabase project and/or server/edge runtime, provider credentials, approved curriculum licenses, and organizational privacy decisions. The repository now contains guarded client routes and `supabase/schema.sql` as the safe implementation baseline; do not mark the remaining deployment items complete until those services are configured and tested.
