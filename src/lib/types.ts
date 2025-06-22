export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  userId: string;
}

export interface MajorGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  currentProgress: number;
  totalSteps: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  userId: string;
}

export interface BadHabit {
  id: string;
  name: string;
  goal: string;
  alternativeAction: string;
  dayCount: number;
  createdAt: string;
  userId: string;
}

export interface Obligation {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  type: 'fixed' | 'variable';
  userId: string;
}

export interface Installment {
  id: string;
  name: string;
  totalAmount: number;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  isPaid: boolean;
  userId: string;
}
