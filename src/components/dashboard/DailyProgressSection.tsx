
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { WeeklyChart } from "@/components/stats/WeeklyChart";

// بيانات نموذجية للرسم البياني الأسبوعي
const weeklyData = [
  { name: "الأحد", value: 70, label: "إنجاز اليوم" },
  { name: "الإثنين", value: 80, label: "إنجاز اليوم" },
  { name: "الثلاثاء", value: 60, label: "إنجاز اليوم" },
  { name: "الأربعاء", value: 90, label: "إنجاز اليوم" },
  { name: "الخميس", value: 75, label: "إنجاز اليوم" },
  { name: "الجمعة", value: 65, label: "إنجاز اليوم" },
  { name: "السبت", value: 85, label: "إنجاز اليوم" },
];

interface DailyProgressSectionProps {
  completedHabits: number;
  totalHabits: number;
  dailyProgress: number;
}

export function DailyProgressSection({ completedHabits, totalHabits, dailyProgress }: DailyProgressSectionProps) {
  // رسالة تحفيزية حسب نسبة الإنجاز
  const getMotivationalMessage = (progress: number) => {
    if (progress < 30) return "يمكنك تحقيق المزيد اليوم!";
    if (progress < 70) return "أنت في الطريق الصحيح!";
    return "أحسنت! أنت تقترب من إكمال أهدافك اليوم";
  };

  return (
    <section className="mb-8">
      <div className="section-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-cairo">تقدمك اليوم</h2>
          <div className="text-sm text-gray-500 font-cairo">
            {completedHabits}/{totalHabits} مكتمل
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8">
          <ProgressCircle percentage={dailyProgress} />
          
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-bold font-cairo mb-2">تقدمك الأسبوعي</h3>
            <WeeklyChart data={weeklyData} />
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="font-cairo text-growup-text">
            {getMotivationalMessage(dailyProgress)}
          </p>
        </div>
      </div>
    </section>
  );
}
