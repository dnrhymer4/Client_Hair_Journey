"use client";

import {
  Crown, Users, UserRound, WalletCards, CalendarDays,
  TrendingUp, Activity, Award, ArrowUpRight, Clock,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, BarChart, Bar,
} from "recharts";
import { Metric, Panel, ProgressBar, Hero, StatusBadge } from "@/components/ui/base";
import { adminStats, allMentees, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

// 8-week platform revenue data
const platformWeekly = [
  { week: "Apr 6",  revenue: 18200 },
  { week: "Apr 13", revenue: 20100 },
  { week: "Apr 20", revenue: 21500 },
  { week: "Apr 27", revenue: 22800 },
  { week: "May 4",  revenue: 24100 },
  { week: "May 11", revenue: 25600 },
  { week: "May 18", revenue: 27200 },
  { week: "May 24", revenue: 28400 },
];

const activityIcon: Record<string, string> = {
  photo: "📸", client: "👤", coaching: "🎯",
  milestone: "🎉", mentee: "✨", booking: "📅",
};

export default function AdminView({ openModal }: { openModal: ModalOpener }) {
  const revD = delta(adminStats.totalRevenue, adminStats.totalRevenuePrev);

  return (
    <div className="space-y-7">
      <Hero
        title="Platform Admin"
        subtitle="Full visibility into the Mentor HQ ecosystem — mentors, mentees, clients, and revenue."
        tag="Admin"
      />

      {/* Platform KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users}       label="Total Platform Users"  value={String(adminStats.totalUsers)}   />
        <Metric icon={WalletCards} label="Platform Revenue"      value={`$${(adminStats.totalRevenue / 1000).toFixed(1)}K`} current={adminStats.totalRevenue} prev={adminStats.totalRevenuePrev} />
        <Metric icon={CalendarDays} label="Appointments (month)" value={String(adminStats.appointmentsThisMonth)} />
        <Metric icon={Activity}    label="Avg Client Progress"   value={`${adminStats.avgClientProgress}%`} />
      </div>

      {/* User breakdown */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Mentors",  value: adminStats.totalMentors,  color: "from-[#e66f8e] to-[#dca669]", icon: Crown },
          { label: "Mentees",  value: adminStats.totalMentees,  color: "from-[#a78bfa] to-[#818cf8]", icon: Users },
          { label: "Clients",  value: adminStats.totalClients,  color: "from-[#34d399] to-[#10b981]", icon: UserRound },
          { label: "Active",   value: adminStats.totalUsers,    color: "from-[#fb923c] to-[#f59e0b]", icon: Activity },
        ].map(s => (
          <div key={s.label} className="rounded-3xl border border-white/10 bg-[#111010] p-5">
            <div className={`mb-4 inline-grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${s.color}`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="mt-1 text-sm text-[#b8a8a4]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart + activity feed */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <Panel title="Platform Revenue (8 weeks)" action={false}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-4xl font-black">${(adminStats.totalRevenue / 1000).toFixed(1)}K</p>
              <p className={`text-sm font-bold ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>
                {revD.positive ? "+" : "-"}{revD.pct}% vs last period
              </p>
            </div>
            <p className="text-right text-xs text-[#b8a8a4]">Across all active mentors</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={platformWeekly} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-admin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e66f8e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e66f8e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="revenue" stroke="#e66f8e" fill="url(#grad-admin)" strokeWidth={2.5} dot={false} />
              <Tooltip
                formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                contentStyle={{ background: "#111010", border: "1px solid #ff8fab33", borderRadius: 8, fontSize: 12 }}
              />
              <XAxis dataKey="week" tick={{ fill: "#76676a", fontSize: 10 }} tickLine={false} axisLine={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Recent Activity" action={false}>
          <div className="space-y-2">
            {adminStats.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-[#151011] p-3">
                <span className="text-lg leading-none">{activityIcon[a.type] ?? "💡"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug">{a.text}</p>
                  <p className="flex items-center gap-1 text-xs text-[#b8a8a4]">
                    <Clock className="h-3 w-3" />{a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Mentee roster with revenue bars */}
      <Panel title="Mentee Roster" action={false}>
        <div className="space-y-4">
          {allMentees.map(m => {
            const revD = delta(m.revenue, m.revenuePrev);
            const goalPct = Math.round((m.revenue / m.goal) * 100);
            return (
              <div key={m.id} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#e66f8e] to-[#dca669] text-xs font-black text-[#17090d]">
                      {m.initials}
                    </div>
                    <div>
                      <p className="font-black">{m.name}</p>
                      <p className="text-xs text-[#b8a8a4]">{m.businessName} · {m.market}, {m.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={m.status} />
                    <div className="text-right">
                      <p className="font-black">${m.revenue.toLocaleString()}</p>
                      <p className={`text-xs font-bold ${revD.positive ? "text-emerald-400" : "text-rose-400"}`}>
                        {revD.positive ? "+" : "-"}{revD.pct}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center text-xs text-[#b8a8a4]">
                  <div><p className="font-black text-[#fff7f4]">{m.activeClients}</p>clients</div>
                  <div><p className="font-black text-[#fff7f4]">{m.bookings}</p>bookings</div>
                  <div><p className="font-black text-[#fff7f4]">{m.businessHealth}</p>health</div>
                  <div><p className="font-black text-[#fff7f4]">{goalPct}%</p>to goal</div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#b8a8a4]">Revenue to goal (${m.goal.toLocaleString()})</span>
                    <span className="font-bold text-[#f1889e]">{goalPct}%</span>
                  </div>
                  <ProgressBar value={goalPct} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Other mentors on platform */}
      <Panel title="All Mentors" action={false}>
        <div className="space-y-3">
          {adminStats.mentorBreakdown.map(m => (
            <div key={m.mentor} className="flex items-center justify-between rounded-2xl bg-[#151011] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2a151a] text-xs font-black text-[#f1889e]">
                  {m.mentor.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-black">{m.mentor}</p>
                  <p className="text-xs text-[#b8a8a4]">{m.mentees} mentees · {m.clients} clients</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black">${m.revenue.toLocaleString()}</p>
                <p className="text-xs text-[#b8a8a4]">this month</p>
              </div>
            </div>
          ))}
          {/* Current logged-in mentor */}
          <div className="flex items-center justify-between rounded-2xl border border-[#e66f8e]/30 bg-[#241218] p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#e66f8e] to-[#dca669] text-xs font-black text-[#17090d]">SB</div>
              <div>
                <p className="font-black">Steph B. <span className="ml-2 rounded-full bg-[#f1889e] px-2 py-0.5 text-xs text-[#17090d]">You</span></p>
                <p className="text-xs text-[#b8a8a4]">3 mentees · 24 clients</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black">$6,800</p>
              <p className="text-xs text-[#b8a8a4]">this month</p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
