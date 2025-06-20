
import { apiClient } from '@/lib/api';

export interface SavingsGoal {
  id: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingsGoalRequest {
  goalName: string;
  targetAmount: number;
  description?: string;
}

export class SavingsGoalsService {
  static async createSavingsGoal(goal: CreateSavingsGoalRequest): Promise<SavingsGoal> {
    return apiClient.post<SavingsGoal>('/savingsGoals', goal);
  }

  static async getUserSavingsGoals(): Promise<SavingsGoal[]> {
    return apiClient.get<SavingsGoal[]>('/savingsGoals');
  }

  static async getSavingsGoalById(id: string): Promise<SavingsGoal> {
    return apiClient.get<SavingsGoal>(`/savingsGoals/${id}`);
  }

  static async updateSavingsGoal(id: string, goal: Partial<CreateSavingsGoalRequest>): Promise<SavingsGoal> {
    return apiClient.put<SavingsGoal>(`/savingsGoals/${id}`, goal);
  }

  static async deleteSavingsGoal(id: string): Promise<void> {
    return apiClient.delete(`/savingsGoals/${id}`);
  }

  static async addToSavingsGoal(id: string, amount: { amount: number }): Promise<SavingsGoal> {
    return apiClient.post<SavingsGoal>(`/savingsGoals/${id}`, amount);
  }
}
