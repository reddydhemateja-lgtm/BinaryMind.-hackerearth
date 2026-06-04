# QueryForge — AI Data Intelligence Platform

> **"AI Meets Data: From Noise to Insight"**
> Turn raw, messy, unstructured data into something teams can actually act on.

🔗 **Live Demo:** [hackthonnew.netlify.app](https://hackthonnew.netlify.app)

---

## Features

| Feature | Description |
|---|---|
| **SQL Analyzer** | Paste any SQL → get lint, score (0-100), security check, complexity rating |
| **AI Optimization** | Claude rewrites your query for max performance + index suggestions |
| **File Comparator** | Diff any 2 files (CSV, JSON, SQL, TXT) — unified + side-by-side view |
| **AI Diff Summary** | Claude summarizes what changed between files in plain English |
| **Data Insights** | Upload CSV/JSON → AI surfaces patterns, column types, anomalies |
| **Schema Detector** | Auto-generate CREATE TABLE from any data file |
| **Data Cleaning Check** | AI finds missing values, duplicates, type mismatches |
| **NL → SQL Builder** | Plain English → production SQL in any dialect |

---

## Architecture Overview

```
User (Browser)
      │
      ▼  HTTPS
┌─────────────────────────────────┐
│  Frontend — React 18            │
│  Vercel CDN                     │
│  (Dashboard · SQL Analyzer ·    │
│   File Compare · Data Insights  │
│   · NL→SQL)                     │
└─────────────┬───────────────────┘
              │  REST API
              ▼
┌─────────────────────────────────┐
│  Backend — Node.js + Express    │
│  Railway Cloud                  │
│  (SQL Parser · File Diff Engine │
│   · Data Analyzer · Prompt      │
│   Builder · Rate Limiter)       │
└─────────────┬───────────────────┘
              │  API Call
              ▼
┌─────────────────────────────────┐
│  AI Engine — Claude AI          │
│  Anthropic (claude-sonnet-4)    │
│  (SQL Analysis · Optimizer ·    │
│   Pattern Discovery · Schema    │
│   Detector · NL→SQL Gen)        │
└─────────────┬───────────────────┘
              │  Structured JSON Response
              ▼
     UI Cards · SQL · Diffs · Scores
```

**How it works:**
1. User inputs SQL, uploads a file, or types a plain English query
2. Frontend sends the request to the backend via REST API
3. Backend builds a structured prompt and calls Claude AI
4. Claude's response is parsed into JSON (scores, insights, SQL, diffs)
5. Frontend renders the result as interactive UI cards

---

## AI Tools Used

| Tool | Model | Purpose |
|---|---|---|
| **Anthropic Claude** | `claude-sonnet-4-20250514` | SQL analysis & scoring, query optimization, file diff summarization, pattern discovery, schema inference, NL→SQL generation |

Every feature routes through Claude AI with carefully structured prompts. The backend acts as a prompt builder — it formats user input into rich context objects before calling the API, then parses the response into structured JSON for the frontend to render.

---

## Stack

- **Frontend**: React 18, React Router, Framer Motion, React Dropzone → **Vercel**
- **Backend**: Node.js + Express, Multer, node-sql-parser, diff → **Railway**
- **AI**: Anthropic Claude `claude-sonnet-4-20250514` (all AI features)

---

## Team

### Shaik Sameena — Team Lead · Backend + Research
- Led overall project direction and architecture decisions
- Built the Node.js/Express backend API and all server-side logic
- Designed and implemented the AI prompt engineering system
- Conducted research on SQL optimization patterns and data quality metrics
- Managed deployment pipeline on Railway

### Doddannagari Hemateja — Full Stack + AI
- Built the complete React 18 frontend with Framer Motion animations
- Integrated Claude AI API across all six platform features
- Implemented the SQL parser, file diff engine, and schema inference modules
- Designed the UI/UX and component architecture
- Managed frontend deployment on Vercel

---

## Project Structure

```
queryforge/
├── frontend/          → Deploy to Vercel
│   ├── src/
│   │   ├── pages/     → SQLAnalyzer, FileCompare, DataInsights, NLtoSQL, Dashboard
│   │   ├── utils/api.js
│   │   └── styles/global.css
│   ├── vercel.json
│   └── package.json
│
└── backend/           → Deploy to Railway
    ├── routes/        → sql.js, compare.js, analysis.js
    ├── services/      → sqlService.js, compareService.js, analysisService.js
    ├── server.js
    ├── railway.toml
    └── package.json
```

---

## Deployment Guide

### Step 1 — Backend on Railway

1. Push your `backend/` folder to a GitHub repo (or the whole monorepo)
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo → Railway auto-detects Node.js
4. Add environment variables in Railway dashboard:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```
5. Railway gives you a URL like `https://queryforge-api.up.railway.app`
6. Copy this URL — you'll need it for Vercel

### Step 2 — Frontend on Vercel

1. Push your `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend` (if monorepo)
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.up.railway.app
   ```
5. Deploy — Vercel builds React automatically

### Step 3 — Connect them

- Update Railway `FRONTEND_URL` with your Vercel URL
- Redeploy Railway service

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm run dev        # runs on http://localhost:3001

# Frontend (new terminal)
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:3001
npm install
npm start          # runs on http://localhost:3000
```

---

## API Endpoints

### SQL
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/sql/analyze` | `{ query, dialect }` |
| POST | `/api/sql/optimize` | `{ query, dialect, context }` |
| POST | `/api/sql/nl-to-sql` | `{ prompt, schema, dialect }` |

### File Compare
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/compare/files` | `multipart: file1, file2, mode` |
| POST | `/api/compare/text` | `{ text1, text2, mode, name1, name2 }` |
| POST | `/api/compare/ai-summary` | `{ diff, name1, name2 }` |

### Data Analysis
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/analysis/data` | `multipart: file` |
| POST | `/api/analysis/schema` | `{ data, format }` |
| POST | `/api/analysis/clean` | `multipart: file` |

### Health
```
GET /health → { status: "ok", version: "2.0.0" }
```

---

## Environment Variables Reference

### Backend (.env)
```env
ANTHROPIC_API_KEY=sk-ant-api03-...   # Required
FRONTEND_URL=https://app.vercel.app   # For CORS
PORT=3001                              # Auto-set by Railway
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://api.railway.app  # Your Railway URL
```

---

## Supported File Formats

- **SQL Analysis**: Any valid SQL (MySQL, PostgreSQL, SQLite, MSSQL, Oracle, BigQuery)
- **File Compare**: `.txt`, `.csv`, `.json`, `.sql`, `.md`, `.xml`, `.yaml`, `.yml`, `.log`
- **Data Analysis**: `.csv`, `.json`, `.txt`, `.tsv`

---

Built with ❤️ — QueryForge v2.0 · HackerEarth Hackathon 2026 · Team Binary Mind
