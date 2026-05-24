-- Mentor HQ + Client Hair Journey Supabase Schema
-- Run this in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

-- =========================
-- ENUMS
-- =========================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('mentor', 'mentee', 'client');
  end if;
end$$;

-- =========================
-- CORE USERS / PROFILES
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'client',
  full_name text,
  email text,
  phone text,
  city text,
  state text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentor_mentee_relationships (
  id uuid primary key default uuid_generate_v4(),
  mentor_id uuid not null references public.profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (mentor_id, mentee_id)
);

-- =========================
-- MENTEE BUSINESS PROFILE
-- =========================

create table if not exists public.mentee_business_profiles (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  business_name text,
  niche text,
  city text,
  state text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  booking_url text,
  business_stage text,
  monthly_revenue_goal numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mentee_id)
);

create table if not exists public.business_metrics (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  metric_date date not null,
  revenue numeric default 0,
  bookings integer default 0,
  active_clients integer default 0,
  new_clients integer default 0,
  repeat_clients integer default 0,
  instagram_followers integer,
  instagram_engagement_rate numeric,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  mentor_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  category text,
  target_date date,
  status text not null default 'active',
  progress_percent integer default 0 check (progress_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coaching_sessions (
  id uuid primary key default uuid_generate_v4(),
  mentor_id uuid not null references public.profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  session_date timestamptz not null,
  topic text,
  wins text,
  blockers text,
  notes text,
  homework text,
  next_session_date timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.action_items (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  mentor_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  status text not null default 'open',
  priority text default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- CLIENT PORTAL
-- =========================

create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  birthday date,
  emergency_contact text,
  preferred_contact_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_hair_profiles (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  loc_start_date date,
  loc_method text,
  loc_phase text,
  hair_texture text,
  scalp_concerns text,
  allergies text,
  sensitivity_notes text,
  current_routine text,
  care_goals text,
  avoid_products text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id)
);

create table if not exists public.client_appointments (
  id uuid primary key default uuid_generate_v4(),
  hair_profile_id uuid not null references public.client_hair_profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  appointment_date timestamptz not null,
  service_type text not null,
  style text,
  products_used text,
  scalp_condition text,
  hair_condition text,
  notes text,
  before_photo_url text,
  after_photo_url text,
  amount_charged numeric,
  payment_status text,
  next_recommended_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.client_wash_days (
  id uuid primary key default uuid_generate_v4(),
  hair_profile_id uuid not null references public.client_hair_profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  wash_date date not null,
  shampoo_used text,
  conditioner_used text,
  oils_or_moisturizers text,
  drying_method text,
  scalp_condition text,
  buildup_level text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_products (
  id uuid primary key default uuid_generate_v4(),
  hair_profile_id uuid not null references public.client_hair_profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  product_name text not null,
  category text,
  frequency text,
  result text,
  reaction_or_irritation text,
  recommendation_status text default 'recommended',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_hair_notes (
  id uuid primary key default uuid_generate_v4(),
  hair_profile_id uuid not null references public.client_hair_profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  note_date date not null default current_date,
  note_type text,
  title text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.client_hair_photos (
  id uuid primary key default uuid_generate_v4(),
  hair_profile_id uuid not null references public.client_hair_profiles(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  photo_url text not null,
  photo_date date not null default current_date,
  caption text,
  photo_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.client_reminders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  reminder_type text not null,
  title text not null,
  reminder_date timestamptz not null,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now()
);

-- =========================
-- CONTENT + MARKET INTEL
-- =========================

create table if not exists public.content_calendar (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null,
  content_type text,
  title text,
  caption text,
  planned_post_date date,
  posted_at timestamptz,
  status text not null default 'planned',
  performance_notes text,
  views integer,
  likes integer,
  comments integer,
  shares integer,
  saves integer,
  created_at timestamptz not null default now()
);

create table if not exists public.competitors (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  city text,
  state text,
  service_type text,
  price numeric,
  source_url text,
  notes text,
  observed_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.market_trends (
  id uuid primary key default uuid_generate_v4(),
  mentee_id uuid references public.profiles(id) on delete cascade,
  market text,
  category text,
  trend_name text not null,
  trend_score numeric,
  source text,
  source_url text,
  observed_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

-- =========================
-- STORAGE BUCKET NOTES
-- =========================
-- Create a Supabase Storage bucket named: client-hair-photos
-- Recommended: make it private and serve signed URLs.

-- =========================
-- RLS
-- =========================

alter table public.profiles enable row level security;
alter table public.mentor_mentee_relationships enable row level security;
alter table public.mentee_business_profiles enable row level security;
alter table public.business_metrics enable row level security;
alter table public.goals enable row level security;
alter table public.coaching_sessions enable row level security;
alter table public.action_items enable row level security;
alter table public.clients enable row level security;
alter table public.client_hair_profiles enable row level security;
alter table public.client_appointments enable row level security;
alter table public.client_wash_days enable row level security;
alter table public.client_products enable row level security;
alter table public.client_hair_notes enable row level security;
alter table public.client_hair_photos enable row level security;
alter table public.client_reminders enable row level security;
alter table public.content_calendar enable row level security;
alter table public.competitors enable row level security;
alter table public.market_trends enable row level security;

-- Helper functions

create or replace function public.is_mentor_for(target_mentee uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.mentor_mentee_relationships r
    where r.mentor_id = auth.uid()
      and r.mentee_id = target_mentee
      and r.status = 'active'
  );
$$;

create or replace function public.is_self(user_id uuid)
returns boolean
language sql
stable
as $$
  select auth.uid() = user_id;
$$;

-- Profiles
drop policy if exists "profiles can read own profile" on public.profiles;
create policy "profiles can read own profile"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles can update own profile" on public.profiles;
create policy "profiles can update own profile"
on public.profiles for update
using (id = auth.uid());

-- Mentor/mentee relationship
drop policy if exists "relationship participants can read" on public.mentor_mentee_relationships;
create policy "relationship participants can read"
on public.mentor_mentee_relationships for select
using (mentor_id = auth.uid() or mentee_id = auth.uid());

-- Mentee-owned records: mentee or assigned mentor can read.
drop policy if exists "mentee business profile access" on public.mentee_business_profiles;
create policy "mentee business profile access"
on public.mentee_business_profiles for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "business metrics access" on public.business_metrics;
create policy "business metrics access"
on public.business_metrics for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "goals access" on public.goals;
create policy "goals access"
on public.goals for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "coaching sessions access" on public.coaching_sessions;
create policy "coaching sessions access"
on public.coaching_sessions for all
using (mentee_id = auth.uid() or mentor_id = auth.uid())
with check (mentee_id = auth.uid() or mentor_id = auth.uid());

drop policy if exists "action items access" on public.action_items;
create policy "action items access"
on public.action_items for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

-- Client records: visible to owning mentee and assigned mentor.
drop policy if exists "clients access" on public.clients;
create policy "clients access"
on public.clients for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id) or profile_id = auth.uid())
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id) or profile_id = auth.uid());

drop policy if exists "client hair profiles access" on public.client_hair_profiles;
create policy "client hair profiles access"
on public.client_hair_profiles for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "client appointments access" on public.client_appointments;
create policy "client appointments access"
on public.client_appointments for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "client wash days access" on public.client_wash_days;
create policy "client wash days access"
on public.client_wash_days for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "client products access" on public.client_products;
create policy "client products access"
on public.client_products for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "client notes access" on public.client_hair_notes;
create policy "client notes access"
on public.client_hair_notes for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "client photos access" on public.client_hair_photos;
create policy "client photos access"
on public.client_hair_photos for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "client reminders access" on public.client_reminders;
create policy "client reminders access"
on public.client_reminders for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

-- Content and market intel
drop policy if exists "content calendar access" on public.content_calendar;
create policy "content calendar access"
on public.content_calendar for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "competitors access" on public.competitors;
create policy "competitors access"
on public.competitors for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id))
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id));

drop policy if exists "market trends access" on public.market_trends;
create policy "market trends access"
on public.market_trends for all
using (mentee_id = auth.uid() or public.is_mentor_for(mentee_id) or mentee_id is null)
with check (mentee_id = auth.uid() or public.is_mentor_for(mentee_id) or mentee_id is null);

-- =========================
-- INDEXES
-- =========================

create index if not exists idx_clients_mentee_id on public.clients(mentee_id);
create index if not exists idx_client_hair_profiles_mentee_id on public.client_hair_profiles(mentee_id);
create index if not exists idx_client_appointments_hair_profile_id on public.client_appointments(hair_profile_id);
create index if not exists idx_client_appointments_mentee_date on public.client_appointments(mentee_id, appointment_date);
create index if not exists idx_client_wash_days_hair_profile_id on public.client_wash_days(hair_profile_id);
create index if not exists idx_business_metrics_mentee_date on public.business_metrics(mentee_id, metric_date);
create index if not exists idx_goals_mentee_status on public.goals(mentee_id, status);
