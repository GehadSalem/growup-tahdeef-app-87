
import { apiClient } from '@/lib/api';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  userId: string;
  title?: string; // Add title field for display
}

export interface CreateExpenseRequest {
  amount: number;
  category: string;
  description?: string;
  date?: string;
  title?: string;
}

export interface MonthlyReport {
  totalExpenses: number;
  expensesByCategory: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
  month: number;
  year: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  count: number;
  percentage: number;
}

export class ExpenseService {
  static async addExpense(expense: CreateExpenseRequest): Promise<Expense> {
    console.log('Adding expense:', expense);
    const result = await apiClient.post<Expense>('/expenses', expense);
    console.log('Expense added:', result);
    return result;
  }

  static async getExpenses(): Promise<Expense[]> {
    console.log('Fetching expenses...');
    const result = await apiClient.get<Expense[]>('/expenses');
    console.log('Expenses fetched:', result);
    return Array.isArray(result) ? result : [];
  }

  static async getMonthlyReport(month: number, year: number): Promise<MonthlyReport> {
    console.log('Fetching monthly report for:', month, year);
    const result = await apiClient.get<MonthlyReport>(`/expenses/${month}/${year}`);
    console.log('Monthly report fetched:', result);
    return result;
  }

  static getCategorySummary(expenses: Expense[]): CategorySummary[] {
    const categoryMap = new Map<string, { amount: number; count: number }>();
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    expenses.forEach(expense => {
      const category = expense.category || 'غير محدد';
      const existing = categoryMap.get(category) || { amount: 0, count: 0 };
      categoryMap.set(category, {
        amount: existing.amount + expense.amount,
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        totalAmount: data.amount,
        count: data.count,
        percentage: total > 0 ? (data.amount / total) * 100 : 0
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  static getTopCategories(expenses: Expense[], limit: number = 5): CategorySummary[] {
    return this.getCategorySummary(expenses).slice(0, limit);
  }
}
