export interface AuditLog {
  id: string;
  user_id: string;
  tenant_id: string;
  action: string;
  entity_name: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}
