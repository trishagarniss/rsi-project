export interface PredictAllResponse {
  status: string;
  message: string;
  data: {
    total_processed: number;
    success_count: number;
    skipped_count: number;
    skipped_details: {
      student_id: string;
      name: string;
      reason: string;
    }[];
  };
}
