// 1. Enums (Sesuai dengan backend)
export enum UserRole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  COUNSELOR = "counselor",
}

// 2. User Response
export interface User {
  id: string;
  tenant_id: string | null;
  fullname: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// 3. Login DTO & Response
export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
}

// 4. Register & Staff DTO
export interface UserCreateDTO {
  fullname: string;
  email: string;
  password: string;
}

export interface StaffCreateDTO {
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
}

// 5. Profil Update
export interface UserUpdateDTO {
  fullname?: string;
  email?: string;
  is_active?: boolean;
}

export interface SuperadminStaffCreateDTO {
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
  tenant_id: string;
}

// 6. Password & Token
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UserCheckTokenDTO {
  email: string;
  token: string;
}

export interface UserGetTokenDTO {
  email: string;
}

export interface UserChangePasswordByTokenDTO {
  email: string;
  token: string;
  new_password: string;
}

// 7. Utility
export interface ApiError {
  detail: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export type RegisterAdminData = UserCreateDTO;