
import { apiClient } from '@/lib/api';
import { MajorGoal } from '@/lib/types';

export interface CreateMajorGoalRequest {
  title: string;
  description: string;
  targetDate: string;
  totalSteps: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateMajorGoalRequest {
  title?: string;
  description?: string;
  targetDate?: string;
  currentProgress?: number;
  totalSteps?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'completed' | 'paused';
}

export class MajorGoalsService {
  static async getMajorGoals(): Promise<MajorGoal[]> {
    try {
      const response = await apiClient.get<MajorGoal[]>('/majorgoals');
      return response || [];
    } catch (error) {
      console.error('Error fetching major goals:', error);
      return [];
    }
  }

  static async createMajorGoal(goal: CreateMajorGoalRequest): Promise<MajorGoal> {
    return await apiClient.post<MajorGoal>('/majorgoals', goal);
  }

  static async updateMajorGoal(id: string, goal: UpdateMajorGoalRequest): Promise<MajorGoal> {
    return await apiClient.put<MajorGoal>(`/majorgoals/${id}`, goal);
  }

  static async deleteMajorGoal(id: string): Promise<void> {
    await apiClient.delete(`/majorgoals/${id}`);
  }

  static async getMajorGoalById(id: string): Promise<MajorGoal> {
    return await apiClient.get<MajorGoal>(`/majorgoals/${id}`);
  }
}
