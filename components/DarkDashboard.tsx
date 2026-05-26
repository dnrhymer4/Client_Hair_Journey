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
  if (role === "client")          return "client-portal";
  if (role === "admin")           return "analytics";
  return "dashboard";
}

export default function DarkDashboard() {
  const { role } = useAuth();
  const appRole = role ?? "client";
  const [view, setView]   = useState<View>(defaultView(appRole));
  const [modal, setModal] = useState<ModalState>(null);
  const openModal: ModalOpener = m => setModal(m);
  const bRole = appRole === "mentee" ? "mentee" : "mentor";

  function renderView() {
    if (appRole === "client") return <ClientPortal openModal={openModal} />;
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
      <div style={{ display:"flex", height:"100vh" }}>
        <Sidebar view={view} setView={setView} role={appRole} />
        <main style={{ flex:1, overflow:"hidden" }}>{renderView()}</main>
      </div>
      <AppModal modal={modal} close={()=>setModal(null)} />
    </div>
  );
}
