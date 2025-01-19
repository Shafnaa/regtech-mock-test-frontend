import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import ProfileHeader from "./profile-header";

function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <ProfileHeader />
    </header>
  );
}

export default AppHeader;
