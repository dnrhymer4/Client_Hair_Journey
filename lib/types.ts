import { ReactNode } from "react";

export type UserRole = "mentor" | "mentee" | "client" | "admin";
export type View = UserRole;
export type WorkTab = "business" | "mentorship";

// Flexible modal — accepts any ReactNode as content.
// All views use openModal({ title, content }) — no more type strings.
export type ModalState =
  | null
  | {
      title: string;
      subtitle?: string;
      content: ReactNode;
      size?: "sm" | "md" | "lg";
    };

export type ModalOpener = (m: ModalState) => void;

// Legacy hair-profile types (kept for Supabase schema compatibility)
export type ClientHairProfile = {
  id: string;
  mentee_id: string;
  client_id: string;
  loc_start_date: string | null;
  loc_method: string | null;
  loc_phase: string | null;
  hair_texture: string | null;
  scalp_concerns: string | null;
  allergies: string | null;
  notes: string | null;
};

export type ClientAppointment = {
  id: string;
  hair_profile_id: string;
  appointment_date: string;
  service_type: string;
  products_used: string | null;
  notes: string | null;
  next_recommended_date: string | null;
};
