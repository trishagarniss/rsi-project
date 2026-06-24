import { get } from "@/lib/api-client";
import type { DashboardData } from "@/types/dashboard";

export const dashboardService = {
  async getAdminSummary(): Promise<{ status: string; data: DashboardData }> {
    return get<{ status: string; data: DashboardData }>("/dashboard/admin-summary");
  },
};
