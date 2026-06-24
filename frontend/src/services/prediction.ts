import { get } from "@/lib/api-client";

interface PredictionCountResponse {
  status: string;
  count: number;
}

export interface PredictionRecord {
  id: string;
  student_id: string;
  student: { name: string; nisn: string | null } | null;
  risk_status: number;
  risk_score: number;
  created_at: string;
  factors: string[];
}

interface PredictionListResponse {
  status: string;
  data: PredictionRecord[];
}

interface UploadResponse {
  status: string;
  message: string;
  data?: PredictionRecord[];
}

export const predictionService = {
  async getCount(): Promise<PredictionCountResponse> {
    return get<PredictionCountResponse>("/predictions/count");
  },

  async getAll(): Promise<PredictionListResponse> {
    return get<PredictionListResponse>("/predictions/");
  },

  async uploadCSV(formData: FormData): Promise<UploadResponse> {
    const { uploadFile } = await import("@/lib/api-client");
    return uploadFile<UploadResponse>("/predictions/upload-csv/", formData);
  },
};
