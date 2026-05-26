"use client";
import { useState, CSSProperties } from "react";
import { Plus, Search, ChevronRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { mentorClients, menteeKia, Client, computeProgress, delta, journeyDays } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66", success:"#34d399" };
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14 };

const AV_COLORS = ["#c4687a","#a78bfa","#34d399","#d4956a","#60a5fa"];
function avColor(n:string){ return AV_COLORS[n.charCodeAt(0)%AV_COLORS.length]; }
function initials(n:string){ return n.split(" ").map(x=>x[0]).join("").slice(0,2); }

function Avatar({ name, size=32 }:{ name:string; size?:number }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:avColor(name), display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontWeight:800, color:"#fff", flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}

function PBar({ value }:{ value:number }) {
  return (
    <div style={{ height:3, background:"rgba(255,255,255,.07)", borderRadius:2, overflow:"hidden", width:"100%" }}>
      <div style={{ height:3, width:`${Math.min(100,value)}%`, background:`linear-gradient(90deg,${C.accent},${C.gold})`, borderRadius:2 }} />
    </div>
  );
}

const STATUS_COLORS:Record<string,string> = {
  "Photo due":"rgba(212,149,106,.15)", "Needs review":"rgba(248,113,113,.15)",
  "Plan completed":"rgba(52,211,153,.12)", "Updated today":"rgba(52,211,153,.12)",
  "Intake pending":"rgba(167,139,250,.15)",
};
const STATUS_TEXT:Record<string,string> = {
  "Photo due":"#d4956a","Needs review":"#f87171","Plan completed":"#34d399",
  "Updated today":"#34d399","Intake pending":"#a78bfa",
};

