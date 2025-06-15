
import { apiClient } from '@/lib/api';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userRegistrations: Array<{
    date: string;
    count: number;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
  }>;
}

export interface WeeklyStats {
  weekData: Array<{
    day: string;
    value: number;
  }>;
}

export interface MonthlyStats {
  monthlyData: Array<{
    month: string;
    value: number;
  }>;
}

export class StatsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    console.log('Fetching dashboard stats...');
    const result = await apiClient.get<DashboardStats>('/stats/dashboard');
    console.log('Dashboard stats fetched:', result);
    return result;
  }

  static async getWeeklyStats(): Promise<WeeklyStats> {
    console.log('Fetching weekly stats...');
    const result = await apiClient.get<WeeklyStats>('/stats/weekly');
    console.log('Weekly stats fetched:', result);
    return result;
  }

  static async getMonthlyStats(): Promise<MonthlyStats> {
    console.log('Fetching monthly stats...');
    const result = await apiClient.get<MonthlyStats>('/stats/monthly');
    console.log('Monthly stats fetched:', result);
    return result;
  }
}
