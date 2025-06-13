
import { apiClient } from '@/lib/api';

export interface CustomInstallmentPlan {
  id: string;
  productName: string;
  totalCost: number;
  downPayment?: number;
  monthsCount: number;
  interestRate?: number;
  monthlyInstallment: number;
  linkedGoalId?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomInstallmentPlanRequest {
  productName: string;
  totalCost: number;
  downPayment?: number;
  monthsCount: number;
  interestRate?: number;
  linkedGoalId?: string;
}

export class CustomInstallmentPlanService {
  static async addPlan(plan: CreateCustomInstallmentPlanRequest): Promise<CustomInstallmentPlan> {
    console.log('Adding custom installment plan:', plan);
    return apiClient.post<CustomInstallmentPlan>('/custom-installment-plans', plan);
  }

  static async getPlans(): Promise<CustomInstallmentPlan[]> {
    console.log('Getting custom installment plans');
    return apiClient.get<CustomInstallmentPlan[]>('/custom-installment-plans');
  }

  static async getPlanById(id: string): Promise<CustomInstallmentPlan> {
    console.log('Getting custom installment plan by id:', id);
    return apiClient.get<CustomInstallmentPlan>(`/custom-installment-plans/${id}`);
  }

  static async updatePlan(id: string, plan: Partial<CreateCustomInstallmentPlanRequest>): Promise<CustomInstallmentPlan> {
    console.log('Updating custom installment plan:', id, plan);
    return apiClient.put<CustomInstallmentPlan>(`/custom-installment-plans/${id}`, plan);
  }

  static async deletePlan(id: string): Promise<void> {
    console.log('Deleting custom installment plan:', id);
    return apiClient.delete(`/custom-installment-plans/${id}`);
  }
}
