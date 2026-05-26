"use client";
import { CSSProperties } from "react";
import { CalendarDays, ExternalLink, Clock } from "lucide-react";
import { mentorClients, menteeKia, Client } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const C = { card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14 };

const AV_COLORS = ["#c4687a","#a78bfa","#34d399","#d4956a","#60a5fa"];
function avColor(n:string){ return AV_COLORS[n.charCodeAt(0)%AV_COLORS.length]; }
function initials(n:string){ return n.split(" ").map(x=>x[0]).join("").slice(0,2); }

const SCHED = [
  { time:"10:00 AM", client:"Layla M.",   service:"Check-in & Photo Update",     day:"Today",   btn:"Check-in" },
  { time:"1:30 PM",  client:"Jasmine R.", service:"Color Correction Consult",    day:"Today",   btn:"Consult"  },
  { time:"4:00 PM",  client:"Brianna T.", service:"Maintenance Plan Review",     day:"Today",   btn:"Follow-up"},
  { time:"9:00 AM",  client:"Maya L.",    service:"Growth Plan Check-in",        day:"May 27",  btn:"Review"   },
  { time:"11:00 AM", client:"Simone P.",  service:"Deep Conditioning Treatment", day:"May 28",  btn:"Prep"     },
  { time:"2:00 PM",  client:"Kezia M.",   service:"Progress Photos",             day:"May 28",  btn:"Prep"     },
  { time:"9:30 AM",  client:"Aaliyah C.", service:"Color Refresh Consult",       day:"May 30",  btn:"Prep"     },
  { time:"3:00 PM",  client:"Nadia B.",   service:"Quarterly Maintenance",       day:"Jun 2",   btn:"Prep"     },
];

const TODAY_APPTS = SCHED.filter(a => a.day==="Today");
const UPCOMING = SCHED.filter(a => a.day!=="Today");

function ApptRow({ time, client, service, btn, showDay, day }:{ time:string; client:string; service:string; btn:string; showDay?:boolean; day?:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
      <div style={{ width:70, flexShrink:0 }}>
        {showDay && <div style={{ fontSize:10, fontWeight:700, color:C.accent, marginBottom:1 }}>{day}</div>}
        <div style={{ fontSize:11.5, fontWeight:600, color:C.text }}>{time}</div>
      </div>
      <div style={{ width:36, height:36, borderRadius:"50%", background:avColor(client), display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff", flexShrink:0 }}>
        {initials(client)}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700 }}>{client}</div>
        <div style={{ fontSize:11, color:C.dim }}>{service}</div>
      </div>
      <button style={{ background:"rgba(196,104,122,.13)", border:"none", borderRadius:8, padding:"5px 12px", fontSize:11, fontWeight:700, color:"#e8909e", cursor:"pointer", flexShrink:0 }}>
        {btn}
      </button>
    </div>
  );
}

export default function AppointmentsView({ openModal, role="mentor" }:{ openModal:ModalOpener; role?:"mentor"|"mentee" }) {
  const bookingUrl = role==="mentee" ? menteeKia.bookingUrl : "https://glossgenius.com/locsbystephb";
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <h1 style={{ fontSize:17, fontWeight:800, margin:0 }}>Appointments</h1>
          <p style={{ fontSize:11.5, color:C.dim, margin:"2px 0 0" }}>Manage your schedule</p>
        </div>
        <a href={bookingUrl} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:6, background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, textDecoration:"none", cursor:"pointer" }}>
          <ExternalLink size={13} /> Manage in Booking Platform
        </a>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
        {/* Booking platform note */}
        <div style={{ background:"rgba(196,104,122,.08)", border:"1px solid rgba(196,104,122,.2)", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <CalendarDays size={16} style={{ color:C.accent, flexShrink:0 }} />
          <div>
            <span style={{ fontSize:12, fontWeight:700, color:"#e8909e" }}>Schedule is managed in your booking platform. </span>
            <span style={{ fontSize:12, color:C.muted }}>Appointments shown below are pulled in for reference. Add, reschedule, or cancel via the platform.</span>
          </div>
          <a href={bookingUrl} target="_blank" rel="noreferrer" style={{ marginLeft:"auto", flexShrink:0, display:"flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, color:C.accent, textDecoration:"none" }}>
            Open <ExternalLink size={11} />
          </a>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {/* Today */}
          <div style={card}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#34d399" }} />
              <span style={{ fontSize:13, fontWeight:800 }}>Today</span>
              <span style={{ fontSize:11, color:C.dim, marginLeft:"auto" }}>May 24, 2026</span>
            </div>
            {TODAY_APPTS.length===0
              ? <div style={{ textAlign:"center", padding:"24px 0", color:C.dim, fontSize:12 }}>No appointments today</div>
              : TODAY_APPTS.map((a,i) => <ApptRow key={i} {...a} />)}
          </div>

          {/* Stats */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Today",         val:"3",  sub:"appointments",    color:C.accent },
              { label:"This week",     val:"12", sub:"appointments",    color:C.gold   },
              { label:"This month",    val:"38", sub:"total bookings",  color:"#a78bfa"},
              { label:"Avg per week",  val:"9",  sub:"appointments",    color:"#34d399"},
            ].map(s => (
              <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:10, color:C.dim }}>{s.sub}</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:12, fontWeight:600, color:C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div style={card}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Clock size={15} style={{ color:C.accent }} />
            <span style={{ fontSize:13, fontWeight:800 }}>Upcoming</span>
          </div>
          {(() => {
            let lastDay = "";
            return UPCOMING.map((a, i) => {
              const showDay = a.day !== lastDay;
              lastDay = a.day;
              return <ApptRow key={i} {...a} showDay={showDay} />;
            });
          })()}
        </div>
      </div>
    </div>
  );
}
