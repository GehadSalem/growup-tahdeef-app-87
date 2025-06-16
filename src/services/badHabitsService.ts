
import { apiClient } from '@/lib/api';

export interface BadHabit {
  id: string;
  name: string;
  description?: string;
  dayCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateBadHabitRequest {
  name: string;
  description?: string;
}

export class BadHabitsService {
  static async getBadHabits(): Promise<BadHabit[]> {
    return apiClient.get<BadHabit[]>('/bad-habits');
  }

  static async createBadHabit(habit: CreateBadHabitRequest): Promise<BadHabit> {
    return apiClient.post<BadHabit>('/bad-habits', habit);
  }

  static async updateBadHabit(id: string, habit: Partial<CreateBadHabitRequest>): Promise<BadHabit> {
    return apiClient.put<BadHabit>(`/bad-habits/${id}`, habit);
  }

  static async deleteBadHabit(id: string): Promise<void> {
    return apiClient.delete(`/bad-habits/${id}`);
  }

  static async recordOccurrence(id: string): Promise<BadHabit> {
    return apiClient.post<BadHabit>(`/bad-habits/${id}/occurrence`);
  }
}
