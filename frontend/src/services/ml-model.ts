import { get, post, put, del } from "@/lib/api-client";
import { MlModel, MlModelCreateDTO, MlModelUpdateDTO } from "@/types/ml-model";

export const mlModelService = {
  async getAll(): Promise<{ status: string; data: MlModel[] }> {
    return get<{ status: string; data: MlModel[] }>("/models/");
  },

  async create(data: MlModelCreateDTO): Promise<{ status: string; message: string; data: MlModel }> {
    return post<{ status: string; message: string; data: MlModel }>("/models/", data);
  },

  async update(id: string, data: MlModelUpdateDTO): Promise<{ status: string; message: string; data: MlModel }> {
    return put<{ status: string; message: string; data: MlModel }>(`/models/${id}`, data);
  },

  async delete(id: string): Promise<{ status: string; message: string }> {
    return del<{ status: string; message: string }>(`/models/${id}`);
  },
};
