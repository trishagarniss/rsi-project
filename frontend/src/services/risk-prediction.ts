import { get, post } from "@/lib/api-client";
import { PredictAllResponse } from "@/types/risk-prediction";

interface PredictionListItem {
  id: string;
  student_id: string;
  risk_status: number;
  risk_score: number;
  created_at: string;
}

interface PredictionListResponse {
  status: string;
  data: PredictionListItem[];
}

export const riskPredictionService = {
  async predictAll(): Promise<PredictAllResponse> {
    return post<PredictAllResponse>("/predictions/all");
  },
  async getAll(): Promise<PredictionListResponse> {
    return get<PredictionListResponse>("/predictions/");
  },
};
