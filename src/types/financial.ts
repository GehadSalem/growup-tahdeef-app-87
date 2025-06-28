
export interface MonthlyFinancialData {
  id: string;
  userId: string;
  month: string; // "2024-01" format
  monthName: string; // "يناير 2024"
  income: number;
  expenses: ExpenseItem[];
  installments: InstallmentItem[];
  emergencyFundAmount: number;
  emergencyFundPercentage: number;
  totalExpenses: number;
  totalInstallments: number;
  netRemaining: number;
  savingsTarget: number;
  actualSavings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  categoryName: string;
  amount: number;
  description?: string;
  date: string;
}

export interface InstallmentItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: 'loan' | 'subscription' | 'purchase' | 'other';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetLimit?: number;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', name: 'طعام وشراب', icon: '🍽️', color: '#FF6384' },
  { id: 'transport', name: 'مواصلات', icon: '🚗', color: '#36A2EB' },
  { id: 'entertainment', name: 'ترفيه', icon: '🎬', color: '#FFCE56' },
  { id: 'shopping', name: 'تسوق', icon: '🛒', color: '#4BC0C0' },
  { id: 'health', name: 'صحة', icon: '⚕️', color: '#9966FF' },
  { id: 'education', name: 'تعليم', icon: '📚', color: '#FF9F40' },
  { id: 'bills', name: 'فواتير', icon: '📋', color: '#FF6384' },
  { id: 'other', name: 'أخرى', icon: '📦', color: '#C9CBCF' }
];
