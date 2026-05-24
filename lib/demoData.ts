// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────

export type MenteeStatus = "On track" | "Needs focus" | "Getting started";
export type ClientStatus = "Updated today" | "Photo due" | "Needs review" | "Plan completed" | "Intake pending";
export type PostStatus = "posted" | "planned" | "draft";
export type SessionStatus = "completed" | "upcoming";
export type Priority = "high" | "medium" | "low";
export type RecoStatus = "recommended" | "avoid" | "neutral";
export type GoalCategory = "revenue" | "content" | "clients" | "pricing";

export interface WeekPoint {
  week: string;
  revenue: number;
  bookings: number;
}

export interface ProgressFactor {
  label: string;
  weight: number;
  score: number;
  description: string;
  tip: string;
}

export interface WashDay {
  id: string;
  date: string;
  shampoo: string;
  conditioner: string;
  oils: string;
  dryingMethod: string;
  scalpCondition: "Good" | "Dry" | "Flaky" | "Itchy";
  buildupLevel: "None" | "Light" | "Moderate" | "Heavy";
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  frequency: string;
  result: string;
  status: RecoStatus;
  notes: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  type: "appointment" | "checkin" | "milestone" | "photo" | "note";
}

export interface CarePlanItem {
  id: string;
  category: string;
  instruction: string;
  frequency: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: ClientStatus;
  nextAppt: string;
  locStartDate: string;
  locPhase: string;
  hairTexture: string;
  scalpConcerns: string;
  progressFactors: ProgressFactor[];
  carePlan: CarePlanItem[];
  timeline: TimelineEntry[];
  washDays: WashDay[];
  products: Product[];
}

export interface CoachingSession {
  id: string;
  date: string;
  topic: string;
  wins: string[];
  blockers: string[];
  homework: string[];
  notes: string;
  nextSessionDate: string;
  status: SessionStatus;
}

export interface ContentPost {
  id: string;
  platform: "Instagram" | "Facebook" | "TikTok";
  contentType: "Reel" | "Photo" | "Story" | "Post";
  title: string;
  plannedDate: string;
  dayLabel: string;
  status: PostStatus;
  views?: number;
  likes?: number;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetDate: string;
  progress: number;
  status: "active" | "completed";
}

export interface Social {
  platform: string;
  handle: string;
  url: string;
  posts: number;
  views: string;
  followers: number;
  followersPrev: number;
}

export interface ActionItem {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  status: "open" | "done";
  source: "mentor" | "self";
}

export interface Mentee {
  id: string;
  name: string;
  initials: string;
  market: string;
  state: string;
  businessName: string;
  niche: string;
  bookingUrl: string;
  revenue: number;
  revenuePrev: number;
  goal: number;
  progress: number;
  activeClients: number;
  activeClientsPrev: number;
  bookings: number;
  bookingsPrev: number;
  socialViews: number;
  socialViewsPrev: number;
  contentScore: number;
  businessHealth: number;
  status: MenteeStatus;
  nextSession: string;
  joinDate: string;
  weeklyData: WeekPoint[];
  clients: Client[];
  coachingSessions: CoachingSession[];
  contentCalendar: ContentPost[];
  goals: Goal[];
  socials: Social[];
  actionItems: ActionItem[];
}

// ────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────

export function computeProgress(factors: ProgressFactor[]): number {
  return Math.round(factors.reduce((s, f) => s + f.score * (f.weight / 100), 0));
}

export function journeyDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date("2026-05-24"); // demo today
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function delta(current: number, prev: number) {
  const pct = Math.round(((current - prev) / prev) * 100);
  return { pct: Math.abs(pct), positive: pct >= 0, raw: pct };
}

export function lowestFactor(factors: ProgressFactor[]): ProgressFactor {
  return [...factors].sort((a, b) => a.score - b.score)[0];
}

// ────────────────────────────────────────────────
// CLIENT: LAYLA M. (full detail)
// ────────────────────────────────────────────────

