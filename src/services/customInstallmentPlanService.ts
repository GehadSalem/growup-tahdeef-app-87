
import { apiClient } from '@/lib/api';

export interface CustomInstallmentPlan {
  id: string;
  name: string;
  totalAmount: number;
  monthlyInstallment: number;
  monthlyAmount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomInstallmentPlanRequest {
  name: string;
  totalAmount: number;
  monthlyInstallment: number;
  monthlyAmount: number;
}

export class CustomInstallmentPlanService {
  static async addPlan(plan: CreateCustomInstallmentPlanRequest): Promise<CustomInstallmentPlan> {
    return apiClient.post<CustomInstallmentPlan>('/custom-installment-plans', plan);
  }

  static async getPlans(): Promise<CustomInstallmentPlan[]> {
    return apiClient.get<CustomInstallmentPlan[]>('/custom-installment-plans');
  }

  static async getPlanById(id: string): Promise<CustomInstallmentPlan> {
    return apiClient.get<CustomInstallmentPlan>(`/custom-installment-plans/${id}`);
  }

  static async updatePlan(id: string, plan: Partial<CreateCustomInstallmentPlanRequest>): Promise<CustomInstallmentPlan> {
    return apiClient.put<CustomInstallmentPlan>(`/custom-installment-plans/${id}`, plan);
  }

  static async deletePlan(id: string): Promise<void> {
    return apiClient.delete(`/custom-installment-plans/${id}`);
  }
}
