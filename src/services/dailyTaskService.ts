
import { apiClient } from '@/lib/api';
import { DailyTask } from '@/lib/types';

export interface CreateDailyTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface UpdateDailyTaskRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export class DailyTaskService {
  static async getTasks(): Promise<DailyTask[]> {
    try {
      const response = await apiClient.get<DailyTask[]>('/dailyTask');
      return response || [];
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
      return [];
    }
  }

  static async createTask(task: CreateDailyTaskRequest): Promise<DailyTask> {
    return await apiClient.post<DailyTask>('/dailyTask', task);
  }

  static async updateTask(id: string, task: UpdateDailyTaskRequest): Promise<DailyTask> {
    return await apiClient.patch<DailyTask>(`/dailyTask/${id}`, task);
  }

  static async markTaskComplete(id: string): Promise<DailyTask> {
    return await apiClient.patch<DailyTask>(`/dailyTask/${id}/complete`);
  }

  static async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/dailyTask/${id}`);
  }

  static async getTaskById(id: string): Promise<DailyTask> {
    return await apiClient.get<DailyTask>(`/dailyTask/${id}`);
  }
}
