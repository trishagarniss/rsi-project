export interface Tenant {
  id: string;
  name: string;
  address?: string;
  contact_email?: string;
  registration_code?: string;
  status: "active" | "inactive" | "trial";
  created_at: string;
  updated_at?: string;
}

export interface TenantCreateDTO {
  name: string;
  address?: string;
  contact_email?: string;
  status?: "active" | "inactive" | "trial";
}

export interface TenantUpdateDTO {
  name?: string;
  address?: string;
  contact_email?: string;
  status?: "active" | "inactive" | "trial";
}
