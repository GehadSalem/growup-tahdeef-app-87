
import { apiClient } from '@/lib/api';

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  category: string;
  createdAt: string;
  userId: string;
}

export interface CreateHabitRequest {
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category?: string;
}

export class HabitService {
  static async createHabit(habit: CreateHabitRequest): Promise<Habit> {
    console.log('Creating habit:', habit);
    return apiClient.post<Habit>('/habits', habit);
  }

  static async getHabits(): Promise<Habit[]> {
    console.log('Fetching habits...');
    return apiClient.get<Habit[]>('/habits');
  }

  static async markHabitComplete(id: string): Promise<Habit> {
    console.log('Marking habit complete:', id);
    return apiClient.patch<Habit>(`/habits/${id}`);
  }

  static async updateHabit(id: string, habit: Partial<CreateHabitRequest>): Promise<Habit> {
    console.log('Updating habit:', id, habit);
    return apiClient.put<Habit>(`/habits/${id}`, habit);
  }

  static async deleteHabit(id: string): Promise<void> {
    console.log('Deleting habit:', id);
    return apiClient.delete(`/habits/${id}`);
  }
}
