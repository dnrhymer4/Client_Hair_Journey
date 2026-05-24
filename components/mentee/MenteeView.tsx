"use client";

import { useState } from "react";
import {
  CalendarDays, Camera, CheckSquare, Eye, ExternalLink, FileText,
  ImagePlus, MessageCircle, PackageCheck, Plus, Sparkles, Square,
  Target, TrendingUp, Users, WalletCards, BriefcaseBusiness, Megaphone,
  ChevronRight,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Metric, Panel, ProgressBar, Hero, StatusBadge, PriorityBadge, WorkTabs, SocialList } from "@/components/ui/base";
import { menteeKia, Mentee, Client, computeProgress, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const ME = menteeKia;

// Demo appointments from booking platform
const MY_APPTS = [
  { time: "10:00 AM", name: "Layla M.",   type: "Check-in & Photo Update", day: "Today"  },
  { time: "1:30 PM",  name: "Jasmine R.", type: "Color Correction Consult", day: "Today"  },
  { time: "9:00 AM",  name: "Brianna T.", type: "Maintenance Plan Review",  day: "May 27" },
  { time: "11:00 AM", name: "Maya L.",    type: "Growth Plan Check-in",     day: "May 31" },
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

// ── Schedule panel ────────────────────────────────────────────────────────────
function SchedulePanel({ openModal }: { openModal: ModalOpener }) {
  return (
    <Panel title="Upcoming Appointments" action={false}>
      <div className="mb-4 space-y-2">
        {MY_APPTS.slice(0, 4).map((a, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-[#ff8fab33] bg-[#151011] p-3">
            <div>
              <p className="text-sm font-black">{a.time} · {a.name}</p>
              <p className="text-xs text-[#b8a8a4]">{a.day} · {a.type}</p>
            </div>
            <button
              onClick={() => openModal({ title: `${a.name}`, content: <p className="text-sm text-[#b8a8a4]">Appointment details will render from Supabase.</p> })}
              className="rounded-full border border-[#e66f8e]/40 bg-[#171112] px-3 py-1 text-xs font-bold text-[#f1889e] hover:bg-[#2a151a]"
            >
              Details
            </button>
          </div>
        ))}
      </div>
      <a
        href={ME.bookingUrl} target="_blank" rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 text-sm font-black text-[#17090d]"
      >
        <CalendarDays className="h-4 w-4" /> Manage in booking platform <ExternalLink className="h-3 w-3" />
      </a>
    </Panel>
  );
}

// ── Client row ────────────────────────────────────────────────────────────────
function ClientRow({ client, openModal }: { client: Client; openModal: ModalOpener }) {
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
        <button onClick={() => openModal({ title: "Log Appointment", content: <LogApptForm client={client} /> })} className="rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#f3b4c1] hover:bg-[#3a1e26]">+ Log appt</button>
        <button onClick={() => openModal({ title: `Add Note — ${client.name}`, content: <AddNoteForm client={client} /> })} className="rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#f3b4c1] hover:bg-[#3a1e26]">+ Add note</button>
        <button className="rounded-xl bg-[#2a151a] px-3 py-1 text-xs font-bold text-[#f3b4c1] hover:bg-[#3a1e26]">Send reminder</button>
      </div>
    </div>
  );
}

function LogApptForm({ client }: { client: Client }) {
  const [form, setForm] = useState({ date: "", time: "", service: client.service, notes: "", charge: "", payment: "paid" });
  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Date</label><input type="date" value={form.date} onChange={up("date")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Time</label><input type="time" value={form.time} onChange={up("time")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Service</label><input value={form.service} onChange={up("service")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Amount ($)</label><input type="number" value={form.charge} onChange={up("charge")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Payment status</label>
          <select value={form.payment} onChange={up("payment")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none">
            <option value="paid">Paid</option><option value="pending">Pending</option><option value="partial">Partial</option>
          </select>
        </div>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Notes</label><textarea value={form.notes} onChange={up("notes")} rows={3} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <button className="w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 font-black text-[#17090d]">Save appointment</button>
    </div>
  );
}

function AddNoteForm({ client }: { client: Client }) {
  const [form, setForm] = useState({ type: "general", title: "", body: "" });
  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="space-y-4">
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Note type</label>
        <select value={form.type} onChange={up("type")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none">
          <option value="general">General</option><option value="scalp">Scalp observation</option><option value="product">Product note</option><option value="growth">Growth update</option>
        </select>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Title</label><input value={form.title} onChange={up("title")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Note</label><textarea value={form.body} onChange={up("body")} rows={5} className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <button className="w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 font-black text-[#17090d]">Save note</button>
    </div>
  );
}

// ── Content calendar ──────────────────────────────────────────────────────────
function ContentCalendar({ mentee }: { mentee: Mentee }) {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const byDay = DAYS.reduce<Record<string, typeof mentee.contentCalendar>>((acc, d) => {
    acc[d] = mentee.contentCalendar.filter(p => p.dayLabel === d);
    return acc;
  }, {});
  const color: Record<string, string> = { posted: "text-emerald-400 bg-[#122418]", planned: "text-[#dca669] bg-[#2d2210]", draft: "text-[#b8a8a4] bg-[#1e1013]" };
  const platform: Record<string, string> = { Instagram: "IG", Facebook: "FB", TikTok: "TT" };
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {DAYS.map(d => <div key={d} className="rounded-lg bg-[#2a151a] py-1.5 text-center text-xs font-black text-[#f1889e]">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map(d => (
          <div key={d} className="min-h-[90px] rounded-2xl border border-[#ff8fab33] bg-[#151011] p-1.5">
            {byDay[d].length === 0
              ? <div className="flex h-full items-center justify-center text-[10px] text-[#b8a8a4] opacity-30">—</div>
              : byDay[d].map(p => (
                <div key={p.id} className="mb-1 rounded-lg bg-[#1a1011] p-1.5">
                  <div className="mb-0.5 flex items-center justify-between gap-0.5">
                    <span className="rounded bg-[#2a151a] px-1 text-[9px] font-black text-[#f1889e]">{platform[p.platform]}</span>
                    <span className={`rounded px-1 text-[9px] font-bold ${color[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-[10px] leading-tight text-[#b8a8a4]">{p.title}</p>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Snapshot tile ─────────────────────────────────────────────────────────────
function Snapshot({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-[#151011] p-4">
      <p className="text-xs text-[#b8a8a4]">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-[#b8a8a4]">{sub}</p>
    </div>
  );
}

// ── Business tab ──────────────────────────────────────────────────────────────
function MenteeBusinessTab({ openModal }: { openModal: ModalOpener }) {
  const revD = delta(ME.revenue, ME.revenuePrev);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users}        label="Active Clients"    value={String(ME.activeClients)}                    current={ME.activeClients} prev={ME.activeClientsPrev} />
        <Metric icon={CalendarDays} label="Bookings"          value={String(ME.bookings)}                         current={ME.bookings}      prev={ME.bookingsPrev}      />
        <Metric icon={WalletCards}  label="Monthly Revenue"   value={`$${ME.revenue.toLocaleString()}`}           current={ME.revenue}       prev={ME.revenuePrev}       />
        <Metric icon={Eye}          label="Social Views"      value={`${(ME.socialViews / 1000).toFixed(1)}K`}   current={ME.socialViews}   prev={ME.socialViewsPrev}   />
      </div>

      <Panel title="Revenue Trend (8 weeks)" action={false}>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-black">${ME.revenue.toLocaleString()}</p>
            <p className={`text-sm font-bold ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>
              {revD.positive ? "+" : "-"}{revD.pct}% vs last month · Goal: ${ME.goal.toLocaleString()}
            </p>
          </div>
          <p className="text-right text-sm font-black text-[#f1889e]">{Math.round((ME.revenue / ME.goal) * 100)}% to goal</p>
        </div>
        <ProgressBar value={Math.round((ME.revenue / ME.goal) * 100)} size="md" />
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={ME.weeklyData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-mentee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e66f8e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e66f8e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke="#e66f8e" fill="url(#grad-mentee)" strokeWidth={2.5} dot={false} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#111010", border: "1px solid #ff8fab33", borderRadius: 8, fontSize: 12 }} />
              <XAxis dataKey="week" tick={{ fill: "#76676a", fontSize: 10 }} tickLine={false} axisLine={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Panel title="Client Management" onViewAll={() => openModal({ title: "All Clients", content: <p className="text-sm text-[#b8a8a4]">Full client list from Supabase.</p> })}>
          <div className="space-y-3">{ME.clients.map(c => <ClientRow key={c.id} client={c} openModal={openModal} />)}</div>
        </Panel>
        <SchedulePanel openModal={openModal} />
      </div>

      <Panel title="Connected Socials + Performance">
        <div className="grid gap-5 lg:grid-cols-[1fr_.4fr]">
          <SocialList socials={ME.socials} showClientLinks />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <Megaphone className="mb-3 h-5 w-5 text-[#f1889e]" />
              <p className="text-3xl font-black">{ME.socials.reduce((s, x) => s + x.posts, 0)}</p>
              <p className="text-sm text-[#b8a8a4]">Posts this month</p>
            </div>
            <div className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <Eye className="mb-3 h-5 w-5 text-[#f1889e]" />
              <p className="text-3xl font-black">{(ME.socialViews / 1000).toFixed(1)}K</p>
              <p className="text-sm text-[#b8a8a4]">Profile views</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Quick Business Actions" action={false}>
        <QuickActions openModal={openModal} />
      </Panel>
    </div>
  );
}

// ── Mentorship tab ────────────────────────────────────────────────────────────
function MenteeMentorshipTab({ openModal }: { openModal: ModalOpener }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Target}           label="Goal Progress"       value={`${ME.progress}%`}                                    />
        <Metric icon={TrendingUp}       label="Revenue Growth"      value={`+${delta(ME.revenue, ME.revenuePrev).pct}%`}         />
        <Metric icon={BriefcaseBusiness} label="Business Health"    value={String(ME.businessHealth)}                            />
        <Metric icon={CalendarDays}     label="Next Mentor Session" value={ME.nextSession}                                       />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Business Growth Plan" onViewAll={() => openModal({ title: "Full Growth Plan", content: <p className="text-sm text-[#b8a8a4]">Detailed growth plan from Supabase.</p> })}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Snapshot label="Revenue Goal"    value={`$${(ME.goal / 1000).toFixed(0)}K/mo`} sub={`Currently $${(ME.revenue / 1000).toFixed(1)}K — ${Math.round((ME.revenue / ME.goal) * 100)}% there`} />
            <Snapshot label="Content Goal"    value="3×/week"    sub="Reels + transformation posts"               />
            <Snapshot label="Retention Goal"  value="85%"        sub="Client check-ins + reminders"               />
            <Snapshot label="Next Session"    value={ME.nextSession} sub="Review pricing + social metrics"        />
          </div>
        </Panel>
        <Panel title="Mentor Action Items" action={false}>
          <div className="space-y-2">
            {ME.actionItems.map(a => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl bg-[#151011] p-3">
                {a.status === "done" ? <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#b8a8a4]" />}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${a.status === "done" ? "text-[#b8a8a4] line-through" : ""}`}>{a.title}</p>
                  <p className="text-xs text-[#b8a8a4]">Due {a.dueDate}</p>
                </div>
                <PriorityBadge priority={a.priority} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="This Week's Content Plan" action={false}>
        <ContentCalendar mentee={ME} />
      </Panel>

      <Panel title="Business Goals">
        <div className="space-y-3">
          {ME.goals.map(g => (
            <div key={g.id} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div><p className="font-black">{g.title}</p><p className="text-xs text-[#b8a8a4]">{g.category} · Target: {g.targetDate}</p></div>
                <span className="text-sm font-black text-[#f1889e]">{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Business Growth Opportunities" action={false}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Raise starter loc pricing +$15", body: "Atlanta market rate is $135–$155. You're currently at $120 — leaving ~$600/mo on the table." },
            { title: "Post 2 transformation reels this week", body: "Your last reel hit 4.2K views. Consistency drives compounding reach." },
            { title: "Launch client check-in reminders", body: "Automated 4-week reminders improve rebooking rate by ~18%." },
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

export default function MenteeView({ openModal }: { openModal: ModalOpener }) {
  const [tab, setTab] = useState<"business" | "mentorship">("business");
  return (
    <div className="space-y-7">
      <Hero title="Mentee Dashboard" subtitle={`${ME.businessName} · ${ME.market}, ${ME.state} · ${ME.niche}`} />
      <WorkTabs tab={tab} setTab={setTab} />
      {tab === "business" ? <MenteeBusinessTab openModal={openModal} /> : <MenteeMentorshipTab openModal={openModal} />}
    </div>
  );
}
