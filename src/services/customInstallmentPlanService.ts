
import { apiClient } from '@/lib/api';

export interface CustomInstallmentPlan {
  id: string;
  name: string; // Changed from productName
  totalAmount: number; // Changed from totalCost
  downPayment?: number;
  monthlyAmount: number; // This is the number of months
  monthlyInstallment: number;
  interestRate?: number;
  startDate: string; // Added required field
  dueDate?: string; // Added optional field
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  linkedGoalId?: string;
  userId: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomInstallmentPlanRequest {
  name: string; // Changed from productName
  totalAmount: number; // Changed from totalCost
  downPayment?: number;
  monthlyAmount: number; // This is the number of months
  interestRate?: number;
  startDate?: string; // Added optional field (will default to today)
  dueDate?: string; // Added optional field
  linkedGoalId?: string;
  notes?: string;
}

export class CustomInstallmentPlanService {
  static async addPlan(plan: CreateCustomInstallmentPlanRequest): Promise<CustomInstallmentPlan> {
    console.log('Adding custom installment plan:', plan);
    
    // Ensure we have a start date
    const planData = {
      ...plan,
      startDate: plan.startDate || new Date().toISOString().split('T')[0]
    };
    
    return apiClient.post<CustomInstallmentPlan>('/custom-installment-plans', planData);
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

  static async getPlansForGoal(goalId: string): Promise<CustomInstallmentPlan[]> {
    console.log('Getting custom installment plans for goal:', goalId);
    return apiClient.get<CustomInstallmentPlan[]>(`/custom-installment-plans?linkedGoalId=${goalId}`);
  }
}
