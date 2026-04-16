# CLAUDE.md

This file provides guidance for AI assistants (like Claude) working in this repository.

## Project Overview

**Handi 0** is a mobile-first golf handicap improvement web app.

- **Repository:** shaunyoo-ao/golf-analyzer
- **Purpose:** Track rounds, compute WHS handicap index, and generate AI feedback prompts for copy-paste into external AI chat sessions (no direct AI API calls)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Routing | react-router-dom v7 (`createBrowserRouter`) |
| Backend | Firebase 11 — Auth (Google) + Firestore |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Language | JavaScript (ES modules, `.jsx` / `.js`) |

## Target Device

Optimised for **Samsung Galaxy S25 series** (360–412px CSS viewport width). Layout is constrained to `max-w-[412px]` centered. All tap targets are `min-h-[44px]`.

## Repository Structure

```
src/
├── main.jsx                    # Router + AuthProvider entry
├── index.css                   # Tailwind v4 @import + @theme (golf green palette + S25 fixes)
├── firebase/
│   ├── config.js               # initializeApp, export auth + db
│   ├── auth.js                 # signInWithGoogle, signOutUser
│   └── firestore.js            # CRUD helpers (profile, rounds, aiResponses)
├── context/
│   └── AuthContext.jsx         # AuthProvider, useAuth hook
├── hooks/
│   ├── useProfile.js           # Firestore users/{uid}/profile read/write
│   ├── useRounds.js            # Firestore users/{uid}/rounds CRUD + handicap update
│   └── useAIResponses.js       # Firestore users/{uid}/aiResponses read/write
├── utils/
│   ├── constants.js            # Club lists, SYSTEM_INSTRUCTION_KO/EN, marker positions
│   ├── handicap.js             # WHS scoreDifferential + handicapIndex
│   ├── promptBuilder.js        # buildPrompt(profile, round, options)
│   └── dateHelpers.js          # golfExperienceMonths(), formatDate(), todayISO()
├── components/
│   ├── layout/                 # AppShell, BottomNav, TopBar
│   ├── ui/                     # Button, Input, Select, Card, Badge, Textarea, Toggle,
│   │                           #   CollapsibleSection, LoadingSpinner, SectionHeader
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   ├── profile/
│   │   ├── PersonalInfoForm.jsx   # Includes AI Feedback Language setting
│   │   └── ClubDistanceForm.jsx
│   ├── round/
│   │   ├── HoleScoreGrid.jsx       # 18-hole score/GIR/putts grid
│   │   ├── DirectionSlider.jsx     # Hook/Pull ↔ Straight ↔ Slice/Push slider
│   │   ├── ClubDirectionPanel.jsx  # DirectionSlider per club (slider only, no text input)
│   │   ├── SwingFormPanel.jsx      # Tab switcher across 4 stages
│   │   ├── SwingStageImage.jsx     # SVG silhouette + MarkerDot overlays
│   │   ├── MarkerDot.jsx           # Tappable dot at body-part position
│   │   ├── MarkerFeedbackModal.jsx # Slide-up bottom sheet for note entry
│   │   └── ManualRoundForm.jsx     # "Previous Round" — NO direction/swing fields
│   └── ai/
│       ├── AIPromptBox.jsx     # Builds + copies JSON prompt; language + past-records toggle
│       ├── AIResponseBox.jsx   # Paste response + visualise
│       └── FeedbackSections.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── RoundInput.jsx
│   ├── Profile.jsx
│   ├── History.jsx             # "+ Previous Round" button opens ManualRoundForm
│   └── AIFeedback.jsx
└── assets/
    └── swing/
        ├── address.svg
        ├── backswing.svg
        ├── impact.svg
        └── finish.svg
```

## Firestore Data Model

```
users/{uid}/profile/data          Single document
users/{uid}/rounds/{roundId}      One document per round
users/{uid}/aiResponses/{roundId} One document per AI response
```

### Profile fields
`name, email, photoURL, age, gender, heightCm, weightKg, handedness, aiFeedbackLanguage ('ko'|'en'), accountCreatedAt, handicapIndex, clubDistances`

### Round fields
`date (YYYY-MM-DD), courseName, country, totalScore, courseRating, slopeRating, longestDriveMeter, lostBalls, holes[18], clubDirections, swingForm, scoreDifferential, isManualEntry`

`swingForm` shape: `{ address: { head, leftArm, rightArm, waist, leftKnee, rightKnee }, backswing: {...}, impact: {...}, finish: {...} }` — freetext strings per marker.

## Coding Conventions

- **File naming:** PascalCase for `.jsx` components, camelCase for `.js` utilities/hooks
- **Hooks:** `use` prefix, live in `src/hooks/`
- **No direct AI API calls** — copy/paste workflow only
- **Units:** meters (m) and kg exclusively throughout
- **Tailwind v4:** configured via `@theme {}` block in `src/index.css`, NOT `tailwind.config.js`
- **Firebase:** modular API only (never legacy namespace `firebase/app` compat)
- **Input font size:** always `text-base` (16px) to prevent iOS/Samsung zoom on focus

## AI Prompt System

`buildPrompt(profile, round, { includePastRecords, language, allRounds })` in `src/utils/promptBuilder.js`:
- `language: 'ko'` → `SYSTEM_INSTRUCTION_KO` (values in Korean)
- `language: 'en'` → `SYSTEM_INSTRUCTION_EN` (values in English)
- Both defined as named constants in `src/utils/constants.js`
- When `includePastRecords: true`, past rounds are appended as `user_data.past_records`

## WHS Handicap

`scoreDifferential = (score - courseRating) × (113 / slopeRating)`

`handicapIndex = avg(best 8 of last 20 differentials) × 0.96` — requires ≥ 8 qualifying rounds.

## Environment Setup

Copy `.env.example` to `.env` and fill in Firebase project values:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase Console must have: Google Auth enabled, Firestore database created, and security rules locking `users/{uid}/**` to the authenticated user.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # ESLint
```

## Commit Conventions

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behavior change
- `chore:` — build process, dependency updates, tooling

## Security

- Never commit `.env` (it is gitignored)
- All user data is scoped to `users/{uid}/` in Firestore
- No API keys embedded in source code
