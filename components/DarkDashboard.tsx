"use client";
import { useState } from "react";
import { Role, View, ModalState, ModalOpener } from "@/lib/types";
import { Sidebar } from "@/components/ui/Sidebar";
import { AppModal } from "@/components/ui/AppModal";
import BusinessDashboard from "@/components/views/BusinessDashboard";
import ClientsView from "@/components/views/ClientsView";
import AppointmentsView from "@/components/views/AppointmentsView";
import MentorshipView from "@/components/views/MentorshipView";
import AnalyticsView from "@/components/views/AnalyticsView";
import ClientPortal from "@/components/views/ClientPortal";
import SettingsView from "@/components/views/SettingsView";

function RoleSwitcher({ role, setRole, setView }: { role:Role; setRole:(r:Role)=>void; setView:(v:View)=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 14px", borderBottom:"1px solid rgba(255,255,255,.05)", background:"#0a0809", flexShrink:0 }}>
      <span style={{ fontSize:9, fontWeight:800, letterSpacing:".15em", color:"#3a2530", textTransform:"uppercase", marginRight:6 }}>Preview as:</span>
      {(["mentor","mentee","client","admin"] as Role[]).map(r => (
        <button key={r} onClick={()=>{ setRole(r); setView(r==="client"?"client-portal":r==="admin"?"analytics":"dashboard"); }} style={{ padding:"3px 10px", borderRadius:6, border:"none", fontSize:11, fontWeight:700, cursor:"pointer", background:role===r?"#c4687a":"transparent", color:role===r?"#fff":"#5e4d55" }}>
          {r}
        </button>
      ))}
    </div>
  );
}

export default function DarkDashboard({ initialView="dashboard" }: { initialView?: View }) {
  const [role, setRole] = useState<Role>("mentor");
  const [view, setView] = useState<View>(initialView);
  const [modal, setModal] = useState<ModalState>(null);
  const openModal: ModalOpener = m => setModal(m);
  const bRole = role==="mentee" ? "mentee" : "mentor";

  function renderView() {
    if (role==="client") return <ClientPortal openModal={openModal} />;
    switch (view) {
      case "client-portal":  return <ClientPortal openModal={openModal} />;
      case "clients":        return <ClientsView openModal={openModal} role={bRole} />;
      case "appointments":   return <AppointmentsView openModal={openModal} role={bRole} />;
      case "mentorship":     return <MentorshipView openModal={openModal} />;
      case "analytics":      return <AnalyticsView openModal={openModal} />;
      case "settings":       return <SettingsView openModal={openModal} />;
      default:               return <BusinessDashboard openModal={openModal} role={bRole} />;
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0c0a0b", color:"#f2e8ea", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <RoleSwitcher role={role} setRole={setRole} setView={setView} />
      <div style={{ display:"flex", height:"calc(100vh - 29px)" }}>
        <Sidebar view={view} setView={setView} role={role} />
        <main style={{ flex:1, overflow:"hidden" }}>{renderView()}</main>
      </div>
      <AppModal modal={modal} close={()=>setModal(null)} />
    </div>
  );
}
