
import { apiClient } from '@/lib/api';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  userId: string;
}

export interface CreateExpenseRequest {
  amount: number;
  category: string;
  description?: string;
  date?: string;
}

export interface MonthlyReport {
  totalExpenses: number;
  expensesByCategory: Array<{
    category: string;
    amount: number;
  }>;
  month: number;
  year: number;
}

export class ExpenseService {
  static async addExpense(expense: CreateExpenseRequest): Promise<Expense> {
    return apiClient.post<Expense>('/expenses', expense);
  }

  static async getExpenses(): Promise<Expense[]> {
    return apiClient.get<Expense[]>('/expenses');
  }

  static async getMonthlyReport(month: number, year: number): Promise<MonthlyReport> {
    return apiClient.get<MonthlyReport>(`/expenses/${month}/${year}`);
  }
}
