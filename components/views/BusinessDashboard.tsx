"use client";

import { useState } from "react";
import {
  Bell, CalendarDays, Camera, CheckCircle2, FileText, ImagePlus,
  MessageCircle, PackageCheck, Plus, Search, Users, WalletCards, Eye,
  TrendingUp, ChevronRight, Clock, ExternalLink,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ProgressBar, StatusBadge } from "@/components/ui/base";
import {
  menteeKia, mentorClients, Client, computeProgress, delta, journeyDays, lowestFactor,
} from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

// ── Avatar circle ─────────────────────────────────────────────────────────────
const COLORS = ["from-[#c4687a] to-[#dca669]", "from-[#a78bfa] to-[#818cf8]",
  "from-[#34d399] to-[#10b981]", "from-[#fb923c] to-[#f59e0b]", "from-[#60a5fa] to-[#3b82f6]"];

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const idx = name.charCodeAt(0) % COLORS.length;
  const sz = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";
  return (
    <div className={`shrink-0 ${sz} grid place-items-center rounded-full bg-gradient-to-br ${COLORS[idx]} font-black text-white`}>
      {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
    </div>
  );
}

// ── Circular progress ─────────────────────────────────────────────────────────
function CircularProgress({ value, size = 100 }: { value: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a151a" strokeWidth={9} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#c4687a" strokeWidth={9}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
    </svg>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function KPI({ icon: Icon, label, value, current, prev }: {
  icon: React.ElementType; label: string; value: string; current?: number; prev?: number;
}) {
  const d = current !== undefined && prev !== undefined ? delta(current, prev) : null;
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#c4687a]/10 text-[#c4687a]">
          <Icon className="h-4 w-4" />
        </div>
        {d && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${d.positive ? "text-emerald-400" : "text-rose-400"}`}>
            <TrendingUp className={`h-3 w-3 ${!d.positive ? "rotate-180" : ""}`} />
            {d.positive ? "+" : "-"}{d.pct}% vs last month
          </span>
        )}
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-[#6b5a63]">{label}</p>
    </div>
  );
}

// ── Client detail right panel ─────────────────────────────────────────────────
function ClientDetailPanel({ client }: { client: Client }) {
  const overall = computeProgress(client.progressFactors);
  const days = journeyDays(client.locStartDate);
  const lowest = lowestFactor(client.progressFactors);
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {/* Progress overview */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-black">Progress Overview</p>
          <button className="text-xs text-[#c4687a]">View full timeline →</button>
        </div>
        <div className="mb-1 flex items-end gap-1">
          <p className="text-4xl font-black">{overall}%</p>
          <p className="mb-1 text-xs text-emerald-400">↑ 8% vs last month</p>
        </div>
        <p className="mb-3 text-xs text-[#6b5a63]">Overall Progress</p>
        <ResponsiveContainer width="100%" height={70}>
          <AreaChart data={menteeKia.weeklyData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cpg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c4687a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c4687a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill="url(#cpg)" strokeWidth={2} dot={false} />
            <XAxis dataKey="week" hide />
            <Tooltip formatter={(v) => [`${Number(v)}`, ""]} contentStyle={{ background: "#131013", border: "1px solid #2a151a", borderRadius: 8, fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Next appointment */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
        <p className="mb-2 text-xs font-black text-[#6b5a63]">Next Appointment</p>
        <p className="text-sm font-black">May 28, 2025</p>
        <p className="text-xs text-[#c4687a]">10:00 AM</p>
        <p className="mt-1 text-xs text-[#a09099]">{client.service}</p>
        <button className="mt-3 w-full rounded-xl bg-[#c4687a] py-2 text-xs font-black text-white">
          View Details
        </button>
      </div>

      {/* Journey timeline */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-black">Journey Timeline</p>
          <button className="text-xs text-[#c4687a]">View full timeline</button>
        </div>
        <div className="space-y-3">
          {client.timeline.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-start gap-2.5">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#c4687a]" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#6b5a63]">{t.date}</p>
                <p className="text-xs font-bold">{t.title}</p>
                <p className="text-[10px] text-[#6b5a63]">{t.body.slice(0, 50)}{t.body.length > 50 ? "…" : ""}</p>
              </div>
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#dca669]" />
            </div>
          ))}
        </div>
      </div>

      {/* Care plan */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
        <p className="mb-3 text-sm font-black">Your Plan</p>
        <div className="space-y-2.5">
          {client.carePlan.slice(0, 4).map(c => (
            <div key={c.id} className="flex items-center gap-2.5">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4687a]" />
              <div>
                <p className="text-xs font-bold">{c.category}</p>
                <p className="text-[10px] text-[#6b5a63]">{c.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Today's schedule ──────────────────────────────────────────────────────────
const ACTION_LABELS: Record<string, string> = {
  "Photo due": "Check-in", "Needs review": "Consult", "Plan completed": "Follow-up",
  "Updated today": "Review", "Intake pending": "Intake",
};

function TodaysSchedule({ clients, onSelect, selected }: {
  clients: Client[]; onSelect: (c: Client) => void; selected: Client | null;
}) {
  const times = ["10:00 AM", "1:30 PM", "4:00 PM", "5:30 PM"];
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-black">Today's Schedule</p>
        <button className="flex items-center gap-1 text-xs text-[#c4687a]">View full calendar <ChevronRight className="h-3 w-3" /></button>
      </div>
      <div className="space-y-2">
        {clients.slice(0, 4).map((c, i) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition ${selected?.id === c.id ? "bg-[#c4687a]/10 ring-1 ring-[#c4687a]/30" : "hover:bg-white/[0.03]"}`}
          >
            <p className="w-16 shrink-0 text-xs text-[#6b5a63]">{times[i] ?? "—"}</p>
            <Avatar name={c.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">{c.name}</p>
              <p className="truncate text-[10px] text-[#6b5a63]">{c.service}</p>
            </div>
            <button className="shrink-0 rounded-lg bg-[#c4687a]/15 px-2.5 py-1 text-[10px] font-black text-[#e8909e] hover:bg-[#c4687a]/25">
              {ACTION_LABELS[c.status] ?? "View"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent client activity ─────────────────────────────────────────────────────
function ClientActivity({ clients, onSelect, selected }: {
  clients: Client[]; onSelect: (c: Client) => void; selected: Client | null;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-black">Recent Client Activity</p>
        <button className="text-xs text-[#c4687a]">View all</button>
      </div>
      <div className="space-y-3">
        {clients.map(c => {
          const p = computeProgress(c.progressFactors);
          return (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              className={`cursor-pointer rounded-xl p-2.5 transition ${selected?.id === c.id ? "bg-[#c4687a]/10 ring-1 ring-[#c4687a]/30" : "hover:bg-white/[0.03]"}`}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <Avatar name={c.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{c.name}</p>
                  <p className="truncate text-[10px] text-[#6b5a63]">{c.service}</p>
                </div>
                <p className="shrink-0 text-sm font-black text-[#c4687a]">{p}%</p>
              </div>
              <ProgressBar value={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quick actions ──────────────────────────────────────────────────────────────
function QuickActions({ openModal }: { openModal: ModalOpener }) {
  const actions = [
    ["Send Message",   MessageCircle, "#c4687a"],
    ["Upload Photo",   Camera,        "#dca669"],
    ["Create Plan",    FileText,      "#a78bfa"],
    ["Add Task",       Plus,          "#34d399"],
    ["Schedule Appt.", CalendarDays,  "#60a5fa"],
    ["Resources",      PackageCheck,  "#fb923c"],
  ] as const;
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
      <p className="mb-3 font-black">Quick Actions</p>
      <div className="grid grid-cols-3 gap-2">
        {actions.map(([label, Icon, color]) => (
          <button
            key={label}
            onClick={() => openModal({ title: label, content: <p className="text-sm text-[#a09099]">This action will connect to Supabase forms once the database is wired up.</p> })}
            className="flex flex-col items-center gap-2 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${color}18` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <p className="text-center text-[10px] font-bold text-[#a09099] leading-tight">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function BusinessDashboard({ openModal, role = "mentor" }: { openModal: ModalOpener; role?: "mentor" | "mentee" }) {
  const clients = role === "mentor" ? mentorClients : menteeKia.clients;
  const name = role === "mentor" ? "Steph" : "Kia";
  const [selected, setSelected] = useState<Client | null>(clients[0]);

  const revD = delta(role === "mentor" ? 6800 : menteeKia.revenue, role === "mentor" ? 6100 : menteeKia.revenuePrev);
  const clientsD = delta(role === "mentor" ? 24 : menteeKia.activeClients, role === "mentor" ? 21 : menteeKia.activeClientsPrev);

  return (
    <div className="flex h-full min-h-screen">
      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#0d0b0c]/90 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black">Welcome back, {name}! ✨</h1>
              <p className="text-xs text-[#6b5a63]">Here's what's happening with your clients today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6b5a63]" />
                <input className="w-48 rounded-xl border border-white/[0.06] bg-[#131013] py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-[#6b5a63]" placeholder="Search clients..." />
              </div>
              <button
                onClick={() => openModal({ title: "Add Client", content: <p className="text-sm text-[#a09099]">New client form connects to Supabase.</p> })}
                className="flex items-center gap-1.5 rounded-xl bg-[#c4687a] px-3 py-2 text-xs font-black text-white shadow-[0_4px_15px_rgba(196,104,122,.35)]"
              >
                <Plus className="h-3.5 w-3.5" /> Add Client
              </button>
              <button className="relative rounded-xl border border-white/[0.06] bg-[#131013] p-2">
                <Bell className="h-4 w-4 text-[#a09099]" />
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#c4687a] text-[9px] font-black text-white">3</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KPI icon={Users}        label="Active Clients"    value={String(role === "mentor" ? 24 : menteeKia.activeClients)}         current={role === "mentor" ? 24 : menteeKia.activeClients} prev={role === "mentor" ? 21 : menteeKia.activeClientsPrev} />
            <KPI icon={CalendarDays} label="Appointments Today" value={role === "mentor" ? "6" : "8"}                                   current={6}  prev={4}  />
            <KPI icon={WalletCards}  label="Monthly Revenue"    value={role === "mentor" ? "$6.8K" : `$${(menteeKia.revenue / 1000).toFixed(1)}K`} current={role === "mentor" ? 6800 : menteeKia.revenue} prev={role === "mentor" ? 6100 : menteeKia.revenuePrev} />
            <KPI icon={Eye}          label="Avg. Progress"      value={`${Math.round(clients.reduce((s, c) => s + computeProgress(c.progressFactors), 0) / clients.length)}%`} />
          </div>

          {/* 3-column layout */}
          <div className="grid gap-4 lg:grid-cols-3">
            <TodaysSchedule clients={clients} onSelect={setSelected} selected={selected} />
            <ClientActivity clients={clients} onSelect={setSelected} selected={selected} />
            <QuickActions openModal={openModal} />
          </div>
        </div>
      </div>

      {/* Right panel — Client detail */}
      <div className="hidden w-[280px] shrink-0 border-l border-white/[0.06] xl:block">
        {selected ? (
          <ClientDetailPanel client={selected} />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div>
              <Users className="mx-auto mb-3 h-8 w-8 text-[#3a2530]" />
              <p className="text-sm font-bold text-[#3a2530]">Select a client to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
