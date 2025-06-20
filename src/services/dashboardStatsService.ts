
import { apiClient } from '@/lib/api';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalHabits: number;
  completedHabits: number;
  totalExpenses: number;
  totalSavings: number;
}

export interface WeeklyStats {
  week: string;
  users: number;
  revenue: number;
  habits: number;
}

export interface MonthlyStats {
  month: string;
  users: number;
  revenue: number;
  habits: number;
}

export class DashboardStatsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/stats/dashboard');
  }

  static async getWeeklyStats(): Promise<WeeklyStats[]> {
    return apiClient.get<WeeklyStats[]>('/stats/weekly');
  }

  static async getMonthlyStats(): Promise<MonthlyStats[]> {
    return apiClient.get<MonthlyStats[]>('/stats/monthly');
  }
}
