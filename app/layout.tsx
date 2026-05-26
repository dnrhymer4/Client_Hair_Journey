import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Mentor HQ",
  description: "Mentor dashboard and client hair journey portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
