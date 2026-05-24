export type UserRole = "mentor" | "mentee" | "client";

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
