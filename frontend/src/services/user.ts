import { get, post, put, del } from '@/lib/api-client';
import { User, UserUpdateDTO, SuperadminStaffCreateDTO } from '@/types/user';

export interface Tenant {
  id: string;
  name: string;
  address?: string;
  contact_email?: string;
  status: string;
}

export const userService = {
  /**
   * Fetch all users
   */
  async getAllUsers(skip = 0, limit = 10000): Promise<{ status: string; data: User[] }> {
    return get<{ status: string; data: User[] }>(`/users/?skip=${skip}&limit=${limit}`);
  },

  /**
   * Update user details (e.g., full name or active status)
   */
  async updateUser(userId: string, data: UserUpdateDTO): Promise<{ status: string; message: string; data: User }> {
    return put<{ status: string; message: string; data: User }>(`/users/${userId}`, data);
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<{ status: string; message: string }> {
    return del<{ status: string; message: string }>(`/users/${userId}`);
  },

  /**
   * Fetch all tenants
   */
  async getAllTenants(): Promise<{ status: string; data: Tenant[] }> {
    return get<{ status: string; data: Tenant[] }>('/tenants/');
  },

  /**
   * Regenerate registration code for a tenant
   */
  async regenerateTenantCode(tenantId: string): Promise<{
    status: string;
    message: string;
    data: { tenant_id: string; new_registration_code: string };
  }> {
    return post<{
      status: string;
      message: string;
      data: { tenant_id: string; new_registration_code: string };
    }>(`/tenants/${tenantId}/regenerate-code`);
  },

  /**
   * Register a new admin using a registration code
   */
  async registerAdmin(regCode: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return post(`/auth/register/${regCode}`, data);
  },

  /**
   * Create a staff member (superadmin, admin, counselor) directly by superadmin
   */
  async createSuperadminStaff(data: SuperadminStaffCreateDTO): Promise<{ status: string; message: string; data: User }> {
    return post<{ status: string; message: string; data: User }>('/users/superadminstaff', data);
  }
};