const laylaFactors: ProgressFactor[] = [
  { label: "Appointment consistency", weight: 30, score: 85, description: "Attends all scheduled appointments.", tip: "Excellent! Your appointment consistency is your strongest area." },
  { label: "Photo/check-in updates",  weight: 25, score: 72, description: "Progress photos and stylist check-ins.", tip: "Submit your next progress photo to boost this score — you're 2 behind for the month." },
  { label: "Care plan completion",    weight: 20, score: 70, description: "Hydration, scalp care, and protection.", tip: "Log your daily scalp massages — even a quick note counts." },
  { label: "Wash-day tracking",       weight: 15, score: 60, description: "Wash days logged with product notes.", tip: "You have 2 unlogged wash days this month. Tap 'Log wash day' below to catch up." },
  { label: "Product/routine adherence", weight: 10, score: 78, description: "Recommended products used consistently.", tip: "Great product compliance this month. Keep it up!" },
];

const laylaClient: Client = {
  id: "client-layla",
  name: "Layla M.",
  email: "layla.m@email.com",
  phone: "(404) 555-0142",
  service: "Check-in & Photo Update",
  status: "Photo due",
  nextAppt: "May 28",
  locStartDate: "2024-09-14",
  locPhase: "Teen Locs",
  hairTexture: "4C Coily",
  scalpConcerns: "Mild dryness, occasional flaking",
  progressFactors: laylaFactors,
  carePlan: [
    { id: "cp1", category: "Hydration",   instruction: "Cantu Shea Butter Leave-In, focus on loc ends", frequency: "3× per week" },
    { id: "cp2", category: "Protein",     instruction: "Aphogee 2-minute protein treatment", frequency: "1× per week" },
    { id: "cp3", category: "Scalp care",  instruction: "JBCO scalp massage — fingertips only, no nails", frequency: "2× per week" },
    { id: "cp4", category: "Protection",  instruction: "Satin bonnet nightly, satin pillowcase as backup", frequency: "Nightly" },
    { id: "cp5", category: "Avoid",       instruction: "SheaMoisture High Porosity Masque — reaction Apr 2025", frequency: "Always avoid" },
  ],
  timeline: [
    { id: "t1", date: "May 24, 2026", title: "Wash day logged",          body: "Mielle Rosemary Mint. Scalp refreshed, minimal buildup.", type: "checkin" },
    { id: "t2", date: "May 14, 2026", title: "20-month progress photos", body: "Front, back, and side submitted. Visible length and thickness growth.", type: "photo" },
    { id: "t3", date: "Apr 30, 2026", title: "Deep conditioning treatment", body: "Hydration boost + micro-trim on stragglers. Scalp in excellent shape.", type: "appointment" },
    { id: "t4", date: "Apr 16, 2026", title: "Color refresh",            body: "Gloss and root blend. Toned to honey brown. Client very happy.", type: "appointment" },
    { id: "t5", date: "Mar 12, 2026", title: "18-month milestone 🎉",    body: "Locs officially matured. Switched to quarterly maintenance schedule.", type: "milestone" },
    { id: "t6", date: "Jan 28, 2026", title: "Maintenance & trim",       body: "Ends trimmed, interlocking refresh, freeform sections tidied.", type: "appointment" },
    { id: "t7", date: "Sep 14, 2024", title: "Loc journey begins",       body: "Two-strand twists installation, 4C coily texture. Goal: waist-length locs.", type: "milestone" },
  ],
  washDays: [
    { id: "w1", date: "May 24, 2026", shampoo: "Mielle Rosemary Mint Shampoo", conditioner: "As I Am Hydration Masque", oils: "Jamaican Black Castor Oil", dryingMethod: "Air dry under hooded dryer", scalpCondition: "Good", buildupLevel: "Light",    notes: "Scalp felt refreshed. Minimal lint." },
    { id: "w2", date: "May 10, 2026", shampoo: "Bronner Bros Herbal Shampoo",  conditioner: "Cantu Deep Treatment Masque", oils: "Argan + JBCO blend",  dryingMethod: "Air dry", scalpCondition: "Dry",  buildupLevel: "Moderate", notes: "Some product buildup at roots from styling spray." },
    { id: "w3", date: "Apr 26, 2026", shampoo: "Mielle Rosemary Mint Shampoo", conditioner: "As I Am Hydration Masque", oils: "Jamaican Black Castor Oil", dryingMethod: "Hooded dryer 30 min", scalpCondition: "Good", buildupLevel: "None",   notes: "Best wash day yet. Locs felt soft and bouncy." },
  ],
  products: [
    { id: "p1", name: "Mielle Rosemary Mint Shampoo",    category: "Cleanser",        frequency: "Every wash",   result: "No irritation, clean scalp",         status: "recommended", notes: "Primary shampoo" },
    { id: "p2", name: "As I Am Hydration Masque",         category: "Deep conditioner", frequency: "Bi-weekly",   result: "Great slip and moisture retention",  status: "recommended", notes: "Use with heat 20 min" },
    { id: "p3", name: "Jamaican Black Castor Oil",        category: "Scalp oil",        frequency: "2× per week", result: "Improved thickness and scalp health", status: "recommended", notes: "Scalp massage only" },
    { id: "p4", name: "Cantu Shea Butter Leave-In",       category: "Moisturizer",      frequency: "3× per week", result: "Good moisture, no buildup",          status: "recommended", notes: "" },
    { id: "p5", name: "SheaMoisture High Porosity Masque", category: "Treatment",       frequency: "Discontinued", result: "Scalp reaction — redness + itching",  status: "avoid",      notes: "Reaction Apr 2025. Never use again." },
  ],
};

