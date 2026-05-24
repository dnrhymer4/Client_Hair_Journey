"use client";

import { useMemo, useState } from "react";
import { View, ModalState, ModalOpener } from "@/lib/types";
import { Shell, AppModal } from "@/components/ui/Shell";
import MentorView from "@/components/mentor/MentorView";
import MenteeView from "@/components/mentee/MenteeView";
import ClientView from "@/components/client/ClientView";
import AdminView from "@/components/admin/AdminView";

export default function DarkDashboard({
  initialView = "mentor",
}: {
  initialView?: View;
}) {
  const [view, setView] = useState<View>(initialView);
  const [modal, setModal] = useState<ModalState>(null);

  // All views get this — they call openModal({ title, content }) freely
  const openModal: ModalOpener = (m) => setModal(m);
  const closeModal = () => setModal(null);

  const content = useMemo(() => {
    switch (view) {
      case "mentor":  return <MentorView  openModal={openModal} />;
      case "mentee":  return <MenteeView  openModal={openModal} />;
      case "client":  return <ClientView  openModal={openModal} />;
      case "admin":   return <AdminView   openModal={openModal} />;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <>
      <Shell view={view} setView={setView} openModal={openModal}>
        {content}
      </Shell>
      <AppModal modal={modal} close={closeModal} view={view} />
    </>
  );
}
