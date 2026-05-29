# PropEdge CP Manager — Frontend

React frontend for the CP Performance Management system.

## Setup

```bash
cd cp-frontend
npm install
```

Create `.env` in the root:
```
REACT_APP_API_URL=http://localhost:3000/api
```
For production, set this to your deployed backend URL.

## Run

```bash
npm start        # dev server → http://localhost:3001
npm run build    # production build → /build
```

## Screens

| Route | Screen |
|---|---|
| `/login` | Admin login |
| `/dashboard` | Project tiles — all projects with CP counts + tier breakdown |
| `/projects/:id` | CP table — filters by tier, period, search. Bulk message. |
| `/projects/:id/cps/:cpId` | CP profile — stats, messages, meetings, send button |
| `/messages` | Global message log with status filter |
| `/settings` | Tier threshold configuration per project |

## Deploy (Vercel — recommended)

```bash
npm install -g vercel
vercel
# set REACT_APP_API_URL to your backend URL
```

Or build and serve from any static host (Netlify, Render, S3+CloudFront).

## Connecting to backend

All API calls live in `src/services/api.js`.  
Change `REACT_APP_API_URL` in `.env` to point to your backend.  
The proxy in `package.json` routes `/api/*` to `localhost:3000` during development.
