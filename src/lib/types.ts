
/**
 * تعريفات الأنواع المستخدمة في التطبيق
 * هذا الملف يحتوي على جميع التعريفات التي يمكن استخدامها في مختلف أجزاء التطبيق
 */

/**
 * نوع العادة اليومية
 */
export interface Habit {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  icon: string;
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
  title: string;
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
}
