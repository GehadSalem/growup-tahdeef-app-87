
import { apiClient } from '@/lib/api';

export interface DashboardStats {
  completedHabits: number;
  totalHabits: number;
  dailyProgress: number;
  weeklyData: {
    day: string;
    value: number;
  }[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
  };
}

export interface WeeklyProgress {
  week: string;
  habits: number;
  completed: number;
  progress: number;
}

export class StatsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    console.log('Fetching dashboard stats...');
    const result = await apiClient.get<DashboardStats>('/stats/dashboard');
    console.log('Dashboard stats fetched:', result);
    return result;
  }

  static async getWeeklyProgress(): Promise<WeeklyProgress[]> {
    console.log('Fetching weekly progress...');
    const result = await apiClient.get<WeeklyProgress[]>('/stats/weekly');
    console.log('Weekly progress fetched:', result);
    return result;
  }

  static async getMonthlyReport(month: string, year: string) {
    console.log('Fetching monthly report for:', month, year);
    const result = await apiClient.get(`/stats/monthly?month=${month}&year=${year}`);
    console.log('Monthly report fetched:', result);
    return result;
  }
}
