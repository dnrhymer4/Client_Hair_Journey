"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  Crown,
  Droplets,
  FileText,
  Home,
  ImagePlus,
  LineChart,
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
} from "lucide-react";

type View = "mentor" | "mentee" | "client" | "admin";
type MentorTab = "mentees" | "mentorClients";
type ModalState =
  | null
  | {
      title: string;
      type: "add" | "view";
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
  { time: "10:00 AM", name: "Layla M.", type: "Check-in & Photo Update" },
  { time: "1:30 PM", name: "Jasmine R.", type: "Consult" },
  { time: "4:00 PM", name: "Brianna T.", type: "Follow-up" },
];

const carePlan = [
  ["Hydration", "3x per week"],
  ["Protein", "1x per week"],
  ["Scalp Care", "Massage 2x per week"],
  ["Protect", "Heat protectant daily"],
];

const mentorTasks = [
  "Review Kia’s pricing calculator",
  "Give feedback on content plan",
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
                  ? "bg-gradient-to-r from-[#8d4052] to-[#c65d76] text-white shadow-[0_0_30px_rgba(230,111,142,.24)]"
                  : "text-[#b8a8a4] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label} View
            </button>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2a151a] text-[#f7a0af]">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Mentor Account</p>
              <p className="text-xs text-[#b8a8a4]">Coaching + client care</p>
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
                    view === id ? "bg-[#e66f8e] text-white" : "bg-white/5 text-[#b8a8a4]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative hidden w-full max-w-md md:block">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#b8a8a4]" />
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#76676a]"
                placeholder="Search mentees, clients, appointments, notes..."
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() =>
                  openModal({
                    title: "Add Record",
                    type: "add",
                    body: "Choose what you want to add: mentee, client, appointment, wash-day log, progress photo, care note, product entry, coaching session, or business goal.",
                  })
                }
                className="rounded-2xl bg-gradient-to-r from-[#e66f8e] to-[#b94d68] px-4 py-2 text-sm font-black text-white shadow-[0_0_30px_rgba(230,111,142,.3)]"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Add Record
              </button>
              <button className="relative rounded-full border border-white/10 bg-white/[0.04] p-3">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#e66f8e] text-xs font-bold">3</span>
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
      <div className="w-full max-w-2xl rounded-[2rem] border border-[#ffb7c42e] bg-[#111010] p-6 shadow-[0_30px_100px_rgba(0,0,0,.75)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-[#2a151a] px-3 py-1 text-xs font-black uppercase tracking-[.2em] text-[#f1889e]">
              {modal.type === "add" ? "Action" : "Details"}
            </p>
            <h2 className="text-3xl font-black">{modal.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#b8a8a4]">{modal.body}</p>
          </div>
          <button onClick={close} className="rounded-full border border-white/10 bg-white/[0.04] p-3">
            <X className="h-5 w-5" />
          </button>
        </div>

        {modal.type === "add" ? <AddRecordOptions /> : <ViewDetailsContent title={modal.title} />}

        <button onClick={close} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e66f8e] to-[#b94d68] py-3 font-black">
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
    ["Coaching Session", ClipboardList],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {options.map(([label, Icon]) => (
        <button key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-[#2a151a]">
          <Icon className="mb-3 h-5 w-5 text-[#f1889e]" />
          <p className="text-sm font-black">{label}</p>
        </button>
      ))}
    </div>
  );
}

