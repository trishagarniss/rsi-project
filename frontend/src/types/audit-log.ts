export interface AuditLog {
  id: string;
  user_id: string;
  tenant_id: string;
  action: string;
  entity_name: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  user_role?: string;
}
