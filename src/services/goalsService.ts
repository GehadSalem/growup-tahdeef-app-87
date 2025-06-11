
import { apiClient } from '@/lib/api';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  category: string;
  targetDate: string;
  milestones?: Omit<Milestone, 'id' | 'isCompleted' | 'completedAt'>[];
}

export class GoalsService {
  static async getGoals(): Promise<Goal[]> {
    console.log('Fetching goals...');
    const result = await apiClient.get<Goal[]>('/goals');
    console.log('Goals fetched:', result);
    return result;
  }

  static async createGoal(goal: CreateGoalRequest): Promise<Goal> {
    console.log('Creating goal:', goal);
    const result = await apiClient.post<Goal>('/goals', goal);
    console.log('Goal created:', result);
    return result;
  }

  static async updateGoal(id: string, goal: Partial<CreateGoalRequest>): Promise<Goal> {
    console.log('Updating goal:', id, goal);
    const result = await apiClient.put<Goal>(`/goals/${id}`, goal);
    console.log('Goal updated:', result);
    return result;
  }

  static async deleteGoal(id: string): Promise<void> {
    console.log('Deleting goal:', id);
    await apiClient.delete(`/goals/${id}`);
    console.log('Goal deleted successfully');
  }

  static async updateMilestone(goalId: string, milestoneId: string, isCompleted: boolean): Promise<Goal> {
    console.log('Updating milestone:', goalId, milestoneId, isCompleted);
    const result = await apiClient.patch<Goal>(`/goals/${goalId}/milestones/${milestoneId}`, { isCompleted });
    console.log('Milestone updated:', result);
    return result;
  }
}
