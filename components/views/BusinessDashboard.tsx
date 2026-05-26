"use client";
import { useState, CSSProperties } from "react";
import {
  Bell, CalendarDays, Camera, CheckCircle2, Crown, ExternalLink, FileText,
  MessageCircle, Package, Plus, Sparkles, Target, TrendingUp, UserPlus,
  Users, WalletCards, CheckSquare, Square, Clock,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { menteeKia, mentorClients, allMentees, Client, computeProgress, delta, journeyDays, lowestFactor } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399" } as const;
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14 };

const AV_COLORS = ["#c4687a","#a78bfa","#34d399","#d4956a","#60a5fa"];
function avColor(n:string){ return AV_COLORS[n.charCodeAt(0)%AV_COLORS.length]; }
function ini(n:string){ return n.split(" ").map(x=>x[0]).join("").slice(0,2); }

function Avatar({ name, size=28 }:{ name:string; size?:number }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:avColor(name), display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontWeight:800, color:"#fff", flexShrink:0 }}>{ini(name)}</div>;
}

function PBar({ value }:{ value:number }) {
  return <div style={{ height:3, background:"rgba(255,255,255,.07)", borderRadius:2, overflow:"hidden" }}><div style={{ height:3, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:2 }}/></div>;
}

function KPI({ icon:Icon, label, value, current, prev, iconBg="rgba(196,104,122,.12)", iconColor="#c4687a" }:{ icon:React.ElementType; label:string; value:string; current?:number; prev?:number; iconBg?:string; iconColor?:string }) {
  const d = current!==undefined && prev!==undefined ? delta(current,prev) : null;
  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", color:iconColor, flexShrink:0 }}><Icon size={15}/></div>
        {d && <span style={{ fontSize:10, color:d.positive?C.success:"#f87171", fontWeight:700 }}>{d.positive?"+":"-"}{d.pct}%</span>}
      </div>
      <div style={{ fontSize:22, fontWeight:900, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:C.dim, marginTop:3 }}>{label}</div>
    </div>
  );
}

const ACTION_BTNS:Record<string,string> = { "Photo due":"Check-in","Needs review":"Consult","Plan completed":"Follow-up","Updated today":"Review","Intake pending":"Intake" };

function TodaysSchedule({ clients, selected, onSelect }:{ clients:Client[]; selected:Client|null; onSelect:(c:Client)=>void }) {
  const TIMES = ["10:00 AM","1:30 PM","4:00 PM","5:30 PM"];
  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700 }}>Today's Schedule</span>
        <span style={{ fontSize:11, color:C.accent, cursor:"pointer" }}>View full calendar →</span>
      </div>
      {clients.slice(0,4).map((c,i)=>(
        <div key={c.id} onClick={()=>onSelect(c)} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 7px", borderRadius:9, cursor:"pointer", background:selected?.id===c.id?"rgba(196,104,122,.08)":"transparent", border:selected?.id===c.id?"1px solid rgba(196,104,122,.18)":"1px solid transparent", marginBottom:3 }}>
          <span style={{ width:54, fontSize:10.5, color:C.dim, flexShrink:0 }}>{TIMES[i]}</span>
          <Avatar name={c.name} size={28}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</div>
            <div style={{ fontSize:10, color:C.dim, whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>{c.service}</div>
          </div>
          <button style={{ background:"rgba(196,104,122,.13)", border:"none", borderRadius:6, padding:"3px 9px", fontSize:10, fontWeight:700, color:"#e8909e", cursor:"pointer", flexShrink:0 }}>
            {ACTION_BTNS[c.status]??"View"}
          </button>
        </div>
      ))}
    </div>
  );
}

function ClientActivity({ clients, selected, onSelect }:{ clients:Client[]; selected:Client|null; onSelect:(c:Client)=>void }) {
  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700 }}>Recent Client Activity</span>
        <span style={{ fontSize:11, color:C.accent, cursor:"pointer" }}>View all</span>
      </div>
      {clients.map(c=>{
        const p = computeProgress(c.progressFactors);
        return (
          <div key={c.id} onClick={()=>onSelect(c)} style={{ cursor:"pointer", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
              <Avatar name={c.name} size={28}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600 }}>{c.name}</div>
                <div style={{ fontSize:10, color:C.dim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{c.service}</div>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:C.accent, flexShrink:0 }}>{p}%</span>
            </div>
            <PBar value={p}/>
          </div>
        );
      })}
    </div>
  );
}

