// src/services/auth.ts
import { 
    UserLoginDTO, 
    LoginResponse, 
    RegisterAdminData, 
    ApiError 
} from '@/types/user';
import { get, post } from '@/lib/api-client';

export const authService = {
    /**
     * Cek validitas Registration Code
     * @param reg_code Kode registrasi dari Superadmin
     */
    async checkRegCode(reg_code: string): Promise<{ status: string; message: string; data: { tenant_id: string } }> {
        return await get(`/auth/check-code/${reg_code}`);
    },

    /**
     * Login user
     * @param data UserLoginDTO (email, password)
     */
    async login(data: UserLoginDTO): Promise<LoginResponse> {
        try {
        // Endpoint FastAPI: /api/v1/auth/login
        return await post<LoginResponse>('/auth/login', data);
        } catch (error) {
        throw error;
        }
    },

    /**
     * Register Admin baru menggunakan Registration Code dari Redis
     * @param reg_code Kode unik dari Superadmin
     * @param data { fullname, email, password }
     */
    async registerAdmin(reg_code: string, data: RegisterAdminData) {
        try {
        // Endpoint FastAPI: /api/v1/auth/register/{reg_code}
        return await post(`/auth/register/${reg_code}`, {
            fullname: data.fullname,
            email: data.email,
            password: data.password
        });
        } catch (error) {
        throw error;
        }
    },

    /**
     * Meminta token reset password
     */
    async requestForgotPassword(email: string) {
        return await post('/users/forgot-password/request', { email });
    },

    /**
     * Reset password menggunakan token
     */
    async resetPassword(token: string, newPassword: string) {
        return await post('/users/forgot-password/reset', { 
        token, 
        new_password: newPassword 
        });
    },

    /**
     * Logout user
     * @param refresh_token Token untuk invalidasi di backend
     */
    async logout(refresh_token: string) {
        return await post('/auth/logout', { refresh_token });
    }
};