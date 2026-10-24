# EduFlow — AI-Powered Autonomous Learning Platform

> **Repository:** `Thunderdoc/EduTwin` · **App name:** EduFlow (`com.eduflow.app`)
>
> EduFlow is a learning platform built as a React web app that can also run as an
> installable PWA and as an Android app via Capacitor. It is organised around
> adaptive and autonomous learning flows: a student signs in, picks subjects,
> and moves through learning, recommendations, analytics, and gamification
> screens, with a teacher dashboard alongside.

## Status — read this first

- **No live deployment link is published here.** The previous README linked to
  placeholder (`#`) and `yourusername/eduflow` badge URLs, and named no deployed
  site. No live link is included in this README until a real deployment URL is
  verified.
- **No published APK or release download is linked here.** There is no download
  URL in the repository's README or config; the Android app is built from this
  source (see [Build for Android](#build-for-android)).
- **No usage, performance, or accuracy metrics are claimed here.** The previous
  README's figures (load time, APK size, page/component counts, "100% offline",
  "100% TypeScript", test coverage, WCAG claims) were not supported by the
  files checked for this rewrite and have been removed.
- This README is a draft the owner can still correct after publishing.

## What it is

A single-page React application (entry: `src/main.tsx` → `src/app/App.tsx`)
with client-side routing, a PWA install prompt, and service-worker registration
in production builds (`src/app/App.tsx` calls `registerServiceWorker()` from
`src/app/utils/pwa.ts`, which registers `/service-worker.js`). Capacitor wraps
the built web output (`webDir: 'dist'`) for Android — see
`capacitor.config.ts`.

The app's own framing is "autonomous learning": the Learn → Test → Analyze →
Adapt loop is reflected in the app's pages (adaptive learning, autonomous
learning, cognitive learning, recommendations, and analytics), not in any
externally verified AI result. Nothing here claims a measured learning outcome.

## Features (from the app's actual routes)

All routes below are defined in `src/app/routes.tsx` (20 routes):

| Area | Routes |
| --- | --- |
| Entry & onboarding | `/` (login), `/onboarding-quiz`, `/subjects` |
| Student learning | `/dashboard`, `/adaptive-learning`, `/autonomous-learning`, `/cognitive-learning`, `/digital-twin` |
| Help & insight | `/ai-chat`, `/cognitive-tools`, `/recommendations`, `/knowledge-graph`, `/analytics-dashboard` |
| Organisation & motivation | `/timetable`, `/gamification` |
| Teacher | `/teacher`, `/teacher/students`, `/teacher/performance`, `/teacher/interventions` |
| Mobile | `/mobile-app-launcher` |

Also wired into the app shell (`src/app/App.tsx`): PWA install prompt,
service-worker registration, and toast notifications.

What is **not** claimed: the previous README's "8 AI systems", "15+ AI tools",
multi-language support, teacher intervention details, and gamification
mechanics (streaks, XP, leaderboards) are not described here, because the
route and config files checked for this rewrite do not by themselves evidence
those details. If those features are confirmed in the page components, they can
be added back with file references.

## Tech stack (from `package.json`, `vite.config.ts`, `capacitor.config.ts`)

- **Frontend:** React 18.3.1 (listed as a peer dependency), React Router 7.13.0,
  Vite 6.3.5, Tailwind CSS 4.1.12
- **UI & visualisation:** Radix UI components, MUI (`@mui/material`), Lucide
  icons, Recharts, Motion
- **Mobile / PWA:** Capacitor 8.3.0 (`@capacitor/core`, `@capacitor/android`,
  `@capacitor/cli`), PWA install prompt + service-worker registration
- **Build:** Vite with the React and Tailwind plugins, `@` aliased to `./src`
  (`vite.config.ts`)

Notes on precision: the source files are `.tsx`, but no TypeScript version is
pinned in `package.json`, so none is claimed here. The package name in
`package.json` is `@figma/my-make-file` (version `0.0.1`); the app name is
EduFlow — both are stated as-is rather than silently tidied up.

## Run it

Only the commands defined in `package.json` are listed here. The project uses
pnpm (its scripts and overrides reference pnpm).

```bash
# Install dependencies
pnpm install

# Run the web app in development (vite)
pnpm dev

# Production web build (outputs to dist/)
pnpm build
```

There is no test script in `package.json`, so no test command is documented
here. Add one to `package.json` first if tests are introduced.

## Build for Android

From `package.json`:

```bash
# Build the web app, then sync it into the Capacitor Android project
pnpm build:android

# Open the synced project in Android Studio
pnpm cap:open:android
```

Other Capacitor helpers defined in `package.json`: `pnpm cap:init`,
`pnpm cap:add:android`, `pnpm cap:sync`. Building a signed release APK needs
Android tooling and signing configuration, which are not specified in the
checked config files — the Capacitor config leaves `keystorePath` and
`keystoreAlias` unset.

## Project layout (verified files only)

```
├── capacitor.config.ts      # appId com.eduflow.app, appName EduFlow, webDir dist
├── vite.config.ts           # Vite + React + Tailwind, @ -> ./src
├── package.json             # Scripts and dependencies (see Tech stack)
└── src/
    ├── main.tsx             # Entry: renders src/app/App.tsx
    └── app/
        ├── App.tsx          # App shell, PWA + service-worker setup
        ├── routes.tsx       # 20 routes (see Features)
        └── utils/pwa.ts     # Service-worker + install-prompt helpers
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Open a pull request describing what changed and how it was checked.

## License

No license file was verified as part of this README rewrite, so no license is
asserted here — check the repository root for a `LICENSE` file before reuse.

---

**Built by Thunderdoc**
