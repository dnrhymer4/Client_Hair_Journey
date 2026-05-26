"use client";
import { useState, CSSProperties } from "react";
import { Bell, CalendarDays, Camera, CheckCircle2, FileText, MessageCircle, Package, Plus, Users, WalletCards, ClipboardList, TrendingUp, ExternalLink, UserPlus } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { menteeKia, mentorClients, Client, computeProgress, delta, journeyDays, lowestFactor } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399" } as const;
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14 };

const AV_COLORS = ["#c4687a","#a78bfa","#34d399","#d4956a","#60a5fa"];
function avColor(name: string){ return AV_COLORS[name.charCodeAt(0) % AV_COLORS.length]; }
function initials(name: string){ return name.split(" ").map(n=>n[0]).join("").slice(0,2); }

function Avatar({ name, size=28 }: { name:string; size?:number }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:avColor(name), display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:800, color:"#fff", flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}

function ProgressBar({ value, height=3 }: { value:number; height?:number }) {
  return (
    <div style={{ height, background:"rgba(255,255,255,.07)", borderRadius:height/2, overflow:"hidden" }}>
      <div style={{ height, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:height/2 }} />
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta: d, deltaColor="#34d399", iconBg="rgba(196,104,122,.12)", iconColor="#c4687a" }: { icon:React.ElementType; label:string; value:string; delta?:string; deltaColor?:string; iconBg?:string; iconColor?:string }) {
  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", color:iconColor, flexShrink:0 }}>
          <Icon size={16} />
        </div>
        {d && <span style={{ fontSize:10, color:deltaColor, fontWeight:700 }}>{d}</span>}
      </div>
      <div style={{ fontSize:22, fontWeight:900, color:C.text, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:C.dim, marginTop:3 }}>{label}</div>
    </div>
  );
}

const ACTION_BTNS: Record<string, string> = { "Photo due":"Check-in","Needs review":"Consult","Plan completed":"Follow-up","Updated today":"Review","Intake pending":"Intake" };

