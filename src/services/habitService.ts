
import { apiClient } from '@/lib/api';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  streakCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export class HabitService {
  static async addHabit(habit: CreateHabitRequest): Promise<Habit> {
    return apiClient.post<Habit>('/habits', habit);
  }

  static async getHabits(): Promise<Habit[]> {
    return apiClient.get<Habit[]>('/habits');
  }

  static async markHabitComplete(id: string): Promise<Habit> {
    return apiClient.patch<Habit>(`/habits/${id}`);
  }

  static async updateHabit(id: string, habit: Partial<CreateHabitRequest>): Promise<Habit> {
    return apiClient.put<Habit>(`/habits/${id}`, habit);
  }

  static async deleteHabit(id: string): Promise<void> {
    return apiClient.delete(`/habits/${id}`);
  }
}
