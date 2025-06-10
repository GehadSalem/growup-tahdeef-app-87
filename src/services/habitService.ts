
import { apiClient } from '@/lib/api';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  completed: boolean;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  category: string;
}

export class HabitService {
  static async createHabit(habit: CreateHabitRequest): Promise<Habit> {
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
  try {
    await apiClient.delete(`/habits/${id}`);
  } catch (error) {
    console.error('Error in HabitService.deleteHabit:', error);
    throw error;
  }
}
}
