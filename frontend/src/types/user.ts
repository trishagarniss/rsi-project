export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  KONSELOR = "konselor",
}

export interface User {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  tenant_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
  last_login_at?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status?: string;
  message?: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
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