function TodaysSchedule({ clients, selected, onSelect }: { clients:Client[]; selected:Client|null; onSelect:(c:Client)=>void }) {
  const TIMES = ["10:00 AM","1:30 PM","4:00 PM","5:30 PM","6:00 PM"];
  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700 }}>Today's Schedule</span>
        <span style={{ fontSize:11, color:C.accent, cursor:"pointer" }}>View full calendar →</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
        {clients.slice(0,4).map((c,i) => {
          const isSel = selected?.id === c.id;
          return (
            <div key={c.id} onClick={()=>onSelect(c)} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 7px", borderRadius:9, cursor:"pointer", background: isSel ? "rgba(196,104,122,.08)" : "transparent", border: isSel ? "1px solid rgba(196,104,122,.18)" : "1px solid transparent", transition:"all .1s" }}>
              <span style={{ width:54, fontSize:10.5, color:C.dim, flexShrink:0 }}>{TIMES[i]}</span>
              <Avatar name={c.name} size={28} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</div>
                <div style={{ fontSize:10, color:C.dim, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.service}</div>
              </div>
              <button style={{ background:"rgba(196,104,122,.13)", border:"none", borderRadius:6, padding:"3px 9px", fontSize:10, fontWeight:700, color:"#e8909e", cursor:"pointer", flexShrink:0 }}>
                {ACTION_BTNS[c.status] ?? "View"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClientActivity({ clients, selected, onSelect }: { clients:Client[]; selected:Client|null; onSelect:(c:Client)=>void }) {
  return (
    <div style={card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700 }}>Recent Client Activity</span>
        <span style={{ fontSize:11, color:C.accent, cursor:"pointer" }}>View all</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {clients.map(c => {
          const p = computeProgress(c.progressFactors);
          return (
            <div key={c.id} onClick={()=>onSelect(c)} style={{ cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <Avatar name={c.name} size={28} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{c.name}</div>
                  <div style={{ fontSize:10, color:C.dim, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.service}</div>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:C.accent, flexShrink:0 }}>{p}%</span>
              </div>
              <ProgressBar value={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickActions({ openModal }: { openModal:ModalOpener }) {
  const actions = [
    { label:"Send Message",    icon:MessageCircle, bg:"rgba(196,104,122,.12)",   color:"#c4687a"  },
    { label:"Upload Photo",    icon:Camera,        bg:"rgba(167,139,250,.12)",   color:"#a78bfa"  },
    { label:"Create Plan",     icon:FileText,      bg:"rgba(96,165,250,.12)",    color:"#60a5fa"  },
    { label:"Add Task",        icon:Plus,          bg:"rgba(52,211,153,.1)",     color:"#34d399"  },
    { label:"Schedule Appt.",  icon:CalendarDays,  bg:"rgba(212,149,106,.12)",   color:"#d4956a"  },
    { label:"Resources",       icon:Package,       bg:"rgba(251,146,60,.1)",     color:"#fb923c"  },
  ];
  return (
    <div style={card}>
      <div style={{ marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700 }}>Quick Actions</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
        {actions.map(({ label, icon: Icon, bg, color }) => (
          <button key={label} onClick={()=>openModal({ title:label, content:<p style={{ color:C.muted, fontSize:13 }}>This action will connect to Supabase once the database is wired up.</p> })} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"10px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer" }}>
            <div style={{ width:32, height:32, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", color }}>
              <Icon size={16} />
            </div>
            <span style={{ fontSize:10, fontWeight:600, color:C.muted, textAlign:"center", lineHeight:1.2 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ClientDetailPanel({ client }: { client:Client }) {
  const overall = computeProgress(client.progressFactors);
  const days = journeyDays(client.locStartDate);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10, padding:14, overflowY:"auto", height:"100%" }}>
      {/* Progress */}
      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:13, fontWeight:700 }}>Your Progress Overview</span>
          <span style={{ fontSize:10, color:C.accent, cursor:"pointer" }}>View all</span>
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
          <span style={{ fontSize:28, fontWeight:900, lineHeight:1 }}>{overall}%</span>
          <span style={{ fontSize:10.5, color:C.success, fontWeight:700 }}>↑ 8%</span>
        </div>
        <div style={{ fontSize:10.5, color:C.dim, marginBottom:8 }}>Overall Progress</div>
        <ResponsiveContainer width="100%" height={52}>
          <AreaChart data={menteeKia.weeklyData} margin={{ top:2, right:0, left:0, bottom:0 }}>
            <defs>
              <linearGradient id="rpg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c4687a" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#c4687a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill="url(#rpg)" strokeWidth={1.5} dot={false} />
            <XAxis dataKey="week" hide />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]} contentStyle={{ background:"#161113", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, fontSize:10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Next appointment */}
      <div style={card}>
        <div style={{ fontSize:10, color:C.dim, marginBottom:4, fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>Next Appointment</div>
        <div style={{ fontSize:13, fontWeight:700 }}>May 28, 2025</div>
        <div style={{ fontSize:11, color:C.accent }}>10:00 AM</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{client.service}</div>
        <a href={menteeKia.bookingUrl} target="_blank" rel="noreferrer" style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:6, width:"100%", marginTop:9, background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"7px 0", fontSize:11, fontWeight:700, textDecoration:"none", cursor:"pointer" }}>
          View Details <ExternalLink size={11} />
        </a>
      </div>

      {/* Timeline */}
      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:700 }}>Journey Timeline</span>
          <span style={{ fontSize:10, color:C.accent, cursor:"pointer" }}>View full timeline</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {client.timeline.slice(0,4).map(t => (
            <div key={t.id} style={{ display:"flex", gap:9 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:4 }} />
              <div>
                <div style={{ fontSize:10, color:C.accent, fontWeight:600 }}>{t.date}</div>
                <div style={{ fontSize:11.5, fontWeight:600 }}>{t.title}</div>
                <div style={{ fontSize:10, color:C.dim }}>{t.body.slice(0,50)}{t.body.length>50?"…":""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div style={card}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>Your Plan</div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {client.carePlan.slice(0,4).map(c => (
            <div key={c.id} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:5 }} />
              <div>
                <div style={{ fontSize:12, fontWeight:600 }}>{c.category}</div>
                <div style={{ fontSize:10, color:C.dim }}>{c.frequency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BusinessDashboard({ openModal, role="mentor" }: { openModal:ModalOpener; role?:"mentor"|"mentee" }) {
  const { user, profile } = useAuth();
  const clients = role==="mentor" ? mentorClients : menteeKia.clients;
  const name = profile?.full_name?.split(" ")[0] ?? (role==="mentor" ? "Steph" : "Kia");
  const [selected, setSelected] = useState<Client|null>(clients[0]);

  return (
    <div style={{ display:"flex", height:"100%", minHeight:"100vh", overflow:"hidden" }}>
      {/* Main scrollable */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0c0a0b", flexShrink:0, position:"sticky", top:0, zIndex:10 }}>
          <div>
            <h1 style={{ fontSize:17, fontWeight:800, color:C.text, margin:0 }}>Welcome back, {name}! ✨</h1>
            <p style={{ fontSize:11.5, color:C.dim, margin:"2px 0 0" }}>Here's what's happening with your clients today.</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>openModal({ title:"Add Client", content:<p style={{ color:C.muted, fontSize:13 }}>New client form — connects to Supabase.</p> })} style={{ display:"flex", alignItems:"center", gap:5, background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <Plus size={13} /> Add Client
            </button>
            <button onClick={()=>openModal({ title:"Invite Client", subtitle:"Generate a link to send to your client", content:<InviteClientModal mentorId={user?.id ?? ""} /> })} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(196,104,122,.13)", color:"#e8909e", border:"1px solid rgba(196,104,122,.25)", borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              <UserPlus size={13} /> Invite Client
            </button>
            <button style={{ position:"relative", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"7px", cursor:"pointer", color:C.muted, display:"flex" }}>
              <Bell size={16} />
              <span style={{ position:"absolute", top:-5, right:-5, background:C.accent, color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>3</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            <KPI icon={Users}       label="Active Clients"    value={String(role==="mentor"?24:menteeKia.activeClients)} delta="↑ 12% vs last month" />
            <KPI icon={CalendarDays} label="Appointments Today" value={role==="mentor"?"6":"8"}                         delta="↑ 4 more today" />
            <KPI icon={ClipboardList} label="Tasks Due"        value="14" delta="This week" deltaColor={C.gold} iconBg="rgba(212,149,106,.12)" iconColor={C.gold} />
            <KPI icon={TrendingUp}  label="Avg. Progress"      value="87%" delta="Across clients" deltaColor={C.success} iconBg="rgba(52,211,153,.1)" iconColor={C.success} />
          </div>

          {/* 3 panels */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            <TodaysSchedule clients={clients} selected={selected} onSelect={setSelected} />
            <ClientActivity clients={clients} selected={selected} onSelect={setSelected} />
            <QuickActions openModal={openModal} />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width:248, borderLeft:"1px solid rgba(255,255,255,.06)", overflowY:"auto", flexShrink:0 }}>
        {selected
          ? <ClientDetailPanel client={selected} />
          : <div style={{ display:"flex", height:"100%", alignItems:"center", justifyContent:"center", padding:20, textAlign:"center" }}>
              <div>
                <Users size={32} style={{ color:"rgba(255,255,255,.08)", margin:"0 auto 8px" }} />
                <p style={{ fontSize:12, color:C.dim }}>Select a client to view details</p>
              </div>
            </div>
        }
      </div>
    </div>
  );
}

// ── Invite client modal ────────────────────────────────────────────────────────

// ── Invite Client Modal ──────────────────────────────────────────────────────
export function InviteClientModal({ mentorId }: { mentorId: string }) {
  const [email, setEmail]     = useState("");
  const [link, setLink]       = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [err, setErr]         = useState("");

  async function generate() {
    setLoading(true); setErr(""); setLink("");
    const { supabase } = await import("@/lib/supabaseClient");
    const { data, error } = await supabase
      .from("client_invites")
      .insert({ invited_by: mentorId, email: email || null })
      .select("token")
      .single();
    if (error || !data) { setErr("Could not generate link. Try again."); setLoading(false); return; }
    const origin = typeof window !== "undefined" ? window.location.origin : "https://client-hair-journey.vercel.app";
    setLink(`${origin}/join?token=${data.token}`);
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <p style={{ fontSize:13, color:"#9a8690", marginBottom:20 }}>Enter the client's email (optional), generate a unique link, and share it via text, email, or DM. When they open it they'll create their account — automatically linked to you.</p>
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:600, color:"#9a8690" }}>Client email (optional)</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="client@example.com"
          style={{ width:"100%", background:"#0c0a0b", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#f2e8ea", outline:"none", marginTop:6 }} />
      </div>
      {err && <p style={{ fontSize:13, color:"#f87171", marginBottom:12 }}>{err}</p>}
      {!link
        ? <button onClick={generate} disabled={loading} style={{ width:"100%", background:loading?"rgba(196,104,122,.5)":"#c4687a", border:"none", borderRadius:10, padding:"11px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:loading?"not-allowed":"pointer" }}>
            {loading ? "Generating…" : "Generate invite link"}
          </button>
        : <>
            <div style={{ background:"#0c0a0b", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#9a8690", wordBreak:"break-all", marginBottom:10 }}>{link}</div>
            <button onClick={copy} style={{ width:"100%", background:copied?"#34d399":"#c4687a", border:"none", borderRadius:10, padding:"11px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", transition:"background .2s" }}>
              {copied ? "✓ Copied!" : "Copy link"}
            </button>
            <p style={{ textAlign:"center" as const, fontSize:12, color:"#6e5a66", marginTop:10 }}>Link expires in 7 days. Share via text, email, or DM.</p>
            <button onClick={()=>setLink("")} style={{ width:"100%", background:"transparent", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"9px 0", fontSize:12, fontWeight:600, color:"#6e5a66", cursor:"pointer", marginTop:6 }}>
              Generate another link
            </button>
          </>
      }
    </div>
  );
}
