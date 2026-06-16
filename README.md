# ⚽ Mondial 2026 — World Cup Prediction App

A Hebrew-language World Cup 2026 prediction app built with React + Vite + Supabase + Tailwind CSS, deployed on Netlify.

🔗 **Live:** [pgmondial2026.netlify.app](https://pgmondial2026.netlify.app)

## Architecture

![Architecture](docs/architecture.svg)

## Features

- 📋 Predict outcomes (1/X/2) for all 104 World Cup matches
- 🎯 Exact score predictions for +3 bonus points
- 🏆 Real-time leaderboard with point calculations
- 🔄 Live scores from worldcup26.ir API
- ⚙️ Admin panel for manual result management

## Scoring

| Result | Points |
|--------|--------|
| Correct outcome (1/X/2) | +1 |
| Exact score match | +3 bonus |
| **Total max per match** | **4** |

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Scores API:** worldcup26.ir
- **Hosting:** Netlify

## Setup

```bash
npm install
```

Create `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm run dev
```