function ClientRow({ client, isSelected, onClick }:{ client:Client; isSelected:boolean; onClick:()=>void }) {
  const p = computeProgress(client.progressFactors);
  const days = journeyDays(client.locStartDate);
  return (
    <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,.04)", background: isSelected?"rgba(196,104,122,.07)":"transparent", borderLeft: isSelected?`3px solid ${C.accent}`:"3px solid transparent", transition:"all .1s" }}>
      <Avatar name={client.name} size={36} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{client.name}</div>
        <div style={{ fontSize:11, color:C.dim }}>{client.locPhase} · {days} days</div>
      </div>
      <div style={{ width:100 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ fontSize:10, color:C.dim }}>Progress</span>
          <span style={{ fontSize:11, fontWeight:700, color:C.accent }}>{p}%</span>
        </div>
        <PBar value={p} />
      </div>
      <div style={{ width:80, textAlign:"center" }}>
        <div style={{ fontSize:11, fontWeight:600 }}>Next {client.nextAppt}</div>
        <div style={{ fontSize:10, color:C.dim }}>{client.service.slice(0,18)}{client.service.length>18?"…":""}</div>
      </div>
      <div style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, background: STATUS_COLORS[client.status]||"rgba(255,255,255,.07)", color: STATUS_TEXT[client.status]||C.muted, whiteSpace:"nowrap" }}>
        {client.status}
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <button style={{ background:"rgba(196,104,122,.13)", border:"none", borderRadius:6, padding:"4px 8px", fontSize:10, fontWeight:700, color:"#e8909e", cursor:"pointer" }}>Note</button>
        <button style={{ background:"rgba(255,255,255,.05)", border:"none", borderRadius:6, padding:"4px 8px", fontSize:10, fontWeight:700, color:C.muted, cursor:"pointer" }}>
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function ClientDetail({ client }:{ client:Client }) {
  const p = computeProgress(client.progressFactors);
  return (
    <div style={{ padding:16, overflowY:"auto", height:"100%" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <Avatar name={client.name} size={48} />
        <div>
          <div style={{ fontSize:16, fontWeight:800 }}>{client.name}</div>
          <div style={{ fontSize:12, color:C.dim }}>{client.locPhase} · {client.hairTexture}</div>
          <div style={{ fontSize:11, color:C.dim }}>{client.service}</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
        {[{ label:"Progress", val:`${p}%`, color:C.accent }, { label:"Days on journey", val:String(journeyDays(client.locStartDate)), color:C.text }, { label:"Next appt", val:client.nextAppt, color:C.gold }].map(s => (
          <div key={s.label} style={{ background:"#1a1318", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:16, fontWeight:900, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:C.dim }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress factors */}
      <div style={{ ...card, marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:700, marginBottom:10 }}>Journey Score Breakdown</div>
        {client.progressFactors.map(f => (
          <div key={f.label} style={{ marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:11, color:C.muted }}>{f.label}</span>
              <span style={{ fontSize:11, fontWeight:700, color:C.accent }}>{f.score}%</span>
            </div>
            <PBar value={f.score} />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={card}>
        <div style={{ fontSize:12, fontWeight:700, marginBottom:10 }}>Recent Timeline</div>
        {client.timeline.slice(0,4).map(t => (
          <div key={t.id} style={{ display:"flex", gap:9, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, flexShrink:0, marginTop:4 }} />
            <div>
              <div style={{ fontSize:10, color:C.accent, fontWeight:600 }}>{t.date}</div>
              <div style={{ fontSize:12, fontWeight:600 }}>{t.title}</div>
              <div style={{ fontSize:10, color:C.dim }}>{t.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsView({ openModal, role="mentor" }:{ openModal:ModalOpener; role?:"mentor"|"mentee" }) {
  const allClients = role==="mentor" ? mentorClients : menteeKia.clients;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Client|null>(allClients[0]);

  const filters = ["All","Photo due","Needs review","Plan completed","Updated today","Intake pending"];
  const filtered = allClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.service.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="All" || c.status===filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display:"flex", height:"100%", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:800, margin:0 }}>Clients</h1>
          <p style={{ fontSize:11.5, color:C.dim, margin:"2px 0 0" }}>{allClients.length} total clients</p>
        </div>
        <button onClick={()=>openModal({ title:"Add Client", content:<p style={{ color:C.muted, fontSize:13 }}>New client form — connects to Supabase.</p> })} style={{ display:"flex", alignItems:"center", gap:5, background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
          <Plus size={13} /> Add Client
        </button>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* List */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Search + filter */}
          <div style={{ padding:"12px 16px", display:"flex", gap:8, borderBottom:"1px solid rgba(255,255,255,.05)", flexShrink:0 }}>
            <div style={{ flex:1, position:"relative" }}>
              <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.dim }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients..." style={{ width:"100%", background:"#161113", border:"1px solid rgba(255,255,255,.07)", borderRadius:9, padding:"7px 10px 7px 30px", fontSize:12, color:C.text, outline:"none" }} />
            </div>
            <div style={{ display:"flex", gap:4, overflowX:"auto" }}>
              {filters.map(f => (
                <button key={f} onClick={()=>setFilter(f)} style={{ padding:"5px 10px", borderRadius:20, border:"1px solid rgba(255,255,255,.07)", fontSize:10.5, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", background: filter===f?"#c4687a":"#161113", color: filter===f?"#fff":C.dim }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 14px", borderBottom:"1px solid rgba(255,255,255,.04)", flexShrink:0 }}>
            <div style={{ width:36, flexShrink:0 }} />
            <div style={{ flex:1, fontSize:10, fontWeight:700, color:C.dim, textTransform:"uppercase", letterSpacing:".05em" }}>Client</div>
            <div style={{ width:100, fontSize:10, fontWeight:700, color:C.dim, textTransform:"uppercase", letterSpacing:".05em" }}>Progress</div>
            <div style={{ width:80, fontSize:10, fontWeight:700, color:C.dim, textTransform:"uppercase", letterSpacing:".05em" }}>Next Appt</div>
            <div style={{ width:100, fontSize:10, fontWeight:700, color:C.dim, textTransform:"uppercase", letterSpacing:".05em" }}>Status</div>
            <div style={{ width:70 }} />
          </div>

          {/* Rows */}
          <div style={{ flex:1, overflowY:"auto" }}>
            {filtered.length===0
              ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:200, color:C.dim }}>
                  <Search size={32} style={{ marginBottom:8, opacity:.3 }} />
                  <p style={{ fontSize:13 }}>No clients match your search</p>
                </div>
              : filtered.map(c => <ClientRow key={c.id} client={c} isSelected={selected?.id===c.id} onClick={()=>setSelected(c)} />)
            }
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ width:280, borderLeft:"1px solid rgba(255,255,255,.06)", overflowY:"auto", flexShrink:0 }}>
          {selected ? <ClientDetail client={selected} /> : <div style={{ display:"flex", height:"100%", alignItems:"center", justifyContent:"center", color:C.dim, fontSize:12, textAlign:"center", padding:20 }}>Select a client to view details</div>}
        </div>
      </div>
    </div>
  );
}
