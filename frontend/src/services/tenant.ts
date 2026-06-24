import { get, post, put, del } from "@/lib/api-client";
import { Tenant, TenantCreateDTO, TenantUpdateDTO } from "@/types/tenant";

export const tenantService = {
  async getAll(skip = 0, limit = 10000): Promise<{ status: string; data: Tenant[] }> {
    return get<{ status: string; data: Tenant[] }>(`/tenants/?skip=${skip}&limit=${limit}`);
  },

  async getById(id: string): Promise<{ status: string; data: Tenant }> {
    return get<{ status: string; data: Tenant }>(`/tenants/${id}`);
  },

  async create(data: TenantCreateDTO): Promise<{ status: string; message: string; data: Tenant }> {
    return post<{ status: string; message: string; data: Tenant }>("/tenants/", data);
  },

  async update(id: string, data: TenantUpdateDTO): Promise<{ status: string; message: string; data: Tenant }> {
    return put<{ status: string; message: string; data: Tenant }>(`/tenants/${id}`, data);
  },

  async delete(id: string): Promise<{ status: string; message: string }> {
    return del<{ status: string; message: string }>(`/tenants/${id}`);
  },

  async getRegistrationCode(id: string): Promise<{ status: string; data: { tenant_id: string; registration_code: string | null; expires_in_seconds: number } }> {
    return get<{ status: string; data: { tenant_id: string; registration_code: string | null; expires_in_seconds: number } }>(`/tenants/${id}/registration-code`);
  },

  async regenerateCode(id: string): Promise<{ status: string; message: string; data: { tenant_id: string; new_registration_code: string; expires_in_seconds: number } }> {
    return post<{ status: string; message: string; data: { tenant_id: string; new_registration_code: string; expires_in_seconds: number } }>(`/tenants/${id}/regenerate-code`);
  },
};
