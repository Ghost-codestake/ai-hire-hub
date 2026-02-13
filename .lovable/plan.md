

# AI-Enhanced Applicant Tracking System (ATS)

## Phase 1 — Landing Page & Authentication

### Landing Page
- **Hero Section** with headline, description, and "Get Started" CTA
- **Features Section** highlighting AI Resume Screening, Candidate Ranking, Smart Interview Questions, Bias-Reduced Matching, Real-time Analytics
- **How It Works** — 4-step visual flow (Post → Receive → AI Analyzes → Hire)
- **Testimonials** — 3 recruiter testimonials with avatars
- **FAQ** — Collapsible accordion with common questions
- **CTA Section** — Sign-up encouragement
- **Footer** — Contact, social links, privacy/terms

### Authentication (Supabase Auth)
- Sign up / Login pages with email + password
- Email verification flow
- Password reset
- Role-based access: **Recruiter** and **Admin** roles (stored in a `user_roles` table)
- Protected routes for the dashboard

---

## Phase 2 — Recruiter Dashboard & Job Management

### Dashboard Overview
- Stats cards: Total jobs, total applicants, shortlisted, hired
- Visual charts (using Recharts) for hiring pipeline and trends

### Job Management
- Create, edit, delete job postings (title, description, requirements, location, type)
- View list of jobs with status filters
- View applicants per job

### Sidebar Navigation
- Clean SaaS layout with collapsible sidebar
- Pages: Dashboard, Jobs, Candidates, Settings

---

## Phase 3 — Candidate Management & Resume Upload

### Candidate Profiles
- Candidate list with search, sort, and filter
- Individual candidate profile page showing resume data, application history
- Application stage tracking pipeline: Applied → Shortlisted → Interview → Hired / Rejected
- Drag or click to move candidates between stages

### Resume Upload
- PDF upload via Supabase Storage (secure bucket with RLS)
- Store file reference in database

---

## Phase 4 — AI Features (via Lovable AI)

### Resume Parsing & Matching
- Edge function that sends resume text + job description to AI
- Extracts: skills, experience, education
- Generates: match score (0-100%), skill breakdown, gap analysis, reasoning

### Interview Question Generator
- AI generates behavioral + technical questions based on job description
- Displayed on candidate profile

### Resume Summary
- AI-generated short candidate summary for quick recruiter review

---

## Phase 5 — Analytics & Polish

### Dashboard Analytics
- Hiring funnel visualization
- Time-to-hire metrics
- Source tracking charts
- Jobs performance comparison

### UI Polish
- Responsive design (mobile + desktop)
- Smooth page transitions and animations
- Accessible color contrast
- Data tables with sorting, filtering, pagination

---

## Database Schema (Supabase)

- **profiles** — linked to auth.users (name, company, avatar)
- **user_roles** — role-based access (admin/recruiter)
- **jobs** — title, description, requirements, location, status, created_by
- **candidates** — name, email, phone, resume_url
- **applications** — links candidates to jobs, tracks stage (applied/shortlisted/interview/hired/rejected)
- **resume_data** — parsed structured data (skills, experience, education)
- **ai_scores** — match score, skill breakdown, reasoning, per application

All tables protected with Row Level Security (RLS).

---

## Security
- RLS on all tables scoped to the recruiter's organization
- Secure storage bucket for resumes
- API keys stored as Supabase secrets (never client-side)
- Input validation with Zod on all forms
- Admin role checked via security-definer function (no client-side role checks)

