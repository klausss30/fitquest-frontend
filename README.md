# FitQuest Frontend

FitQuest is an AI fitness coaching frontend built with React, TypeScript, and Vite. The app focuses on a clear mobile-first workout flow: daily check-in, AI-generated training plan, live workout guidance, training history, and nutrition advice.

This project is designed as a portfolio/CV project to demonstrate frontend engineering, product thinking, API integration, and polished interaction design.

## Highlights

- AI-style reasoning UI for workout and nutrition recommendations
- Daily check-in flow for sleep, energy, stress, and recovery score
- Weekly training map and personalised workout planning
- Live workout tracker with sets, rest timer, skip, and completion states
- Training history and workout detail pages
- Profile settings for experience level, goal, height, and weight
- Mobile-first interface with Framer Motion animations

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Vercel deployment

## Run Locally

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

Set the backend API URL with:

```bash
VITE_API_BASE_URL=https://your-api-url.com
```

If no API URL is provided, the frontend uses:

```text
/api
```

## Scripts

```bash
npm run dev      # Start local development server
npm run build    # Type-check and build for production
npm run preview  # Preview production build
```

## Project Structure

```text
src/
├── components/   Shared UI and reasoning animation components
├── pages/        App routes such as Home, Plan, Workout, Check-In, Records
├── context/      Authentication state
├── copy/         English UI copy
├── services/     API client
├── types/        Shared TypeScript types
└── utils/        Local storage and cache helpers
```

## Notes

The frontend does not call AI providers directly. It communicates with the backend API, which handles authentication, plan generation, nutrition generation, and saved training data.
