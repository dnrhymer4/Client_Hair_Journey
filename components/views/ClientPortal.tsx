"use client";
import { useState, useRef, CSSProperties } from "react";
import {
  CalendarDays, Camera, CheckCircle2, Clock, Droplets,
  ExternalLink, Lightbulb, PackageCheck, ArrowRight, Sparkles,
} from "lucide-react";
import { menteeKia, computeProgress, journeyDays, lowestFactor } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const CLIENT  = menteeKia.clients[0]; // Layla M.
const STYLIST = menteeKia;
const OVERALL = computeProgress(CLIENT.progressFactors);
const DAYS    = journeyDays(CLIENT.locStartDate);
const LOWEST  = lowestFactor(CLIENT.progressFactors);

const C = {
  bg:"#0c0a0b", card:"#161113", card2:"#1a1318",
  border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a",
  text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399",
};

// ── Shared primitives ─────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", marginBottom:14 }}>{children}</p>;
}

function PBar({ value }: { value: number }) {
  return (
    <div style={{ height:5, background:"rgba(255,255,255,.07)", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:5, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:3, transition:"width .6s ease" }} />
    </div>
  );
}

// ── Circular ring ─────────────────────────────────────────────────────────────
function ProgressRing({ value, size=120 }: { value:number; size?:number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", position:"absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={10}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.accent} strokeWidth={10}
          strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:24, fontWeight:900, color:C.text, lineHeight:1 }}>{value}%</span>
        <span style={{ fontSize:9, color:C.muted, marginTop:2, textTransform:"uppercase" as const, letterSpacing:".1em" }}>Progress</span>
      </div>
    </div>
  );
}

// ── Wash day form ─────────────────────────────────────────────────────────────
function WashDayForm({ onClose }: { onClose?: ()=>void }) {
  const inp: CSSProperties = { width:"100%", background:"#0c0a0b", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.text, outline:"none", marginTop:5 };
  const [form, setForm] = useState({ date:"2026-05-24", shampoo:"", conditioner:"", oils:"", dryingMethod:"Air dry", scalpCondition:"Good", buildupLevel:"None", notes:"" });
  const up = (k:keyof typeof form) => (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.muted }}>Date</label><input type="date" value={form.date} onChange={up("date")} style={inp}/></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.muted }}>Shampoo</label><input value={form.shampoo} onChange={up("shampoo")} placeholder="Product name" style={inp}/></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.muted }}>Conditioner</label><input value={form.conditioner} onChange={up("conditioner")} placeholder="Product name" style={inp}/></div>
        <div><label style={{ fontSize:11, fontWeight:600, color:C.muted }}>Oils / moisturizers</label><input value={form.oils} onChange={up("oils")} placeholder="Product name" style={inp}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 12px" }}>
        {[
          { label:"Drying method", key:"dryingMethod", opts:["Air dry","Hooded dryer","Diffuser","Blow dry"] },
          { label:"Scalp condition", key:"scalpCondition", opts:["Good","Dry","Flaky","Itchy"] },
          { label:"Buildup level", key:"buildupLevel", opts:["None","Light","Moderate","Heavy"] },
        ].map(f=>(
          <div key={f.key}><label style={{ fontSize:11, fontWeight:600, color:C.muted }}>{f.label}</label>
            <select value={form[f.key as keyof typeof form]} onChange={up(f.key as keyof typeof form)} style={inp}>
              {f.opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div><label style={{ fontSize:11, fontWeight:600, color:C.muted }}>Notes</label><textarea value={form.notes} onChange={up("notes")} rows={3} placeholder="How did your hair feel? Anything unusual?" style={{ ...inp, resize:"none" as const }}/></div>
      <button style={{ background:C.accent, border:"none", borderRadius:10, padding:"11px 0", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Save wash day</button>
    </div>
  );
}

// ── Progress breakdown ────────────────────────────────────────────────────────
function ProgressBreakdown() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ background:`${C.accent}18`, border:`1px solid ${C.accent}30`, borderRadius:12, padding:"14px 16px" }}>
        <p style={{ fontSize:32, fontWeight:900, margin:0, lineHeight:1 }}>{OVERALL}%</p>
        <p style={{ fontSize:12, color:C.muted, margin:"4px 0 0" }}>Weighted journey score across 5 categories</p>
      </div>
      <div style={{ background:`${C.gold}12`, border:`1px solid ${C.gold}25`, borderRadius:12, padding:"12px 14px", display:"flex", gap:10 }}>
        <Lightbulb size={16} style={{ color:C.gold, flexShrink:0, marginTop:2 }}/>
        <div><p style={{ fontSize:12, fontWeight:700, color:C.gold, margin:0 }}>Lowest: {LOWEST.label} ({LOWEST.score}%)</p><p style={{ fontSize:12, color:C.muted, margin:"3px 0 0" }}>{LOWEST.tip}</p></div>
      </div>
      {CLIENT.progressFactors.map(f=>(
        <div key={f.label} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <div><p style={{ fontSize:13, fontWeight:700, margin:0 }}>{f.label}</p><p style={{ fontSize:11, color:C.muted, margin:"2px 0 0" }}>{f.description}</p></div>
            <div style={{ textAlign:"right" as const, flexShrink:0, marginLeft:12 }}><p style={{ fontSize:14, fontWeight:900, color:C.accent, margin:0 }}>{f.score}%</p><p style={{ fontSize:10, color:C.dim, margin:0 }}>Weight {f.weight}%</p></div>
          </div>
          <PBar value={f.score}/>
        </div>
      ))}
    </div>
  );
}

