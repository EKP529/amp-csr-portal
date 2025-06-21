'use client';

import { DashboardLayout } from "@toolpad/core/DashboardLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout defaultSidebarCollapsed>{children}</DashboardLayout>;
}
