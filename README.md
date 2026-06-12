# ResumeAI — AI-Powered Job Application Tracker

> Track every job application and get Claude-powered resume suggestions tailored to each role.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL via Prisma ORM |
| AI | Anthropic Claude API |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend) + Railway (backend) |

## Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Kanban Board** — Drag-and-drop application tracking across 5 stages
- **AI Resume Tailor** — Paste a job description → get tailored bullet points (Phase 3)
- **Interview Prep** — Auto-generated Q&A for each role (Phase 3)
- **Analytics Dashboard** — Charts showing application activity and conversion rates (Phase 4)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (free tier: [Supabase](https://supabase.com) or [Railway](https://railway.app))
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

### 1. Clone & install

```bash
git clone https://github.com/yourusername/resume-tracker.git
cd resume-tracker

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Set up environment variables

**Backend** — copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
```

**Frontend** — copy `.env.local.example` to `.env.local`:
```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Set up the database

```bash
cd backend

# Run Prisma migration (creates all tables)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 4. Start development servers

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — register an account and you're in.

## Project Structure

```
resume-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database models
│   └── src/
│       ├── controllers/         # Business logic
│       ├── middleware/          # JWT auth guard
│       ├── routes/              # Express routes
│       ├── services/            # Claude AI service
│       ├── lib/prisma.ts        # DB client singleton
│       └── index.ts             # Express app entry
│
└── frontend/
    ├── app/
    │   ├── auth/login/          # Login page
    │   ├── auth/register/       # Register page
    │   ├── dashboard/           # Main dashboard
    │   ├── applications/        # Kanban board
    │   └── ai-tailor/           # AI resume page
    ├── components/              # Shared UI components
    └── lib/
        ├── api.ts               # Axios instance with JWT
        └── auth.ts              # Token helpers
```

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login + get token |
| GET | `/api/auth/me` | JWT | Get current user |

### Applications (Phase 2)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/applications` | JWT | Get all applications |
| POST | `/api/applications` | JWT | Add application |
| PUT | `/api/applications/:id` | JWT | Update application |
| DELETE | `/api/applications/:id` | JWT | Delete application |

### AI (Phase 3)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/tailor` | JWT | Tailor resume to JD |
| POST | `/api/ai/interview-prep` | JWT | Generate interview Q&A |

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your Railway backend URL
```

### Backend → Railway
1. Push to GitHub
2. Create new project on [railway.app](https://railway.app)
3. Connect your repo → select `backend` folder
4. Add environment variables (DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY)
5. Railway auto-deploys on every push

---

Built as part of a full-stack portfolio project. Phase 1: Auth | Phase 2: Kanban | Phase 3: AI | Phase 4: Analytics
