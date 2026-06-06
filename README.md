# FitQuest Reasoning Agent — Frontend

React + TypeScript frontend for FitQuest, a multi-agent AI fitness coaching platform. Submitted to the **Microsoft Agents League Hackathon** (Reasoning Agents track).

Unlike traditional fitness apps with static programmes, FitQuest exposes the AI reasoning process directly in the UI — users can watch agents analyse their recovery score, training history, and daily conditions in real time before a plan is generated.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- The backend API running (see `fitness app backend/README.md`)

### Run locally

```bash
git clone <repo>
cd "fitness app frontend"
npm install
npm run dev
# App available at http://localhost:5173
```

The app connects to the backend at the URL configured in `src/services/api.ts`. For local development this defaults to `http://localhost:3001`.

## Features

### Multi-Agent Reasoning UI
- **Live reasoning chain** — animated step-by-step display of each agent's decision process with real signal values (recovery score, sleep hours, session count)
- **Agent A (Training)** — analyses recovery, history, and daily check-in to generate a personalised workout
- **Agent B (Nutrition)** — reads Agent A's output to deliver cross-domain nutrition advice from a single check-in

### Workout Flow
- AI-generated personalised plans based on fitness level, goals, and history
- Real-time plan adjustment: low-energy mode, time-shortened sessions, intensity scaling, exercise swap
- Live workout tracker with set/rep logging and rest timers
- Session saving with full exercise history

### Daily Check-In
- Sleep, energy, stress, and optional weight tracking
- Recovery score (0–100) computed from inputs
- Instant display from localStorage cache — no loading flash on revisit

### Dashboard & History
- Training streak and weekly session count (cached for instant render)
- Full session history with exercise detail view
- Weekly schedule view

### Nutrition
- AI macro targets (calories, protein, carbs, fat) based on body metrics and training load
- Meal suggestions with calorie estimates
- Agent reasoning display

### Settings
- Bilingual support: English / Chinese (system-detected or manual)
- Profile editing (experience level, goal, height, weight, gender)

## Project Structure

```
src/
  components/
    AgentThinkingLoader   — Animated reasoning chain during AI loading
    ReasoningChainLoader  — Shared step-by-step chain renderer
    ReasoningPanel        — Post-generation reasoning display
    BackButton            — Shared back navigation
    coach/                — Animated coach icon components
  pages/
    HomePage              — Agent dashboard (stats, quick actions)
    PlanPage              — AI plan generation + adjustment
    WorkoutPage           — Live workout tracker
    WeekPage              — Weekly schedule
    CheckInPage           — Daily check-in form + recovery score
    NutritionPage         — AI nutrition advice
    RecordsPage           — Session history list
    RecordDetailPage      — Session detail view
    SettingsPage          — Language + profile settings
    LoginPage / RegisterPage / OnboardingPage
  copy/
    coachCopy.ts          — All UI strings (English + Chinese), language hook
  services/
    api.ts                — API client + error classification
  types/
    index.ts              — Shared TypeScript types
  utils/
    planDrafts.ts         — localStorage plan draft helpers
    storageKeys.ts        — Centralised localStorage key constants
    weekPlanCache.ts      — Week plan cache helpers
```

## AI Provider

The frontend sends `Accept-Language` headers that the backend uses to determine AI response language. No AI calls are made directly from the frontend — all AI requests go through the backend API.

Error messages from the backend are automatically translated to the user's current language via `classifyApiError` in `api.ts`.
