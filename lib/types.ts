import { ReactNode } from "react";
export type { AppRole as Role } from "@/lib/auth-context";
export type View = "dashboard" | "clients" | "appointments" | "mentorship" | "analytics" | "client-portal" | "settings";
export type ModalState = null | { title: string; subtitle?: string; content: ReactNode; size?: "sm" | "md" | "lg" };
export type ModalOpener = (m: ModalState) => void;
