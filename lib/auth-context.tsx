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

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as UserProfile | null;
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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile(session.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const role: AppRole = profile?.role ?? "client";

  return (
    <Ctx.Provider value={{ user, profile, role, loading, signOut, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
