"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import DarkDashboard from "@/components/DarkDashboard";

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user)    { router.push("/login");    return; }
    if (profile && !profile.profile_complete) { router.push("/register"); return; }
  }, [user, profile, loading, router]);

  if (loading || !user || (profile && !profile.profile_complete)) {
    return (
      <div style={{ minHeight:"100vh", background:"#0c0a0b", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:28, color:"#e8a0b0", marginBottom:10 }}>Hair Journey</div>
          <p style={{ fontSize:12, color:"#6e5a66" }}>Loading…</p>
        </div>
      </div>
    );
  }

  return <DarkDashboard />;
}
