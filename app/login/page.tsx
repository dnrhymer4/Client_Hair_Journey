"use client";
import { useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.08)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const inp: CSSProperties = {
    width: "100%", background: "#0c0a0b", border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "11px 14px", fontSize: 14, color: C.text,
    outline: "none", marginTop: 6,
  };

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 28, color: "#e8a0b0", letterSpacing: 0.5 }}>Hair Journey</div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".25em", color: C.gold, marginTop: 4, textTransform: "uppercase" }}>Mentor HQ</div>
        </div>

        {/* Card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 28 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "0 0 6px" }}>Sign in</h1>
          <p style={{ fontSize: 13, color: C.dim, margin: "0 0 24px" }}>Enter your email and password to continue.</p>

          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inp} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inp} />
            </div>

            {error && (
              <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.25)", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 18 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "rgba(196,104,122,.5)" : C.accent, border: "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: C.dim }}>
          Invited via email? Check your inbox and click the link to set your password.
        </p>
      </div>
    </div>
  );
}
