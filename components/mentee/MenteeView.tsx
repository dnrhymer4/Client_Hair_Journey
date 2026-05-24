"use client";

import { useState } from "react";
import {
  CalendarDays, Users, WalletCards, Eye, ChevronRight,
  Target, TrendingUp, BriefcaseBusiness, CheckSquare, Square,
  Plus, Globe, GlobeLock, Megaphone,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  Metric, Panel, ProgressBar, Hero, EmptyState, StatusBadge,
  PriorityBadge, WorkTabs, SocialList, BookingCTA,
} from "@/components/ui/base";
import { menteeKia, Mentee, Client, computeProgress, delta } from "@/lib/demoData";

type ModalOpener = (modal: { title: string; content: React.ReactNode }) => void;

// Use Kia as the default "logged in mentee"
const ME = menteeKia;

// ── Client row with inline actions ────────────────────────────────────────────
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
      <div className="rounded-2xl bg-[#1a1011] p-3 text-sm text-[#b8a8a4]">Logging appointment for <span className="font-bold text-[#f3b4c1]">{client.name}</span></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Date</label><input type="date" value={form.date} onChange={up("date")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Time</label><input type="time" value={form.time} onChange={up("time")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Service</label><input value={form.service} onChange={up("service")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Amount charged ($)</label><input type="number" value={form.charge} onChange={up("charge")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
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

// ── Content calendar week view ─────────────────────────────────────────────────
function ContentCalendar({ mentee }: { mentee: Mentee }) {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const postsByDay = DAYS.reduce<Record<string, typeof mentee.contentCalendar>>((acc, d) => {
    acc[d] = mentee.contentCalendar.filter(p => p.dayLabel === d);
    return acc;
  }, {});
  const statusColor: Record<string, string> = {
    posted: "text-emerald-400 bg-[#122418]",
    planned: "text-[#dca669] bg-[#2d2210]",
    draft:   "text-[#b8a8a4] bg-[#1e1013]",
  };
  const platformIcon: Record<string, string> = { Instagram: "IG", Facebook: "FB", TikTok: "TT" };
  return (
    <div>
      <div className="mb-3 grid grid-cols-7 gap-1.5">
        {DAYS.map(d => <div key={d} className="rounded-lg bg-[#2a151a] py-1.5 text-center text-xs font-black text-[#f1889e]">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map(d => {
          const posts = postsByDay[d];
          return (
            <div key={d} className="min-h-[100px] rounded-2xl border border-[#ff8fab33] bg-[#151011] p-2">
              {posts.length === 0
                ? <div className="flex h-full items-center justify-center"><span className="text-[10px] text-[#b8a8a4] opacity-40">—</span></div>
                : posts.map(p => (
                  <div key={p.id} className="mb-1.5 rounded-lg bg-[#1a1011] p-1.5">
                    <div className="mb-0.5 flex items-center justify-between gap-1">
                      <span className="rounded bg-[#2a151a] px-1 text-[9px] font-black text-[#f1889e]">{platformIcon[p.platform]}</span>
                      <span className={`rounded px-1 text-[9px] font-bold ${statusColor[p.status]}`}>{p.status}</span>
                    </div>
                    <p className="text-[10px] leading-tight text-[#b8a8a4]">{p.title}</p>
                    <p className="mt-0.5 text-[9px] text-[#76676a]">{p.contentType}</p>
                  </div>
                ))
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Business tab ──────────────────────────────────────────────────────────────
function MenteeBusinessTab({ openModal }: { openModal: ModalOpener }) {
  const revD = delta(ME.revenue, ME.revenuePrev);
  const clientD = delta(ME.activeClients, ME.activeClientsPrev);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={WalletCards} label="Monthly Revenue"   value={`$${ME.revenue.toLocaleString()}`}  current={ME.revenue}       prev={ME.revenuePrev}       />
        <Metric icon={Users}       label="Active Clients"    value={String(ME.activeClients)}          current={ME.activeClients} prev={ME.activeClientsPrev} />
        <Metric icon={CalendarDays} label="Bookings"         value={String(ME.bookings)}               current={ME.bookings}      prev={ME.bookingsPrev}      />
        <Metric icon={Eye}         label="Social Views"      value={`${(ME.socialViews / 1000).toFixed(1)}K`} current={ME.socialViews} prev={ME.socialViewsPrev} />
      </div>

      <Panel title="Revenue Trend (8 weeks)" action={false}>
        <div className="flex items-end justify-between mb-3 gap-4">
          <div>
            <p className="text-3xl font-black">${ME.revenue.toLocaleString()}</p>
            <p className={`text-sm font-bold ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>
              {revD.positive ? "+" : "-"}{revD.pct}% vs last month · Goal: ${ME.goal.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-[#f3b4c1]">{Math.round((ME.revenue / ME.goal) * 100)}%</p>
            <p className="text-xs text-[#b8a8a4]">to goal</p>
          </div>
        </div>
        <ProgressBar value={Math.round((ME.revenue / ME.goal) * 100)} size="md" />
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={100}>
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

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Panel title="Client Management" action={false}>
          <div className="space-y-3">{ME.clients.map(c => <ClientRow key={c.id} client={c} openModal={openModal} />)}</div>
        </Panel>
        <Panel title="Booking Platform" action={false}>
          <BookingCTA url={ME.bookingUrl} label="Open GlossGenius" />
        </Panel>
      </div>

      <Panel title="Connected Socials + Performance" action={false}>
        <div className="grid gap-5 lg:grid-cols-[1fr_.5fr]">
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
              <p className={`text-xs font-bold ${delta(ME.socialViews, ME.socialViewsPrev).positive ? "text-emerald-400" : "text-rose-400"}`}>
                +{delta(ME.socialViews, ME.socialViewsPrev).pct}% vs last month
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── Mentorship tab ────────────────────────────────────────────────────────────
function MenteeMentorshipTab({ openModal }: { openModal: ModalOpener }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Target}          label="Goal Progress"       value={`${ME.progress}%`}       />
        <Metric icon={TrendingUp}      label="Revenue Growth"      value={`+${delta(ME.revenue, ME.revenuePrev).pct}%`} />
        <Metric icon={BriefcaseBusiness} label="Business Health"   value={String(ME.businessHealth)} />
        <Metric icon={CalendarDays}    label="Next Mentor Session" value={ME.nextSession}           />
      </div>

      <Panel title="This Week's Content Plan" action={false}>
        <ContentCalendar mentee={ME} />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Business Goals">
          <div className="space-y-3">
            {ME.goals.map(g => (
              <div key={g.id} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-black">{g.title}</p>
                    <p className="text-xs text-[#b8a8a4]">{g.category} · Target: {g.targetDate}</p>
                  </div>
                  <span className="text-sm font-black text-[#f1889e]">{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Mentor Action Items" action={false}>
          <div className="space-y-2">
            {ME.actionItems.map(a => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl bg-[#151011] p-3">
                {a.status === "done" ? <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#b8a8a4]" />}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${a.status === "done" ? "text-[#b8a8a4] line-through" : ""}`}>{a.title}</p>
                  <p className="text-xs text-[#b8a8a4]">Due {a.dueDate} · {a.source === "mentor" ? "Assigned by mentor" : "Self-set"}</p>
                </div>
                <PriorityBadge priority={a.priority} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Business Growth Opportunities" action={false}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Raise starter loc pricing +$15", body: "Atlanta market rate is $135–$155. You're currently at $120.", icon: WalletCards },
            { title: "Post 2 transformation reels", body: "Your last reel hit 4.2K views. Consistency drives compounding reach.", icon: TrendingUp },
            { title: "Launch client check-in reminders", body: "Automated 4-week reminders improve retention by ~18%.", icon: CheckSquare },
          ].map(o => (
            <div key={o.title} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <o.icon className="mb-3 h-5 w-5 text-[#f1889e]" />
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
