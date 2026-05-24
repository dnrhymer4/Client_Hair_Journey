
"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  Crown,
  Droplets,
  ExternalLink,
  FileText,
  Home,
  ImagePlus,
  Instagram,
  LineChart,
  Link as LinkIcon,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  BriefcaseBusiness,
  Target,
  TrendingUp,
  UserRound,
  X,
  ClipboardList,
  Facebook,
  Share2,
  Eye,
  CalendarRange,
  Megaphone,
} from "lucide-react";

type View = "mentor" | "mentee" | "client" | "admin";
type WorkTab = "business" | "mentorship";
type ModalState =
  | null
  | {
      title: string;
      type: "add" | "view" | "calendar";
      body: string;
    };

const progressFormula = [
  { label: "Appointment consistency", weight: 30, score: 80, description: "Attends scheduled appointments and completes check-ins." },
  { label: "Photo/check-in updates", weight: 25, score: 72, description: "Progress photos and stylist check-ins are current." },
  { label: "Care plan completion", weight: 20, score: 70, description: "Hydration, scalp care, and protection plan followed." },
  { label: "Wash-day tracking", weight: 15, score: 60, description: "Wash days are logged with scalp and product notes." },
  { label: "Product/routine adherence", weight: 10, score: 78, description: "Recommended products are used; avoid list is followed." },
];

function calculateProgress() {
  const weighted = progressFormula.reduce((sum, item) => sum + item.score * (item.weight / 100), 0);
  return Math.round(weighted);
}

const overallProgress = calculateProgress();

const mentees = [
  {
    name: "Kia",
    market: "Atlanta",
    niche: "Locs + protective styles",
    revenue: "$4.1K",
    goal: "$5K",
    progress: 74,
    clients: 47,
    bookings: 32,
    contentScore: 68,
    status: "On track",
    nextSession: "Jun 24",
  },
  {
    name: "Maya",
    market: "Charlotte",
    niche: "Color + loc repair",
    revenue: "$3.2K",
    goal: "$4.5K",
    progress: 58,
    clients: 29,
    bookings: 21,
    contentScore: 45,
    status: "Needs focus",
    nextSession: "Jun 28",
  },
];

const clients = [
  { name: "Layla M.", service: "Check-in & Photo Update", progress: overallProgress, status: "Photo due", next: "May 28" },
  { name: "Jasmine R.", service: "Color Correction Plan", progress: 58, status: "Needs review", next: "May 30" },
  { name: "Brianna T.", service: "Maintenance Plan", progress: 81, status: "Plan completed", next: "May 27" },
  { name: "Maya L.", service: "Growth Plan", progress: 90, status: "Updated today", next: "May 31" },
];

const clientTimeline = [
  { date: "Today", title: "Photo Update", body: "Front and back progress photos added." },
  { date: "Apr 30", title: "Deep Conditioning Treatment", body: "Hydration boost and trim completed." },
  { date: "Apr 16", title: "Color Refresh", body: "Gloss and root blend completed." },
  { date: "Apr 2", title: "Consultation", body: "Goal setting and journey plan created." },
];

const appointments = [
  { day: "3", time: "10:00 AM", name: "Layla M.", type: "Check-in & Photo Update" },
  { day: "7", time: "1:30 PM", name: "Jasmine R.", type: "Consult" },
  { day: "12", time: "4:00 PM", name: "Brianna T.", type: "Follow-up" },
  { day: "19", time: "9:30 AM", name: "Maya L.", type: "Maintenance" },
  { day: "24", time: "11:00 AM", name: "Kia", type: "Mentorship Session" },
];

const carePlan = [
  ["Hydration", "3x per week"],
  ["Protein", "1x per week"],
  ["Scalp Care", "Massage 2x per week"],
  ["Protect", "Heat protectant daily"],
];

const socials = [
  { platform: "Instagram", handle: "@locsbystephb", url: "instagram.com/locsbystephb", icon: Instagram, posts: 18, views: "12.4K" },
  { platform: "Facebook", handle: "Locs by Steph B", url: "facebook.com/locsbystephb", icon: Facebook, posts: 9, views: "4.8K" },
  { platform: "Booking", handle: "Book Appointment", url: "glossgenius.com/locsbystephb", icon: CalendarDays, posts: 0, views: "1.7K" },
];

