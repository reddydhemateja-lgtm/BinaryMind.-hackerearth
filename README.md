# QueryForge — AI Data Intelligence Platform

> **"AI Meets Data: From Noise to Insight"**
> Turn raw, messy, unstructured data into something teams can actually act on.

🔗 **Live Demo:** [hackthonnew.netlify.app](https://hackthonnew.netlify.app)

---

## Features

| Feature | Description |
|---|---|
| **SQL Analyzer** | Paste any SQL → get lint, score (0-100), security check, complexity rating |
| **AI Optimization** | AI rewrites your query for max performance + index suggestions |
| **File Comparator** | Diff any 2 files (CSV, JSON, SQL, TXT) — unified + side-by-side view |
| **AI Diff Summary** | AI summarizes what changed between files in plain English |
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
│  Netlify CDN                    │
│  (Dashboard · SQL Analyzer ·    │
│   File Compare · Data Insights  │
│   · NL→SQL)                     │
└─────────────┬───────────────────┘
              │  REST API
              ▼
┌─────────────────────────────────┐
│  Backend — Node.js + Express    │
│  Render Cloud                   │
│  (SQL Parser · File Diff Engine │
│   · Data Analyzer · Prompt      │
│   Builder · Rate Limiter)       │
└─────────────┬───────────────────┘
              │  API Call
              ▼
┌─────────────────────────────────┐
│  AI Engine — Groq API           │
│  Model: llama3-70b-8192         │
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
3. Backend builds a structured prompt and calls Groq AI
4. Groq's response is parsed into JSON (scores, insights, SQL, diffs)
5. Frontend renders the result as interactive UI cards

---

## AI Tools Used

| Tool | Model | Purpose |
|---|---|---|
| **Groq API** | `llama3-70b-8192` | SQL analysis & scoring, query optimization, file diff summarization, pattern discovery, schema inference, NL→SQL generation |

Every feature routes through Groq AI with carefully structured prompts. The backend acts as a prompt builder — it formats user input into rich context objects before calling the API, then parses the response into structured JSON for the frontend to render.

---

## Stack

- **Frontend**: React 18, React Router, Framer Motion, React Dropzone → **Netlify**
- **Backend**: Node.js + Express, Multer, node-sql-parser, diff → **Render**
- **AI**: Groq API `llama3-70b-8192` (all AI features)

---

## Team

### Shaik Sameena — Team Lead · Backend + Research
- Led overall project direction and architecture decisions
- Built the Node.js/Express backend API and all server-side logic
- Designed and implemented the AI prompt engineering system
- Conducted research on SQL optimization patterns and data quality metrics
- Managed deployment pipeline on Render

### Doddannagari Hemateja — Full Stack + AI
- Built the complete React 18 frontend with Framer Motion animations
- Integrated Groq AI API across all six platform features
- Implemented the SQL parser, file diff engine, and schema inference modules
- Designed the UI/UX and component architecture
- Managed frontend deployment on Netlify

---

## Project Structure

```
queryforge/
├── frontend/          → Deploy to Netlify
│   ├── src/
│   │   ├── pages/     → SQLAnalyzer, FileCompare, DataInsights, NLtoSQL, Dashboard
│   │   ├── utils/api.js
│   │   └── styles/global.css
│   ├── vercel.json
│   └── package.json
│
└── backend/           → Deploy to Render
    ├── routes/        → sql.js, compare.js, analysis.js
    ├── services/      → sqlService.js, compareService.js, analysisService.js
    ├── server.js
    └── package.json
```

---

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Add your GROQ_API_KEY to .env
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
GROQ_API_KEY=gsk_...          # Required
FRONTEND_URL=https://hackthonnew.netlify.app   # For CORS
PORT=3001                      # Auto-set by Render
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api.onrender.com  # Your Render URL
```

---

## Supported File Formats

- **SQL Analysis**: Any valid SQL (MySQL, PostgreSQL, SQLite, MSSQL, Oracle, BigQuery)
- **File Compare**: `.txt`, `.csv`, `.json`, `.sql`, `.md`, `.xml`, `.yaml`, `.yml`, `.log`
- **Data Analysis**: `.csv`, `.json`, `.txt`, `.tsv`

---

Built with ❤️ — QueryForge v2.0 · HackerEarth Hackathon 2026 · Team Binary Mind
