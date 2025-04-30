
// تعريفات الأنواع المستخدمة في التطبيق

export interface Habit {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  icon: string;
}

export interface BadHabit {
  id: string;
  name: string;
  goal: string;
  dayCount: number;
  alternativeAction: string;
}

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

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

// أنواع إضافية حسب الحاجة