function QuickActions({ openModal }:{ openModal:ModalOpener }) {
  const actions = [
    { label:"Send Message",   Icon:MessageCircle, bg:"rgba(196,104,122,.12)",  color:"#c4687a" },
    { label:"Upload Photo",   Icon:Camera,        bg:"rgba(167,139,250,.12)",  color:"#a78bfa" },
    { label:"Create Plan",    Icon:FileText,      bg:"rgba(96,165,250,.12)",   color:"#60a5fa" },
    { label:"Add Task",       Icon:Plus,          bg:"rgba(52,211,153,.1)",    color:"#34d399" },
    { label:"Schedule Appt.", Icon:CalendarDays,  bg:"rgba(212,149,106,.12)",  color:"#d4956a" },
    { label:"Resources",      Icon:Package,       bg:"rgba(251,146,60,.1)",    color:"#fb923c" },
  ];
  return (
    <div style={card}>
      <div style={{ marginBottom:12 }}><span style={{ fontSize:13, fontWeight:700 }}>Quick Actions</span></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
        {actions.map(({ label, Icon, bg, color })=>(
          <button key={label} onClick={()=>openModal({ title:label, content:<p style={{ color:C.muted, fontSize:13 }}>Connects to Supabase.</p> })} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"10px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer" }}>
            <div style={{ width:32, height:32, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", color }}><Icon size={16}/></div>
            <span style={{ fontSize:10, fontWeight:600, color:C.muted, textAlign:"center" as const, lineHeight:1.2 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Mentor right panel — mentee overview ──────────────────────────────────────
function MentorRightPanel({ onSelectMentee }:{ onSelectMentee:()=>void }) {
  return (
    <div style={{ overflowY:"auto", height:"100%", padding:14, display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ marginBottom:2 }}>
        <p style={{ fontSize:13, fontWeight:800, margin:0 }}>Mentee Overview</p>
        <p style={{ fontSize:11, color:C.dim, margin:"2px 0 0" }}>Quick status on your mentees</p>
      </div>
      {allMentees.map(m=>{
        const rd = delta(m.revenue, m.revenuePrev);
        const STATUS_COLOR:Record<string,{bg:string;fg:string}> = { "On track":{bg:"rgba(52,211,153,.12)",fg:"#34d399"}, "Needs focus":{bg:"rgba(212,149,106,.12)",fg:"#d4956a"}, "Getting started":{bg:"rgba(167,139,250,.12)",fg:"#a78bfa"} };
        const sc = STATUS_COLOR[m.status]||{bg:"rgba(255,255,255,.07)",fg:C.muted};
        return (
          <div key={m.id} style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${C.accent},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", flexShrink:0 }}>{m.initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12.5, fontWeight:700, margin:0 }}>{m.name}</p>
                <p style={{ fontSize:10, color:C.dim, margin:0 }}>{m.market}</p>
              </div>
              <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20, background:sc.bg, color:sc.fg, flexShrink:0 }}>{m.status}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:8 }}>
              {[{ l:"Revenue", v:`$${(m.revenue/1000).toFixed(1)}K`, d:`${rd.positive?"+":"-"}${rd.pct}%`, dc:rd.positive?C.success:"#f87171" }, { l:"Clients", v:String(m.activeClients), d:`+${m.activeClients-m.activeClientsPrev}`, dc:C.success }, { l:"Health", v:String(m.businessHealth), d:"/100", dc:C.dim }].map(s=>(
                <div key={s.l} style={{ background:"#0c0a0b", borderRadius:8, padding:"7px 6px", textAlign:"center" as const }}>
                  <p style={{ fontSize:14, fontWeight:900, lineHeight:1, margin:0 }}>{s.v}</p>
                  <p style={{ fontSize:9, color:s.dc, fontWeight:700, margin:"2px 0 0" }}>{s.d}</p>
                  <p style={{ fontSize:9, color:C.dim, margin:0 }}>{s.l}</p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={32}>
              <AreaChart data={m.weeklyData} margin={{ top:0, right:0, left:0, bottom:0 }}>
                <defs><linearGradient id={`mrg-${m.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c4687a" stopOpacity={.3}/><stop offset="95%" stopColor="#c4687a" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill={`url(#mrg-${m.id})`} strokeWidth={1.5} dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
              <span style={{ fontSize:10, color:C.dim }}>Next: {m.nextSession}</span>
              <button onClick={onSelectMentee} style={{ background:C.accent, border:"none", borderRadius:7, padding:"4px 9px", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer" }}>View →</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Mentee right panel — coaching status ──────────────────────────────────────
function MenteeRightPanel() {
  const ME = menteeKia;
  const revD = delta(ME.revenue, ME.revenuePrev);
  const goalPct = Math.round((ME.revenue / ME.goal) * 100);
  return (
    <div style={{ overflowY:"auto", height:"100%", padding:14, display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ marginBottom:2 }}>
        <p style={{ fontSize:13, fontWeight:800, margin:0 }}>My Coaching</p>
        <p style={{ fontSize:11, color:C.dim, margin:"2px 0 0" }}>From your mentor</p>
      </div>

      {/* Revenue to goal */}
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 8px" }}>Revenue Goal</p>
        <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}>
          <span style={{ fontSize:22, fontWeight:900, lineHeight:1 }}>${ME.revenue.toLocaleString()}</span>
          <span style={{ fontSize:11, color:revD.positive?C.success:"#f87171", fontWeight:700 }}>{revD.positive?"+":"-"}{revD.pct}%</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.dim, marginBottom:5 }}>
          <span>Goal: ${ME.goal.toLocaleString()}</span><span style={{ fontWeight:700, color:C.accent }}>{goalPct}%</span>
        </div>
        <PBar value={goalPct}/>
        <ResponsiveContainer width="100%" height={40} style={{ marginTop:8 }}>
          <AreaChart data={ME.weeklyData} margin={{ top:2, right:0, left:0, bottom:0 }}>
            <defs><linearGradient id="mrp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c4687a" stopOpacity={.3}/><stop offset="95%" stopColor="#c4687a" stopOpacity={0}/></linearGradient></defs>
            <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill="url(#mrp)" strokeWidth={1.5} dot={false}/>
            <XAxis dataKey="week" hide/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Next coaching session */}
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 8px" }}>Next Session</p>
        {ME.coachingSessions.filter(s=>s.status==="upcoming").slice(0,1).map(s=>(
          <div key={s.id}>
            <p style={{ fontSize:13, fontWeight:700, margin:"0 0 2px" }}>{s.topic}</p>
            <p style={{ fontSize:11, color:C.dim, margin:"0 0 8px" }}>{s.date}</p>
            <div style={{ background:"rgba(196,104,122,.08)", border:"1px solid rgba(196,104,122,.2)", borderRadius:8, padding:"8px 10px" }}>
              <p style={{ fontSize:11, color:"#e8909e", fontWeight:600, margin:0 }}>Prepare: review your P&L, post metrics, and client retention numbers before this session.</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action items from mentor */}
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 10px" }}>Mentor Action Items</p>
        {ME.actionItems.filter(a=>a.source==="mentor").map(a=>(
          <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
            {a.status==="done" ? <CheckSquare size={13} style={{ color:C.success, flexShrink:0, marginTop:1 }}/> : <Square size={13} style={{ color:C.dim, flexShrink:0, marginTop:1 }}/>}
            <div style={{ flex:1 }}>
              <p style={{ fontSize:11.5, fontWeight:600, margin:"0 0 1px", color:a.status==="done"?C.dim:C.text }}>{a.title}</p>
              <p style={{ fontSize:10, color:C.dim, margin:0 }}>Due {a.dueDate}</p>
            </div>
            <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:20, background:a.priority==="high"?"rgba(248,113,113,.15)":a.priority==="medium"?"rgba(212,149,106,.15)":"rgba(52,211,153,.1)", color:a.priority==="high"?"#f87171":a.priority==="medium"?C.gold:C.success, flexShrink:0 }}>{a.priority}</span>
          </div>
        ))}
      </div>

      {/* Business goals */}
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 10px" }}>Business Goals</p>
        {ME.goals.map(g=>(
          <div key={g.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:11, fontWeight:600 }}>{g.title}</span>
              <span style={{ fontSize:11, fontWeight:700, color:C.accent }}>{g.progress}%</span>
            </div>
            <PBar value={g.progress}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Client detail (for right panel when clicking a client in schedule/activity) ──
function ClientDetailPanel({ client }:{ client:Client }) {
  const overall = computeProgress(client.progressFactors);
  const days = journeyDays(client.locStartDate);
  return (
    <div style={{ overflowY:"auto", height:"100%", padding:14, display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:12, borderBottom:`1px solid rgba(255,255,255,.06)` }}>
        <Avatar name={client.name} size={40}/>
        <div>
          <p style={{ fontSize:14, fontWeight:800, margin:0 }}>{client.name}</p>
          <p style={{ fontSize:11, color:C.dim, margin:"2px 0 0" }}>{client.locPhase} · {days}d</p>
        </div>
      </div>
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}>
          <span style={{ fontSize:26, fontWeight:900, lineHeight:1 }}>{overall}%</span>
          <span style={{ fontSize:11, color:C.success, fontWeight:700 }}>↑ 8%</span>
        </div>
        <p style={{ fontSize:11, color:C.dim, margin:"0 0 8px" }}>Journey progress score</p>
        <PBar value={overall}/>
      </div>
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 6px" }}>Next Appointment</p>
        <p style={{ fontSize:13, fontWeight:700, margin:0 }}>May 28, 2025 · 10:00 AM</p>
        <p style={{ fontSize:11, color:C.dim, margin:"2px 0 0" }}>{client.service}</p>
      </div>
      <div style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:12, padding:12 }}>
        <p style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 10px" }}>Timeline</p>
        {client.timeline.slice(0,3).map(t=>(
          <div key={t.id} style={{ display:"flex", gap:9, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:4 }}/>
            <div>
              <p style={{ fontSize:10, color:C.accent, fontWeight:600, margin:"0 0 1px" }}>{t.date}</p>
              <p style={{ fontSize:11.5, fontWeight:600, margin:0 }}>{t.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Invite client modal ───────────────────────────────────────────────────────
export function InviteClientModal({ mentorId }:{ mentorId:string }) {
  const [email, setEmail] = useState(""); const [link, setLink] = useState(""); const [loading, setLoading] = useState(false); const [copied, setCopied] = useState(false); const [err, setErr] = useState("");
  async function generate() {
    setLoading(true); setErr(""); setLink("");
    const { supabase } = await import("@/lib/supabaseClient");
    const { data, error } = await supabase.from("client_invites").insert({ invited_by:mentorId, email:email||null }).select("token").single();
    if (error||!data) { setErr("Could not generate link."); setLoading(false); return; }
    setLink(`${window.location.origin}/join?token=${data.token}`);
    setLoading(false);
  }
  async function copy() { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  return (
    <div>
      <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Enter the client's email (optional), generate a unique link, and share via text or DM. They'll create their account linked to you.</p>
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:600, color:C.muted }}>Client email (optional)</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="client@example.com" style={{ width:"100%", background:"#0c0a0b", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"11px 14px", fontSize:14, color:C.text, outline:"none", marginTop:6 }}/>
      </div>
      {err && <p style={{ fontSize:13, color:"#f87171", marginBottom:12 }}>{err}</p>}
      {!link
        ? <button onClick={generate} disabled={loading} style={{ width:"100%", background:loading?"rgba(196,104,122,.5)":C.accent, border:"none", borderRadius:10, padding:"11px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:loading?"not-allowed":"pointer" }}>{loading?"Generating…":"Generate invite link"}</button>
        : <>
            <div style={{ background:"#0c0a0b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"10px 14px", fontSize:12, color:C.muted, wordBreak:"break-all" as const, marginBottom:10 }}>{link}</div>
            <button onClick={copy} style={{ width:"100%", background:copied?"#34d399":C.accent, border:"none", borderRadius:10, padding:"11px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", transition:"background .2s" }}>{copied?"✓ Copied!":"Copy link"}</button>
            <p style={{ textAlign:"center" as const, fontSize:12, color:C.dim, marginTop:10 }}>Expires in 7 days · single use</p>
            <button onClick={()=>setLink("")} style={{ width:"100%", background:"transparent", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"9px 0", fontSize:12, fontWeight:600, color:C.dim, cursor:"pointer", marginTop:6 }}>Generate another</button>
          </>
      }
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BusinessDashboard({ openModal, role="mentor" }:{ openModal:ModalOpener; role?:"mentor"|"mentee" }) {
  const { user, profile } = useAuth();
  const isMentor = role === "mentor";
  const clients  = isMentor ? mentorClients : menteeKia.clients;
  const firstName = profile?.full_name?.split(" ")[0] ?? (isMentor?"Steph":"Kia");
  const [selected, setSelected] = useState<Client|null>(clients[0]);

  // KPIs differ by role
  const kpis = isMentor
    ? [
        { icon:Users,        label:"My Active Clients",   value:"24",    current:24,    prev:21    },
        { icon:CalendarDays, label:"Appointments Today",  value:"6",     current:6,     prev:4     },
        { icon:WalletCards,  label:"Monthly Revenue",     value:"$6.8K", current:6800,  prev:6100  },
        { icon:Crown,        label:"Active Mentees",      value:"3",     iconBg:"rgba(167,139,250,.12)", iconColor:"#a78bfa" },
      ]
    : [
        { icon:Users,        label:"My Clients",          value:String(menteeKia.activeClients), current:menteeKia.activeClients, prev:menteeKia.activeClientsPrev },
        { icon:WalletCards,  label:"Monthly Revenue",     value:`$${(menteeKia.revenue/1000).toFixed(1)}K`, current:menteeKia.revenue, prev:menteeKia.revenuePrev },
        { icon:CalendarDays, label:"Bookings",            value:String(menteeKia.bookings), current:menteeKia.bookings, prev:menteeKia.bookingsPrev },
        { icon:Target,       label:"Goal Progress",       value:`${Math.round((menteeKia.revenue/menteeKia.goal)*100)}%`, iconBg:"rgba(52,211,153,.1)", iconColor:"#34d399" },
      ];

  return (
    <div style={{ display:"flex", height:"100%", minHeight:0 }}>
      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        {/* Header */}
        <div style={{ padding:"12px 18px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <h1 style={{ fontSize:16, fontWeight:800, margin:0 }}>
              {isMentor ? `Welcome back, ${firstName}! ✨` : `Hey ${firstName}, let's build that business 💼`}
            </h1>
            <p style={{ fontSize:11, color:C.dim, margin:"2px 0 0" }}>
              {isMentor ? "Here's what's happening with your clients today." : `You're at ${Math.round((menteeKia.revenue/menteeKia.goal)*100)}% of your monthly goal. Keep pushing.`}
            </p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>openModal({ title:"Invite Client", subtitle:"Generate a link to send to your client", content:<InviteClientModal mentorId={user?.id??""}/> })} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(196,104,122,.13)", color:"#e8909e", border:"1px solid rgba(196,104,122,.25)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <UserPlus size={13}/> Invite Client
            </button>
            <button onClick={()=>openModal({ title:"Add Client", content:<p style={{ color:C.muted }}>New client form connects to Supabase.</p> })} style={{ display:"flex", alignItems:"center", gap:5, background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <Plus size={13}/> Add Client
            </button>
            <button style={{ position:"relative", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"6px", cursor:"pointer", color:C.muted, display:"flex" }}>
              <Bell size={16}/>
              <span style={{ position:"absolute", top:-4, right:-4, background:C.accent, color:"#fff", borderRadius:"50%", width:14, height:14, fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>3</span>
            </button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>
          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {kpis.map(k=><KPI key={k.label} {...k}/>)}
          </div>
          {/* 3 panels */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            <TodaysSchedule clients={clients} selected={selected} onSelect={setSelected}/>
            <ClientActivity clients={clients} selected={selected} onSelect={setSelected}/>
            <QuickActions openModal={openModal}/>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width:262, borderLeft:"1px solid rgba(255,255,255,.06)", flexShrink:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {/* Panel header */}
        <div style={{ padding:"12px 14px", borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
          <p style={{ fontSize:12, fontWeight:800, margin:0 }}>
            {isMentor ? (selected ? selected.name : "Mentee Overview") : "My Coaching Progress"}
          </p>
          {isMentor && selected && (
            <button onClick={()=>setSelected(null)} style={{ fontSize:10, color:C.accent, background:"none", border:"none", padding:0, cursor:"pointer", marginTop:2 }}>
              ← Mentee overview
            </button>
          )}
        </div>
        {/* Panel body */}
        <div style={{ flex:1, minHeight:0 }}>
          {isMentor
            ? (selected
                ? <ClientDetailPanel client={selected}/>
                : <MentorRightPanel onSelectMentee={()=>{}}/>)
            : <MenteeRightPanel/>
          }
        </div>
      </div>
    </div>
  );
}
