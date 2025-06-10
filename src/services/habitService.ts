
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
    console.log('Creating habit:', habit);
    const result = await apiClient.post<Habit>('/habits', habit);
    console.log('Created habit result:', result);
    return result;
  }

  static async getHabits(): Promise<Habit[]> {
    console.log('Fetching habits...');
    const result = await apiClient.get<Habit[]>('/habits');
    console.log('Fetched habits:', result);
    return result;
  }

  static async markHabitComplete(id: string): Promise<Habit> {
    console.log('Marking habit complete:', id);
    const result = await apiClient.patch<Habit>(`/habits/${id}`);
    console.log('Mark complete result:', result);
    return result;
  }

  static async updateHabit(id: string, habit: Partial<CreateHabitRequest>): Promise<Habit> {
    console.log('Updating habit:', id, habit);
    const result = await apiClient.put<Habit>(`/habits/${id}`, habit);
    console.log('Update habit result:', result);
    return result;
  }

  static async deleteHabit(id: string): Promise<void> {
    console.log('Deleting habit:', id);
    try {
      await apiClient.delete(`/habits/${id}`);
      console.log('Habit deleted successfully');
    } catch (error) {
      console.error('Error in HabitService.deleteHabit:', error);
      throw error;
    }
  }
}
