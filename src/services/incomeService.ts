
import { apiClient } from '@/lib/api';

export interface Income {
  id: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
  userId: string;
}

export interface CreateIncomeRequest {
  amount: number;
  source: string;
  description?: string;
  date?: string;
}

export class IncomeService {
  static async addIncome(income: CreateIncomeRequest): Promise<Income> {
    return apiClient.post<Income>('/incomes', income);
  }

  static async getUserIncomes(): Promise<Income[]> {
    return apiClient.get<Income[]>('/incomes');
  }

  static async getIncomesByDate(year: number, month: number): Promise<Income[]> {
    return apiClient.get<Income[]>(`/incomes/${year}/${month}`);
  }

  static async getIncomeById(id: string): Promise<Income> {
    return apiClient.get<Income>(`/incomes/${id}`);
  }

  static async updateIncome(id: string, income: Partial<CreateIncomeRequest>): Promise<Income> {
    return apiClient.put<Income>(`/incomes/${id}`, income);
  }

  static async deleteIncome(id: string): Promise<void> {
    return apiClient.delete(`/incomes/${id}`);
  }
}
