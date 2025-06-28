
import { format, addMonths, addDays, isAfter, isBefore } from "date-fns";
import { ar } from "date-fns/locale";
import { Obligation } from "../obligations/AddObligationDialog";

// حساب تاريخ السداد القادم حسب التكرار
export const getNextPaymentDate = (dueDate: string, recurrence: string): string => {
  const date = new Date(dueDate);
  const today = new Date();
  
  let nextDate = new Date(date);
  
  // إذا كان التاريخ قد مر، نحسب التاريخ القادم
  if (isBefore(nextDate, today)) {
    switch (recurrence) {
      case "شهري":
        // نضيف شهر حتى نصل لتاريخ مستقبلي
        while (isBefore(nextDate, today)) {
          nextDate = addMonths(nextDate, 1);
        }
        break;
      case "ربع سنوي":
        // نضيف 3 أشهر حتى نصل لتاريخ مستقبلي
        while (isBefore(nextDate, today)) {
          nextDate = addMonths(nextDate, 3);
        }
        break;
      case "سنوي":
        // نضيف سنة (12 شهر) حتى نصل لتاريخ مستقبلي
        while (isBefore(nextDate, today)) {
          nextDate = addMonths(nextDate, 12);
        }
        break;
      case "مرة واحدة":
        // لا نغير التاريخ لأنه يحدث مرة واحدة فقط
        break;
    }
  }
  
  return format(nextDate, "yyyy-MM-dd");
};

// تنسيق التاريخ بالعربية
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy", { locale: ar });
};

// التحقق من الالتزامات القريبة
export const checkUpcomingObligations = (obligations: Obligation[], notifyCallback: (title: string, description: string) => void) => {
  const today = new Date();
  const threeDaysLater = addDays(today, 3);
  
  return obligations.map(obligation => {
    if (!obligation.isPaid && obligation.enableNotifications) {
      const nextPaymentDate = new Date(getNextPaymentDate(obligation.dueDate, obligation.recurrence));
      let notificationSent = obligation.notificationSent;
      
      // إشعار لليوم نفسه
      if (format(today, "yyyy-MM-dd") === format(nextPaymentDate, "yyyy-MM-dd") && !obligation.notificationSent) {
        notifyCallback(
          "موعد سداد اليوم!",
          `حان موعد سداد "${obligation.name}" بمبلغ ${obligation.amount} ريال`
        );
        notificationSent = true;
      }
      
      // إشعار قبل 3 أيام
      else if (
        isAfter(nextPaymentDate, today) && 
        isBefore(nextPaymentDate, threeDaysLater) && 
        !obligation.notificationSent
      ) {
        notifyCallback(
          "تذكير بموعد سداد قريب",
          `موعد سداد "${obligation.name}" سيكون في ${formatDate(nextPaymentDate.toString())}`
        );
        notificationSent = true;
      }
      
      return { ...obligation, notificationSent };
    }
    return obligation;
  });
};
