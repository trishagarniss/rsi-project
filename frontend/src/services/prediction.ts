import { get } from "@/lib/api-client";

interface PredictionCountResponse {
  status: string;
  count: number;
}

export const predictionService = {
  async getCount(): Promise<PredictionCountResponse> {
    return get<PredictionCountResponse>("/predictions/count");
  },
};
