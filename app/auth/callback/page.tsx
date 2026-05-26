"use client";
import { useEffect, useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.08)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };
const inp: CSSProperties = { width:"100%", background:"#0c0a0b", border:`1px solid rgba(255,255,255,.08)`, borderRadius:10, padding:"11px 14px", fontSize:14, color:"#f2e8ea", outline:"none", marginTop:6 };

type Step = "loading" | "set-password" | "done";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    async function handleCallback() {
      const params  = new URLSearchParams(window.location.search);
      const hash    = window.location.hash;
      const code    = params.get("code");
      const isInvite = hash.includes("type=invite") || params.get("type") === "invite";

      // ── OAuth / PKCE code exchange (Google, etc.) ──
      if (code && !isInvite) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.push("/");
          return;
        } catch (e) {
          console.error("Code exchange failed:", e);
          router.push("/login");
          return;
        }
      }

      // ── Already have a session (e.g. back-navigation) ──
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !isInvite) {
        router.push("/");
        return;
      }

      // ── Invite / password-reset flow (hash token) ──
      if (isInvite || hash.includes("access_token")) {
        setStep("set-password");
        return;
      }

      // ── Nothing recognised — back to login ──
      router.push("/login");
    }

    handleCallback();

    // onAuthStateChange catches implicit-flow tokens in the hash automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const hash = window.location.hash;
        if (hash.includes("type=invite")) {
          setStep("set-password");
        } else {
          router.push("/");
        }
      }
      if (event === "PASSWORD_RECOVERY") {
        setStep("set-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    setSaving(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setSaving(false); }
    else { setStep("done"); setTimeout(() => router.push("/"), 1500); }
  }

  if (step === "loading") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:24, color:"#e8a0b0", marginBottom:12 }}>Hair Journey</div>
        <p style={{ color:C.dim, fontSize:13 }}>Signing you in…</p>
      </div>
    </div>
  );

  if (step === "done") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:10 }}>✓</div>
        <p style={{ color:C.text, fontSize:16, fontWeight:700 }}>Password set! Redirecting…</p>
      </div>
    </div>
  );

  // step === "set-password" (invite flow)
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:28, color:"#e8a0b0" }}>Hair Journey</div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:".25em", color:C.gold, marginTop:4, textTransform:"uppercase" as const }}>Mentor HQ</div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:28 }}>
          <h1 style={{ fontSize:20, fontWeight:800, margin:"0 0 6px" }}>Set your password</h1>
          <p style={{ fontSize:13, color:C.dim, margin:"0 0 24px" }}>Choose a password to secure your account.</p>
          <form onSubmit={handleSetPassword}>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted }}>New password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="At least 8 characters" style={inp}/>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:600, color:C.muted }}>Confirm password</label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required placeholder="Re-enter password" style={inp}/>
            </div>
            {error && <div style={{ background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.25)", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:18 }}>{error}</div>}
            <button type="submit" disabled={saving} style={{ width:"100%", background:saving?"rgba(196,104,122,.5)":C.accent, border:"none", borderRadius:10, padding:"12px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:saving?"not-allowed":"pointer" }}>
              {saving ? "Saving…" : "Set password & sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