// ────────────────────────────────────────────────
// CLIENT STUBS (Kia's other clients)
// ────────────────────────────────────────────────

const makeStubClient = (
  id: string, name: string, email: string, phone: string,
  service: string, status: ClientStatus, nextAppt: string,
  locPhase: string, locStartDate: string,
  score: number
): Client => ({
  id, name, email, phone, service, status, nextAppt,
  locPhase, locStartDate, hairTexture: "4B/4C Coily", scalpConcerns: "Minimal",
  progressFactors: laylaFactors.map(f => ({ ...f, score: score + Math.floor(Math.random() * 10) - 5 })),
  carePlan: laylaClient.carePlan,
  timeline: laylaClient.timeline.slice(0, 3),
  washDays: laylaClient.washDays.slice(0, 1),
  products: laylaClient.products.slice(0, 3),
});

// ────────────────────────────────────────────────
// MENTEE: KIA JOHNSON
// ────────────────────────────────────────────────

export const menteeKia: Mentee = {
  id: "mentee-kia",
  name: "Kia Johnson",
  initials: "KJ",
  market: "Atlanta",
  state: "GA",
  businessName: "Locs by Kia",
  niche: "Locs + protective styles",
  bookingUrl: "https://glossgenius.com/locsbykia",
  revenue: 4100, revenuePrev: 3500,
  goal: 5000,
  progress: 74,
  activeClients: 47, activeClientsPrev: 42,
  bookings: 32,      bookingsPrev: 28,
  socialViews: 12400, socialViewsPrev: 9800,
  contentScore: 68,
  businessHealth: 74,
  status: "On track",
  nextSession: "Jun 10",
  joinDate: "2025-09-01",
  weeklyData: [
    { week: "Apr 6",  revenue: 2800, bookings: 19 },
    { week: "Apr 13", revenue: 3100, bookings: 21 },
    { week: "Apr 20", revenue: 3200, bookings: 22 },
    { week: "Apr 27", revenue: 3400, bookings: 24 },
    { week: "May 4",  revenue: 3600, bookings: 26 },
    { week: "May 11", revenue: 3900, bookings: 28 },
    { week: "May 18", revenue: 4100, bookings: 30 },
    { week: "May 24", revenue: 4100, bookings: 32 },
  ],
  clients: [
    laylaClient,
    makeStubClient("c2", "Jasmine R.", "jasmine.r@email.com", "(404) 555-0231", "Color Correction Plan",  "Needs review",   "May 30", "Baby Locs", "2025-01-10", 58),
    makeStubClient("c3", "Brianna T.", "brianna.t@email.com", "(404) 555-0318", "Maintenance Plan",       "Plan completed", "May 27", "Mature Locs", "2022-06-04", 81),
    makeStubClient("c4", "Maya L.",    "maya.l@email.com",    "(404) 555-0407", "Growth Plan",            "Updated today",  "May 31", "Adult Locs",  "2021-03-15", 90),
    makeStubClient("c5", "Tasha W.",   "tasha.w@email.com",   "(678) 555-0512", "New Client Intake",      "Intake pending", "Jun 3",  "Starter Locs","2026-05-01", 24),
  ],
  coachingSessions: [
    { id: "s1", date: "Jun 10, 2026", topic: "Revenue & Pricing Strategy", wins: [], blockers: [], homework: [], notes: "", nextSessionDate: "Jul 8, 2026", status: "upcoming" },
    { id: "s2", date: "May 13, 2026", topic: "Content Consistency Deep-Dive", wins: ["Maintained 3 posts/week for 3 weeks", "First reel hit 4.2K views", "2 new client inquiries from IG"], blockers: ["Inconsistent posting on weekends", "Reels taking too long to film"], homework: ["Batch film 4 reels this weekend", "Set up content scheduling in Later app", "Create 'before/after' template"], notes: "Kia is gaining momentum on content. Main bottleneck is filming time. Suggest batching Sundays.", nextSessionDate: "Jun 10, 2026", status: "completed" },
    { id: "s3", date: "Apr 22, 2026", topic: "Q2 Business Review", wins: ["Revenue up 17% vs Q1", "Client count grew from 38 → 47", "Zero cancellations in April"], blockers: ["Pricing still below market rate", "No cancellation policy in place"], homework: ["Research Atlanta market pricing", "Draft cancellation policy", "Add new service packages to GlossGenius"], notes: "Strong Q2. Pricing is the clearest lever to pull. Kia is leaving ~$600/mo on the table.", nextSessionDate: "May 13, 2026", status: "completed" },
    { id: "s4", date: "Mar 18, 2026", topic: "Client Retention Tactics", wins: ["Implemented rebooking reminders", "Client satisfaction up after text follow-ups"], blockers: ["No structured re-engagement for lapsed clients"], homework: ["Build lapsed client outreach sequence", "Add 'care tip of the week' to client texts"], notes: "Retention is solid. Focus on preventing lapse rather than re-engagement.", nextSessionDate: "Apr 22, 2026", status: "completed" },
  ],
  contentCalendar: [
    { id: "cc1", platform: "Instagram", contentType: "Reel",  title: "3 tips for the teen loc phase", plannedDate: "2026-05-25", dayLabel: "Mon", status: "planned" },
    { id: "cc2", platform: "Instagram", contentType: "Story", title: "Product of the week: Mielle",    plannedDate: "2026-05-26", dayLabel: "Tue", status: "planned" },
    { id: "cc3", platform: "Facebook",  contentType: "Post",  title: "Client spotlight — Brianna 6-month journey", plannedDate: "2026-05-27", dayLabel: "Wed", status: "draft" },
    { id: "cc4", platform: "Instagram", contentType: "Photo", title: "Fresh maintenance day results",  plannedDate: "2026-05-28", dayLabel: "Thu", status: "planned" },
    { id: "cc5", platform: "Instagram", contentType: "Reel",  title: "Before & after loc repair",      plannedDate: "2026-05-29", dayLabel: "Fri", status: "planned" },
    { id: "cc6", platform: "TikTok",    contentType: "Reel",  title: "My loc studio workspace tour",   plannedDate: "2026-05-30", dayLabel: "Sat", status: "draft" },
  ],
  goals: [
    { id: "g1", title: "Hit $5K/month revenue",        category: "revenue",  targetDate: "Jul 2026", progress: 74, status: "active" },
    { id: "g2", title: "Post 3×/week for 60 days",     category: "content",  targetDate: "Jun 2026", progress: 55, status: "active" },
    { id: "g3", title: "85% client retention rate",    category: "clients",  targetDate: "Jun 2026", progress: 82, status: "active" },
    { id: "g4", title: "Raise starter loc price +$15", category: "pricing",  targetDate: "Jun 2026", progress: 0,  status: "active" },
  ],
  socials: [
    { platform: "Instagram", handle: "@locsbykia", url: "instagram.com/locsbykia", posts: 18, views: "12.4K", followers: 2100, followersPrev: 1900 },
    { platform: "Facebook",  handle: "Locs by Kia", url: "facebook.com/locsbykia", posts: 9,  views: "4.8K",  followers: 847,  followersPrev: 812 },
    { platform: "Booking",   handle: "GlossGenius", url: "glossgenius.com/locsbykia", posts: 0, views: "1.7K", followers: 0, followersPrev: 0 },
  ],
  actionItems: [
    { id: "a1", title: "Update pricing page on GlossGenius (+$15 starter)", priority: "high",   dueDate: "May 31", status: "open", source: "mentor" },
    { id: "a2", title: "Post 2 transformation reels this week",              priority: "high",   dueDate: "May 31", status: "open", source: "mentor" },
    { id: "a3", title: "Set up client check-in reminder workflow",           priority: "medium", dueDate: "Jun 7",  status: "open", source: "mentor" },
    { id: "a4", title: "Review Q2 P&L statement",                           priority: "low",    dueDate: "Jun 14", status: "open", source: "self"   },
    { id: "a5", title: "Draft cancellation policy",                         priority: "medium", dueDate: "Jun 7",  status: "open", source: "mentor" },
  ],
};

