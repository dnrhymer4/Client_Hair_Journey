"use client";
import { useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.08)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };
const inp: CSSProperties = { width:"100%", background:"#0c0a0b", border:`1px solid rgba(255,255,255,.08)`, borderRadius:10, padding:"11px 14px", fontSize:14, color:"#f2e8ea", outline:"none", marginTop:6 };

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/"); }
  }

  async function handleGoogleSignIn() {
    setError(""); setGoogleLoading(true);
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${base}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
    // On success the browser navigates away — no need to do anything
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:28, color:"#e8a0b0", letterSpacing:.5 }}>Hair Journey</div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:".25em", color:C.gold, marginTop:4, textTransform:"uppercase" as const }}>Mentor HQ</div>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:28 }}>
          <h1 style={{ fontSize:20, fontWeight:800, margin:"0 0 6px" }}>Sign in</h1>
          <p style={{ fontSize:13, color:C.dim, margin:"0 0 24px" }}>Welcome back — sign in to continue.</p>

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"#fff", border:"1px solid rgba(0,0,0,.12)", borderRadius:10, padding:"11px 0", fontSize:14, fontWeight:600, color:"#3c4043", cursor:googleLoading?"not-allowed":"pointer", marginBottom:16, opacity:googleLoading?0.7:1, transition:"opacity .15s" }}
          >
            <GoogleIcon/>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }}/>
            <span style={{ fontSize:12, color:C.dim }}>or sign in with email</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }}/>
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" style={inp}/>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted }}>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" style={inp}/>
            </div>
            {error && (
              <div style={{ background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.25)", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:18 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading || googleLoading} style={{ width:"100%", background:loading?"rgba(196,104,122,.5)":C.accent, border:"none", borderRadius:10, padding:"12px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:loading?"not-allowed":"pointer" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", marginTop:20, fontSize:12, color:C.dim }}>
          Invited via email? Check your inbox and click the link to set your password.
        </p>
      </div>
    </div>
  );
}
