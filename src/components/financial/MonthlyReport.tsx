import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Mail, Link, LightbulbIcon, BadgeDollarSign, ChartBar, TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface ExpenseItem {
  name: string;
  value: number;
  color: string;
}

interface WithdrawalItem {
  amount: number;
  reason: string;
  date: string;
}

interface EmergencyFund {
  totalAmount: number;
  withdrawals: WithdrawalItem[];
}

interface FinancialReport {
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

interface MonthlyReportProps {
  income: number;
  expenses: ExpenseItem[];
  emergencyFund?: EmergencyFund;
}

export function MonthlyReport({ income, expenses, emergencyFund }: MonthlyReportProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions with better error handling
  const safeNumber = (value: unknown, defaultValue = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  const safeToFixed = (value: unknown, digits = 0): string => {
    const num = safeNumber(value);
    return num.toFixed(digits);
  };

  // Calculate the month names
  const currentMonth = format(new Date(), "MMMM yyyy", { locale: ar });
  const previousMonth = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "MMMM yyyy", { locale: ar });
  
  // Calculate totals with safe number conversions and better data validation
  const safeIncome = safeNumber(income);
  const validExpenses = expenses.filter(expense => expense && typeof expense === 'object');
  const totalExpenses = validExpenses.reduce((sum, expense) => {
    const expenseAmount = safeNumber(expense.value);
    return sum + expenseAmount;
  }, 0);
  
  const expensePercentage = safeIncome > 0 ? (totalExpenses / safeIncome) * 100 : 0;
  const remaining = safeIncome - totalExpenses;
  
  // Find highest expense category with better safeguards
  let highestExpense = { name: "لا توجد مصروفات", amount: 0 };
  if (validExpenses.length > 0) {
    const expenseWithAmounts = validExpenses.map(expense => ({
      name: expense.name || "مصروف غير محدد",
      amount: safeNumber(expense.value)
    }));
    highestExpense = expenseWithAmounts.reduce((prev, current) => {
      return prev.amount > current.amount ? prev : current;
    }, { name: "", amount: 0 });
  }
  
  // Calculate emergency fund withdrawal if available
  const emergencyWithdrawal = emergencyFund?.withdrawals
    ? emergencyFund.withdrawals
        .filter(w => {
          const withdrawalDate = new Date(w.date);
          const now = new Date();
          return withdrawalDate.getMonth() === now.getMonth() - 1 && 
                 withdrawalDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, w) => sum + safeNumber(w.amount), 0)
    : 0;
  
  const emergencyWithdrawalReason = emergencyFund?.withdrawals
    ? emergencyFund.withdrawals
        .filter(w => {
          const withdrawalDate = new Date(w.date);
          const now = new Date();
          return withdrawalDate.getMonth() === now.getMonth() - 1 && 
                 withdrawalDate.getFullYear() === now.getFullYear();
        })
        .map(w => w.reason)
        .join(", ")
    : "";
  
  // Prepare report data with better type safety
  const reportData: FinancialReport = {
    month: previousMonth,
    income: safeIncome,
    totalExpenses: totalExpenses,
    expensePercentage: expensePercentage,
    remainingAmount: remaining,
    categories: validExpenses.map(expense => ({
      name: expense.name || "مصروف غير محدد",
      amount: safeNumber(expense.value),
      percentage: safeIncome > 0 ? (safeNumber(expense.value) / safeIncome) * 100 : 0
    })),
    highestExpense: {
      category: highestExpense.name,
      amount: highestExpense.amount
    },
    emergencyFundWithdrawal: emergencyWithdrawal,
    emergencyFundWithdrawalReason: emergencyWithdrawalReason,
    tips: [
      remaining > 0 
        ? `لقد وفرت هذا الشهر ${safeToFixed(remaining)} ريال — استمر على هذا النهج!` 
        : "حاول أن توفر جزءًا من دخلك الشهر القادم!",
      highestExpense.name && highestExpense.name !== "لا توجد مصروفات"
        ? `الإنفاق على ${highestExpense.name} كان مرتفعًا — حاول تقليله في الشهر القادم.`
        : "تتبع مصاريفك باستمرار لمعرفة أنماط الإنفاق الخاصة بك.",
      "استثمر المتبقي من راتبك في أهدافك الكبرى (تعليم، مشروع، صحة...)."
    ]
  };
  
  const generateHtmlReport = () => {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تقريرك المالي الشهري - ${reportData.month}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            direction: rtl;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .section {
            margin-bottom: 25px;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 15px;
          }
          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          h1 {
            margin: 0;
            font-size: 24px;
          }
          h2 {
            color: #6366f1;
            margin-top: 0;
            font-size: 18px;
            border-right: 4px solid #6366f1;
            padding-right: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          table, th, td {
            border: 1px solid #eaeaea;
          }
          th, td {
            padding: 10px;
            text-align: right;
          }
          th {
            background-color: #f3f4f6;
          }
          .alert {
            background-color: #fef9c3;
            border-right: 4px solid #eab308;
            padding: 10px;
            margin: 15px 0;
          }
          .tips {
            background-color: #f0fdf4;
            padding: 15px;
            border-radius: 6px;
          }
          .tips p {
            margin: 5px 0;
          }
          .green {
            color: #22c55e;
          }
          .red {
            color: #ef4444;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .cta-button {
            display: block;
            text-align: center;
            background-color: #6366f1;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px auto;
            width: 60%;
          }
          .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #6b7280;
            background-color: #f3f4f6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧾 تقريرك المالي الشهري - ${reportData.month}</h1>
            <p>مرحباً بك، هذا تقريرك المفصل للشهر الماضي بناءً على بياناتك في تطبيق Grow Up.</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>💰 ملخص الراتب والمصروفات</h2>
              <div class="summary-item">
                <span><strong>الراتب الكلي المستلم:</strong></span>
                <span>${reportData.income.toFixed(0)} ريال</span>
              </div>
              <div class="summary-item">
                <span><strong>إجمالي المصروفات:</strong></span>
                <span>${reportData.totalExpenses.toFixed(0)} ريال</span>
              </div>
              <div class="summary-item">
                <span><strong>النسبة المستهلكة من الراتب:</strong></span>
                <span>${reportData.expensePercentage.toFixed(1)}%</span>
              </div>
              <div class="summary-item">
                <span><strong>المتبقي من الراتب:</strong></span>
                <span class="${reportData.remainingAmount > 0 ? 'green' : 'red'}">${reportData.remainingAmount.toFixed(0)} ريال</span>
              </div>
            </div>
            
            <div class="section">
              <h2>📊 تصنيف المصروفات</h2>
              <table>
                <thead>
                  <tr>
                    <th>البند</th>
                    <th>القيمة (ريال)</th>
                    <th>النسبة من الراتب</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportData.categories.map(cat => `
                    <tr>
                      <td>${cat.name}</td>
                      <td>${cat.amount.toFixed(0)}</td>
                      <td>${cat.percentage.toFixed(1)}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              ${reportData.highestExpense.category ? `
                <p><strong>📌 أكثر بند تم الصرف عليه:</strong> ${reportData.highestExpense.category} - بقيمة ${reportData.highestExpense.amount.toFixed(0)} ريال</p>
              ` : ''}
            </div>
            
            ${reportData.emergencyFundWithdrawal > 0 ? `
              <div class="section">
                <h2>🚨 استخدام صندوق الطوارئ</h2>
                <div class="summary-item">
                  <span><strong>تم سحب مبلغ:</strong></span>
                  <span>${reportData.emergencyFundWithdrawal.toFixed(0)} ريال</span>
                </div>
                ${reportData.emergencyFundWithdrawalReason ? `
                  <div class="summary-item">
                    <span><strong>سبب السحب:</strong></span>
                    <span>${reportData.emergencyFundWithdrawalReason}</span>
                  </div>
                ` : ''}
                
                <div class="alert">
                  <p>⚠️ <strong>تنبيه:</strong> صندوق الطوارئ وُجد للظروف الطارئة فقط. حاول دائمًا تركه كخط دفاع أخير 🙏</p>
                </div>
              </div>
            ` : ''}
            
            <div class="section">
              <h2>✅ نصائح وتحليلات سلوكية</h2>
              <div class="tips">
                ${reportData.tips.map(tip => `
                  <p>${tip.startsWith("لقد وفرت") ? '🟢' : tip.includes("الإنفاق") ? '🔴' : '🧠'} ${tip}</p>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h2>📆 نحو نمو مالي أفضل</h2>
              <p>استخدم التقارير الشهرية كمرآة تعكس عاداتك المالية — وابدأ الشهر الجديد بهدف واضح وتحكم أفضل في مصاريفك.</p>
              
              <a href="#" class="cta-button">📲 فتح التقرير في التطبيق</a>
            </div>
          </div>
          
          <div class="footer">
            <p>تم إنشاء هذا التقرير تلقائياً عبر تطبيق Grow Up © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailAddress) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال عنوان البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    if (!webhookUrl) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رابط Webhook الخاص بك",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const htmlReport = generateHtmlReport();
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          email: emailAddress,
          subject: `تقريرك المالي الشهري - ${previousMonth}`,
          htmlContent: htmlReport,
          reportData: reportData,
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب التقرير بنجاح! تحقق من بريدك الإلكتروني قريباً.",
      });
      
      setShowDialog(false);
    } catch (error) {
      console.error("خطأ في إرسال التقرير:", error);
      toast({
        title: "حدث خطأ",
        description: "تعذر إرسال التقرير، الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreview = () => {
    const reportWindow = window.open("", "_blank");
    if (reportWindow) {
      reportWindow.document.write(generateHtmlReport());
      reportWindow.document.close();
    } else {
      toast({
        title: "تم حظر النوافذ المنبثقة",
        description: "يرجى السماح بالنوافذ المنبثقة لمعاينة التقرير.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="mt-6 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
          <Calendar className="h-5 w-5" />
          التقرير المالي الشهري
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDialog(true)}
                >
                  <Mail className="h-4 w-4 ml-1" />
                  إرسال بالبريد
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePreview}
                >
                  <Link className="h-4 w-4 ml-1" />
                  معاينة التقرير
                </Button>
              </div>
              <div className="text-right">
                <h3 className="font-cairo font-bold">تقرير شهر {previousMonth}</h3>
                <p className="text-sm text-gray-500">يتم إنشاؤه تلقائياً في نهاية كل شهر</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-md p-4 border-r-4 border-blue-500">
              <div className="flex items-center justify-end gap-2 mb-2">
                <h3 className="font-cairo font-bold">ملخص الراتب والمصروفات</h3>
                <BadgeDollarSign className="h-5 w-5 text-blue-500" />
              </div>
              
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="font-medium">{safeIncome.toFixed(0)} ريال</span>
                  <span>الراتب الكلي</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{totalExpenses.toFixed(0)} ريال</span>
                  <span>إجمالي المصروفات</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{expensePercentage.toFixed(1)}%</span>
                  <span>النسبة المستهلكة</span>
                </div>
                <div className="flex justify-between">
                  <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remaining.toFixed(0)} ريال
                  </span>
                  <span>المتبقي</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-md p-4 border-r-4 border-purple-500">
              <div className="flex items-center justify-end gap-2 mb-2">
                <h3 className="font-cairo font-bold">تصنيف المصروفات</h3>
                <ChartBar className="h-5 w-5 text-purple-500" />
              </div>
              
              <div className="mt-3">
                {highestExpense.name && highestExpense.name !== "لا توجد مصروفات" && (
                  <div className="bg-purple-50 p-2 rounded-md text-right mb-2">
                    <span className="block text-sm text-gray-600">أكثر بند تم الصرف عليه:</span>
                    <span className="font-bold">{highestExpense.name} - {highestExpense.amount.toFixed(0)} ريال</span>
                  </div>
                )}
                
                <div className="max-h-36 overflow-y-auto">
                  {validExpenses.length > 0 ? (
                    validExpenses.map((expense, index) => {
                      const amount = safeNumber(expense.value);
                      return (
                        <div key={index} className="flex justify-between py-1 border-b border-gray-100">
                          <span>{amount.toFixed(0)} ريال</span>
                          <span>{expense.name || "مصروف غير محدد"}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      لا توجد مصروفات مسجلة
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-md p-4 border-r-4 border-amber-500">
            <div className="flex items-center justify-end gap-2 mb-3">
              <h3 className="font-cairo font-bold">نصائح وتحليلات سلوكية</h3>
              <LightbulbIcon className="h-5 w-5 text-amber-500" />
            </div>
            
            <ul className="space-y-2 list-none p-0 text-right">
              {remaining > 0 ? (
                <li className="flex items-center justify-end gap-2">
                  <span>لقد وفرت هذا الشهر {remaining.toFixed(0)} ريال — استمر على هذا النهج!</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </li>
              ) : (
                <li className="flex items-center justify-end gap-2">
                  <span>تجاوزت مصروفاتك الدخل بـ {Math.abs(remaining).toFixed(0)} ريال — حاول تقليص النفقات!</span>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </li>
              )}
              
              {highestExpense.name && highestExpense.name !== "لا توجد مصروفات" && (
                <li className="flex items-center justify-end gap-2">
                  <span>الإنفاق على {highestExpense.name} كان مرتفعًا — حاول تقليله في الشهر القادم.</span>
                  <Wallet className="h-4 w-4 text-amber-500" />
                </li>
              )}
              
              <li className="flex items-center justify-end gap-2">
                <span>استثمر المتبقي من راتبك في أهدافك الكبرى (تعليم، مشروع، صحة...).</span>
                <LightbulbIcon className="h-4 w-4 text-blue-500" />
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">إرسال التقرير بالبريد الإلكتروني</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSendEmail} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-right block" htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                placeholder="user@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-right block" htmlFor="webhook">
                رابط Webhook (Zapier أو خدمة مماثلة)
              </Label>
              <Input
                id="webhook"
                type="url"
                dir="ltr"
                placeholder="https://hooks.zapier.com/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 text-right">
                هذا الرابط سيستخدم لإرسال البريد الإلكتروني عبر خدمة مثل Zapier
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                إلغاء
              </Button>
              <Button 
                type="submit" 
                className="bg-growup hover:bg-growup-dark"
                disabled={isLoading}
              >
                {isLoading ? "جاري الإرسال..." : "إرسال التقرير"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
