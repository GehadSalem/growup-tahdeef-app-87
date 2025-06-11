
import { apiClient } from '@/lib/api';

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateDailyTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export class DailyTaskService {
  static async createTask(task: CreateDailyTaskRequest): Promise<DailyTask> {
    console.log('Creating daily task:', task);
    const result = await apiClient.post<DailyTask>('/dailyTask', task);
    console.log('Created daily task result:', result);
    return result;
  }

  static async getTasks(): Promise<DailyTask[]> {
    console.log('Fetching daily tasks...');
    const result = await apiClient.get<DailyTask[]>('/dailyTask');
    console.log('Fetched daily tasks:', result);
    return result;
  }

  static async getTaskById(id: string): Promise<DailyTask> {
    console.log('Fetching daily task by id:', id);
    const result = await apiClient.get<DailyTask>(`/dailyTask/${id}`);
    console.log('Fetched daily task:', result);
    return result;
  }

  static async updateTask(id: string, task: Partial<CreateDailyTaskRequest>): Promise<DailyTask> {
    console.log('Updating daily task:', id, task);
    const result = await apiClient.patch<DailyTask>(`/dailyTask/${id}`, task);
    console.log('Update daily task result:', result);
    return result;
  }

  static async markTaskComplete(id: string): Promise<DailyTask> {
    console.log('Marking daily task complete:', id);
    const result = await apiClient.patch<DailyTask>(`/dailyTask/${id}/complete`);
    console.log('Mark complete result:', result);
    return result;
  }

  static async deleteTask(id: string): Promise<void> {
    console.log('Deleting daily task:', id);
    await apiClient.delete(`/dailyTask/${id}`);
    console.log('Daily task deleted successfully');
  }
}
