# ResumeAI — AI-Powered Job Application Tracker

> Track every job application, get AI-tailored resume suggestions, prepare for interviews, and check your resume's ATS score — all in one place.

🔗 **Live demo:** https://resume-tracker-i9k6w1q8y-apurv12.vercel.app
🔗 **GitHub:** https://github.com/apurv12-ai/resume-tracker-ai

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, Recharts |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase) via Prisma ORM |
| AI | Google Gemini API (resume tailoring, interview prep, ATS analysis) |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Railway (backend) |

## Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Kanban Board** — Drag-and-drop application tracking across 5 stages (Saved → Applied → Interview → Offer → Rejected)
- **Search & Filter** — Search by company/role, filter board by status
- **AI Resume Tailor** — Paste a job description → get tailored bullet points, a custom summary, keywords, and a match score
- **AI Interview Prep** — Auto-generated technical, behavioral, and company-specific interview questions with model answers
- **ATS Resume Analyzer** — Upload a resume PDF → get an ATS compatibility score, strengths, missing keywords, and improvement suggestions
- **Dashboard Analytics** — Charts for application activity over time and status breakdown, plus response/interview/offer rate metrics

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (free tier: [Supabase](https://supabase.com))
- Google Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### 1. Clone & install

```bash
git clone https://github.com/apurv12-ai/resume-tracker-ai.git
cd resume-tracker-ai

cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

**Backend** — create `backend/.env`:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="<generate with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\">"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="your-gemini-api-key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Frontend** — create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run locally

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
resume-tracker-ai/
├── backend/
│   ├── prisma/schema.prisma     # User, Application, Resume, AISuggestion models
│   └── src/
│       ├── controllers/         # auth, applications, ai, ats, stats
│       ├── middleware/           # JWT auth guard
│       ├── routes/
│       ├── services/             # Gemini AI integration
│       └── index.ts
│
└── frontend/
    ├── app/
    │   ├── auth/login, auth/register
    │   ├── dashboard/             # Analytics with Recharts
    │   ├── applications/          # Kanban board with search/filter
    │   ├── ai-tailor/             # Resume tailor + interview prep
    │   └── ats/                   # PDF resume ATS analyzer
    └── lib/
        ├── api.ts                 # Axios instance with JWT
        └── auth.ts                # Token helpers
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login + get token |
| GET | `/api/auth/me` | JWT | Get current user |
| GET/POST/PUT/DELETE | `/api/applications` | JWT | Application CRUD |
| POST | `/api/ai/tailor` | JWT | AI resume tailoring |
| POST | `/api/ai/interview-prep` | JWT | AI interview prep |
| POST | `/api/ats/analyze` | JWT | ATS resume PDF analysis |
| GET | `/api/stats` | JWT | Dashboard analytics |

## Deployment

- **Frontend**: Deployed on Vercel, root directory set to `frontend`
- **Backend**: Deployed on Railway, root directory set to `backend`, build command `npm install && npx prisma generate && npm run build`, start command `npx prisma migrate deploy && npm start`
- **Database**: Supabase PostgreSQL (session pooler connection)

---

Built as a full-stack portfolio project demonstrating authentication, REST API design, database modeling, AI integration, and end-to-end deployment.