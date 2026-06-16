import { get } from "@/lib/api-client";

interface Student {
  id: string;
  nis: string;
  fullname: string;
  tenant_id: string;
  is_active: boolean;
}

interface StudentListResponse {
  status: string;
  data: Student[];
}

interface StudentCountResponse {
  status: string;
  data: { total_active: number; total_all: number };
}

export const studentService = {
  async getAll(skip = 0, limit = 10000): Promise<StudentListResponse> {
    return get(`/students?skip=${skip}&limit=${limit}`);
  },
  async count(): Promise<StudentCountResponse> {
    return get('/students/count');
  },
};
