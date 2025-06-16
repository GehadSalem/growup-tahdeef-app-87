
import { Card, CardContent } from "@/components/ui/card";
import { Obligation } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface ObligationsSummaryProps {
  totalObligations: number;
  remainingIncome: number;
  savingsRemaining: number;
  obligationPercentage: number;
  obligations: Obligation[];
}

export function ObligationsSummary({ 
  totalObligations, 
  remainingIncome, 
  savingsRemaining, 
  obligationPercentage,
  obligations
}: ObligationsSummaryProps) {
  
  // دالة لتنسيق الأرقام وضمان عدم ظهور NaN
  const formatNumber = (num: number): string => {
    const safeNum = Number(num) || 0;
    return safeNum.toLocaleString('ar-SA');
  };

  // دالة لتنسيق النسبة المئوية
  const formatPercentage = (num: number): string => {
    const safeNum = Number(num) || 0;
    return safeNum.toFixed(1);
  };

  // التأكد من صحة البيانات
  const safeTotalObligations = Number(totalObligations) || 0;
  const safeRemainingIncome = Number(remainingIncome) || 0;
  const safeSavingsRemaining = Number(savingsRemaining) || 0;
  const safeObligationPercentage = Number(obligationPercentage) || 0;

  console.log("ObligationsSummary Debug:", {
    totalObligations: safeTotalObligations,
    remainingIncome: safeRemainingIncome,
    savingsRemaining: safeSavingsRemaining,
    obligationPercentage: safeObligationPercentage
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500 font-cairo">إجمالي الالتزامات</div>
            <div className="text-xl font-bold font-cairo">
              {formatNumber(safeTotalObligations)} ريال
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500 font-cairo">الراتب بعد الالتزامات</div>
            <div className="text-xl font-bold font-cairo">
              {formatNumber(safeRemainingIncome)} ريال
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500 font-cairo">المتبقي للادخار</div>
            <div className="text-xl font-bold font-cairo">
              {formatNumber(safeSavingsRemaining)} ريال
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${safeObligationPercentage > 50 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
          <CardContent className="p-4 text-right">
            <div className="text-sm text-gray-500 font-cairo">نسبة الالتزامات من الدخل</div>
            <div className="text-xl font-bold font-cairo">
              {formatPercentage(safeObligationPercentage)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {safeObligationPercentage > 50 && (
        <div className="bg-red-100 border-r-4 border-red-500 p-4 mb-6 flex items-center rounded-md">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-bold text-red-700 font-cairo">تحذير</span>
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <p className="text-red-700 font-cairo">الالتزامات تستهلك أكثر من 50% من دخلك. يُنصح بمراجعة الإنفاق الشهري.</p>
          </div>
        </div>
      )}
      
      {safeSavingsRemaining < 0 && (
        <div className="bg-amber-100 border-r-4 border-amber-500 p-4 mb-6 flex items-center rounded-md">
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-bold text-amber-700 font-cairo">تنبيه</span>
              <AlertTriangle className="h-5 w-5 text-amber-700" />
            </div>
            <p className="text-amber-700 font-cairo">
              أنت بحاجة إلى {formatNumber(Math.abs(safeSavingsRemaining))} ريال إضافية لتحقيق هدف الادخار لهذا الشهر.
            </p>
          </div>
        </div>
      )}
    </>
  );
}