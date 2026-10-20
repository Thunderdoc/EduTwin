# EduFlow product audit and delivery list

## Delivered local foundations in this workspace

- [x] Login/demo/signup entry points, client role guards, learner setup, persistent class/board/language profile, and public home page.
- [x] Classes 0–12 curriculum discovery structure and 12 regional-language choices. It is a navigation skeleton, not complete official curriculum.
- [x] Six original skill-course outlines with modules, lessons, activities, and per-account local progress.
- [x] Reusable lesson player with explicit disclosure that generic scaffold content is not a complete authoritative lesson.
- [x] Original objective multiple-choice starter question sets for selected common topics/classes; scores, explanations, per-topic progress, mastery, and spaced-review dates are saved locally. Every bank entry is explicitly tagged as an unreviewed draft.
- [x] Assessment hub to combine available question sets and score them.
- [x] Review queue that shows due/upcoming items and records an explicit recall result.
- [x] Progress service validates scores, computes cumulative accuracy-based mastery, study minutes, date-based activity streaks, due reviews, and weak topics.
- [x] Progress, exams, courses, timetable, and portfolio use local account-scoped storage keys; progress service has isolation tests.
- [x] Dashboard/analytics use saved objective evidence and study-session records instead of fabricated scores, streaks, charts, and weak areas. Unknown cognitive traits are not inferred.
- [x] Smart academic recommendations now require actual scored progress; skill-course recommendations link to real in-app courses.
- [x] Timetable seeds a class/subject/daily-goal-based editable local study plan, persists events, and calculates schedule totals from saved events.
- [x] Exam planner saves learner-entered dates/syllabus and creates a transparent local revision outline from due reviews, scored weak topics, and entered topics.
- [x] Portfolio supports account-scoped text artifacts/reflections and JSON export; lesson activities can open a pre-filled portfolio reflection.
- [x] Plan/billing UI no longer pretends to upgrade accounts or take payment; it discloses that billing and feature entitlements are not connected.
- [x] Mind-map nodes are movable. Accessibility preferences, local crash recovery, content-review data model, provider-neutral AI contract, optional database schema, and deployment workflow foundations are present.

## Still incomplete — content and review work

- [ ] Complete, subject-specific lessons for every class, board, chapter, and academic year, with definitions, examples, worked solutions, diagrams, practice, answers, citations, and age review.
- [ ] Import and map authoritative CBSE/NCERT, Tamil Nadu, ICSE, and individual state-board syllabi, while respecting licensing and documenting year/version. Do not fabricate official material.
- [ ] Expand objective question coverage beyond the starter bank. Add educator-reviewed class/topic-specific questions, numeric and written answers, worked explanations, marking rubrics, and board-style mock tests. The current bank has a small number of original draft items and is not enough for a real examination product.
- [ ] Human translation, subject instruction, bilingual terminology, and reviewed audio for Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, Punjabi, Urdu, Odia, and Assamese. Language selectors alone are not full translation.
- [ ] Apply the selected Class 11–12 stream to valid board-specific subject combinations, projects, practicals, and pathways.
- [ ] Add source/correction reporting, license review, age suitability review, and an operational educator approval interface. The current typed model is only a workflow foundation.

## Still incomplete — services and product workflows

- [ ] Managed identity, email verification/reset, secure server sessions, durable database sync, cross-device recovery, server-side authorization, monitoring, rate limits, privacy/guardian consent operations, and institutional class/enrollment workflows require provisioned infrastructure and organizational decisions.
- [ ] AI features are disabled until a compliant server is configured at `VITE_AI_GATEWAY_URL`. The gateway contract is provider-neutral; there is no deployed provider, credential, moderation service, approved-source retrieval service, or audited production AI. Remaining generator pages must not be represented as live AI.
- [ ] Offline synchronization, conflict resolution, downloadable content, and sync status require a persistent backend and a defined conflict policy.
- [ ] Browser/push/email reminders are not delivered. Timetable reminder controls are local preferences only; the timetable clearly warns that background notifications are unavailable.
- [ ] Teacher and guardian experiences are not collaborative services yet. There is no shared roster, invitation/join code, assignment distribution, verified teacher grading, guardian-linked account, or legally reviewed consent.
- [ ] Portfolio entries are local text, not file uploads or teacher-submitted work. Teacher feedback fields are learner-authored private notes, not authenticated teacher comments.
- [ ] Skill courses still need assessed projects, rubrics, teacher feedback, certificates, and portfolio/course-level assessment.
- [ ] Cognitive, memory, focus, learning-style, and clinical risk analytics are deliberately not inferred from the limited activity data.
- [ ] Age-specific interface modes, global search, class challenges/badges, career pathways, guardian reports, and reviewed accessible-media content remain product work.
- [ ] Connect all remaining independent demo/AI pages to saved curriculum/progress or replace them with explicit non-production states. Existing `PROJECT_AUDIT` sections below cover additional deployment and audit work.

