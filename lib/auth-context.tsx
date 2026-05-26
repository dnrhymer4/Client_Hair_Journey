"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type AppRole = "mentor" | "mentee" | "client" | "admin";

export interface UserProfile {
  id: string;
  role: AppRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  business_name: string | null;
  niche: string | null;
  booking_url: string | null;
  instagram: string | null;
  hair_texture: string | null;
  loc_goals: string | null;
  profile_complete: boolean;
  invited_by: string | null;
}

interface AuthCtx {
  user: User | null;
  profile: UserProfile | null;
  role: AppRole;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, profile: null, role: "client", loading: true,
  signOut: async () => {}, refreshProfile: async () => {},
});

/** Role is stamped into app_metadata (JWT) by the DB trigger — always available without a DB query. */
function roleFromUser(user: User | null): AppRole {
  const r = user?.app_metadata?.role ?? user?.user_metadata?.role;
  if (r === "mentor" || r === "mentee" || r === "admin") return r;
  return "client";
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) { console.warn("fetchProfile:", error.message); return null; }
    return data as UserProfile;
  } catch (e) {
    console.warn("fetchProfile threw:", e);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(u: User) {
    const p = await fetchProfile(u.id);
    setProfile(p);
  }

  async function refreshProfile() {
    if (user) await loadProfile(user);
  }

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 6000);

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) await loadProfile(session.user);
      })
      .catch(e => console.warn("getSession:", e))
      .finally(() => { clearTimeout(timeout); setLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile(session.user);
      else setProfile(null);
      setLoading(false);
    });

    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null);
  };

  // Role priority: profile DB row → JWT app_metadata → "client"
  const role: AppRole = profile?.role ?? roleFromUser(user);

  return (
    <Ctx.Provider value={{ user, profile, role, loading, signOut, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
