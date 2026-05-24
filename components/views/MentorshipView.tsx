"use client";

import { useState } from "react";
import { Crown, Target, TrendingUp, Sparkles, ChevronRight, CheckSquare, Square, Clock, CheckCircle2, Plus } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ProgressBar, StatusBadge, PriorityBadge } from "@/components/ui/base";
import { allMentees, Mentee, CoachingSession, computeProgress, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

function MenteeCard({ mentee, onSelect }: { mentee: Mentee; onSelect: (m: Mentee) => void }) {
  const revD = delta(mentee.revenue, mentee.revenuePrev);
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#c4687a] to-[#dca669] text-xs font-black text-white">{mentee.initials}</div>
          <div>
            <p className="font-bold">{mentee.name}</p>
            <p className="text-xs text-[#6b5a63]">{mentee.businessName} · {mentee.market}</p>
          </div>
        </div>
        <StatusBadge status={mentee.status} />
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-[#0d0b0c] px-2 py-2 text-center">
          <p className="text-base font-black">${(mentee.revenue / 1000).toFixed(1)}K</p>
          <p className={`text-[10px] font-bold ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>{revD.positive ? "+" : "-"}{revD.pct}%</p>
          <p className="text-[10px] text-[#6b5a63]">Revenue</p>
        </div>
        <div className="rounded-xl bg-[#0d0b0c] px-2 py-2 text-center">
          <p className="text-base font-black">{mentee.activeClients}</p>
          <p className="text-[10px] font-bold text-emerald-400">+{mentee.activeClients - mentee.activeClientsPrev}</p>
          <p className="text-[10px] text-[#6b5a63]">Clients</p>
        </div>
        <div className="rounded-xl bg-[#0d0b0c] px-2 py-2 text-center">
          <p className="text-base font-black">{mentee.businessHealth}</p>
          <p className="text-[10px] text-[#6b5a63]">/100 Health</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={mentee.weeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`mvg-${mentee.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#c4687a" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#c4687a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill={`url(#mvg-${mentee.id})`} strokeWidth={1.5} dot={false} />
          <XAxis dataKey="week" hide />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-[#6b5a63]">Next session: {mentee.nextSession}</p>
        <button onClick={() => onSelect(mentee)} className="flex items-center gap-1 rounded-xl bg-[#c4687a] px-3 py-1.5 text-xs font-black text-white">
          View <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function SessionForm({ session }: { session: CoachingSession }) {
  const [step, setStep] = useState<"prep" | "session" | "followup">("prep");
  const [form, setForm] = useState({ topic: session.topic, agenda: "", wins: "", blockers: "", notes: "", homework: "", nextDate: "" });
  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["prep", "session", "followup"] as const).map((s, i) => (
          <button key={s} onClick={() => setStep(s)} className={`rounded-full px-3 py-1 text-xs font-bold ${step === s ? "bg-[#c4687a] text-white" : "bg-[#1e1319] text-[#a09099]"}`}>
            {["1. Prep", "2. Session", "3. Follow-up"][i]}
          </button>
        ))}
      </div>
      {step === "prep" && (
        <div className="space-y-3">
          <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Topic</label><input value={form.topic} onChange={up("topic")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
          <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Agenda</label><textarea value={form.agenda} onChange={up("agenda")} rows={3} className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
          <button onClick={() => setStep("session")} className="w-full rounded-xl bg-[#c4687a] py-2.5 font-black text-white">Continue →</button>
        </div>
      )}
      {step === "session" && (
        <div className="space-y-3">
          <div><label className="mb-1 block text-xs font-bold text-emerald-400">Wins</label><textarea value={form.wins} onChange={up("wins")} rows={3} className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" placeholder="One per line..." /></div>
          <div><label className="mb-1 block text-xs font-bold text-rose-400">Blockers</label><textarea value={form.blockers} onChange={up("blockers")} rows={3} className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" placeholder="One per line..." /></div>
          <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Notes</label><textarea value={form.notes} onChange={up("notes")} rows={3} className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
          <button onClick={() => setStep("followup")} className="w-full rounded-xl bg-[#c4687a] py-2.5 font-black text-white">Continue →</button>
        </div>
      )}
      {step === "followup" && (
        <div className="space-y-3">
          <div><label className="mb-1 block text-xs font-bold text-[#dca669]">Homework</label><textarea value={form.homework} onChange={up("homework")} rows={4} className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" placeholder="One action item per line..." /></div>
          <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Next session date</label><input type="date" value={form.nextDate} onChange={up("nextDate")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
          <button className="w-full rounded-xl bg-[#c4687a] py-2.5 font-black text-white">Save session</button>
        </div>
      )}
    </div>
  );
}

function MenteeDetail({ mentee, onBack, openModal }: { mentee: Mentee; onBack: () => void; openModal: ModalOpener }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-xs font-bold text-[#c4687a]">← Back to all mentees</button>
      <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#c4687a] to-[#dca669] text-base font-black text-white">{mentee.initials}</div>
        <div>
          <div className="flex flex-wrap items-center gap-2"><p className="font-black">{mentee.name}</p><StatusBadge status={mentee.status} /></div>
          <p className="text-xs text-[#6b5a63]">{mentee.businessName} · {mentee.market} · Next: {mentee.nextSession}</p>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <p className="mb-3 font-black">Coaching Sessions</p>
          <div className="space-y-3">
            {mentee.coachingSessions.map(s => (
              <div key={s.id} className="rounded-xl border border-white/[0.06] bg-[#0d0b0c] p-3">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <div><p className="text-sm font-bold">{s.topic}</p><p className="text-[10px] text-[#6b5a63]">{s.date}</p></div>
                  <StatusBadge status={s.status} />
                </div>
                {s.status === "completed" && s.wins.length > 0 && s.wins.slice(0, 2).map(w => <p key={w} className="flex items-start gap-1.5 text-xs text-[#a09099]"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />{w}</p>)}
                {s.status === "upcoming" && <button onClick={() => openModal({ title: `Session: ${s.topic}`, content: <SessionForm session={s} /> })} className="mt-2 w-full rounded-xl bg-[#c4687a] py-2 text-xs font-black text-white">Start session notes</button>}
              </div>
            ))}
          </div>
          <button onClick={() => openModal({ title: "New Coaching Session", content: <SessionForm session={{ id: "", date: "", topic: "", wins: [], blockers: [], homework: [], notes: "", nextSessionDate: "", status: "upcoming" }} /> })} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-[#0d0b0c] py-2.5 text-xs font-black text-[#e8909e]"><Plus className="h-3.5 w-3.5" /> New session</button>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
            <p className="mb-3 font-black">Business Goals</p>
            <div className="space-y-3">
              {mentee.goals.map(g => (
                <div key={g.id}>
                  <div className="mb-1 flex items-center justify-between text-xs"><p className="font-bold">{g.title}</p><p className="text-[#c4687a]">{g.progress}%</p></div>
                  <ProgressBar value={g.progress} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
            <p className="mb-3 font-black">Action Items</p>
            <div className="space-y-2">
              {mentee.actionItems.map(a => (
                <div key={a.id} className="flex items-start gap-2.5">
                  {a.status === "done" ? <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> : <Square className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6b5a63]" />}
                  <p className={`flex-1 text-xs font-medium ${a.status === "done" ? "text-[#6b5a63] line-through" : ""}`}>{a.title}</p>
                  <PriorityBadge priority={a.priority} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorshipView({ openModal }: { openModal: ModalOpener }) {
  const [selected, setSelected] = useState<Mentee | null>(null);
  if (selected) return (
    <div className="p-6"><MenteeDetail mentee={selected} onBack={() => setSelected(null)} openModal={openModal} /></div>
  );
  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-black">Mentorship</h1>
        <p className="text-sm text-[#6b5a63]">Coaching and growth layer — separate from day-to-day client operations.</p>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <Crown className="mb-3 h-5 w-5 text-[#c4687a]" />
          <p className="text-2xl font-black">3</p><p className="text-xs text-[#6b5a63]">Active Mentees</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <Target className="mb-3 h-5 w-5 text-[#c4687a]" />
          <p className="text-2xl font-black">58%</p><p className="text-xs text-[#6b5a63]">Avg. Goal Progress</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <TrendingUp className="mb-3 h-5 w-5 text-[#c4687a]" />
          <p className="text-2xl font-black">+20%</p><p className="text-xs text-[#6b5a63]">Avg. Revenue Growth</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {allMentees.map(m => <MenteeCard key={m.id} mentee={m} onSelect={setSelected} />)}
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <p className="mb-3 font-black">Upcoming Sessions</p>
          <div className="space-y-2">
            {allMentees.flatMap(m => m.coachingSessions.filter(s => s.status === "upcoming").map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-xl bg-[#0d0b0c] p-3">
                <div><p className="text-sm font-bold">{m.name} — {s.topic}</p><p className="text-xs text-[#6b5a63]">{s.date}</p></div>
                <button onClick={() => setSelected(m)} className="rounded-xl bg-[#c4687a] px-3 py-1.5 text-xs font-black text-white">Prepare</button>
              </div>
            )))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <p className="mb-3 font-black">Growth Opportunities</p>
          <div className="space-y-3">
            {[
              { name: "Kia", tip: "Raise starter loc pricing +$15 — Atlanta market avg is $135–$155." },
              { name: "Maya", tip: "Post 1 repair transformation reel — repair content gets 2.4× more reach." },
              { name: "Destiny", tip: "Build 3-tier service menu to lift avg ticket by ~35%." },
            ].map(o => (
              <div key={o.name} className="flex items-start gap-2.5 rounded-xl bg-[#0d0b0c] p-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#dca669]" />
                <div><p className="text-xs font-bold text-[#dca669]">{o.name}</p><p className="text-xs text-[#a09099]">{o.tip}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
