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
    if (!user) { router.push("/login"); return; }
    if (profile && !profile.profile_complete) { router.push("/register"); return; }
  }, [user, profile, loading, router]);

  // Still loading
  if (loading) return <Splash text="Loading…" />;
  // No session — redirect firing
  if (!user) return <Splash text="Redirecting…" />;
  // Profile not complete — redirect firing
  if (profile && !profile.profile_complete) return <Splash text="Almost there…" />;

  return <DarkDashboard />;
}

function Splash({ text }: { text: string }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0c0a0b", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,-apple-system,sans-serif", gap:12 }}>
      <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:28, color:"#e8a0b0" }}>Hair Journey</div>
      <p style={{ fontSize:12, color:"#6e5a66", margin:0 }}>{text}</p>
    </div>
  );
}
