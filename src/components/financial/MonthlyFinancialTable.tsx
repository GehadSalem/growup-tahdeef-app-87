
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Calendar, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Shield,
  Target
} from "lucide-react";
import { MonthlyFinancialData } from '@/types/financial';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface MonthlyFinancialTableProps {
  data: MonthlyFinancialData;
  onUpdateIncome: (income: number) => void;
  onChangeMonth: (month: string) => void;
}

export function MonthlyFinancialTable({ 
  data, 
  onUpdateIncome, 
  onChangeMonth 
}: MonthlyFinancialTableProps) {
  const [tempIncome, setTempIncome] = useState(data.income);
  const [selectedMonth, setSelectedMonth] = useState(data.month);

  const handleSaveIncome = () => {
    onUpdateIncome(tempIncome);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    onChangeMonth(month);
  };

  // إنشاء قائمة بأشهر السنة الحالية والسابقة
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthValue = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMMM yyyy', { locale: ar });
      months.push({ value: monthValue, name: monthName });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div className="space-y-6">
      {/* اختيار الشهر */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
            <Calendar className="h-5 w-5" />
            اختيار الشهر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {monthOptions.map((month) => (
              <Button
                key={month.value}
                variant={selectedMonth === month.value ? "default" : "outline"}
                onClick={() => handleMonthChange(month.value)}
                className="font-cairo text-sm"
              >
                {month.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إدخال الدخل الشهري */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
            <DollarSign className="h-5 w-5" />
            الدخل الشهري - {data.monthName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-right block font-cairo mb-2">
                أدخل دخلك الشهري (ر.س)
              </Label>
              <Input
                type="number"
                value={tempIncome || ''}
                onChange={(e) => setTempIncome(Number(e.target.value))}
                placeholder="مثال: 12000"
                className="text-right"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSaveIncome}
                className="bg-growup hover:bg-growup-dark font-cairo"
              >
                حفظ الدخل
              </Button>
            </div>
          </div>
          
          {data.income > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-right font-cairo text-sm text-gray-600">
                الدخل الشهري المحفوظ: <span className="font-bold text-growup">{data.income} ريال</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* جدول البيانات المالية */}
      {data.income > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-cairo">
              ملخص مالي مفصل - {data.monthName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right font-cairo">البيان</TableHead>
                    <TableHead className="text-right font-cairo">المبلغ (ر.س)</TableHead>
                    <TableHead className="text-right font-cairo">النسبة من الدخل</TableHead>
                    <TableHead className="text-right font-cairo">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* الدخل الشهري */}
                  <TableRow className="bg-green-50">
                    <TableCell className="font-cairo font-medium">
                      💰 الدخل الشهري
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {data.income.toLocaleString()}
                    </TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        مؤكد
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {/* المصروفات */}
                  <TableRow>
                    <TableCell className="font-cairo font-medium">
                      💸 إجمالي المصروفات
                      {data.expenses.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {data.expenses.map(expense => (
                            <div key={expense.id} className="flex justify-between">
                              <span>{expense.amount} ر.س</span>
                              <span>{expense.categoryName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-red-600">
                      {data.totalExpenses.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {((data.totalExpenses / data.income) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={data.totalExpenses > data.income * 0.7 ? "destructive" : "secondary"}
                        className={data.totalExpenses > data.income * 0.7 ? "" : "bg-yellow-100 text-yellow-800"}
                      >
                        {data.totalExpenses > data.income * 0.7 ? "مرتفع" : "متوسط"}
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {/* الأقساط */}
                  <TableRow>
                    <TableCell className="font-cairo font-medium">
                      💳 الأقساط المدفوعة
                      {data.installments.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {data.installments.map(installment => (
                            <div key={installment.id} className="flex justify-between">
                              <span>{installment.amount} ر.س</span>
                              <span>{installment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-orange-600">
                      {data.totalInstallments.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {((data.totalInstallments / data.income) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-orange-600">
                        التزامات
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {/* صندوق الطوارئ */}
                  <TableRow className="bg-blue-50">
                    <TableCell className="font-cairo font-medium">
                      🚨 صندوق الطوارئ ({data.emergencyFundPercentage}%)
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {data.emergencyFundAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {data.emergencyFundPercentage}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        حماية
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {/* الصافي المتبقي */}
                  <TableRow className={data.netRemaining >= 0 ? "bg-green-50" : "bg-red-50"}>
                    <TableCell className="font-cairo font-medium">
                      💰 الصافي المتبقي (الادخار)
                    </TableCell>
                    <TableCell className={`font-bold ${data.netRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {data.netRemaining.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {((data.netRemaining / data.income) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={data.netRemaining >= 0 ? "secondary" : "destructive"}
                        className={data.netRemaining >= 0 ? "bg-green-100 text-green-800" : ""}
                      >
                        {data.netRemaining >= 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            ممتاز
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 mr-1" />
                            عجز
                          </>
                        )}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