// ── Photo upload grid ─────────────────────────────────────────────────────────
const PHOTO_LABELS = ["Starter locs", "Budding phase", "Current progress"];
function PhotoGrid() {
  const [urls, setUrls] = useState(["","",""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
      {PHOTO_LABELS.map((label,i)=>(
        <div key={label} className="group" style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden", borderRadius:12, border:`1px dashed rgba(255,255,255,.1)`, background:C.card2, cursor:"pointer" }} onClick={()=>refs[i].current?.click()}>
          {urls[i]
            ? <img src={urls[i]} alt={label} style={{ width:"100%", height:"100%", objectFit:"cover" as const }}/>
            : <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:`${C.accent}18`, display:"flex", alignItems:"center", justifyContent:"center" }}><Camera size={18} style={{ color:C.accent }}/></div>
                <p style={{ fontSize:11, color:C.dim, margin:0, textAlign:"center" as const }}>{label}</p>
              </div>}
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:10, opacity:0, transition:"opacity .15s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.opacity="1"}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.opacity="0"}>
            <span style={{ background:C.accent, color:"#fff", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700 }}>{urls[i]?"Replace":"Upload"}</span>
          </div>
          <input ref={refs[i]} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f) setUrls(p=>p.map((u,j)=>j===i?URL.createObjectURL(f):u)); }}/>
        </div>
      ))}
    </div>
  );
}

