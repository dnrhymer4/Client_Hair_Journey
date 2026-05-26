"use client";
import { useState, CSSProperties } from "react";
import { Plus, Search } from "lucide-react";
import { mentorClients, menteeKia, Client, computeProgress, journeyDays } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const C = { card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399" };

const AV_COLORS = ["#c4687a","#a78bfa","#34d399","#d4956a","#60a5fa"];
function avColor(n:string){ return AV_COLORS[n.charCodeAt(0)%AV_COLORS.length]; }
function ini(n:string){ return n.split(" ").map(x=>x[0]).join("").slice(0,2); }

function PBar({ value }:{ value:number }) {
  return (
    <div style={{ height:3, background:"rgba(255,255,255,.07)", borderRadius:2, overflow:"hidden", flex:1 }}>
      <div style={{ height:3, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:2 }}/>
    </div>
  );
}

const STATUS_BG:Record<string,string> = { "Photo due":"rgba(212,149,106,.15)","Needs review":"rgba(248,113,113,.15)","Plan completed":"rgba(52,211,153,.12)","Updated today":"rgba(52,211,153,.12)","Intake pending":"rgba(167,139,250,.15)" };
const STATUS_FG:Record<string,string> = { "Photo due":"#d4956a","Needs review":"#f87171","Plan completed":"#34d399","Updated today":"#34d399","Intake pending":"#a78bfa" };

function ClientDetail({ client }:{ client:Client }) {
  const p = computeProgress(client.progressFactors);
  const days = journeyDays(client.locStartDate);
  return (
    <div style={{ padding:16, overflowY:"auto", height:"100%", boxSizing:"border-box" as const }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, paddingBottom:16, borderBottom:`1px solid rgba(255,255,255,.06)` }}>
        <div style={{ width:48, height:48, borderRadius:12, background:avColor(client.name), display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff", flexShrink:0 }}>
          {ini(client.name)}
        </div>
        <div>
          <p style={{ fontSize:15, fontWeight:800, margin:"0 0 2px" }}>{client.name}</p>
          <p style={{ fontSize:11, color:C.dim, margin:0 }}>{client.locPhase} · {client.hairTexture}</p>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
        {[{ l:"Progress", v:`${p}%`, c:C.accent },{ l:"Days", v:String(days), c:C.text },{ l:"Next", v:client.nextAppt, c:C.gold }].map(s=>(
          <div key={s.l} style={{ background:"#1a1318", border:`1px solid rgba(255,255,255,.06)`, borderRadius:10, padding:"10px 8px", textAlign:"center" as const }}>
            <p style={{ fontSize:16, fontWeight:900, color:s.c, margin:0, lineHeight:1 }}>{s.v}</p>
            <p style={{ fontSize:9, color:C.dim, margin:"3px 0 0", textTransform:"uppercase" as const }}>{s.l}</p>
          </div>
        ))}
      </div>
      {/* Score breakdown */}
      <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", marginBottom:10 }}>Journey Score</p>
      {client.progressFactors.map(f=>(
        <div key={f.label} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:11, color:C.muted }}>{f.label}</span>
            <span style={{ fontSize:11, fontWeight:700, color:C.accent }}>{f.score}%</span>
          </div>
          <PBar value={f.score}/>
        </div>
      ))}
      {/* Timeline */}
      <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"18px 0 10px" }}>Recent Timeline</p>
      {client.timeline.slice(0,4).map(t=>(
        <div key={t.id} style={{ display:"flex", gap:10, marginBottom:10, padding:"10px 12px", background:"#1a1318", borderRadius:10, border:`1px solid rgba(255,255,255,.05)` }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:4 }}/>
          <div>
            <p style={{ fontSize:10, color:C.accent, fontWeight:700, margin:"0 0 2px" }}>{t.date}</p>
            <p style={{ fontSize:12, fontWeight:600, margin:"0 0 2px" }}>{t.title}</p>
            <p style={{ fontSize:11, color:C.dim, margin:0 }}>{t.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientRow({ client, isSelected, onClick }:{ client:Client; isSelected:boolean; onClick:()=>void }) {
  const p = computeProgress(client.progressFactors);
  return (
    <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", cursor:"pointer", borderBottom:`1px solid rgba(255,255,255,.04)`, background:isSelected?"rgba(196,104,122,.07)":"transparent", borderLeft:isSelected?`3px solid ${C.accent}`:`3px solid transparent`, transition:"all .1s" }}>
      <div style={{ width:34, height:34, borderRadius:"50%", background:avColor(client.name), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>
        {ini(client.name)}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:12.5, fontWeight:700, margin:"0 0 1px", whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>{client.name}</p>
        <p style={{ fontSize:10.5, color:C.dim, margin:0 }}>{client.locPhase}</p>
      </div>
      <div style={{ width:90 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:10, color:C.dim }}>Progress</span>
          <span style={{ fontSize:10.5, fontWeight:700, color:C.accent }}>{p}%</span>
        </div>
        <PBar value={p}/>
      </div>
      <div style={{ width:72, textAlign:"right" as const, flexShrink:0 }}>
        <p style={{ fontSize:11, fontWeight:600, margin:"0 0 1px" }}>Next {client.nextAppt}</p>
        <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20, background:STATUS_BG[client.status]||"rgba(255,255,255,.07)", color:STATUS_FG[client.status]||C.muted }}>
          {client.status}
        </span>
      </div>
    </div>
  );
}

export default function ClientsView({ openModal, role="mentor" }:{ openModal:ModalOpener; role?:"mentor"|"mentee" }) {
  const allClients = role==="mentor" ? mentorClients : menteeKia.clients;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Client|null>(allClients[0] ?? null);

  const filters = ["All","Photo due","Needs review","Plan completed","Updated today","Intake pending"];
  const filtered = allClients.filter(c => {
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.service.toLowerCase().includes(q))
      && (filter==="All" || c.status===filter);
  });

  return (
    // Use 100% height — parent main element fills via flex
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0 }}>
      {/* Header */}
      <div style={{ padding:"12px 18px", borderBottom:`1px solid rgba(255,255,255,.06)`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h1 style={{ fontSize:16, fontWeight:800, margin:0 }}>Clients</h1>
          <p style={{ fontSize:11, color:C.dim, margin:"2px 0 0" }}>{allClients.length} total</p>
        </div>
        <button onClick={()=>openModal({ title:"Add Client", content:<p style={{ color:C.muted, fontSize:13 }}>New client form connects to Supabase.</p> })} style={{ display:"flex", alignItems:"center", gap:5, background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          <Plus size={13}/> Add Client
        </button>
      </div>

      {/* Body — fills remaining height */}
      <div style={{ display:"flex", flex:1, minHeight:0 }}>

        {/* Left: list */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, minHeight:0 }}>
          {/* Search + filters */}
          <div style={{ padding:"10px 14px", display:"flex", gap:8, borderBottom:`1px solid rgba(255,255,255,.05)`, flexShrink:0 }}>
            <div style={{ flex:1, position:"relative" }}>
              <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.dim }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients…" style={{ width:"100%", background:"#161113", border:`1px solid rgba(255,255,255,.07)`, borderRadius:9, padding:"7px 10px 7px 28px", fontSize:12, color:C.text, outline:"none", boxSizing:"border-box" as const }}/>
            </div>
            <div style={{ display:"flex", gap:4, overflowX:"auto" }}>
              {filters.map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{ padding:"5px 9px", borderRadius:20, border:`1px solid rgba(255,255,255,.07)`, fontSize:10, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" as const, background:filter===f?"#c4687a":"#161113", color:filter===f?"#fff":C.dim, flexShrink:0 }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 14px 6px 17px", borderBottom:`1px solid rgba(255,255,255,.04)`, flexShrink:0 }}>
            <div style={{ width:34, flexShrink:0 }}/>
            <div style={{ flex:1, fontSize:9.5, fontWeight:700, color:C.dim, textTransform:"uppercase" as const, letterSpacing:".06em" }}>Client</div>
            <div style={{ width:90, fontSize:9.5, fontWeight:700, color:C.dim, textTransform:"uppercase" as const, letterSpacing:".06em" }}>Progress</div>
            <div style={{ width:72, fontSize:9.5, fontWeight:700, color:C.dim, textTransform:"uppercase" as const, letterSpacing:".06em", textAlign:"right" as const }}>Next Appt</div>
          </div>

          {/* Scrollable rows */}
          <div style={{ flex:1, overflowY:"auto", minHeight:0 }}>
            {filtered.length === 0
              ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:200, color:C.dim }}>
                  <Search size={28} style={{ marginBottom:8, opacity:.3 }}/>
                  <p style={{ fontSize:13, margin:0 }}>No clients match</p>
                </div>
              : filtered.map(c=>(
                  <ClientRow key={c.id} client={c} isSelected={selected?.id===c.id} onClick={()=>setSelected(c)}/>
                ))
            }
          </div>
        </div>

        {/* Right: detail panel */}
        <div style={{ width:280, borderLeft:`1px solid rgba(255,255,255,.06)`, flexShrink:0, overflowY:"auto", minHeight:0 }}>
          {selected
            ? <ClientDetail client={selected}/>
            : <div style={{ display:"flex", height:"100%", alignItems:"center", justifyContent:"center", color:C.dim, fontSize:12, textAlign:"center" as const, padding:20 }}>
                Click a client to view their details
              </div>
          }
        </div>
      </div>
    </div>
  );
}
