export interface MlModel {
  id: string;
  version: string;
  algorithm: string;
  file_path: string;
  accuracy_score?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MlModelUpdateDTO {
  version?: string;
  algorithm?: string;
  accuracy_score?: number;
  is_active?: boolean;
}
