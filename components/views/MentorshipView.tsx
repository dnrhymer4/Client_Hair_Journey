"use client";
import { useState, CSSProperties } from "react";
import { ArrowLeft, CheckSquare, Square, Crown, Sparkles, Target, TrendingUp, Plus, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { allMentees, Mentee, CoachingSession, computeProgress, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const C = { card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399" };
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14 };

const AV_COLORS = ["#c4687a","#a78bfa","#34d399","#d4956a","#60a5fa"];
function avColor(n:string){ return AV_COLORS[n.charCodeAt(0)%AV_COLORS.length]; }
function initials(n:string){ return n.split(" ").map(x=>x[0]).join("").slice(0,2); }

const STATUS_STYLES:Record<string,{ bg:string; color:string }> = {
  "On track":       { bg:"rgba(52,211,153,.12)",  color:"#34d399" },
  "Needs focus":    { bg:"rgba(212,149,106,.12)",  color:"#d4956a" },
  "Getting started":{ bg:"rgba(167,139,250,.12)",  color:"#a78bfa" },
};

function PBar({ value, height=3 }:{ value:number; height?:number }) {
  return (
    <div style={{ height, background:"rgba(255,255,255,.07)", borderRadius:height/2, overflow:"hidden" }}>
      <div style={{ height, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:height/2 }} />
    </div>
  );
}

function StatusBadge({ status }:{ status:string }) {
  const s = STATUS_STYLES[status] || { bg:"rgba(255,255,255,.07)", color:C.muted };
  return <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, background:s.bg, color:s.color, whiteSpace:"nowrap" }}>{status}</span>;
}

function SessionForm({ session }:{ session:CoachingSession }) {
  const [step, setStep] = useState<"prep"|"session"|"followup">("prep");
  const [form, setForm] = useState({ topic:session.topic, agenda:"", wins:"", blockers:"", notes:"", homework:"", nextDate:"" });
  const up = (k:keyof typeof form) => (e:React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const inp: CSSProperties = { width:"100%", background:"#0c0a0b", border:"1px solid rgba(255,255,255,.07)", borderRadius:9, padding:"9px 12px", fontSize:13, color:C.text, outline:"none" };
  const ta: CSSProperties = { ...inp, resize:"none" as const };
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {(["prep","session","followup"] as const).map((s,i)=>(
          <button key={s} onClick={()=>setStep(s)} style={{ padding:"5px 12px", borderRadius:20, border:"none", fontSize:11, fontWeight:700, cursor:"pointer", background:step===s?"#c4687a":"rgba(255,255,255,.06)", color:step===s?"#fff":C.muted }}>
            {["1. Prep","2. Session","3. Follow-up"][i]}
          </button>
        ))}
      </div>
      {step==="prep" && <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.accent, display:"block", marginBottom:5 }}>Topic</label><input value={form.topic} onChange={up("topic")} style={inp} /></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.accent, display:"block", marginBottom:5 }}>Agenda / pre-work notes</label><textarea value={form.agenda} onChange={up("agenda")} rows={4} style={ta} placeholder="What to cover? What should the mentee bring?" /></div>
        <button onClick={()=>setStep("session")} style={{ background:"#c4687a", border:"none", borderRadius:9, padding:"9px 0", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Continue to session →</button>
      </div>}
      {step==="session" && <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div><label style={{ fontSize:11, fontWeight:600, color:"#34d399", display:"block", marginBottom:5 }}>Wins this period</label><textarea value={form.wins} onChange={up("wins")} rows={3} style={ta} placeholder="One per line..." /></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:"#f87171", display:"block", marginBottom:5 }}>Blockers</label><textarea value={form.blockers} onChange={up("blockers")} rows={3} style={ta} placeholder="One per line..." /></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.accent, display:"block", marginBottom:5 }}>Notes</label><textarea value={form.notes} onChange={up("notes")} rows={4} style={ta} /></div>
        <button onClick={()=>setStep("followup")} style={{ background:"#c4687a", border:"none", borderRadius:9, padding:"9px 0", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Continue to follow-up →</button>
      </div>}
      {step==="followup" && <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.gold, display:"block", marginBottom:5 }}>Homework assigned</label><textarea value={form.homework} onChange={up("homework")} rows={4} style={ta} placeholder="One action item per line..." /></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.accent, display:"block", marginBottom:5 }}>Next session date</label><input type="date" value={form.nextDate} onChange={up("nextDate")} style={inp} /></div>
        <button style={{ background:"#c4687a", border:"none", borderRadius:9, padding:"9px 0", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Save session</button>
      </div>}
    </div>
  );
}

