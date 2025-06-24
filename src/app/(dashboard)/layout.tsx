'use client';

import { DashboardLayout } from "@toolpad/core/DashboardLayout";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout defaultSidebarCollapsed>{children}</DashboardLayout>;
}
