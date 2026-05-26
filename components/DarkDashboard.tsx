"use client";
import { useState } from "react";
import { useAuth, AppRole } from "@/lib/auth-context";
import { View, ModalState, ModalOpener } from "@/lib/types";
import { Sidebar } from "@/components/ui/Sidebar";
import { AppModal } from "@/components/ui/AppModal";
import BusinessDashboard from "@/components/views/BusinessDashboard";
import ClientsView from "@/components/views/ClientsView";
import AppointmentsView from "@/components/views/AppointmentsView";
import MentorshipView from "@/components/views/MentorshipView";
import AnalyticsView from "@/components/views/AnalyticsView";
import ClientPortal from "@/components/views/ClientPortal";
import SettingsView from "@/components/views/SettingsView";

function defaultView(role: AppRole): View {
  if (role === "client") return "client-portal";
  if (role === "admin")  return "analytics";
  return "dashboard";
}

// Admin-only: view-as banner to preview other roles
function ViewAsBanner({ viewAs, setViewAs }: { viewAs: AppRole | null; setViewAs: (r: AppRole | null) => void }) {
  const roles: AppRole[] = ["mentor", "mentee", "client"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 16px", background:"rgba(167,139,250,.08)", borderBottom:"1px solid rgba(167,139,250,.15)", flexShrink:0 }}>
      <span style={{ fontSize:11, fontWeight:700, color:"#a78bfa" }}>Admin — View as:</span>
      {roles.map(r => (
        <button key={r} onClick={() => setViewAs(viewAs === r ? null : r)}
          style={{ padding:"3px 10px", borderRadius:6, border:"1px solid rgba(167,139,250,.25)", fontSize:11, fontWeight:700, cursor:"pointer", background:viewAs===r?"#a78bfa":"transparent", color:viewAs===r?"#fff":"#a78bfa" }}>
          {r}
        </button>
      ))}
      {viewAs && <button onClick={() => setViewAs(null)} style={{ marginLeft:4, fontSize:11, color:"#6e5a66", background:"none", border:"none", cursor:"pointer" }}>✕ Exit preview</button>}
    </div>
  );
}

export default function DarkDashboard() {
  const { role } = useAuth();
  const [viewAs, setViewAs]   = useState<AppRole | null>(null);
  const effectiveRole: AppRole = (role === "admin" && viewAs) ? viewAs : role;
  const [view, setView]        = useState<View>(defaultView(role));
  const [modal, setModal]      = useState<ModalState>(null);
  const openModal: ModalOpener = m => setModal(m);
  const bRole = effectiveRole === "mentee" ? "mentee" : "mentor";

  function renderView() {
    if (effectiveRole === "client") return <ClientPortal openModal={openModal} />;
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
      {role === "admin" && <ViewAsBanner viewAs={viewAs} setViewAs={setViewAs} />}
      <div style={{ display:"flex", height: role === "admin" ? "calc(100vh - 37px)" : "100vh" }}>
        <Sidebar view={view} setView={setView} role={effectiveRole} />
        <main style={{ flex:1, overflow:"hidden" }}>{renderView()}</main>
      </div>
      <AppModal modal={modal} close={() => setModal(null)} />
    </div>
  );
}
