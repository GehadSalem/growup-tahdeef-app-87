
import { apiClient } from '@/lib/api';

export interface BadHabit {
  id: string;
  name: string;
  description?: string;
  goal: string;
  dayCount: number;
  alternativeAction: string;
  createdAt: string;
  updatedAt: string;
  lastOccurrence?: string;
}

export interface CreateBadHabitRequest {
  name: string;
  description?: string;
  goal: string;
  alternativeAction: string;
}

export class BadHabitsService {
  static async getBadHabits(): Promise<BadHabit[]> {
    console.log('Fetching bad habits...');
    const result = await apiClient.get<BadHabit[]>('/bad-habits');
    console.log('Bad habits fetched:', result);
    return Array.isArray(result) ? result : [];
  }

  static async createBadHabit(habit: CreateBadHabitRequest): Promise<BadHabit> {
    console.log('Creating bad habit:', habit);
    const result = await apiClient.post<BadHabit>('/bad-habits', habit);
    console.log('Bad habit created:', result);
    return result;
  }

  static async updateBadHabit(id: string, habit: Partial<CreateBadHabitRequest>): Promise<BadHabit> {
    console.log('Updating bad habit:', id, habit);
    const result = await apiClient.put<BadHabit>(`/bad-habits/${id}`, habit);
    console.log('Bad habit updated:', result);
    return result;
  }

  static async deleteBadHabit(id: string): Promise<void> {
    console.log('Deleting bad habit:', id);
    await apiClient.delete(`/bad-habits/${id}`);
    console.log('Bad habit deleted successfully');
  }

  static async recordOccurrence(id: string): Promise<BadHabit> {
    console.log('Recording bad habit occurrence:', id);
    const result = await apiClient.post<BadHabit>(`/bad-habits/${id}/occurrence`);
    console.log('Occurrence recorded:', result);
    return result;
  }
}