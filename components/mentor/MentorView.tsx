"use client";

import { useState } from "react";
import {
  ArrowLeft, Bell, CalendarDays, Camera, CheckCircle2, ClipboardList,
  Clock, Crown, Droplets, ExternalLink, Eye, FileText, ImagePlus,
  MessageCircle, PackageCheck, Plus, Sparkles, Target, TrendingUp,
  Users, WalletCards, ChevronRight, CheckSquare, Square,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Metric, Panel, ProgressBar, Hero, StatusBadge, PriorityBadge, WorkTabs, SocialList, BookingCTA } from "@/components/ui/base";
import { allMentees, mentorClients, Mentee, Client, CoachingSession, computeProgress, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

// Demo appointments (sourced from booking platform)
const MENTOR_APPTS = [
  { time: "10:00 AM", name: "Simone P.",  type: "Maintenance",      day: "Today"   },
  { time: "2:00 PM",  name: "Kezia M.",   type: "Check-in",         day: "Today"   },
  { time: "9:00 AM",  name: "Aaliyah C.", type: "Color Consult",    day: "May 27"  },
  { time: "11:00 AM", name: "Nadia B.",   type: "Follow-up",        day: "May 28"  },
  { time: "3:00 PM",  name: "Kia J.",     type: "Mentorship",       day: "May 28"  },
];

// ── Quick actions grid ────────────────────────────────────────────────────────
function QuickActions({ openModal }: { openModal: ModalOpener }) {
  const actions = [
    ["Send Message",   MessageCircle],
    ["Upload Photo",   ImagePlus],
    ["Create Plan",    FileText],
    ["Add Note",       FileText],
    ["Schedule Appt.", CalendarDays],
    ["Resources",      PackageCheck],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {actions.map(([label, Icon]) => (
        <button
          key={label}
          onClick={() => openModal({ title: label, content: <p className="text-sm text-[#b8a8a4]">This action will connect to a Supabase form once the database is wired up.</p> })}
          className="rounded-2xl border border-[#ff8fab33] bg-[#171112] p-4 text-left transition hover:bg-[#2a151a]"
        >
          <Icon className="mb-3 h-5 w-5 text-[#f1889e]" />
          <p className="text-xs font-black text-[#f3b4c1]">{label}</p>
        </button>
      ))}
    </div>
  );
}

// ── Schedule panel with upcoming appointments ─────────────────────────────────
function SchedulePanel({ bookingUrl, openModal }: { bookingUrl: string; openModal: ModalOpener }) {
  return (
    <Panel title="Upcoming Appointments" action={false}>
      <div className="mb-4 space-y-2">
        {MENTOR_APPTS.slice(0, 4).map((a, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-[#ff8fab33] bg-[#151011] p-3">
            <div>
              <p className="text-sm font-black">{a.time} · {a.name}</p>
              <p className="text-xs text-[#b8a8a4]">{a.day} · {a.type}</p>
            </div>
            <button
              onClick={() => openModal({ title: `${a.name} — ${a.type}`, content: <p className="text-sm text-[#b8a8a4]">Full appointment details will render here once Supabase is connected.</p> })}
              className="rounded-full border border-[#e66f8e]/40 bg-[#171112] px-3 py-1 text-xs font-bold text-[#f1889e] hover:bg-[#2a151a]"
            >
              Details
            </button>
          </div>
        ))}
      </div>
      <a
        href={bookingUrl} target="_blank" rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 text-sm font-black text-[#17090d]"
      >
        <CalendarDays className="h-4 w-4" /> Manage in booking platform <ExternalLink className="h-3 w-3" />
      </a>
    </Panel>
  );
}

// ── Client row ────────────────────────────────────────────────────────────────
function ClientRow({ client, onSelect }: { client: Client; onSelect: (c: Client) => void }) {
  const progress = computeProgress(client.progressFactors);
  return (
    <div className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-black">{client.name}</p>
          <p className="text-xs text-[#b8a8a4]">{client.locPhase} · Next {client.nextAppt}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={client.status} />
          <span className="text-sm font-black text-[#f1889e]">{progress}%</span>
        </div>
      </div>
      <ProgressBar value={progress} />
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#f3b4c1] hover:bg-[#3a1e26]">+ Log appt</button>
        <button className="rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#f3b4c1] hover:bg-[#3a1e26]">+ Add note</button>
        <button className="rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#f3b4c1] hover:bg-[#3a1e26]">Send reminder</button>
        <button onClick={() => onSelect(client)} className="ml-auto flex items-center gap-1 rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#dca669] hover:bg-[#3a1e26]">
          View journey <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ── Mentee sparkline card ─────────────────────────────────────────────────────
function MenteeCard({ mentee, onSelect }: { mentee: Mentee; onSelect: (m: Mentee) => void }) {
  const revD = delta(mentee.revenue, mentee.revenuePrev);
  return (
    <div className="rounded-3xl border border-[#ff8fab33] bg-[#111010] p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#e66f8e] to-[#dca669] text-sm font-black text-[#17090d]">{mentee.initials}</div>
          <div>
            <p className="font-black">{mentee.name}</p>
            <p className="text-xs text-[#b8a8a4]">{mentee.businessName} · {mentee.market}</p>
          </div>
        </div>
        <StatusBadge status={mentee.status} />
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-[#151011] px-3 py-2 text-center">
          <p className="text-lg font-black">${(mentee.revenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[#b8a8a4]">Revenue</p>
          <p className={`text-xs font-bold ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>{revD.positive ? "+" : "-"}{revD.pct}%</p>
        </div>
        <div className="rounded-2xl bg-[#151011] px-3 py-2 text-center">
          <p className="text-lg font-black">{mentee.activeClients}</p>
          <p className="text-xs text-[#b8a8a4]">Clients</p>
          <p className="text-xs font-bold text-emerald-400">+{mentee.activeClients - mentee.activeClientsPrev}</p>
        </div>
        <div className="rounded-2xl bg-[#151011] px-3 py-2 text-center">
          <p className="text-lg font-black">{mentee.businessHealth}</p>
          <p className="text-xs text-[#b8a8a4]">Health</p>
          <p className="text-xs text-[#b8a8a4]">/100</p>
        </div>
      </div>
      <p className="mb-1 text-xs text-[#b8a8a4]">8-week revenue trend</p>
      <ResponsiveContainer width="100%" height={48}>
        <AreaChart data={mentee.weeklyData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`mg-${mentee.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#e66f8e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#e66f8e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="revenue" stroke="#e66f8e" fill={`url(#mg-${mentee.id})`} strokeWidth={2} dot={false} />
          <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#111010", border: "1px solid #ff8fab33", borderRadius: 8, fontSize: 11 }} labelFormatter={() => ""} />
          <XAxis dataKey="week" hide />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-[#b8a8a4]">Next session: {mentee.nextSession}</p>
        <button onClick={() => onSelect(mentee)} className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-4 py-2 text-xs font-black text-[#17090d]">
          View dashboard <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ── Session notes form ────────────────────────────────────────────────────────
function SessionNotesForm({ session }: { session: CoachingSession }) {
  const [step, setStep] = useState<"prep" | "session" | "followup">("prep");
  const [form, setForm] = useState({ topic: session.topic, agenda: "", wins: "", blockers: "", notes: "", homework: "", nextDate: "" });
  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const steps = ["prep", "session", "followup"] as const;
  const labels = ["1. Prep", "2. Session", "3. Follow-up"];
  return (
    <div>
      <div className="mb-5 flex gap-2">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(s)} className={`rounded-full px-3 py-1 text-xs font-bold transition ${step === s ? "bg-[#f1889e] text-[#17090d]" : "bg-[#2a151a] text-[#f3b4c1]"}`}>{labels[i]}</button>
        ))}
      </div>
      {step === "prep" && (
        <div className="space-y-4">
          <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Topic</label><input value={form.topic} onChange={up("topic")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
          <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Agenda / pre-work notes</label><textarea value={form.agenda} onChange={up("agenda")} rows={4} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" placeholder="What to cover? What should the mentee bring?" /></div>
          <button onClick={() => setStep("session")} className="w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 font-black text-[#17090d]">Continue to session →</button>
        </div>
      )}
      {step === "session" && (
        <div className="space-y-4">
          <div><label className="mb-1 block text-xs font-bold text-emerald-400">Wins this period</label><textarea value={form.wins} onChange={up("wins")} rows={3} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" placeholder="One per line..." /></div>
          <div><label className="mb-1 block text-xs font-bold text-rose-400">Blockers</label><textarea value={form.blockers} onChange={up("blockers")} rows={3} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" placeholder="One per line..." /></div>
          <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Notes</label><textarea value={form.notes} onChange={up("notes")} rows={4} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
          <button onClick={() => setStep("followup")} className="w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 font-black text-[#17090d]">Continue to follow-up →</button>
        </div>
      )}
      {step === "followup" && (
        <div className="space-y-4">
          <div><label className="mb-1 block text-xs font-bold text-[#dca669]">Homework assigned</label><textarea value={form.homework} onChange={up("homework")} rows={4} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" placeholder="One action item per line..." /></div>
          <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Next session date</label><input type="date" value={form.nextDate} onChange={up("nextDate")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
          <button className="w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 font-black text-[#17090d]">Save session</button>
        </div>
      )}
    </div>
  );
}

// ── Mentee detail drill-down ──────────────────────────────────────────────────
function MenteeDetail({ mentee, onBack, openModal }: { mentee: Mentee; onBack: () => void; openModal: ModalOpener }) {
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#f1889e] hover:text-[#f3b4c1]">
        <ArrowLeft className="h-4 w-4" /> Back to all mentees
      </button>
      <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#111010] p-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#e66f8e] to-[#dca669] text-lg font-black text-[#17090d]">{mentee.initials}</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3"><p className="text-xl font-black">{mentee.name}</p><StatusBadge status={mentee.status} /></div>
          <p className="text-sm text-[#b8a8a4]">{mentee.businessName} · {mentee.market}, {mentee.state} · {mentee.niche}</p>
          <p className="text-xs text-[#b8a8a4]">Next session: {mentee.nextSession}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={WalletCards}  label="Monthly Revenue"  value={`$${mentee.revenue.toLocaleString()}`}         current={mentee.revenue}       prev={mentee.revenuePrev}       />
        <Metric icon={Users}        label="Active Clients"   value={String(mentee.activeClients)}                  current={mentee.activeClients} prev={mentee.activeClientsPrev} />
        <Metric icon={CalendarDays} label="Bookings"         value={String(mentee.bookings)}                       current={mentee.bookings}      prev={mentee.bookingsPrev}      />
        <Metric icon={Eye}          label="Social Views"     value={`${(mentee.socialViews / 1000).toFixed(1)}K`}  current={mentee.socialViews}   prev={mentee.socialViewsPrev}   />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Client Management" action={false}>
          <div className="space-y-3">{mentee.clients.map(c => <ClientRow key={c.id} client={c} onSelect={() => {}} />)}</div>
        </Panel>
        <Panel title="Coaching Sessions" action={false}>
          <div className="space-y-3">
            {mentee.coachingSessions.map(s => (
              <div key={s.id} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div><p className="font-black">{s.topic}</p><p className="flex items-center gap-1.5 text-xs text-[#b8a8a4]"><Clock className="h-3 w-3" />{s.date}</p></div>
                  <StatusBadge status={s.status} />
                </div>
                {s.status === "completed" && s.wins.length > 0 && (
                  <div className="mt-2">
                    <p className="mb-1 text-xs font-bold text-emerald-400">Wins</p>
                    {s.wins.map(w => <p key={w} className="flex items-start gap-1.5 text-xs text-[#b8a8a4]"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />{w}</p>)}
                  </div>
                )}
                {s.status === "upcoming" && (
                  <button onClick={() => openModal({ title: `Session: ${s.topic}`, content: <SessionNotesForm session={s} /> })} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2 text-sm font-black text-[#17090d]">
                    Start session notes
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => openModal({ title: "Log New Session", content: <SessionNotesForm session={{ id: "", date: "", topic: "", wins: [], blockers: [], homework: [], notes: "", nextSessionDate: "", status: "upcoming" }} /> })} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ff8fab33] bg-[#171112] py-3 text-sm font-black text-[#f3b4c1] hover:bg-[#2a151a]">
            <Plus className="h-4 w-4" /> New session
          </button>
        </Panel>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Business Goals">
          <div className="space-y-3">
            {mentee.goals.map(g => (
              <div key={g.id} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
                <div className="mb-2 flex items-center justify-between"><p className="font-black">{g.title}</p><span className="text-sm font-black text-[#f1889e]">{g.progress}%</span></div>
                <ProgressBar value={g.progress} />
                <p className="mt-1 text-xs text-[#b8a8a4]">Target: {g.targetDate}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Action Items" action={false}>
          <div className="space-y-2">
            {mentee.actionItems.map(a => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl bg-[#151011] p-3">
                {a.status === "done" ? <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#b8a8a4]" />}
                <div className="min-w-0 flex-1"><p className={`text-sm font-bold ${a.status === "done" ? "text-[#b8a8a4] line-through" : ""}`}>{a.title}</p><p className="text-xs text-[#b8a8a4]">Due {a.dueDate}</p></div>
                <PriorityBadge priority={a.priority} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Connected Socials"><SocialList socials={mentee.socials} /></Panel>
    </div>
  );
}

// ── Business tab ──────────────────────────────────────────────────────────────
function MentorBusinessTab({ openModal }: { openModal: ModalOpener }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users}        label="Active Clients"    value="24"    current={24}    prev={21}    />
        <Metric icon={CalendarDays} label="Appointments Today" value="6"   current={6}     prev={4}     />
        <Metric icon={WalletCards}  label="Monthly Revenue"   value="$6.8K" current={6800}  prev={6100}  />
        <Metric icon={Eye}          label="Social Views"      value="18.9K" current={18900} prev={16200} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Panel title="Client Management" onViewAll={() => openModal({ title: "All Clients", content: <p className="text-sm text-[#b8a8a4]">Full client list will load from Supabase.</p> })}>
          <div className="space-y-3">{mentorClients.map(c => <ClientRow key={c.id} client={c} onSelect={() => {}} />)}</div>
        </Panel>
        <SchedulePanel bookingUrl="https://glossgenius.com/locsbystephb" openModal={openModal} />
      </div>
      <Panel title="Connected Socials + Performance">
        <SocialList socials={allMentees[0].socials.map(s => ({ ...s, handle: s.platform === "Instagram" ? "@locsbystephb" : s.handle }))} showClientLinks />
      </Panel>
      <Panel title="Quick Business Actions" action={false}>
        <QuickActions openModal={openModal} />
      </Panel>
    </div>
  );
}

// ── Mentorship tab ────────────────────────────────────────────────────────────
function MentorMentorshipTab({ openModal }: { openModal: ModalOpener }) {
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  if (selectedMentee) return <MenteeDetail mentee={selectedMentee} onBack={() => setSelectedMentee(null)} openModal={openModal} />;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Crown}      label="Active Mentees"     value="3"      />
        <Metric icon={Target}     label="Avg Goal Progress"  value="58%"    />
        <Metric icon={TrendingUp} label="Avg Revenue Growth" value="+20%"   />
        <Metric icon={Sparkles}   label="Next Session"       value="May 28" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {allMentees.map(m => <MenteeCard key={m.id} mentee={m} onSelect={setSelectedMentee} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Upcoming Coaching Sessions" action={false}>
          <div className="space-y-2">
            {allMentees.flatMap(m => m.coachingSessions.filter(s => s.status === "upcoming").map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-2xl bg-[#151011] p-4">
                <div><p className="font-black">{m.name} — {s.topic}</p><p className="text-xs text-[#b8a8a4]">{s.date}</p></div>
                <button onClick={() => setSelectedMentee(m)} className="rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-3 py-1.5 text-xs font-black text-[#17090d]">Prepare</button>
              </div>
            )))}
          </div>
        </Panel>
        <Panel title="Coaching Tasks" action={false}>
          {["Review Kia's pricing update", "Audit Maya's content consistency", "Confirm Destiny's service menu", "Update next-session action plans"].map((task, i) => (
            <div key={task} className="mb-3 flex items-center justify-between rounded-2xl bg-[#151011] p-4">
              <span className="text-sm font-bold">{task}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#44212a] text-sm font-black text-[#f1889e]">{i + 1}</span>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Business Growth Opportunities" action={false}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Kia: raise starter loc pricing +$15", body: "Atlanta market rate is $135–$155. Kia is at $120." },
            { title: "Maya: post 1 repair transformation reel", body: "Repair content performs 2.4× better than maintenance posts on IG." },
            { title: "Destiny: build 3-tier service menu", body: "Tiered pricing lifts avg ticket by ~35% vs single-service pricing." },
          ].map(o => (
            <div key={o.title} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <Sparkles className="mb-3 h-5 w-5 text-[#f1889e]" />
              <p className="font-black">{o.title}</p>
              <p className="mt-1 text-sm text-[#b8a8a4]">{o.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export default function MentorView({ openModal }: { openModal: ModalOpener }) {
  const [tab, setTab] = useState<"business" | "mentorship">("business");
  return (
    <div className="space-y-7">
      <Hero title="Mentor HQ" subtitle="Manage your own clients and business operations while coaching mentees as a separate growth system." />
      <WorkTabs tab={tab} setTab={setTab} />
      {tab === "business" ? <MentorBusinessTab openModal={openModal} /> : <MentorMentorshipTab openModal={openModal} />}
    </div>
  );
}