const mentorshipTasks = [
  "Review pricing strategy",
  "Audit social content consistency",
  "Confirm client retention workflow",
  "Update next-session action plan",
];

function Shell({ view, setView, children, openModal }: { view: View; setView: (view: View) => void; children: React.ReactNode; openModal: (modal: ModalState) => void }) {
  const nav = [
    ["mentor", "Mentor", Home],
    ["mentee", "Mentee", Users],
    ["client", "Client", Sparkles],
    ["admin", "Admin", LineChart],
  ] as const;

  return (
    <main className="min-h-screen bg-[#070708] text-[#fff7f4]">
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-[#ffb7c42e] bg-black/50 p-5 backdrop-blur-xl lg:block">
        <div className="mb-10">
          <div className="font-serif text-3xl italic tracking-wide text-[#f7a0af]">Hair Journey</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.35em] text-[#dca669]">Mentor HQ</div>
        </div>

        <nav className="space-y-2">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                view === id
                  ? "bg-gradient-to-r from-[#f1889e] to-[#dca669] text-[#17090d] shadow-[0_0_30px_rgba(230,111,142,.24)]"
                  : "text-[#f3b4c1] hover:bg-[#251319] hover:text-[#ffd6de]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label} View
            </button>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-[#151011] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2a151a] text-[#f7a0af]">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Mentor Account</p>
              <p className="text-xs text-[#b8a8a4]">Business + mentorship + client care</p>
            </div>
          </div>
        </div>
      </aside>

      <section className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070708]/80 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <div className="flex gap-2 lg:hidden">
              {nav.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`rounded-full px-3 py-2 text-xs font-bold ${
                    view === id ? "bg-[#f1889e] text-[#17090d]" : "bg-[#171112] text-[#f3b4c1]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative hidden w-full max-w-md md:block">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#b8a8a4]" />
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#171112] py-3 pl-11 pr-4 text-sm text-[#fff7f4] outline-none placeholder:text-[#76676a]"
                placeholder="Search mentees, clients, appointments, socials..."
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() =>
                  openModal({
                    title: "Add Record",
                    type: "add",
                    body: "Choose what you want to add: mentee, client, appointment, wash-day log, progress photo, care note, product entry, coaching session, business goal, or social profile.",
                  })
                }
                className="rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-4 py-2 text-sm font-black text-[#17090d] shadow-[0_0_30px_rgba(230,111,142,.3)]"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Add Record
              </button>
              <button className="relative rounded-full border border-[#ff8fab33] bg-[#171112] p-3">
                <Bell className="h-4 w-4 text-[#f3b4c1]" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f1889e] text-xs font-bold text-[#17090d]">3</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 md:p-8">{children}</div>
      </section>
    </main>
  );
}

function AppModal({ modal, close }: { modal: ModalState; close: () => void }) {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[2rem] border border-[#ffb7c42e] bg-[#111010] p-6 shadow-[0_30px_100px_rgba(0,0,0,.75)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-[#2a151a] px-3 py-1 text-xs font-black uppercase tracking-[.2em] text-[#f1889e]">
              {modal.type === "calendar" ? "Calendar" : modal.type === "add" ? "Action" : "Details"}
            </p>
            <h2 className="text-3xl font-black">{modal.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#b8a8a4]">{modal.body}</p>
          </div>
          <button onClick={close} className="rounded-full border border-[#ff8fab33] bg-[#171112] p-3">
            <X className="h-5 w-5 text-[#f1889e]" />
          </button>
        </div>

        {modal.type === "add" && <AddRecordOptions />}
        {modal.type === "calendar" && <MonthlyCalendar />}
        {modal.type === "view" && <ViewDetailsContent title={modal.title} />}

        <button onClick={close} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-3 font-black text-[#17090d]">
          Close
        </button>
      </div>
    </div>
  );
}

function AddRecordOptions() {
  const options = [
    ["Mentee", Users],
    ["Client", UserRound],
    ["Appointment", CalendarDays],
    ["Wash Day", Droplets],
    ["Progress Photo", Camera],
    ["Care Note", FileText],
    ["Product Entry", PackageCheck],
    ["Social Profile", Share2],
    ["Coaching Session", ClipboardList],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {options.map(([label, Icon]) => (
        <button key={label} className="rounded-2xl border border-[#ff8fab33] bg-[#171112] p-4 text-left transition hover:bg-[#2a151a]">
          <Icon className="mb-3 h-5 w-5 text-[#f1889e]" />
          <p className="text-sm font-black text-[#f3b4c1]">{label}</p>
        </button>
      ))}
    </div>
  );
}

function ViewDetailsContent({ title }: { title: string }) {
  if (title.toLowerCase().includes("progress")) return <ProgressBreakdown />;
  if (title.toLowerCase().includes("social")) return <SocialConnections showClientLinks />;

  return (
    <div className="rounded-3xl border border-[#ff8fab33] bg-[#151011] p-5">
      <p className="text-sm leading-6 text-[#b8a8a4]">
        This is the full detail area for <span className="font-bold text-[#f3b4c1]">{title}</span>. Once Supabase is connected, this panel should render the full table, record list, form, or analytics view for this section.
      </p>
    </div>
  );
}

function MonthlyCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => String(i + 1));
  const appointmentMap = new Map(appointments.map((a) => [a.day, a]));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-3xl border border-[#ff8fab33] bg-[#151011] p-4">
        <div>
          <p className="text-sm text-[#b8a8a4]">Monthly Schedule</p>
          <p className="text-2xl font-black">June 2026</p>
        </div>
        <CalendarRange className="h-8 w-8 text-[#f1889e]" />
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="rounded-xl bg-[#2a151a] p-2 text-center text-xs font-black text-[#f1889e]">{d}</div>
        ))}
        {days.map((day) => {
          const appt = appointmentMap.get(day);
          return (
            <div key={day} className="min-h-24 rounded-2xl border border-[#ff8fab33] bg-[#151011] p-3">
              <p className="mb-2 text-sm font-black text-[#f3b4c1]">{day}</p>
              {appt && (
                <div className="rounded-xl bg-[#2a151a] p-2">
                  <p className="text-xs font-black text-[#f1889e]">{appt.time}</p>
                  <p className="text-xs text-[#b8a8a4]">{appt.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBreakdown() {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-[#e66f8e]/25 bg-[#241218] p-5">
        <p className="text-sm text-[#b8a8a4]">Overall Progress Score</p>
        <p className="mt-1 text-5xl font-black">{overallProgress}%</p>
        <p className="mt-2 text-sm leading-6 text-[#b8a8a4]">
          The score is a weighted client journey score. Each category contributes to the 100% total.
        </p>
      </div>

      {progressFormula.map((item) => (
        <div key={item.label} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="font-black">{item.label}</p>
              <p className="text-xs text-[#b8a8a4]">{item.description}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-[#f1889e]">{item.score}%</p>
              <p className="text-xs text-[#b8a8a4]">Weight {item.weight}%</p>
            </div>
          </div>
          <ProgressBar value={item.score} />
        </div>
      ))}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025))] p-5 shadow-[0_20px_60px_rgba(0,0,0,.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#2b161c] text-[#f1889e]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-bold text-emerald-400">↗ 12%</span>
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-[#b8a8a4]">{label}</p>
    </div>
  );
}

function Panel({
  title,
  children,
  action = true,
  onViewAll,
}: {
  title: string;
  children: React.ReactNode;
  action?: boolean;
  onViewAll?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111010]/80 p-5 shadow-[0_25px_80px_rgba(0,0,0,.38)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        {action && (
          <button onClick={onViewAll} className="rounded-full px-3 py-1 text-xs font-bold text-[#f1889e] hover:bg-[#2a151a]">
            View all
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#2a151a]">
      <div className="h-full rounded-full bg-gradient-to-r from-[#e66f8e] to-[#f4a27c]" style={{ width: `${value}%` }} />
    </div>
  );
}

function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025))] p-6 shadow-[0_25px_90px_rgba(0,0,0,.45)] md:p-8">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(230,111,142,.20),transparent_24rem)]" />
      <div className="relative">
        <p className="mb-3 inline-flex rounded-full border border-[#ffb7c42e] bg-[#2a151a] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#f1889e]">Hair Journey</p>
        <h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-[#b8a8a4]">{subtitle}</p>
      </div>
    </section>
  );
}

function WorkTabs({ tab, setTab }: { tab: WorkTab; setTab: (tab: WorkTab) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setTab("business")}
        className={`rounded-2xl px-5 py-3 text-sm font-black ${
          tab === "business" ? "bg-[#f1889e] text-[#17090d]" : "border border-[#ff8fab33] bg-[#171112] text-[#f3b4c1]"
        }`}
      >
        Client + Business Management
      </button>
      <button
        onClick={() => setTab("mentorship")}
        className={`rounded-2xl px-5 py-3 text-sm font-black ${
          tab === "mentorship" ? "bg-[#f1889e] text-[#17090d]" : "border border-[#ff8fab33] bg-[#171112] text-[#f3b4c1]"
        }`}
      >
        Mentorship + Growth
      </button>
    </div>
  );
}

function ClientRows() {
  return (
    <div className="space-y-3">
      {clients.map((c) => (
        <div key={c.name} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-black">{c.name}</p>
              <p className="text-xs text-[#b8a8a4]">{c.status} · Next {c.next}</p>
            </div>
            <span className="text-sm font-black text-[#f1889e]">{c.progress}%</span>
          </div>
          <ProgressBar value={c.progress} />
        </div>
      ))}
    </div>
  );
}

function MenteeRows() {
  return (
    <div className="space-y-3">
      {mentees.map((m) => (
        <div key={m.name} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black">{m.name} · {m.market}</p>
              <p className="text-xs text-[#b8a8a4]">{m.niche} · Next session {m.nextSession}</p>
            </div>
            <span className="rounded-full bg-[#2a151a] px-3 py-1 text-xs font-black text-[#f1889e]">{m.status}</span>
          </div>
          <div className="mb-2 flex justify-between text-xs text-[#b8a8a4]">
            <span>Business progress</span>
            <span>{m.progress}%</span>
          </div>
          <ProgressBar value={m.progress} />
        </div>
      ))}
    </div>
  );
}

function SocialConnections({ showClientLinks = false }: { showClientLinks?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.platform} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#2a151a] text-[#f1889e]">
                  <Icon className="h-5 w-5" />
                </div>
                <ExternalLink className="h-4 w-4 text-[#dca669]" />
              </div>
              <p className="font-black">{s.platform}</p>
              <p className="text-sm text-[#f3b4c1]">{s.handle}</p>
              <p className="mt-1 text-xs text-[#b8a8a4]">{s.url}</p>
              {showClientLinks && <p className="mt-3 text-xs font-bold text-[#dca669]">Visible to clients</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SocialTracking({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <Panel
      title="Connected Socials + Performance"
      onViewAll={() =>
        openModal({
          title: "Social Network Pages",
          type: "view",
          body: "Connected social pages, post counts, page views, engagement, and public links clients can access.",
        })
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <SocialConnections showClientLinks />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
            <Megaphone className="mb-3 h-5 w-5 text-[#f1889e]" />
            <p className="text-3xl font-black">27</p>
            <p className="text-sm text-[#b8a8a4]">Posts this month</p>
          </div>
          <div className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
            <Eye className="mb-3 h-5 w-5 text-[#f1889e]" />
            <p className="text-3xl font-black">18.9K</p>
            <p className="text-sm text-[#b8a8a4]">Page/profile views</p>
          </div>
          <button
            onClick={() =>
              openModal({
                title: "Connect Social Account",
                type: "add",
                body: "Connect Instagram, Facebook, TikTok, booking pages, or Google Business Profile to track posts, views, engagement, and client-facing links.",
              })
            }
            className="rounded-2xl border border-[#ff8fab33] bg-[#171112] p-4 text-left transition hover:bg-[#2a151a] sm:col-span-2"
          >
            <LinkIcon className="mb-3 h-5 w-5 text-[#f1889e]" />
            <p className="font-black text-[#f3b4c1]">Connect or update social accounts</p>
            <p className="mt-1 text-xs text-[#b8a8a4]">Use API integrations later for automated post and view counts.</p>
          </button>
        </div>
      </div>
    </Panel>
  );
}

function QuickActions({ openModal }: { openModal: (modal: ModalState) => void }) {
  const actions = [
    ["Send Message", MessageCircle],
    ["Upload Photo", ImagePlus],
    ["Create Plan", FileText],
    ["Add Note", FileText],
    ["Schedule Appt.", CalendarDays],
    ["Resources", PackageCheck],
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(([label, Icon]) => (
        <button
          key={label}
          onClick={() =>
            openModal({
              title: label,
              type: "add",
              body: `Start the ${label.toLowerCase()} workflow. This will later connect to the correct Supabase form/table.`,
            })
          }
          className="rounded-2xl border border-[#ff8fab33] bg-[#171112] p-4 text-left transition hover:bg-[#2a151a]"
        >
          <Icon className="mb-3 h-5 w-5 text-[#f1889e]" />
          <p className="text-xs font-black text-[#f3b4c1]">{label}</p>
        </button>
      ))}
    </div>
  );
}

function SchedulePanel({ openModal, title = "Schedule" }: { openModal: (modal: ModalState) => void; title?: string }) {
  return (
    <Panel
      title={title}
      action={false}
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={() =>
            openModal({
              title: "Full Monthly Schedule",
              type: "calendar",
              body: "A full calendar view for appointments, client check-ins, wash-day reminders, and mentorship sessions.",
            })
          }
          className="rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-4 py-2 text-sm font-black text-[#17090d]"
        >
          <CalendarRange className="mr-2 inline h-4 w-4" />
          Calendar
        </button>
      </div>

      <div className="space-y-3">
        {appointments.slice(0, 3).map((a) => (
          <div key={`${a.time}-${a.name}`} className="flex items-center justify-between rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
            <div>
              <p className="text-sm font-black">{a.time} · {a.name}</p>
              <p className="text-xs text-[#b8a8a4]">{a.type}</p>
            </div>
            <button
              onClick={() =>
                openModal({
                  title: `${a.name} Appointment`,
                  type: "view",
                  body: "Appointment detail view with service type, preparation notes, intake questions, payment status, and reschedule options.",
                })
              }
              className="rounded-full border border-[#e66f8e]/40 bg-[#171112] px-3 py-1 text-xs font-bold text-[#f1889e]"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BusinessManagement({ owner, openModal }: { owner: "mentor" | "mentee"; openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label={owner === "mentor" ? "Mentor's Active Clients" : "Active Clients"} value={owner === "mentor" ? "24" : "47"} />
        <Metric icon={CalendarDays} label="Appointments Today" value={owner === "mentor" ? "6" : "8"} />
        <Metric icon={WalletCards} label="Monthly Revenue" value={owner === "mentor" ? "$6.8K" : "$4.1K"} />
        <Metric icon={Eye} label="Social Page Views" value={owner === "mentor" ? "18.9K" : "9.4K"} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Panel
          title={owner === "mentor" ? "Mentor's Client Management" : "Mentee's Client Management"}
          onViewAll={() =>
            openModal({
              title: "Client Management",
              type: "view",
              body: "Full client management view: client list, appointments, care plans, product notes, photos, journey timeline, and reminders.",
            })
          }
        >
          <ClientRows />
        </Panel>

        <SchedulePanel openModal={openModal} title="Client + Business Schedule" />
      </div>

      <SocialTracking openModal={openModal} />

      <Panel title="Quick Business Actions" action={false}>
        <QuickActions openModal={openModal} />
      </Panel>
    </div>
  );
}

function MentorshipGrowth({ role, openModal }: { role: "mentor" | "mentee"; openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Target} label="Goal Progress" value="74%" />
        <Metric icon={TrendingUp} label="Revenue Growth" value="18%" />
        <Metric icon={BriefcaseBusiness} label="Business Health" value="82" />
        <Metric icon={CalendarDays} label="Next Session" value="Jun 24" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel
          title={role === "mentor" ? "Mentee Business Progress" : "My Business Growth Plan"}
          onViewAll={() =>
            openModal({
              title: role === "mentor" ? "Mentee Business Progress" : "Business Growth Plan",
              type: "view",
              body: "Mentorship should focus on business growth: goals, pricing, content consistency, client retention, booking strategy, and session notes.",
            })
          }
        >
          {role === "mentor" ? <MenteeRows /> : <GrowthPlanCards />}
        </Panel>

        <Panel title={role === "mentor" ? "Coaching Tasks" : "Mentorship Action Items"}>
          {mentorshipTasks.map((task, i) => (
            <div key={task} className="mb-3 flex items-center justify-between rounded-2xl bg-[#151011] p-4">
              <span className="text-sm font-bold">{task}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#44212a] text-sm font-black text-[#f1889e]">{i + 1}</span>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Business Growth Opportunities">
        <div className="grid gap-4 md:grid-cols-3">
          {["Raise starter loc pricing by $15", "Post 2 transformation reels", "Launch client journey check-ins"].map((item) => (
            <div key={item} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <Sparkles className="mb-3 h-5 w-5 text-[#f1889e]" />
              <p className="font-bold">{item}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function GrowthPlanCards() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Snapshot label="Pricing Goal" value="+$15" sub="Starter loc package increase" />
      <Snapshot label="Content Goal" value="3x/week" sub="Reels + transformation posts" />
      <Snapshot label="Retention Goal" value="85%" sub="Client check-ins + reminders" />
      <Snapshot label="Next Session" value="Jun 24" sub="Review pricing + social metrics" />
    </div>
  );
}

function Snapshot({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-[#151011] p-4">
      <p className="text-xs text-[#b8a8a4]">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-[#b8a8a4]">{sub}</p>
    </div>
  );
}

function ClientJourneyAndPlan({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_.7fr]">
      <Panel
        title="Client Journey Timeline"
        onViewAll={() =>
          openModal({
            title: "Client Journey Timeline",
            type: "view",
            body: "Full individual client timeline: loc start date, appointments, wash days, product changes, photo updates, scalp notes, and care milestones.",
          })
        }
      >
        <div className="space-y-3">
          {clientTimeline.map((t) => (
            <div key={t.title} className="flex gap-4 rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-[#e66f8e] shadow-[0_0_20px_rgba(230,111,142,.8)]" />
              <div className="flex-1">
                <p className="text-xs font-bold text-[#f1889e]">{t.date}</p>
                <p className="font-black">{t.title}</p>
                <p className="text-sm text-[#b8a8a4]">{t.body}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#dca669]" />
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Client Care Plan"
        onViewAll={() =>
          openModal({
            title: "Client Care Plan",
            type: "view",
            body: "Full care plan: hydration, protein, scalp care, product recommendations, avoid list, and recommended service cadence.",
          })
        }
      >
        <div className="space-y-3">
          {carePlan.map(([title, sub]) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl bg-[#151011] p-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#2a151a] text-[#f1889e]">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black">{title}</p>
                <p className="text-xs text-[#b8a8a4]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MentorView({ openModal }: { openModal: (modal: ModalState) => void }) {
  const [tab, setTab] = useState<WorkTab>("business");

  return (
    <div className="space-y-7">
      <Hero
        title="Mentor HQ"
        subtitle="Manage your own clients and business operations, while keeping mentorship as a separate growth system for mentees."
      />
      <WorkTabs tab={tab} setTab={setTab} />
      {tab === "business" ? <BusinessManagement owner="mentor" openModal={openModal} /> : <MentorshipGrowth role="mentor" openModal={openModal} />}
    </div>
  );
}

function MenteeView({ openModal }: { openModal: (modal: ModalState) => void }) {
  const [tab, setTab] = useState<WorkTab>("business");

  return (
    <div className="space-y-7">
      <Hero
        title="Mentee Dashboard"
        subtitle="Run the business day-to-day, track clients and socials, and use mentorship as the growth layer."
      />
      <WorkTabs tab={tab} setTab={setTab} />
      {tab === "business" ? <BusinessManagement owner="mentee" openModal={openModal} /> : <MentorshipGrowth role="mentee" openModal={openModal} />}
    </div>
  );
}

function ClientView({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-7">
      <Hero title="Hey, Layla! 👋" subtitle="Your individual hair journey, appointment plan, care routine, business links, and progress history." />

      <Panel
        title="Connect With Your Stylist"
        onViewAll={() =>
          openModal({
            title: "Social Network Pages",
            type: "view",
            body: "Clients can access the stylist's social pages, booking link, and business profile from here.",
          })
        }
      >
        <SocialConnections showClientLinks />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel
          title="Your Progress Overview"
          onViewAll={() =>
            openModal({
              title: "Progress Overview",
              type: "view",
              body: "The progress score is calculated from appointment consistency, photo/check-in updates, care plan completion, wash-day tracking, and product/routine adherence.",
            })
          }
        >
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-5xl font-black">{overallProgress}%</p>
              <p className="text-sm text-[#b8a8a4]">Weighted journey progress score</p>
            </div>
            <button
              onClick={() =>
                openModal({
                  title: "Progress Overview",
                  type: "view",
                  body: "The progress score is calculated from appointment consistency, photo/check-in updates, care plan completion, wash-day tracking, and product/routine adherence.",
                })
              }
              className="rounded-full border border-[#e66f8e]/40 bg-[#171112] px-3 py-2 text-xs font-bold text-[#f1889e]"
            >
              What counts?
            </button>
          </div>
          <ProgressBar value={overallProgress} />
        </Panel>

        <Panel title="Next Appointment">
          <div className="rounded-3xl border border-[#e66f8e]/25 bg-[#241218] p-5">
            <p className="text-sm text-[#b8a8a4]">May 28, 2025 · 10:00 AM</p>
            <p className="mt-2 text-2xl font-black">Check-in & Photo Update</p>
            <p className="mt-2 text-sm text-[#b8a8a4]">Front/back photos, scalp notes, and maintenance plan updates.</p>
            <button
              onClick={() =>
                openModal({
                  title: "Next Appointment",
                  type: "view",
                  body: "Appointment detail view with service type, preparation notes, intake questions, payment status, and reschedule options.",
                })
              }
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-3 font-black text-[#17090d]"
            >
              View Details
            </button>
          </div>
        </Panel>
      </div>

      <ClientJourneyAndPlan openModal={openModal} />

      <Panel
        title="Recent Photos"
        onViewAll={() =>
          openModal({
            title: "Recent Photos",
            type: "view",
            body: "Full progress photo gallery with dates, captions, and photo type.",
          })
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {["Starter locs", "Budding phase", "Current progress"].map((label) => (
            <div key={label} className="grid aspect-[4/3] place-items-center rounded-3xl border border-dashed border-[#ffb7c42e] bg-[#171112]">
              <div className="text-center text-[#b8a8a4]">
                <Camera className="mx-auto mb-3 h-8 w-8 text-[#f1889e]" />
                <p className="text-sm font-bold">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AdminView({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-7">
      <Hero title="Admin Dashboard" subtitle="Platform-level usage, bookings, revenue, retention, and user activity." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Total Users" value="52" />
        <Metric icon={UserRound} label="Clients" value="38" />
        <Metric icon={Crown} label="Mentors" value="6" />
        <Metric icon={WalletCards} label="Total Revenue" value="$6.8K" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Platform Overview"
          onViewAll={() =>
            openModal({
              title: "Platform Overview",
              type: "view",
              body: "Full platform analytics dashboard.",
            })
          }
        >
          <div className="rounded-3xl border border-white/10 bg-[#151011] p-6">
            <p className="text-5xl font-black text-[#f1889e]">{overallProgress}%</p>
            <p className="mt-2 text-[#b8a8a4]">Average client journey progress</p>
            <div className="mt-5"><ProgressBar value={overallProgress} /></div>
          </div>
        </Panel>
        <Panel
          title="Recent Activity"
          onViewAll={() =>
            openModal({
              title: "Recent Activity",
              type: "view",
              body: "Full admin activity log.",
            })
          }
        >
          {["New client signed up", "Payment received", "Appointment booked", "New mentor added"].map((x, i) => (
            <div key={x} className="mb-3 flex items-center justify-between rounded-2xl bg-[#151011] p-4">
              <span className="text-sm font-bold">{x}</span>
              <span className="text-xs text-[#b8a8a4]">{i + 1}h ago</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export default function DarkDashboard({ initialView = "mentor" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [modal, setModal] = useState<ModalState>(null);

  const content = useMemo(() => {
    if (view === "mentor") return <MentorView openModal={setModal} />;
    if (view === "mentee") return <MenteeView openModal={setModal} />;
    if (view === "client") return <ClientView openModal={setModal} />;
    return <AdminView openModal={setModal} />;
  }, [view]);

  return (
    <>
      <Shell view={view} setView={setView} openModal={setModal}>
        {content}
      </Shell>
      <AppModal modal={modal} close={() => setModal(null)} />
    </>
  );
}
