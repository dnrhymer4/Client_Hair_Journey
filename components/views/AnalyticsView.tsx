"use client";
import { CSSProperties } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from "recharts";
import { Activity, CalendarDays, TrendingUp, Users, WalletCards } from "lucide-react";
import { adminStats, allMentees, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const C = { card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399" };
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 };

function PBar({ value }:{ value:number }) {
  return (
    <div style={{ height:4, background:"rgba(255,255,255,.07)", borderRadius:2, overflow:"hidden", flex:1 }}>
      <div style={{ height:4, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:2 }} />
    </div>
  );
}

const WEEKLY = [
  { day:"Mon", count:8 }, { day:"Tue", count:12 }, { day:"Wed", count:7 },
  { day:"Thu", count:14 }, { day:"Fri", count:11 }, { day:"Sat", count:9 }, { day:"Sun", count:3 },
];

const PLATFORM_REVENUE = [
  { week:"Apr 6", revenue:18200 }, { week:"Apr 13", revenue:20100 },
  { week:"Apr 20", revenue:21500 }, { week:"Apr 27", revenue:22800 },
  { week:"May 4",  revenue:24100 }, { week:"May 11", revenue:25600 },
  { week:"May 18", revenue:27200 }, { week:"May 24", revenue:28400 },
];

const PIE = [
  { name:"On Track",        value:58, color:"#34d399" },
  { name:"Needs Attention", value:32, color:"#c4687a" },
  { name:"At Risk",         value:10, color:"#5e4d55" },
];

const TOP_PLANS = [
  { name:"Hydration Plan",        pct:92 },
  { name:"Curl Recovery Plan",    pct:89 },
  { name:"Length Retention Plan", pct:85 },
];

export default function AnalyticsView({ openModal }:{ openModal:ModalOpener }) {
  const revD = delta(adminStats.totalRevenue, adminStats.totalRevenuePrev);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:800, margin:0 }}>Analytics Overview</h1>
          <p style={{ fontSize:11.5, color:C.dim, margin:"2px 0 0" }}>May 1 – May 28</p>
        </div>
        <div style={{ padding:"5px 12px", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, fontSize:12, color:C.muted, cursor:"pointer" }}>May 1 – May 28 ▾</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[
            { icon:Users,        label:"Clients",        val:String(adminStats.totalClients),                sub:"↑ 12%", color:C.success, icBg:"rgba(52,211,153,.1)", icColor:"#34d399" },
            { icon:CalendarDays, label:"Appointments",   val:String(adminStats.appointmentsThisMonth),      sub:"↑ 18%", color:C.success, icBg:"rgba(196,104,122,.12)", icColor:C.accent },
            { icon:WalletCards,  label:"Platform Revenue",val:`$${(adminStats.totalRevenue/1000).toFixed(0)}K`, sub:`${revD.positive?"+":"-"}${revD.pct}%`, color:revD.positive?C.success:"#f87171", icBg:"rgba(212,149,106,.12)", icColor:C.gold },
            { icon:Activity,     label:"Retention Rate", val:`${adminStats.avgClientProgress}%`,            sub:"↑ 10%", color:C.success, icBg:"rgba(167,139,250,.12)", icColor:"#a78bfa" },
          ].map(s=>(
            <div key={s.label} style={card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:s.icBg, display:"flex", alignItems:"center", justifyContent:"center", color:s.icColor }}><s.icon size={15}/></div>
                <span style={{ fontSize:10, fontWeight:700, color:s.color }}>{s.sub}</span>
              </div>
              <div style={{ fontSize:22, fontWeight:900, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:11, color:C.dim, marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue chart + donut + activity */}
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr .9fr", gap:12 }}>
          {/* Revenue */}
          <div style={card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>Platform Revenue</div>
                <div style={{ fontSize:10, color:C.dim }}>8-week trend</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:900, lineHeight:1 }}>${(adminStats.totalRevenue/1000).toFixed(1)}K</div>
                <div style={{ fontSize:10, fontWeight:700, color:revD.positive?C.success:"#f87171" }}>{revD.positive?"+":"-"}{revD.pct}% vs last period</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={PLATFORM_REVENUE} margin={{ top:4, right:0, left:0, bottom:0 }}>
                <defs><linearGradient id="aag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c4687a" stopOpacity={.3}/><stop offset="95%" stopColor="#c4687a" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill="url(#aag)" strokeWidth={2} dot={false}/>
                <XAxis dataKey="week" tick={{ fill:"#6e5a66", fontSize:10 }} tickLine={false} axisLine={false}/>
                <Tooltip formatter={(v)=>[`$${Number(v).toLocaleString()}`,""]} contentStyle={{ background:"#161113", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, fontSize:11 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut */}
          <div style={card}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>Progress Overview</div>
            <div style={{ fontSize:10, color:C.dim, marginBottom:12 }}>Client journey health</div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE} cx="50%" cy="50%" innerRadius={36} outerRadius={52} dataKey="value" strokeWidth={0}>
                      {PIE.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:18, fontWeight:900, lineHeight:1 }}>72%</div>
                  <div style={{ fontSize:9, color:C.dim }}>Avg</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {PIE.map(d=>(
                  <div key={d.name} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:C.muted }}>{d.name}</div>
                      <div style={{ fontSize:11, fontWeight:700 }}>{d.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div style={card}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Recent Activity</div>
            {adminStats.recentActivity.slice(0,5).map((a,i)=>(
              <div key={i} style={{ display:"flex", gap:9, marginBottom:9 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:4 }}/>
                <div>
                  <div style={{ fontSize:11.5, fontWeight:500 }}>{a.text}</div>
                  <div style={{ fontSize:10, color:C.dim }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments bar + top plans + mentee table */}
        <div style={{ display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:12 }}>
          {/* Bar chart */}
          <div style={card}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>Appointments This Week</div>
            <div style={{ fontSize:10, color:C.dim, marginBottom:12 }}>By day of week</div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={WEEKLY} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                <Bar dataKey="count" fill="#c4687a" radius={[4,4,0,0]}/>
                <XAxis dataKey="day" tick={{ fill:"#6e5a66", fontSize:10 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill:"#6e5a66", fontSize:10 }} tickLine={false} axisLine={false}/>
                <Tooltip formatter={(v)=>[v,"Appointments"]} contentStyle={{ background:"#161113", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, fontSize:11 }}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top plans */}
          <div style={card}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Top Performing Plans</div>
            {TOP_PLANS.map(p=>(
              <div key={p.name} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>{p.name}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:C.accent }}>{p.pct}%</span>
                </div>
                <PBar value={p.pct}/>
              </div>
            ))}
            <div style={{ marginTop:4, fontSize:13, fontWeight:700, marginBottom:10 }}>User Breakdown</div>
            {[{ label:"Mentors", val:adminStats.totalMentors, color:"#c4687a" }, { label:"Mentees", val:adminStats.totalMentees, color:"#a78bfa" }, { label:"Clients", val:adminStats.totalClients, color:"#34d399" }].map(s=>(
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:C.muted }}>{s.label}</span>
                <span style={{ fontSize:12, fontWeight:800, color:s.color }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mentee performance */}
        <div style={card}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>Mentee Performance</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {allMentees.map(m=>{
              const revD = delta(m.revenue, m.revenuePrev);
              const goalPct = Math.round((m.revenue/m.goal)*100);
              return (
                <div key={m.id} style={{ background:"#0c0a0b", border:"1px solid rgba(255,255,255,.05)", borderRadius:12, padding:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.accent},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", flexShrink:0 }}>{m.initials}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700 }}>{m.name}</div>
                      <div style={{ fontSize:10, color:C.dim }}>{m.market}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:800, color:revD.positive?C.success:"#f87171" }}>{revD.positive?"+":"-"}{revD.pct}%</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:10, color:C.dim }}>Revenue to goal</span>
                    <span style={{ fontSize:11, fontWeight:700, color:C.accent }}>{goalPct}%</span>
                  </div>
                  <PBar value={goalPct}/>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginTop:10 }}>
                    {[{ l:"Clients", v:m.activeClients }, { l:"Bookings", v:m.bookings }, { l:"Health", v:m.businessHealth }].map(s=>(
                      <div key={s.l} style={{ textAlign:"center", background:"rgba(255,255,255,.03)", borderRadius:8, padding:"6px 4px" }}>
                        <div style={{ fontSize:14, fontWeight:900 }}>{s.v}</div>
                        <div style={{ fontSize:9, color:C.dim }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
