import { get, uploadFile, put, del } from "@/lib/api-client";
import { MlModel, MlModelUpdateDTO } from "@/types/ml-model";

export const mlModelService = {
  async getAll(): Promise<{ status: string; data: MlModel[] }> {
    return get<{ status: string; data: MlModel[] }>("/models/");
  },

  async create(formData: FormData): Promise<{ status: string; message: string; data: MlModel }> {
    return uploadFile<{ status: string; message: string; data: MlModel }>("/models/", formData);
  },

  async update(id: string, data: MlModelUpdateDTO): Promise<{ status: string; message: string; data: MlModel }> {
    return put<{ status: string; message: string; data: MlModel }>(`/models/${id}`, data);
  },

  async delete(id: string): Promise<{ status: string; message: string }> {
    return del<{ status: string; message: string }>(`/models/${id}`);
  },
};