// ────────────────────────────────────────────────
// MENTEE: MAYA SIMMONS
// ────────────────────────────────────────────────

export const menteeMaya: Mentee = {
  id: "mentee-maya",
  name: "Maya Simmons",
  initials: "MS",
  market: "Charlotte",
  state: "NC",
  businessName: "Loc'd by Maya",
  niche: "Color + loc repair",
  bookingUrl: "https://squareup.com/appointments/locd-by-maya",
  revenue: 3200, revenuePrev: 3400,
  goal: 4500,
  progress: 58,
  activeClients: 29, activeClientsPrev: 31,
  bookings: 21,      bookingsPrev: 24,
  socialViews: 7200, socialViewsPrev: 8100,
  contentScore: 45,
  businessHealth: 58,
  status: "Needs focus",
  nextSession: "May 28",
  joinDate: "2025-11-01",
  weeklyData: [
    { week: "Apr 6",  revenue: 2900, bookings: 18 },
    { week: "Apr 13", revenue: 3200, bookings: 22 },
    { week: "Apr 20", revenue: 3000, bookings: 20 },
    { week: "Apr 27", revenue: 3100, bookings: 21 },
    { week: "May 4",  revenue: 2900, bookings: 19 },
    { week: "May 11", revenue: 3100, bookings: 20 },
    { week: "May 18", revenue: 3200, bookings: 21 },
    { week: "May 24", revenue: 3200, bookings: 21 },
  ],
  clients: [
    makeStubClient("mc1", "Sandra K.", "sandra.k@email.com", "(704) 555-0101", "Starter Loc Install",     "Intake pending", "Jun 1",  "Starter Locs", "2026-05-05", 35),
    makeStubClient("mc2", "Keisha B.", "keisha.b@email.com", "(704) 555-0202", "Repair & Restoration",   "Needs review",   "May 29", "Baby Locs",    "2025-08-20", 62),
    makeStubClient("mc3", "Tanisha W.","tanisha.w@email.com","(704) 555-0303", "Color Consultation",     "Updated today",  "Jun 4",  "Teen Locs",    "2024-11-12", 71),
  ],
  coachingSessions: [
    { id: "ms1", date: "May 28, 2026", topic: "Content & Client Re-Engagement", wins: [], blockers: [], homework: [], notes: "", nextSessionDate: "Jun 25, 2026", status: "upcoming" },
    { id: "ms2", date: "Apr 30, 2026", topic: "Revenue Dip Analysis", wins: ["Completed all April appointments", "Added 2 new services to menu"], blockers: ["Lost 3 clients to competitor pricing", "Content dropped to 0 posts in 2 weeks"], homework: ["Conduct 3 exit interviews with lapsed clients", "Create 1 reel per week minimum", "Research competitor pricing"], notes: "Revenue decline is driven by client loss, not booking decline. Need to address retention urgently.", nextSessionDate: "May 28, 2026", status: "completed" },
  ],
  contentCalendar: [
    { id: "mcc1", platform: "Instagram", contentType: "Reel",  title: "Loc repair before & after", plannedDate: "2026-05-26", dayLabel: "Tue", status: "draft" },
    { id: "mcc2", platform: "Instagram", contentType: "Photo", title: "Color correction results",   plannedDate: "2026-05-28", dayLabel: "Thu", status: "planned" },
    { id: "mcc3", platform: "Facebook",  contentType: "Post",  title: "May special pricing",        plannedDate: "2026-05-29", dayLabel: "Fri", status: "planned" },
  ],
  goals: [
    { id: "mg1", title: "Recover to $3,500/month",      category: "revenue", targetDate: "Jun 2026", progress: 30, status: "active" },
    { id: "mg2", title: "Post 2×/week consistently",    category: "content", targetDate: "Jun 2026", progress: 20, status: "active" },
    { id: "mg3", title: "Re-engage 5 lapsed clients",   category: "clients", targetDate: "Jun 2026", progress: 40, status: "active" },
  ],
  socials: [
    { platform: "Instagram", handle: "@locdbymaya", url: "instagram.com/locdbymaya", posts: 6, views: "7.2K", followers: 1340, followersPrev: 1480 },
    { platform: "Facebook",  handle: "Loc'd by Maya", url: "facebook.com/locdbymaya", posts: 3, views: "2.1K", followers: 420, followersPrev: 445 },
    { platform: "Booking",   handle: "Square Appointments", url: "squareup.com/appointments/locd-by-maya", posts: 0, views: "940", followers: 0, followersPrev: 0 },
  ],
  actionItems: [
    { id: "ma1", title: "Conduct 3 lapsed client exit interviews",   priority: "high",   dueDate: "May 30", status: "open", source: "mentor" },
    { id: "ma2", title: "Post minimum 1 reel this week",             priority: "high",   dueDate: "May 28", status: "open", source: "mentor" },
    { id: "ma3", title: "Audit competitor pricing in Charlotte",     priority: "medium", dueDate: "Jun 4",  status: "open", source: "mentor" },
    { id: "ma4", title: "Update service menu with new offerings",    priority: "medium", dueDate: "Jun 7",  status: "open", source: "self"   },
  ],
};

