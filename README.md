# FitQuest Frontend

FitQuest is a playful, mobile-first AI fitness coach app for personalized daily workout quests. The product turns training into a lightweight, game-like flow: users register, set up a training profile, generate an AI workout plan, adjust the plan, start a guided workout, and save completed sessions as training history.

The interface uses a friendly coach-like tone and a daily quest structure, so the app feels more like training with an AI coach than managing a traditional workout tracker.

## Features

- Email/password registration and login
- New-user onboarding for training profile setup
- Profile fields for experience level, goal, gender, height, and weight
- Weekly training map with completed sessions and upcoming training guidance
- AI-generated temporary workout plans
- Plan adjustment actions for low energy, shorter time, higher intensity, and exercise swaps
- Editable workout plans before training:
  - reorder exercises
  - edit sets and reps
  - edit weighted movements
  - keep bodyweight movements weight-locked
- Guided workout mode with set progression and rest countdowns
- Save completed workouts as training history
- Read-only training history and session detail pages
- Settings page for profile updates, language preference, and logout
- Local draft handling for unsaved daily plans

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Framer Motion
- Tailwind CSS

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

## Backend

This frontend expects a backend API to run at:

```text
http://localhost:5000
```

During development, Vite proxies frontend requests from:

```text
/api
```

to:

```text
http://localhost:5000
```

For production deployments, set `VITE_API_BASE_URL` to the deployed backend API base URL, for example:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

Authenticated requests use:

```http
Authorization: Bearer <token>
```

The main API areas are:

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

## Product Flow

1. A user creates an account or logs in.
2. New users complete onboarding with their training profile.
3. The weekly map shows the current week, completed workouts, rest days, and upcoming training guidance.
4. The AI generates a temporary plan for the day.
5. The user can edit and adjust the plan before training.
6. The user starts a guided workout.
7. Only after the user finishes and saves the workout is it stored as training history.

AI-generated plans are treated as temporary drafts. They are not saved as completed sessions until the user taps the final save action after training.

## Local Drafts

The app stores unsaved daily workout plans in `localStorage` so users can leave and return to a plan before starting the workout.

Drafts are cleared when:

- the user logs in
- the user logs out
- authentication expires
- onboarding profile setup is saved
- profile settings are updated
- a workout is completed and saved

This prevents stale workout plans from leaking across users or profile changes.

## Language

The app sends `Accept-Language` with API requests:

- `zh-CN` for Chinese
- `en-US` for English

The backend is expected to use this header when generating AI-facing content such as workout titles, coach notes, exercise names, and rationales.

Existing saved training history is not automatically translated when the language preference changes.

## Project Structure

```text
src/
  context/      Auth state and route protection helpers
  copy/         Centralized product copy
  data/         Static UI data
  pages/        Route-level screens
  services/     API client functions
  types/        Shared TypeScript types
  utils/        Local storage and draft helpers
```

## Notes

FitQuest focuses on the core user loop:

```text
register -> profile setup -> generate plan -> train -> save history
```

Future improvements could include richer workout analytics, cross-device draft sync, stronger localization, more coach personalization, and a more complete design system.