// ── Tab system ────────────────────────────────────────────────────────────────
type Tab = "Timeline" | "Photos" | "Plans" | "Appointments" | "Products";

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ClientPortal({ openModal }: { openModal: ModalOpener }) {
  const { profile } = useAuth();
  const clientName = profile?.full_name?.split(" ")[0] ?? "there";
  const [tab, setTab] = useState<Tab>("Timeline");
  const tabs: Tab[] = ["Timeline","Photos","Plans","Appointments","Products"];

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden", background:C.bg }}>
      {/* Left column */}
      <div style={{ width:320, flexShrink:0, borderRight:`1px solid ${C.border}`, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {/* Hero */}
        <div style={{ padding:"24px 20px 20px", background:`linear-gradient(180deg,rgba(196,104,122,.12) 0%,transparent 100%)`, borderBottom:`1px solid ${C.border}` }}>
          <p style={{ fontSize:22, fontWeight:900, margin:"0 0 2px" }}>Hey, {clientName}! 👋</p>
          <p style={{ fontSize:13, color:C.dim, margin:0 }}>Stay consistent. You got this.</p>
          {/* Stats row */}
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            {[
              { label:"Days on journey", val:String(DAYS), color:C.accent },
              { label:"Loc phase",       val:CLIENT.locPhase.replace(" Locs",""), color:C.text },
            ].map(s=>(
              <div key={s.label} style={{ flex:1, background:"rgba(255,255,255,.05)", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px" }}>
                <p style={{ fontSize:18, fontWeight:900, color:s.color, margin:0, lineHeight:1 }}>{s.val}</p>
                <p style={{ fontSize:10, color:C.muted, margin:"3px 0 0", textTransform:"uppercase" as const, letterSpacing:".05em" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress ring */}
        <div style={{ padding:"18px 20px", borderBottom:`1px solid ${C.border}` }}>
          <SectionTitle>My Progress</SectionTitle>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12 }}>
            <ProgressRing value={OVERALL} size={100}/>
            <div>
              <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>Journey score</p>
              <p style={{ fontSize:11, color:C.success, fontWeight:700, margin:0 }}>↑ 8% this month</p>
              <button onClick={()=>openModal({ title:"Progress Breakdown", content:<ProgressBreakdown/> })}
                style={{ marginTop:10, background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:600, color:C.accent, cursor:"pointer" }}>
                What counts?
              </button>
            </div>
          </div>
          {/* Inline tip */}
          <div style={{ background:`${C.gold}10`, border:`1px solid ${C.gold}20`, borderRadius:10, padding:"10px 12px", display:"flex", gap:8 }}>
            <Lightbulb size={14} style={{ color:C.gold, flexShrink:0, marginTop:1 }}/>
            <p style={{ fontSize:11, color:C.muted, margin:0 }}><span style={{ fontWeight:700, color:C.gold }}>Tip: </span>{LOWEST.tip}</p>
          </div>
        </div>

        {/* Next appointment */}
        <div style={{ padding:"18px 20px", borderBottom:`1px solid ${C.border}` }}>
          <SectionTitle>Next Appointment</SectionTitle>
          <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px" }}>
            <p style={{ fontSize:12, color:C.dim, margin:"0 0 4px" }}>May 28, 2025 · 10:00 AM</p>
            <p style={{ fontSize:15, fontWeight:800, margin:"0 0 4px" }}>{CLIENT.service}</p>
            <p style={{ fontSize:12, color:C.muted, margin:"0 0 12px" }}>Prep: clean, dry locs + bring product list</p>
            <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:C.accent, color:"#fff", borderRadius:9, padding:"9px 0", fontSize:12, fontWeight:700, textDecoration:"none" }}>
              <CalendarDays size={13}/> Manage booking <ExternalLink size={11}/>
            </a>
          </div>
        </div>

        {/* Recent wash days */}
        <div style={{ padding:"18px 20px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <SectionTitle>Recent Wash Days</SectionTitle>
            <button onClick={()=>openModal({ title:"Log Wash Day", content:<WashDayForm/> })}
              style={{ background:`${C.accent}18`, border:`1px solid ${C.accent}30`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:C.accent, cursor:"pointer" }}>
              + Log
            </button>
          </div>
          {CLIENT.washDays.slice(0,2).map(w=>(
            <div key={w.id} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:`1px solid rgba(255,255,255,.04)` }}>
              <Clock size={14} style={{ color:C.accent, flexShrink:0, marginTop:2 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:12, fontWeight:700, margin:"0 0 2px" }}>{w.date}</p>
                <p style={{ fontSize:11, color:C.muted, margin:"0 0 4px" }}>{w.shampoo}</p>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:w.scalpCondition==="Good"?"rgba(52,211,153,.12)":"rgba(212,149,106,.12)", color:w.scalpCondition==="Good"?C.success:C.gold }}>
                  {w.scalpCondition} scalp
                </span>
              </div>
            </div>
          ))}
          <button onClick={()=>openModal({ title:"Log Wash Day", content:<WashDayForm/> })}
            style={{ width:"100%", marginTop:12, background:`${C.accent}18`, border:`1px solid ${C.accent}25`, borderRadius:10, padding:"10px 0", fontSize:12, fontWeight:700, color:C.accent, cursor:"pointer" }}>
            <Droplets size={13} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }}/> Log today's wash day
          </button>
        </div>

        {/* Connect with stylist */}
        <div style={{ padding:"18px 20px" }}>
          <SectionTitle>Connect with {STYLIST.name.split(" ")[0]}</SectionTitle>
          {STYLIST.socials.slice(0,2).map(s=>(
            <a key={s.platform} href={`https://${s.url}`} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", marginBottom:6, background:C.card2, border:`1px solid ${C.border}`, borderRadius:10, textDecoration:"none" }}>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:C.text, margin:0 }}>{s.platform}</p>
                <p style={{ fontSize:11, color:C.accent, margin:0 }}>{s.handle}</p>
              </div>
              <ExternalLink size={13} style={{ color:C.gold }}/>
            </a>
          ))}
          <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:`linear-gradient(90deg,${C.accent},${C.gold})`, color:"#fff", borderRadius:10, padding:"11px 0", fontSize:13, fontWeight:700, textDecoration:"none", marginTop:8 }}>
            <CalendarDays size={14}/> Book appointment
          </a>
        </div>
      </div>

      {/* Right column — My Journey */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Tab bar */}
        <div style={{ padding:"16px 20px 0", borderBottom:`1px solid ${C.border}`, display:"flex", gap:4, flexShrink:0 }}>
          <p style={{ fontSize:17, fontWeight:800, margin:"0 20px 0 0", alignSelf:"flex-end", paddingBottom:14 }}>My Journey</p>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:"8px 14px", borderRadius:"10px 10px 0 0", border:`1px solid ${tab===t?C.border:"transparent"}`, borderBottom:tab===t?`1px solid ${C.card}`:"none", fontSize:12.5, fontWeight:600, cursor:"pointer", background:tab===t?C.card:"transparent", color:tab===t?C.text:C.dim, marginBottom:tab===t?-1:0 }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
          {tab==="Timeline" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {CLIENT.timeline.map((t,i)=>(
                <div key={t.id} style={{ display:"flex", gap:14, padding:"14px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:14 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:C.accent, boxShadow:`0 0 10px ${C.accent}80`, flexShrink:0 }}/>
                    {i < CLIENT.timeline.length-1 && <div style={{ width:1, flex:1, background:`rgba(196,104,122,.2)`, minHeight:20 }}/>}
                  </div>
                  <div style={{ flex:1, paddingTop:0 }}>
                    <p style={{ fontSize:11, fontWeight:700, color:C.accent, margin:"0 0 3px" }}>{t.date}</p>
                    <p style={{ fontSize:14, fontWeight:700, margin:"0 0 4px" }}>{t.title}</p>
                    <p style={{ fontSize:12, color:C.muted, margin:0 }}>{t.body}</p>
                  </div>
                  <CheckCircle2 size={16} style={{ color:C.gold, flexShrink:0, marginTop:2 }}/>
                </div>
              ))}
            </div>
          )}

          {tab==="Photos" && (
            <div>
              <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>Upload progress photos to track your loc journey visually.</p>
              <PhotoGrid/>
            </div>
          )}

          {tab==="Plans" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {CLIENT.carePlan.map(c=>(
                <div key={c.id} style={{ display:"flex", gap:12, padding:"14px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:14 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`${C.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Droplets size={17} style={{ color:C.accent }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, margin:"0 0 2px" }}>{c.category}</p>
                    <p style={{ fontSize:12, color:C.muted, margin:"0 0 4px" }}>{c.instruction}</p>
                    <span style={{ fontSize:11, fontWeight:700, color:C.gold }}>{c.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="Appointments" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ padding:"16px", background:`${C.accent}10`, border:`1px solid ${C.accent}25`, borderRadius:14 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 6px" }}>Upcoming</p>
                <p style={{ fontSize:15, fontWeight:800, margin:"0 0 2px" }}>May 28, 2025 · 10:00 AM</p>
                <p style={{ fontSize:12, color:C.muted, margin:"0 0 12px" }}>{CLIENT.service}</p>
                <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:C.accent, textDecoration:"none" }}>
                  Manage booking <ExternalLink size={12}/>
                </a>
              </div>
              {CLIENT.timeline.filter(t=>t.type==="appointment").map(a=>(
                <div key={a.id} style={{ display:"flex", gap:12, padding:"12px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:12 }}>
                  <CheckCircle2 size={16} style={{ color:C.success, flexShrink:0, marginTop:2 }}/>
                  <div><p style={{ fontSize:13, fontWeight:700, margin:"0 0 2px" }}>{a.title}</p><p style={{ fontSize:11, color:C.dim, margin:0 }}>{a.date} · {a.body}</p></div>
                </div>
              ))}
            </div>
          )}

          {tab==="Products" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {CLIENT.products.map(p=>(
                <div key={p.id} style={{ display:"flex", gap:12, padding:"14px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:14 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:p.status==="avoid"?"rgba(248,113,113,.12)":`${C.success}12`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <PackageCheck size={17} style={{ color:p.status==="avoid"?"#f87171":C.success }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:4 }}>
                      <p style={{ fontSize:13, fontWeight:700, margin:0 }}>{p.name}</p>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:p.status==="recommended"?"rgba(52,211,153,.12)":"rgba(248,113,113,.12)", color:p.status==="recommended"?C.success:"#f87171", flexShrink:0 }}>{p.status}</span>
                    </div>
                    <p style={{ fontSize:11, color:C.muted, margin:"0 0 2px" }}>{p.category} · {p.frequency}</p>
                    <p style={{ fontSize:11, color:C.dim, margin:0 }}>{p.result}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
