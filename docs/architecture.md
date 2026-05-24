# Architecture

## Recommended Split

### App Layer: Supabase + Vercel
Use this for:
- user accounts
- role-based access
- dashboards
- client records
- appointments
- wash days
- product logs
- progress photos
- business metrics
- automation-ready data

### Content Layer: Notion
Use Notion for:
- mentor guides
- SOPs
- playbooks
- worksheets
- learning content
- resource library

### Automation Layer
Use n8n, Make, or Supabase Edge Functions for:
- reminder notifications
- trend data ingestion
- weekly business summaries
- product restock prompts
- client follow-up alerts

## Roles

### Mentor
Can see assigned mentees, their business dashboard, sessions, goals, action items, and client trend summaries.

### Mentee
Can manage their own business profile, clients, appointments, content calendar, products, notes, and metrics.

### Client
Can eventually see their own hair journey, upcoming appointments, wash-day routine, product recommendations, and photos.
