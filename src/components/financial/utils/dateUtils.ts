
import { format, isAfter, addDays, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";

export interface Obligation {
  id: string;
  name: string;
  type: "loan" | "subscription" | "purchase" | "other";
  amount: number;
  dueDate: string;
  recurrence: "monthly" | "quarterly" | "yearly" | "one-time";
  notes?: string;
  isPaid: boolean;
  enableNotifications?: boolean;
  salaryImpactPercentage?: number;
  notificationSent?: boolean;
}

// تحويل التاريخ إلى تنسيق قابل للقراءة
export const formatDueDate = (dueDate: string): string => {
  try {
    return format(new Date(dueDate), "d MMMM yyyy", { locale: ar });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dueDate;
  }
};

// حساب الأيام المتبقية حتى تاريخ الاستحقاق
export const getDaysUntilDue = (dueDate: string): number => {
  try {
    const today = new Date();
    const due = new Date(dueDate);
    return differenceInDays(due, today);
  } catch (error) {
    console.error('Error calculating days until due:', error);
    return 0;
  }
};

// التحقق من قرب موعد الاستحقاق
export const isUpcoming = (dueDate: string, days: number = 3): boolean => {
  try {
    const daysUntil = getDaysUntilDue(dueDate);
    return daysUntil >= 0 && daysUntil <= days;
  } catch (error) {
    console.error('Error checking if upcoming:', error);
    return false;
  }
};

// التحقق من تجاوز موعد الاستحقاق
export const isOverdue = (dueDate: string): boolean => {
  try {
    const today = new Date();
    const due = new Date(dueDate);
    return isAfter(today, due);
  } catch (error) {
    console.error('Error checking if overdue:', error);
    return false;
  }
};

// فحص الالتزامات القريبة وإرسال إشعارات
export const checkUpcomingObligations = (
  obligations: Obligation[],
  notifyFunction: (title: string, description: string) => void
): Obligation[] => {
  return obligations.map(obligation => {
    try {
      if (obligation.enableNotifications !== false && !obligation.notificationSent) {
        const daysUntil = getDaysUntilDue(obligation.dueDate);
        
        if (daysUntil === 1 && !obligation.isPaid) {
          notifyFunction(
            "تذكير: استحقاق غداً",
            `${obligation.name} - ${obligation.amount.toFixed(2)} ر.س`
          );
          return { ...obligation, notificationSent: true };
        }
        
        if (daysUntil === 0 && !obligation.isPaid) {
          notifyFunction(
            "تذكير: استحقاق اليوم",
            `${obligation.name} - ${obligation.amount.toFixed(2)} ر.س`
          );
          return { ...obligation, notificationSent: true };
        }
        
        if (isOverdue(obligation.dueDate) && !obligation.isPaid) {
          notifyFunction(
            "تنبيه: التزام متأخر",
            `${obligation.name} متأخر ${Math.abs(daysUntil)} يوم - ${obligation.amount.toFixed(2)} ر.س`
          );
          return { ...obligation, notificationSent: true };
        }
      }
      
      return obligation;
    } catch (error) {
      console.error('Error checking obligation:', obligation, error);
      return obligation;
    }
  });
};

// حساب إجمالي الالتزامات حسب النوع
export const calculateObligationsByType = (obligations: Obligation[]) => {
  try {
    return obligations.reduce((acc, obligation) => {
      if (!acc[obligation.type]) {
        acc[obligation.type] = {
          total: 0,
          count: 0,
          paid: 0,
          unpaid: 0
        };
      }
      
      acc[obligation.type].total += obligation.amount || 0;
      acc[obligation.type].count += 1;
      
      if (obligation.isPaid) {
        acc[obligation.type].paid += obligation.amount || 0;
      } else {
        acc[obligation.type].unpaid += obligation.amount || 0;
      }
      
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Error calculating obligations by type:', error);
    return {};
  }
};

// إنشاء تاريخ الاستحقاق التالي بناءً على التكرار
export const getNextDueDate = (currentDueDate: string, recurrence: string): string => {
  try {
    const current = new Date(currentDueDate);
    
    switch (recurrence) {
      case "monthly":
        return addDays(current, 30).toISOString();
      case "quarterly":
        return addDays(current, 90).toISOString();
      case "yearly":
        return addDays(current, 365).toISOString();
      default:
        return currentDueDate;
    }
  } catch (error) {
    console.error('Error getting next due date:', error);
    return currentDueDate;
  }
};

