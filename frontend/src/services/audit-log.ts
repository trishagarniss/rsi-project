import { get } from "@/lib/api-client";
import { AuditLog } from "@/types/audit-log";

export const auditLogService = {
  async getAll(skip = 0, limit = 100): Promise<{ status: string; data: AuditLog[] }> {
    return get<{ status: string; data: AuditLog[] }>(`/audit-logs/?skip=${skip}&limit=${limit}`);
  },
};
