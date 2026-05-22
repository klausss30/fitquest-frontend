# FitQuest Frontend

FitQuest is a mobile-first AI fitness coach app that turns daily training into a lightweight quest flow. Instead of behaving like a traditional workout tracker, the app speaks from the perspective of a coach: it helps users set up a training profile, plans the week, generates a workout for the day, guides the session, and records completed training.

The current frontend focuses on the core experience: authentication, onboarding, AI-assisted planning, editable workout plans, guided training, automatic workout saving, and read-only training history.

## Product Highlights

- Coach-like product voice across the app
- Game-inspired weekly training map
- Animated stick-figure coach system for onboarding, weekly plans, workout categories, and completion feedback
- AI-generated temporary plans that are not saved as history until the user finishes training
- Local draft handling so an unfinished daily plan can be revisited
- Bilingual interface support for Chinese and English
- Mobile-first layout with Vercel-friendly SPA routing

## Core Flow

```text
register / login
-> onboarding profile
-> weekly training map
-> generate today's plan
-> edit or adjust plan
-> guided workout
-> auto-save completed session
-> read-only training history
```

AI-generated plans are treated as temporary drafts. A generated plan does not become a training record until the user completes the workout. This keeps planning and history separate, which is important for avoiding false training records.

## Features

- Email/password registration and login
- New-user onboarding with training profile setup
- Profile fields for experience level, goal, gender, height, and weight
- Weekly plan view with completed sessions, recovery days, and planned training days
- Cached weekly plan handling to avoid regenerating the same week every time the page opens
- AI-generated daily workout plans
- Plan adjustments for low energy, shorter time, higher intensity, and exercise swaps
- Editable workout plan before training:
  - reorder exercises
  - edit sets and reps
  - edit weighted movements
  - keep bodyweight movements weight-locked
- Guided workout mode with set progression and rest countdowns
- Automatic save after workout completion
- Read-only training history and session detail pages
- Settings page for profile updates, language preference, and logout
- Local cleanup for drafts and cached plans when the user logs out, changes profile, or changes language

## UI Direction

FitQuest uses a friendly animated stick-figure coach as the central visual language. The coach appears in small, reusable SVG components rather than static image assets, which makes the character easy to adapt for different states:

- login coach with dumbbell animation
- onboarding coach with profile/checklist animation
- weekly plan coach message avatar
- workout-category icons such as squat, push-up, pull-up, dumbbell fly, full-body movement, and sleeping recovery day
- celebration animation after a workout is completed

This keeps the UI lightweight while leaving room for richer exercise demonstrations later.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Framer Motion
- Tailwind CSS

## Project Structure

```text
src/
  components/   Reusable UI and coach animation components
  context/      Auth state and route protection helpers
  copy/         Centralized Chinese/English product copy
  data/         Static UI data
  pages/        Route-level screens
  services/     API client functions
  types/        Shared TypeScript types
  utils/        Local storage, drafts, and weekly plan cache helpers
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file if you need to override the backend URL:

```bash
cp .env.example .env
```

```env
VITE_API_PROXY_TARGET=http://localhost:5000
VITE_API_BASE_URL=/api
```

Start the development server:

```bash
npm run dev
```

By default, the app runs at:

```text
http://127.0.0.1:5173
```

Build for production:

```bash
npm run build
```

Preview a production build:

```bash
npm run preview
```

## Backend Configuration

This frontend expects a JSON API. In local development, Vite proxies frontend requests from:

```text
/api
```

to:

```text
http://localhost:5000
```

For production deployments, set `VITE_API_BASE_URL` to the deployed backend API base URL:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

Authenticated requests use:

```http
Authorization: Bearer <token>
```

The app also sends `Accept-Language` with protected API requests:

- `zh-CN` for Chinese
- `en-US` for English

The backend is expected to use this header when generating AI-facing content such as workout titles, coach notes, exercise names, and rationale text.

## Main API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me`
- `PUT /api/profile`
- `GET /api/week-plan`
- `POST /api/plan/generate`
- `POST /api/plan/adjust`
- `POST /api/training-sessions`
- `GET /api/training-sessions`
- `GET /api/training-sessions/week`
- `GET /api/training-sessions/:id`

## State Handling

FitQuest uses `localStorage` for lightweight client-side persistence:

- auth token and current user snapshot
- unsaved daily workout plan drafts
- cached weekly plans by user, week start date, and language
- language preference

Drafts and cached weekly plans are cleared when they could become stale, such as after logout, profile updates, onboarding completion, language changes, or authentication expiry.

## Deployment Notes

The app includes a `vercel.json` rewrite so direct refreshes on client-side routes such as `/week`, `/plan`, and `/settings` resolve back to the React app instead of returning a 404.

For production, make sure the frontend has access to a deployed backend and that `VITE_API_BASE_URL` is set during the Vercel build.

## Future Improvements

- Richer exercise-specific coach animations
- More complete analytics around training consistency and progression
- Better recovery recommendations based on recent completed sessions
- Cross-device draft sync
- More robust localization for generated and saved content
- A more formal design system for reusable controls and motion patterns
