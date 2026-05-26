"use client";
import { BarChart3, CalendarDays, Crown, LayoutDashboard, LogOut, Settings, Sparkles, Users, ChevronDown } from "lucide-react";
import { AppRole, useAuth } from "@/lib/auth-context";
import { View } from "@/lib/types";

type NavItem = { id: View; label: string; icon: React.ElementType };

const NAV_MAIN: NavItem[] = [
  { id:"dashboard",    label:"Dashboard",    icon:LayoutDashboard },
  { id:"clients",      label:"Clients",      icon:Users           },
  { id:"appointments", label:"Appointments", icon:CalendarDays    },
  { id:"mentorship",   label:"Mentorship",   icon:Crown           },
  { id:"analytics",    label:"Analytics",    icon:BarChart3       },
  { id:"settings",     label:"Settings",     icon:Settings        },
];
const NAV_ADMIN: NavItem[] = [
  { id:"analytics",    label:"Analytics",    icon:BarChart3       },
  { id:"settings",     label:"Settings",     icon:Settings        },
];
const NAV_CLIENT: NavItem[] = [
  { id:"client-portal", label:"My Journey",   icon:Sparkles    },
  { id:"appointments",  label:"Appointments", icon:CalendarDays },
  { id:"settings",      label:"Settings",     icon:Settings     },
];

// Branding by role
const BRAND: Record<AppRole, { sub: string | null }> = {
  mentor:  { sub: "Mentor HQ" },
  mentee:  { sub: "Mentor HQ" },
  client:  { sub: null        },
  admin:   { sub: "Admin"     },
};

export function Sidebar({ view, setView, role }: { view: View; setView: (v: View) => void; role: AppRole }) {
  const { user, profile, signOut } = useAuth();

  const nav = role === "client" ? NAV_CLIENT : role === "admin" ? NAV_ADMIN : NAV_MAIN;
  const brand = BRAND[role];
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const initials    = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const roleLabels: Record<AppRole, string> = { mentor:"Mentor", mentee:"Mentee", client:"Client", admin:"Administrator" };

  return (
    <aside style={{ width:210, background:"#0f0c0e", borderRight:"1px solid rgba(255,255,255,.06)", display:"flex", flexDirection:"column", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"18px 18px 14px" }}>
        <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:20, color:"#e8a0b0", letterSpacing:.5, lineHeight:1 }}>Hair Journey</div>
        {brand.sub && <div style={{ fontSize:9, fontWeight:800, letterSpacing:".25em", color:"#d4956a", marginTop:3, textTransform:"uppercase" }}>{brand.sub}</div>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"0 10px", display:"flex", flexDirection:"column", gap:2 }}>
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setView(id)}
            style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12.5, fontWeight:view===id?600:500, textAlign:"left", width:"100%", background:view===id?"linear-gradient(90deg,#c4687a,#c46870)":"transparent", color:view===id?"#fff":"#6e5a66", transition:"all .15s" }}
            onMouseEnter={e=>{ if(view!==id){ (e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,.04)"; (e.currentTarget as HTMLButtonElement).style.color="#c4a0ac"; }}}
            onMouseLeave={e=>{ if(view!==id){ (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color="#6e5a66"; }}}
          >
            <Icon size={16} style={{ flexShrink:0 }} />{label}
          </button>
        ))}
      </nav>

      {/* Profile + sign out */}
      <div style={{ margin:"0 10px 10px", borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:10 }}>
        <div style={{ padding:10, border:"1px solid rgba(255,255,255,.06)", borderRadius:12, marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#c4687a,#d4956a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>{initials}</div>
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#e8d0d8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{displayName}</div>
              <div style={{ fontSize:10, color:"#6e5a66" }}>{roleLabels[role]}</div>
            </div>
          </div>
        </div>
        <button onClick={signOut}
          style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", background:"transparent", border:"none", borderRadius:8, cursor:"pointer", color:"#6e5a66", fontSize:12, fontWeight:500 }}
          onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background="rgba(248,113,113,.08)"; (e.currentTarget as HTMLButtonElement).style.color="#f87171"; }}
          onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color="#6e5a66"; }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
