
import { apiClient } from '@/lib/api';

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: {
    type: "daily" | "weekly" | "monthly";
    time?: string;
    days?: number[];
    dayOfMonth?: number;
  };
  isCompleted?: boolean;
  streak?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHabitRequest {
  name: string;
  category: string;
  frequency: {
    type: "daily" | "weekly" | "monthly";
    time?: string;
    days?: number[];
    dayOfMonth?: number;
  };
}

export interface UpdateHabitRequest {
  name?: string;
  category?: string;
  frequency?: {
    type: "daily" | "weekly" | "monthly";
    time?: string;
    days?: number[];
    dayOfMonth?: number;
  };
}

export class HabitService {
  static async createHabit(habitData: CreateHabitRequest): Promise<Habit> {
    const response = await apiClient.post<Habit>('/habits', habitData);
    return response;
  }

  static async getHabits(): Promise<Habit[]> {
    const response = await apiClient.get<Habit[]>('/habits');
    return response || [];
  }

  static async updateHabit(id: string, habitData: UpdateHabitRequest): Promise<Habit> {
    const response = await apiClient.put<Habit>(`/habits/${id}`, habitData);
    return response;
  }

  static async markHabitComplete(id: string): Promise<Habit> {
    const response = await apiClient.patch<Habit>(`/habits/${id}`, {});
    return response;
  }

  static async deleteHabit(id: string): Promise<void> {
    await apiClient.delete(`/habits/${id}`);
  }
}
