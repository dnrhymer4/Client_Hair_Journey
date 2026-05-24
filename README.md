# Mentor HQ + Client Hair Journey Starter

This is a Vercel-ready starter structure for a mentoring platform with three major areas:

1. Mentor HQ
2. Mentee Business Dashboard
3. Client Hair Journey Portal

## Stack

- Next.js App Router
- Supabase
- Tailwind CSS
- shadcn/ui-ready structure
- PostgreSQL Row Level Security model

## Main Product Areas

### Mentor HQ
For the mentor/admin to manage mentees, sessions, business goals, trend insights, and coaching actions.

### Mentee Business Dashboard
For the beauty professional/loctitian to manage clients, appointments, revenue, content planning, pricing, and business health.

### Client Hair Journey Portal
For clients to track loc start date, appointments, wash days, products used, scalp/hair notes, progress photos, and care recommendations.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and anon key.
5. Install dependencies:

```bash
npm install
```

6. Run locally:

```bash
npm run dev
```

7. Deploy to Vercel and add the same environment variables.

## Suggested Next Steps

- Add Supabase Auth.
- Connect real user IDs to profiles.
- Replace demo data with Supabase queries.
- Add file upload for client progress photos.
- Add appointment reminder automations.
- Add market trend ingestion using APIs or scheduled jobs.