// ────────────────────────────────────────────────
// MENTEE: DESTINY REEVES
// ────────────────────────────────────────────────

export const menteeDestiny: Mentee = {
  id: "mentee-destiny",
  name: "Destiny Reeves",
  initials: "DR",
  market: "Houston",
  state: "TX",
  businessName: "The Loc Studio",
  niche: "Starter locs + maintenance",
  bookingUrl: "https://booksy.com/the-loc-studio",
  revenue: 1800, revenuePrev: 1200,
  goal: 3000,
  progress: 42,
  activeClients: 12, activeClientsPrev: 7,
  bookings: 9,       bookingsPrev: 5,
  socialViews: 3200, socialViewsPrev: 1800,
  contentScore: 30,
  businessHealth: 45,
  status: "Getting started",
  nextSession: "Jun 3",
  joinDate: "2026-02-01",
  weeklyData: [
    { week: "Apr 6",  revenue: 800,  bookings: 4 },
    { week: "Apr 13", revenue: 1000, bookings: 5 },
    { week: "Apr 20", revenue: 1100, bookings: 6 },
    { week: "Apr 27", revenue: 1200, bookings: 6 },
    { week: "May 4",  revenue: 1400, bookings: 7 },
    { week: "May 11", revenue: 1600, bookings: 8 },
    { week: "May 18", revenue: 1700, bookings: 8 },
    { week: "May 24", revenue: 1800, bookings: 9 },
  ],
  clients: [
    makeStubClient("dc1", "Aisha T.", "aisha.t@email.com", "(713) 555-0101", "Starter Loc Consult", "Intake pending", "Jun 5", "Pre-Starter", "2026-05-20", 20),
    makeStubClient("dc2", "Monique L.", "monique.l@email.com", "(713) 555-0202", "Starter Loc Install", "Updated today", "Jun 8", "Starter Locs", "2026-04-15", 32),
  ],
  coachingSessions: [
    { id: "ds1", date: "Jun 3, 2026", topic: "Business Foundations: Pricing & Systems", wins: [], blockers: [], homework: [], notes: "", nextSessionDate: "Jul 1, 2026", status: "upcoming" },
    { id: "ds2", date: "May 6, 2026", topic: "Setting Up Your Business Infrastructure", wins: ["Launched booking page", "Got first 5 paying clients", "Set up business Instagram"], blockers: ["No pricing structure yet", "Overwhelmed managing inquiries"], homework: ["Build service menu with 3 tiers", "Set up auto-reply for DMs", "Research Houston market rates"], notes: "Great energy. Destiny is coachable and moves fast. Priority: pricing and systems before more clients.", nextSessionDate: "Jun 3, 2026", status: "completed" },
  ],
  contentCalendar: [
    { id: "dcc1", platform: "Instagram", contentType: "Photo", title: "My first loc install!",         plannedDate: "2026-05-27", dayLabel: "Wed", status: "planned" },
    { id: "dcc2", platform: "TikTok",    contentType: "Reel",  title: "Day in the life: loc studio",  plannedDate: "2026-05-29", dayLabel: "Fri", status: "draft" },
  ],
  goals: [
    { id: "dg1", title: "Hit $3K/month revenue",   category: "revenue", targetDate: "Aug 2026", progress: 42, status: "active" },
    { id: "dg2", title: "Build service menu",       category: "pricing", targetDate: "Jun 2026", progress: 15, status: "active" },
    { id: "dg3", title: "Reach 20 active clients",  category: "clients", targetDate: "Aug 2026", progress: 60, status: "active" },
  ],
  socials: [
    { platform: "Instagram", handle: "@thelocstudio_htx", url: "instagram.com/thelocstudio_htx", posts: 8, views: "3.2K", followers: 620, followersPrev: 280 },
    { platform: "Booking",   handle: "Booksy",             url: "booksy.com/the-loc-studio",       posts: 0, views: "580", followers: 0, followersPrev: 0 },
  ],
  actionItems: [
    { id: "da1", title: "Build 3-tier service menu",          priority: "high",   dueDate: "May 31", status: "open", source: "mentor" },
    { id: "da2", title: "Set up DM auto-reply",               priority: "high",   dueDate: "May 28", status: "open", source: "mentor" },
    { id: "da3", title: "Research Houston market pricing",    priority: "medium", dueDate: "Jun 3",  status: "open", source: "mentor" },
  ],
};