function ViewDetailsContent({ title }: { title: string }) {
  if (title.toLowerCase().includes("progress")) {
    return <ProgressBreakdown />;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-sm leading-6 text-[#b8a8a4]">
        This is where the full list/detail view will go once connected to Supabase. For now, the button confirms the navigation behavior and gives you a clear place to wire real records.
      </p>
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
        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
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
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
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

function ClientRows() {
  return (
    <div className="space-y-3">
      {clients.map((c) => (
        <div key={c.name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
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
  const mentees = [
    {
      name: "Kia",
      market: "Atlanta",
      niche: "Locs + protective styles",
      progress: 74,
      status: "On track",
      nextSession: "Jun 24",
    },
    {
      name: "Maya",
      market: "Charlotte",
      niche: "Color + loc repair",
      progress: 58,
      status: "Needs focus",
      nextSession: "Jun 28",
    },
  ];

  return (
    <div className="space-y-3">
      {mentees.map((m) => (
        <div key={m.name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
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
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-[#2a151a]"
        >
          <Icon className="mb-3 h-5 w-5 text-[#f1889e]" />
          <p className="text-xs font-black">{label}</p>
        </button>
      ))}
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
            <div key={t.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
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
            <div key={title} className="flex items-center gap-3 rounded-2xl bg-white/[0.035] p-4">
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

function MentorMenteeProgressView({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Active Mentees" value="12" />
        <Metric icon={Target} label="Avg Goal Progress" value="74%" />
        <Metric icon={BriefcaseBusiness} label="Mentee Clients" value="139" />
        <Metric icon={TrendingUp} label="Avg Revenue Growth" value="18%" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel
          title="Mentee Business Progress"
          onViewAll={() =>
            openModal({
              title: "Mentee Business Progress",
              type: "view",
              body: "Full mentee list with business stage, goals, revenue, bookings, clients, content score, next session, and coaching priorities.",
            })
          }
        >
          <MenteeRows />
        </Panel>

        <Panel title="Kia's Business Snapshot" action={false}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Snapshot label="Revenue" value="$4.1K" sub="Goal: $5K" />
            <Snapshot label="Bookings" value="32" sub="Active clients: 47" />
            <Snapshot label="Content Score" value="68%" sub="Needs consistency" />
            <Snapshot label="Next Session" value="Jun 24" sub="Pricing + retention" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Panel
          title="Mentor Coaching Tasks"
          onViewAll={() =>
            openModal({
              title: "Mentor Coaching Tasks",
              type: "view",
              body: "Full task board for mentor follow-ups, assignments, due dates, session prep, and mentee accountability.",
            })
          }
        >
          {mentorTasks.map((task, i) => (
            <div key={task} className="mb-3 flex items-center justify-between rounded-2xl bg-white/[0.035] p-4">
              <span className="text-sm font-bold">{task}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#44212a] text-sm font-black text-[#f1889e]">{i + 1}</span>
            </div>
          ))}
        </Panel>

        <Panel
          title="Business Growth Opportunities"
          onViewAll={() =>
            openModal({
              title: "Business Growth Opportunities",
              type: "view",
              body: "Full opportunity feed based on pricing, competitor trends, booking patterns, content performance, and retention signals.",
            })
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {["Raise starter loc pricing by $15", "Post 2 transformation reels", "Launch client journey check-ins"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Sparkles className="mb-3 h-5 w-5 text-[#f1889e]" />
                <p className="font-bold">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Snapshot({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.035] p-4">
      <p className="text-xs text-[#b8a8a4]">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-[#b8a8a4]">{sub}</p>
    </div>
  );
}

function MentorClientManagementView({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Mentor's Active Clients" value="24" />
        <Metric icon={CalendarDays} label="Appointments Today" value="6" />
        <Metric icon={CheckCircle2} label="Client Tasks Due" value="14" />
        <Metric icon={LineChart} label="Avg Client Progress" value={`${overallProgress}%`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr_.9fr]">
        <Panel
          title="Mentor's Client Schedule"
          onViewAll={() =>
            openModal({
              title: "Mentor's Client Schedule",
              type: "view",
              body: "Full calendar view for the mentor’s own direct clients.",
            })
          }
        >
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.time} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-sm font-black">{a.time} · {a.name}</p>
                  <p className="text-xs text-[#b8a8a4]">{a.type}</p>
                </div>
                <button
                  onClick={() =>
                    openModal({
                      title: `${a.name} Check-in`,
                      type: "add",
                      body: "Open the client check-in workflow: add notes, upload photos, update care plan, and schedule the next appointment.",
                    })
                  }
                  className="rounded-full border border-[#e66f8e]/40 px-3 py-1 text-xs font-bold text-[#f1889e]"
                >
                  Check-in
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Recent Client Activity"
          onViewAll={() =>
            openModal({
              title: "Recent Client Activity",
              type: "view",
              body: "Full recent client activity feed for direct clients.",
            })
          }
        >
          <ClientRows />
        </Panel>

        <Panel title="Quick Client Actions" action={false}>
          <QuickActions openModal={openModal} />
        </Panel>
      </div>

      <ClientJourneyAndPlan openModal={openModal} />
    </div>
  );
}

function MentorView({ openModal }: { openModal: (modal: ModalState) => void }) {
  const [tab, setTab] = useState<"mentees" | "mentorClients">("mentees");

  return (
    <div className="space-y-7">
      <Hero
        title="Mentor HQ"
        subtitle="Coach mentees on business growth, while also managing the mentor’s own direct clients when needed."
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setTab("mentees")}
          className={`rounded-2xl px-5 py-3 text-sm font-black ${
            tab === "mentees" ? "bg-[#e66f8e] text-white" : "border border-white/10 bg-white/[0.04] text-[#b8a8a4]"
          }`}
        >
          Mentee Business Progress
        </button>
        <button
          onClick={() => setTab("mentorClients")}
          className={`rounded-2xl px-5 py-3 text-sm font-black ${
            tab === "mentorClients" ? "bg-[#e66f8e] text-white" : "border border-white/10 bg-white/[0.04] text-[#b8a8a4]"
          }`}
        >
          Mentor’s Client Management
        </button>
      </div>

      {tab === "mentees" ? <MentorMenteeProgressView openModal={openModal} /> : <MentorClientManagementView openModal={openModal} />}
    </div>
  );
}

function MenteeView({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-7">
      <Hero title="Mentee Business Dashboard" subtitle="A clean operating view for bookings, clients, content, products, and follow-ups." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={WalletCards} label="Monthly Revenue" value="$4.1K" />
        <Metric icon={CalendarDays} label="Booked Appts" value="56" />
        <Metric icon={MessageCircle} label="Messages" value="132" />
        <Metric icon={ShieldCheck} label="Retention Rate" value="86%" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Panel
          title="Mentee's Clients"
          onViewAll={() =>
            openModal({
              title: "Mentee's Clients",
              type: "view",
              body: "Full client list owned by the mentee.",
            })
          }
        >
          <ClientRows />
        </Panel>
        <Panel
          title="Business Tasks Due"
          onViewAll={() =>
            openModal({
              title: "Business Tasks Due",
              type: "view",
              body: "Full task list for the mentee dashboard.",
            })
          }
        >
          {["Review photo updates", "Follow up with clients", "Update care plans", "Check-in reminders"].map((t, i) => (
            <div key={t} className="mb-3 flex items-center justify-between rounded-2xl bg-white/[0.035] p-4">
              <span className="text-sm font-bold">{t}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#44212a] text-sm font-black text-[#f1889e]">{i + 2}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function ClientView({ openModal }: { openModal: (modal: ModalState) => void }) {
  return (
    <div className="space-y-7">
      <Hero title="Hey, Layla! 👋" subtitle="Your individual hair journey, appointment plan, care routine, and progress history." />
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
              className="rounded-full border border-[#e66f8e]/40 px-3 py-2 text-xs font-bold text-[#f1889e]"
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
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#e66f8e] to-[#b94d68] py-3 font-black"
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
            <div key={label} className="grid aspect-[4/3] place-items-center rounded-3xl border border-dashed border-[#ffb7c42e] bg-white/[0.04]">
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
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
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
            <div key={x} className="mb-3 flex items-center justify-between rounded-2xl bg-white/[0.035] p-4">
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
