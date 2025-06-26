
import { apiClient } from '@/lib/api';

export interface MajorGoal {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  category?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  currentAmount:number;
  estimatedCost?: number;
  remainingAmount?: number;
}

export interface CreateMajorGoalRequest {
  title: string;
  description?: string;
  targetDate: string;
  category?: string;
  estimatedCost?: number;
}

export class MajorGoalsService {
  static async createMajorGoal(goal: CreateMajorGoalRequest): Promise<MajorGoal> {
    return apiClient.post<MajorGoal>('/majorgoals', goal);
  }

  static async getUserMajorGoals(): Promise<MajorGoal[]> {
    return apiClient.get<MajorGoal[]>('/majorgoals');
  }

  static async getMajorGoalById(id: string): Promise<MajorGoal> {
    return apiClient.get<MajorGoal>(`/majorgoals/${id}`);
  }

  static async updateMajorGoal(id: string, goal: Partial<CreateMajorGoalRequest>): Promise<MajorGoal> {
    return apiClient.put<MajorGoal>(`/majorgoals/${id}`, goal);
  }

  static async deleteMajorGoal(id: string): Promise<void> {
    return apiClient.delete(`/majorgoals/${id}`);
  }
}