// ────────────────────────────────────────────────
// MENTOR'S OWN CLIENTS
// ────────────────────────────────────────────────

export const mentorClients: Client[] = [
  makeStubClient("mc-1", "Simone P.",  "simone.p@email.com",  "(770) 555-0101", "Deep Conditioning",  "Updated today",  "May 26", "Adult Locs",   "2020-04-01", 88),
  makeStubClient("mc-2", "Kezia M.",   "kezia.m@email.com",   "(770) 555-0202", "Growth Plan",        "Photo due",      "May 29", "Mature Locs",  "2022-08-15", 71),
  makeStubClient("mc-3", "Aaliyah C.", "aaliyah.c@email.com", "(770) 555-0303", "Color Refresh",      "Needs review",   "May 27", "Teen Locs",    "2024-02-20", 64),
  makeStubClient("mc-4", "Nadia B.",   "nadia.b@email.com",   "(770) 555-0404", "Maintenance",        "Plan completed", "May 25", "Adult Locs",   "2019-11-30", 92),
];

// ────────────────────────────────────────────────
// ALL MENTEES
// ────────────────────────────────────────────────

export const allMentees: Mentee[] = [menteeKia, menteeMaya, menteeDestiny];

// ────────────────────────────────────────────────
// ADMIN STATS
// ────────────────────────────────────────────────

