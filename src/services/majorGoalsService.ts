
import { apiClient } from '@/lib/api';

export interface MajorGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  category: string;
  progress: number;
  userId: string;
}

export interface CreateMajorGoalRequest {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  category: string;
}

export interface UpdateProgressRequest {
  currentAmount: number;
}

export class MajorGoalsService {
  static async createMajorGoal(goal: CreateMajorGoalRequest): Promise<MajorGoal> {
    return apiClient.post<MajorGoal>('/majorGoals', goal);
  }

  static async getUserMajorGoals(): Promise<MajorGoal[]> {
    return apiClient.get<MajorGoal[]>('/majorGoals');
  }

  static async getMajorGoalById(id: string): Promise<MajorGoal> {
    return apiClient.get<MajorGoal>(`/majorGoals/${id}`);
  }

  static async updateMajorGoal(id: string, goal: Partial<CreateMajorGoalRequest>): Promise<MajorGoal> {
    return apiClient.put<MajorGoal>(`/majorGoals/${id}`, goal);
  }

  static async deleteMajorGoal(id: string): Promise<void> {
    return apiClient.delete(`/majorGoals/${id}`);
  }

  static async updateProgress(id: string, progress: UpdateProgressRequest): Promise<MajorGoal> {
    return apiClient.patch<MajorGoal>(`/majorGoals/${id}`, progress);
  }
}