## P0 — production readiness

- [~] Replace local-only passwords with managed authentication and secure server-side sessions. The provider-neutral local adapter uses PBKDF2-SHA256 (210,000 iterations), migrates legacy plaintext records, and never stores new plaintext passwords; hosted identity and server sessions still require deployment.
- [x] Add client route guards for student and teacher pages; unauthorized roles are redirected safely. Administrator routes remain a backend-era feature because no admin UI exists.
- [~] Account deletion and 12-hour local session expiry are implemented. Password reset and email verification require managed authentication.
- [x] Define a provider-neutral PostgreSQL baseline schema for profiles, classes, enrollments, curricula, lessons, progress, assessments, corrections, consent, and audit events (`supabase/schema.sql`). It is optional and undeployed.
- [~] Add automated unit, integration, accessibility, and end-to-end browser tests. Vitest unit tests now cover local auth, curriculum catalog, course outlines, question bank, progress isolation, exam planner, portfolio, and content approval. Browser E2E and automated accessibility scans remain.
- [~] Add error monitoring, audit logs, rate limiting, abuse controls, and privacy/consent flows for minors. A local crash boundary/log and backend audit/consent tables exist; hosted monitoring and edge rate limiting require deployment infrastructure.

## P1 — reliable learner progress

- [~] Replace hardcoded learner dashboard/analytics sample values with persisted local evidence. The principal student dashboard, recommendations, weekly activity chart, subject mastery chart, timetable summary, and analytics page use local records; other specialist pages still have demo arrays.
- [~] Connect lesson completion, objective quizzes, spaced revision, mastery, and weak-topic recommendations. There is a working local loop for the limited unreviewed starter bank; broad subject-specific content/assessment remains incomplete.
- [~] Connect AI tools to a safe server-side provider. A provider-neutral cookie-authenticated gateway client and contract exist, but every gateway call remains disabled until deployment supplies and tests the endpoint.
- [~] Ground AI answers in approved curriculum content and display sources. The gateway contract requires approved context, citations, moderation, limits, and validated source-bearing responses; production retrieval is not deployed.
- [ ] Add full rubric-based assessments, board-exam patterns, mock tests, teacher feedback, and verified scoring.
- [ ] Implement reliable offline synchronization and conflict handling.

## P2 — customization and engagement

- [~] Timetable is editable, saved locally per learner, and initially generated from selected class/subjects/daily target. It does not know school hours and does not send alerts; the learner must adapt it.
- [~] Add configurable accessibility: reading-friendly font, high contrast, reduced motion, responsive font sizes, skip link, and stronger focus indicators are implemented; a full WCAG audit remains.
- [~] Add parent/guardian view, consent controls, teacher-class management, and role-specific dashboards. Student/teacher route authorization and optional consent/class schema exist; guardian and shared class-management workflows remain.
- [~] Themes, learning preferences, notification settings, editable profile details, local data export, and deletion are present; avatar upload and dashboard-widget layout remain.
- [~] Add low-stakes activity streak and basic saved-work portfolio. The streak derives from local study records; streak recovery, verified badges, challenges, assignments, and teacher-reviewed project workflows remain.
- [ ] Add comprehensive career discovery, practical pathways, subject combinations, and verified exam planning for each board. A learner-entered local exam planner is present but is not an official board planner.

## Environment and deployment requirements

Configure deployment secrets outside source control. `VITE_AI_GATEWAY_URL` must point to a compliant server; model keys must never be placed in browser variables. Managed identity, email, hosted AI, teacher moderation, monitoring, sync, and notifications need an explicitly provisioned server/backend, privacy/security review, approved licensed curriculum, and human content reviewers. Do not mark these blocked tasks complete until implemented and tested in that environment.