export const adminStats = {
  totalUsers: 52,
  totalMentors: 6,
  totalMentees: 14,
  totalClients: 32,
  totalRevenue: 28400,
  totalRevenuePrev: 24100,
  appointmentsThisMonth: 156,
  avgClientProgress: 71,
  recentActivity: [
    { text: "Maya L. submitted 20-month progress photos",  time: "2h ago",  type: "photo"      },
    { text: "New client Tasha W. added by Kia Johnson",    time: "4h ago",  type: "client"     },
    { text: "Coaching session completed: Kia Johnson",     time: "1d ago",  type: "coaching"   },
    { text: "Revenue milestone: Kia Johnson hit $4K/mo",   time: "2d ago",  type: "milestone"  },
    { text: "New mentee enrolled: Destiny Reeves (Houston)", time: "3d ago", type: "mentee"    },
    { text: "Brianna T. completed maintenance plan",        time: "4d ago",  type: "milestone"  },
  ],
  mentorBreakdown: [
    { mentor: "Stephanie B.", mentees: 3, clients: 24, revenue: 12400 },
    { mentor: "Janelle W.",   mentees: 2, clients: 18, revenue: 8700  },
    { mentor: "Camille R.",   mentees: 2, clients: 14, revenue: 7300  },
  ],
};
