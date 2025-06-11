
/**
 * تعريفات الأنواع المستخدمة في التطبيق
 * هذا الملف يحتوي على جميع التعريفات التي يمكن استخدامها في مختلف أجزاء التطبيق
 */

/**
 * نوع العادة اليومية
 */
export interface Habit {
  id: string;
  name: string;
  title?: string; // Optional for backward compatibility
  category: string;
  completed: boolean;
  streak?: number;
  createdAt?: string;
  updatedAt?: string;
  icon?: string;
  frequency?: {
    type: 'daily' | 'weekly' | 'monthly';
    time?: string;
    days?: number[];
    dayOfMonth?: number;
  };
}

/**
 * نوع العادة السيئة المراد التخلص منها
 */
export interface BadHabit {
  id: string;
  name: string;
  goal: string;
  dayCount: number;
  alternativeAction: string;
}

/**
 * نوع الالتزام المالي الشهري
 */
export interface MonthlyObligation {
  id: string;
  name: string;
  type: "loan" | "occasion" | "purchase" | "other"; // قسط - مناسبة - شراء - آخر
  amount: number;
  dueDate: string;
  frequency: "monthly" | "quarterly" | "yearly" | "once"; // شهري - ربع سنوي - سنوي - مرة واحدة
  isPaid: boolean;
  salaryImpactPercentage: number;
  notes?: string;
}

/**
 * نوع عنصر القائمة/الفئة
 */
export interface CategoryItem {
  id: string;
  name: string;
  title?: string; // Add title for compatibility
  description: string;
  icon: string;
  route: string;
  color: string;
}

/**
 * نوع ميزة الاشتراك
 */
export interface SubscriptionFeature {
  title: string;
  description: string;
  icon: string;
}

/**
 * نوع خطة الاشتراك
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: SubscriptionFeature[];
  isPopular?: boolean;
}

/**
 * نوع الهدف الرئيسي
 */
export interface MajorGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  milestones: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
}

/**
 * نوع المستخدم
 */
export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  subscriptionEndDate?: string;
  preferences?: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  referralCode?: string;
  referralCount?: number;
}

/**
 * نوع بيانات الملف الشخصي
 */
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
  joinDate: string;
  subscription: {
    isSubscribed: boolean;
    plan?: string;
    startDate?: string;
    endDate?: string;
    autoRenew?: boolean;
  };
  stats: {
    completedGoals: number;
    activeDays: number;
    financialHealthScore: number;
  };
  referralCode?: string;
  referralCount?: number;
  freeMonthsEarned?: number;
}

/**
 * نوع التقرير المالي
 */
export interface FinancialReport {
  month: string;
  income: number;
  totalExpenses: number;
  expensePercentage: number;
  remainingAmount: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  highestExpense: {
    category: string;
    amount: number;
  };
  emergencyFundWithdrawal: number;
  emergencyFundWithdrawalReason: string;
  tips: string[];
}

/**
 * نوع الإحالة
 */
export interface Referral {
  id: string;
  referrerId: string; // معرف المستخدم الذي أرسل الدعوة
  referredEmail: string; // بريد الشخص المدعو
  status: "pending" | "completed" | "expired"; // حالة الإحالة
  createdAt: string; // تاريخ إنشاء الإحالة
  completedAt?: string; // تاريخ اكتمال الإحالة
  rewardClaimed: boolean; // هل تم استلام المكافأة
}