function MenteeCard({ mentee, onSelect }:{ mentee:Mentee; onSelect:(m:Mentee)=>void }) {
  const revD = delta(mentee.revenue, mentee.revenuePrev);
  const st = STATUS_STYLES[mentee.status] || { bg:"rgba(255,255,255,.07)", color:C.muted };
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:`linear-gradient(135deg,${C.accent},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", flexShrink:0 }}>{mentee.initials}</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800 }}>{mentee.name}</div>
            <div style={{ fontSize:11, color:C.dim }}>{mentee.businessName} · {mentee.market}</div>
          </div>
        </div>
        <StatusBadge status={mentee.status} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[
          { label:"Revenue", val:`$${(mentee.revenue/1000).toFixed(1)}K`, delta:`${revD.positive?"+":"-"}${revD.pct}%`, dColor:revD.positive?"#34d399":"#f87171" },
          { label:"Clients", val:String(mentee.activeClients), delta:`+${mentee.activeClients-mentee.activeClientsPrev}`, dColor:"#34d399" },
          { label:"Health", val:String(mentee.businessHealth), delta:"/100", dColor:C.dim },
        ].map(s => (
          <div key={s.label} style={{ background:"#0c0a0b", borderRadius:10, padding:"9px 10px", textAlign:"center" }}>
            <div style={{ fontSize:16, fontWeight:900, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:10, color:s.dColor, fontWeight:700, marginTop:2 }}>{s.delta}</div>
            <div style={{ fontSize:9, color:C.dim, marginTop:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize:10, color:C.dim, marginBottom:4 }}>8-week revenue trend</div>
        <ResponsiveContainer width="100%" height={42}>
          <AreaChart data={mentee.weeklyData} margin={{ top:2, right:0, left:0, bottom:0 }}>
            <defs><linearGradient id={`mvg${mentee.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c4687a" stopOpacity={.35}/><stop offset="95%" stopColor="#c4687a" stopOpacity={0}/></linearGradient></defs>
            <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill={`url(#mvg${mentee.id})`} strokeWidth={1.5} dot={false}/>
            <XAxis dataKey="week" hide/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:C.dim }}>Next session: {mentee.nextSession}</span>
        <button onClick={()=>onSelect(mentee)} style={{ display:"flex", alignItems:"center", gap:5, background:C.accent, border:"none", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700, color:"#fff", cursor:"pointer" }}>View dashboard →</button>
      </div>
    </div>
  );
}

