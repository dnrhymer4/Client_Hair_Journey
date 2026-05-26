"use client";
import { useState, CSSProperties } from "react";
import { ExternalLink, Check } from "lucide-react";
import { menteeKia } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const C = { card:"#161113", border:"rgba(255,255,255,.07)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };
const card: CSSProperties = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18 };

function Toggle({ on, onChange }:{ on:boolean; onChange:()=>void }) {
  return (
    <div onClick={onChange} style={{ width:38, height:20, borderRadius:10, background: on?C.accent:"rgba(255,255,255,.1)", position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: on?20:3, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left .2s" }} />
    </div>
  );
}

function Field({ label, value, type="text", placeholder }:{ label:string; value:string; type?:string; placeholder?:string }) {
  const [v, setV] = useState(value);
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:600, color:C.dim, marginBottom:5, textTransform:"uppercase", letterSpacing:".05em" }}>{label}</div>
      <input type={type} value={v} onChange={e=>setV(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:"#0c0a0b", border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", fontSize:13, color:C.text, outline:"none" }} />
    </div>
  );
}

function SectionTitle({ children }:{ children:string }) {
  return <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:14, paddingBottom:10, borderBottom:`1px solid rgba(255,255,255,.06)` }}>{children}</div>;
}

export default function SettingsView({ openModal, role="mentor" }:{ openModal:ModalOpener; role?:"mentor"|"mentee" }) {
  const [notifs, setNotifs] = useState({ email:true, sms:false, apptReminders:true, progressAlerts:true, newClients:true, sessionReminders:false });
  const toggle = (k:keyof typeof notifs) => () => setNotifs(p=>({ ...p, [k]:!p[k] }));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
        <h1 style={{ fontSize:17, fontWeight:800, margin:0 }}>Settings</h1>
        <p style={{ fontSize:11.5, color:C.dim, margin:"2px 0 0" }}>Manage your profile, business, and preferences</p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignContent:"start" }}>
        {/* Profile */}
        <div style={card}>
          <SectionTitle>Profile</SectionTitle>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${C.accent},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff", flexShrink:0 }}>SB</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800 }}>Steph B.</div>
              <div style={{ fontSize:12, color:C.dim }}>Mentor · Atlanta, GA</div>
              <button style={{ marginTop:6, background:"rgba(196,104,122,.13)", border:"none", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, color:"#e8909e", cursor:"pointer" }}>Change photo</button>
            </div>
          </div>
          <Field label="Full name" value="Stephanie B." />
          <Field label="Email" value="steph@hairjourney.com" type="email" />
          <Field label="Phone" value="(404) 555-0100" />
          <button style={{ width:"100%", background:C.accent, border:"none", borderRadius:9, padding:"9px 0", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Save profile</button>
        </div>

        {/* Business */}
        <div style={card}>
          <SectionTitle>Business Info</SectionTitle>
          <Field label="Business name" value="Locs by Steph B." />
          <Field label="Niche / speciality" value="Locs + protective styles" />
          <Field label="Booking platform URL" value="glossgenius.com/locsbystephb" placeholder="yourplatform.com/yourbusiness" />
          <Field label="Instagram handle" value="@locsbystephb" />
          <Field label="Location / market" value="Atlanta, GA" />
          <button style={{ width:"100%", background:C.accent, border:"none", borderRadius:9, padding:"9px 0", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>Save business info</button>
        </div>

        {/* Notifications */}
        <div style={card}>
          <SectionTitle>Notifications</SectionTitle>
          {[
            { key:"email",           label:"Email notifications",          sub:"Receive updates via email" },
            { key:"sms",             label:"SMS notifications",             sub:"Text alerts for appointments" },
            { key:"apptReminders",   label:"Appointment reminders",        sub:"24h and 2h before each appt" },
            { key:"progressAlerts",  label:"Client progress alerts",       sub:"When a client falls below 60%" },
            { key:"newClients",      label:"New client notifications",     sub:"When a new client signs up" },
            { key:"sessionReminders",label:"Coaching session reminders",   sub:"Reminder before mentoring sessions" },
          ].map(n => (
            <div key={n.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:12.5, fontWeight:600 }}>{n.label}</div>
                <div style={{ fontSize:11, color:C.dim }}>{n.sub}</div>
              </div>
              <Toggle on={notifs[n.key as keyof typeof notifs]} onChange={toggle(n.key as keyof typeof notifs)} />
            </div>
          ))}
        </div>

        {/* Connections */}
        <div style={card}>
          <SectionTitle>Connected Platforms</SectionTitle>
          {[
            { name:"GlossGenius",     status:"Connected", color:"#34d399", url:"glossgenius.com" },
            { name:"Instagram",       status:"Connected", color:"#34d399", url:"instagram.com/locsbystephb" },
            { name:"Facebook",        status:"Connected", color:"#34d399", url:"facebook.com/locsbystephb" },
            { name:"Google Calendar", status:"Not connected", color:C.dim, url:"" },
            { name:"Supabase",        status:"Not connected", color:C.dim, url:"" },
          ].map(p => (
            <div key={p.name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"10px 12px", background:"#0c0a0b", borderRadius:10, border:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:p.color, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:600 }}>{p.name}</div>
                <div style={{ fontSize:10, color:p.color }}>{p.status}</div>
              </div>
              {p.url
                ? <a href={`https://${p.url}`} target="_blank" rel="noreferrer" style={{ color:C.accent, display:"flex" }}><ExternalLink size={13} /></a>
                : <button style={{ background:"rgba(196,104,122,.13)", border:"none", borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:700, color:"#e8909e", cursor:"pointer" }}>Connect</button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
