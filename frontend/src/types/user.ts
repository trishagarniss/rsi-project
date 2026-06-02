export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  KONSELOR = "konselor",
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  tenant_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ApiError {
  detail: string;
}
