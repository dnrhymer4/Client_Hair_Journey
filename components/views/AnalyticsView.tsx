"use client";

import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CalendarDays, Clock, TrendingUp, Users, WalletCards } from "lucide-react";
import { ProgressBar } from "@/components/ui/base";
import { adminStats, allMentees, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const weeklyAppts = [
  { day: "Mon", count: 8 }, { day: "Tue", count: 12 }, { day: "Wed", count: 7 },
  { day: "Thu", count: 14 }, { day: "Fri", count: 11 }, { day: "Sat", count: 9 }, { day: "Sun", count: 3 },
];

const PIE_DATA = [
  { name: "On Track",     value: 58, color: "#34d399" },
  { name: "Needs Attention", value: 32, color: "#c4687a" },
  { name: "At Risk",      value: 10, color: "#6b5a63" },
];

const TOP_PLANS = [
  { name: "Hydration Plan",       pct: 92 },
  { name: "Curl Recovery Plan",   pct: 89 },
  { name: "Length Retention Plan",pct: 85 },
];

function Stat({ icon: Icon, label, value, sub, positive = true }: { icon: React.ElementType; label: string; value: string; sub: string; positive?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-[#6b5a63]">{label}</p>
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#c4687a]/10 text-[#c4687a]"><Icon className="h-3.5 w-3.5" /></div>
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className={`text-xs font-bold ${positive ? "text-emerald-400" : "text-rose-400"}`}>{sub}</p>
    </div>
  );
}

export default function AnalyticsView({ openModal }: { openModal: ModalOpener }) {
  const revD = delta(adminStats.totalRevenue, adminStats.totalRevenuePrev);
  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Analytics Overview</h1>
          <p className="text-sm text-[#6b5a63]">May 1 – May 28</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users}        label="Clients"        value={String(adminStats.totalClients)}              sub="↑ 12% vs last month" />
        <Stat icon={CalendarDays} label="Appointments"   value={String(adminStats.appointmentsThisMonth)}     sub="↑ 18% vs last month" />
        <Stat icon={WalletCards}  label="Platform Revenue" value={`$${(adminStats.totalRevenue / 1000).toFixed(0)}K`} sub={`${revD.positive ? "+" : "-"}${revD.pct}% vs last period`} />
        <Stat icon={Activity}     label="Retention Rate" value={`${adminStats.avgClientProgress}%`}           sub="↑ 10% vs last month" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_.9fr]">
        {/* Progress donut */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-5">
          <p className="mb-1 font-black">Progress Overview</p>
          <p className="mb-4 text-xs text-[#6b5a63]">Client journey health</p>
          <div className="flex items-center gap-4">
            <div className="relative h-[120px] w-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={56} dataKey="value" strokeWidth={0}>
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-black">72%</p>
                <p className="text-[9px] text-[#6b5a63]">Avg Progress</p>
              </div>
            </div>
            <div className="space-y-2">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <p className="text-xs text-[#a09099]">{d.name}</p>
                  <p className="ml-auto text-xs font-bold">{d.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments bar chart */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-5">
          <p className="mb-1 font-black">Appointments</p>
          <p className="mb-4 text-xs text-[#6b5a63]">This week by day</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={weeklyAppts} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <Bar dataKey="count" fill="#c4687a" radius={[4, 4, 0, 0]} />
              <XAxis dataKey="day" tick={{ fill: "#6b5a63", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6b5a63", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => [v, "Appointments"]} contentStyle={{ background: "#131013", border: "1px solid #2a1520", borderRadius: 8, fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top plans + recent activity */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
            <p className="mb-3 font-black">Top Performing Plans</p>
            {TOP_PLANS.map(p => (
              <div key={p.name} className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs"><p>{p.name}</p><p className="font-bold text-[#c4687a]">{p.pct}%</p></div>
                <ProgressBar value={p.pct} />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
            <p className="mb-3 font-black">Recent Activity</p>
            <div className="space-y-2">
              {adminStats.recentActivity.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4687a]" />
                  <div><p className="text-xs text-[#a09099]">{a.text}</p><p className="text-[10px] text-[#6b5a63]">{a.time}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentee roster */}
      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-[#131013] p-5">
        <p className="mb-4 font-black">Mentee Performance</p>
        <div className="grid gap-3 md:grid-cols-3">
          {allMentees.map(m => {
            const revD = delta(m.revenue, m.revenuePrev);
            const goalPct = Math.round((m.revenue / m.goal) * 100);
            return (
              <div key={m.id} className="rounded-xl border border-white/[0.06] bg-[#0d0b0c] p-3">
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#c4687a] to-[#dca669] text-xs font-black text-white">{m.initials}</div>
                  <div><p className="text-sm font-bold">{m.name}</p><p className="text-[10px] text-[#6b5a63]">{m.market}</p></div>
                  <p className={`ml-auto text-xs font-black ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>{revD.positive ? "+" : "-"}{revD.pct}%</p>
                </div>
                <div className="mb-1 flex justify-between text-[10px] text-[#6b5a63]"><span>Revenue to goal</span><span className="font-bold text-[#c4687a]">{goalPct}%</span></div>
                <ProgressBar value={goalPct} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