function MenteeDetail({ mentee, onBack, openModal }:{ mentee:Mentee; onBack:()=>void; openModal:ModalOpener }) {
  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.accent, fontSize:12, fontWeight:700, cursor:"pointer", marginBottom:14, padding:0 }}>
        ← Back to all mentees
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18, padding:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:14 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg,${C.accent},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff", flexShrink:0 }}>{mentee.initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:17, fontWeight:800 }}>{mentee.name}</span><StatusBadge status={mentee.status} /></div>
          <div style={{ fontSize:12, color:C.dim }}>{mentee.businessName} · {mentee.market}, {mentee.state} · Next session: {mentee.nextSession}</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* Sessions */}
        <div style={card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:700 }}>Coaching Sessions</span>
            <button onClick={()=>openModal({ title:"New Session", content:<SessionForm session={{ id:"", date:"", topic:"", wins:[], blockers:[], homework:[], notes:"", nextSessionDate:"", status:"upcoming" }}/> })} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(196,104,122,.13)", border:"none", borderRadius:7, padding:"4px 9px", fontSize:10, fontWeight:700, color:"#e8909e", cursor:"pointer" }}>
              <Plus size={11}/> New
            </button>
          </div>
          {mentee.coachingSessions.map(s=>(
            <div key={s.id} style={{ marginBottom:10, padding:12, background:"#0c0a0b", borderRadius:11, border:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:700 }}>{s.topic}</div>
                  <div style={{ fontSize:10, color:C.dim }}>{s.date}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              {s.status==="completed" && s.wins.slice(0,2).map(w=><div key={w} style={{ display:"flex", gap:6, fontSize:11, color:C.muted, marginBottom:2 }}><CheckCircle2 size={11} style={{ color:"#34d399", flexShrink:0, marginTop:1 }}/>{w}</div>)}
              {s.status==="upcoming" && <button onClick={()=>openModal({ title:`Session: ${s.topic}`, content:<SessionForm session={s}/> })} style={{ width:"100%", background:"#c4687a", border:"none", borderRadius:8, padding:"7px 0", fontSize:11, fontWeight:700, color:"#fff", cursor:"pointer", marginTop:6 }}>Start session notes</button>}
            </div>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Goals */}
          <div style={card}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Business Goals</div>
            {mentee.goals.map(g=>(
              <div key={g.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:600 }}>{g.title}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:C.accent }}>{g.progress}%</span>
                </div>
                <PBar value={g.progress} height={4}/>
                <div style={{ fontSize:10, color:C.dim, marginTop:3 }}>Target: {g.targetDate}</div>
              </div>
            ))}
          </div>

          {/* Action items */}
          <div style={card}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:10 }}>Action Items</div>
            {mentee.actionItems.map(a=>(
              <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:9 }}>
                {a.status==="done" ? <CheckSquare size={14} style={{ color:"#34d399", flexShrink:0, marginTop:1 }}/> : <Square size={14} style={{ color:C.dim, flexShrink:0, marginTop:1 }}/>}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:a.status==="done"?C.dim:C.text, textDecoration:a.status==="done"?"line-through":"none" }}>{a.title}</div>
                  <div style={{ fontSize:10, color:C.dim }}>Due {a.dueDate}</div>
                </div>
                <span style={{ padding:"2px 7px", borderRadius:20, fontSize:9, fontWeight:700, background:a.priority==="high"?"rgba(248,113,113,.15)":a.priority==="medium"?"rgba(212,149,106,.15)":"rgba(52,211,153,.1)", color:a.priority==="high"?"#f87171":a.priority==="medium"?C.gold:"#34d399", flexShrink:0 }}>{a.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorshipView({ openModal }:{ openModal:ModalOpener }) {
  const [selected, setSelected] = useState<Mentee|null>(null);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
        <h1 style={{ fontSize:17, fontWeight:800, margin:0 }}>Mentorship</h1>
        <p style={{ fontSize:11.5, color:C.dim, margin:"2px 0 0" }}>Coaching and growth — separate from day-to-day client operations</p>
      </div>

      {selected ? (
        <MenteeDetail mentee={selected} onBack={()=>setSelected(null)} openModal={openModal} />
      ) : (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { icon:Crown,      label:"Active Mentees",    val:"3",     color:C.accent },
              { icon:Target,     label:"Avg Goal Progress", val:"58%",   color:C.gold   },
              { icon:TrendingUp, label:"Avg Rev Growth",    val:"+20%",  color:"#34d399"},
            ].map(s=>(
              <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"rgba(196,104,122,.1)", display:"flex", alignItems:"center", justifyContent:"center", color:s.color, flexShrink:0 }}><s.icon size={18}/></div>
                <div>
                  <div style={{ fontSize:20, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:C.dim }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mentee cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {allMentees.map(m=><MenteeCard key={m.id} mentee={m} onSelect={setSelected}/>)}
          </div>

          {/* Upcoming sessions + opportunities */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={card}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Upcoming Coaching Sessions</div>
              {allMentees.flatMap(m=>m.coachingSessions.filter(s=>s.status==="upcoming").map(s=>(
                <div key={s.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:700 }}>{m.name} — {s.topic}</div>
                    <div style={{ fontSize:10, color:C.dim }}>{s.date}</div>
                  </div>
                  <button onClick={()=>setSelected(m)} style={{ background:"#c4687a", border:"none", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700, color:"#fff", cursor:"pointer" }}>Prepare</button>
                </div>
              )))}
            </div>
            <div style={card}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Growth Opportunities</div>
              {[
                { name:"Kia",    tip:"Raise starter loc pricing +$15 — Atlanta avg is $135–$155." },
                { name:"Maya",   tip:"Post 1 repair transformation reel — gets 2.4× more reach than maintenance content." },
                { name:"Destiny",tip:"Build 3-tier service menu to lift avg ticket ~35%." },
              ].map(o=>(
                <div key={o.name} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <Sparkles size={14} style={{ color:C.gold, flexShrink:0, marginTop:2 }}/>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:C.gold }}>{o.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{o.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
