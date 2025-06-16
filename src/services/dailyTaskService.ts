
import { apiClient } from '@/lib/api';

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: string;
  userId: string;
}

export interface CreateDailyTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

export class DailyTaskService {
  static async createTask(task: CreateDailyTaskRequest): Promise<DailyTask> {
    return apiClient.post<DailyTask>('/dailyTask', task);
  }

  static async getTasks(): Promise<DailyTask[]> {
    return apiClient.get<DailyTask[]>('/dailyTask');
  }

  static async getTaskById(id: string): Promise<DailyTask> {
    return apiClient.get<DailyTask>(`/dailyTask/${id}`);
  }

  static async updateTask(id: string, task: Partial<CreateDailyTaskRequest>): Promise<DailyTask> {
    return apiClient.patch<DailyTask>(`/dailyTask/${id}`, task);
  }

  static async markTaskComplete(id: string): Promise<DailyTask> {
    return apiClient.patch<DailyTask>(`/dailyTask/${id}/complete`);
  }

  static async deleteTask(id: string): Promise<void> {
    return apiClient.delete(`/dailyTask/${id}`);
  }
}
