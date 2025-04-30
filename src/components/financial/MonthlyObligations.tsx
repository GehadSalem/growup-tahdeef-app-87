
import { useState, useEffect } from "react";
import { format, addMonths, addDays, isAfter, isBefore } from "date-fns";
import { ar } from "date-fns/locale";
import { Bell, Calendar, Plus, PiggyBank, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

// تعريف أنواع الالتزامات
type ObligationType = "قسط" | "مناسبة" | "شراء" | "آخر";
type RecurrenceType = "شهري" | "ربع سنوي" | "سنوي" | "مرة واحدة";

// واجهة الالتزام
interface Obligation {
  id: string;
  name: string;
  type: ObligationType;
  amount: number;
  dueDate: string;
  recurrence: RecurrenceType;
  notes?: string;
  isPaid: boolean;
  enableNotifications: boolean;
  notificationSent?: boolean;
}

export function MonthlyObligations() {
  const { toast } = useToast();
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [income, setIncome] = useState<number>(12000);
  const [showAddObligationDialog, setShowAddObligationDialog] = useState(false);
  const [newObligation, setNewObligation] = useState<Omit<Obligation, "id" | "isPaid" | "enableNotifications">>({
    name: "",
    type: "قسط",
    amount: 0,
    dueDate: format(new Date(), "yyyy-MM-dd"),
    recurrence: "شهري",
    notes: "",
  });
  
  const [savingsGoal, setSavingsGoal] = useState<number>(3000);

  // حساب إجمالي الالتزامات
  const totalObligations = obligations.reduce((sum, obligation) => sum + obligation.amount, 0);
  
  // حساب المتبقي من الراتب بعد الالتزامات
  const remainingIncome = income - totalObligations;
  
  // حساب المتبقي للادخار
  const savingsRemaining = remainingIncome - savingsGoal;
  
  // حساب نسبة الالتزامات من الراتب
  const obligationPercentage = (totalObligations / income) * 100;

  // إضافة التزام جديد
  const handleAddObligation = () => {
    if (newObligation.name.trim() === "") {
      toast({
        title: "خطأ",
        description: "يجب إدخال اسم الالتزام",
        variant: "destructive",
      });
      return;
    }

    if (newObligation.amount <= 0) {
      toast({
        title: "خطأ",
        description: "يجب إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    const newId = `obligation-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    setObligations([...obligations, {
      ...newObligation,
      id: newId,
      isPaid: false,
      enableNotifications: true,
    }]);
    
    setNewObligation({
      name: "",
      type: "قسط",
      amount: 0,
      dueDate: format(new Date(), "yyyy-MM-dd"),
      recurrence: "شهري",
      notes: "",
    });
    
    setShowAddObligationDialog(false);
    
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الالتزام الجديد بنجاح",
    });
  };

  // تعديل حالة الدفع
  const togglePaymentStatus = (id: string) => {
    setObligations(obligations.map(obligation => 
      obligation.id === id ? { ...obligation, isPaid: !obligation.isPaid } : obligation
    ));
  };

  // حساب تاريخ السداد القادم حسب التكرار
  const getNextPaymentDate = (dueDate: string, recurrence: RecurrenceType): string => {
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
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // حساب تأثير الالتزام على الراتب كنسبة مئوية
  const calculateImpact = (amount: number): string => {
    const percentage = (amount / income) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  // فحص الالتزامات القريبة وإرسال إشعارات
  useEffect(() => {
    const today = new Date();
    const threeDaysLater = addDays(today, 3);
    
    obligations.forEach(obligation => {
      if (!obligation.isPaid && obligation.enableNotifications) {
        const nextPaymentDate = new Date(getNextPaymentDate(obligation.dueDate, obligation.recurrence));
        
        // إشعار لليوم نفسه
        if (format(today, "yyyy-MM-dd") === format(nextPaymentDate, "yyyy-MM-dd") && !obligation.notificationSent) {
          toast({
            title: "موعد سداد اليوم!",
            description: `حان موعد سداد "${obligation.name}" بمبلغ ${obligation.amount} ريال`,
          });
          
          // تحديث حالة الإشعار
          setObligations(prev => prev.map(item => 
            item.id === obligation.id ? { ...item, notificationSent: true } : item
          ));
        }
        
        // إشعار قبل 3 أيام
        else if (
          isAfter(nextPaymentDate, today) && 
          isBefore(nextPaymentDate, threeDaysLater) && 
          !obligation.notificationSent
        ) {
          toast({
            title: "تذكير بموعد سداد قريب",
            description: `موعد سداد "${obligation.name}" سيكون في ${formatDate(nextPaymentDate.toString())}`,
          });
          
          // تحديث حالة الإشعار
          setObligations(prev => prev.map(item => 
            item.id === obligation.id ? { ...item, notificationSent: true } : item
          ));
        }
      }
    });
    
    // إعادة تعيين حالة الإشعارات كل يوم
    const resetNotifications = () => {
      setObligations(prev => prev.map(item => ({ ...item, notificationSent: false })));
    };
    
    const midnightReset = setInterval(resetNotifications, 86400000); // 24 ساعة
    
    return () => clearInterval(midnightReset);
  }, [obligations, toast]);

  // بيانات للرسم البياني حسب النوع
  const pieChartData = () => {
    const data: { [key: string]: number } = {};
    
    obligations.forEach(obligation => {
      if (data[obligation.type]) {
        data[obligation.type] += obligation.amount;
      } else {
        data[obligation.type] = obligation.amount;
      }
    });
    
    return Object.keys(data).map(type => ({
      name: type,
      value: data[type],
    }));
  };

  // ألوان الرسم البياني حسب النوع
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
            <PiggyBank className="h-5 w-5" />
            الالتزامات الشهرية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Dialog open={showAddObligationDialog} onOpenChange={setShowAddObligationDialog}>
              <DialogTrigger asChild>
                <Button className="bg-growup hover:bg-growup-dark">
                  <Plus className="mr-0 ml-2 h-4 w-4" />
                  إضافة التزام جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-right">إضافة التزام جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-right block">الاسم</Label>
                    <Input 
                      className="text-right" 
                      placeholder="مثال: قسط سيارة" 
                      value={newObligation.name}
                      onChange={e => setNewObligation({...newObligation, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">نوع الالتزام</Label>
                    <select 
                      className="w-full p-2 border rounded text-right" 
                      value={newObligation.type}
                      onChange={e => setNewObligation({...newObligation, type: e.target.value as ObligationType})}
                    >
                      <option value="قسط">قسط</option>
                      <option value="مناسبة">مناسبة</option>
                      <option value="شراء">شراء</option>
                      <option value="آخر">آخر</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">المبلغ (ريال)</Label>
                    <Input 
                      type="number" 
                      className="text-right" 
                      placeholder="مثال: 3000" 
                      value={newObligation.amount || ''}
                      onChange={e => setNewObligation({...newObligation, amount: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">تاريخ الاستحقاق</Label>
                    <Input 
                      type="date" 
                      className="text-right" 
                      value={newObligation.dueDate}
                      onChange={e => setNewObligation({...newObligation, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">تكرار الالتزام</Label>
                    <select 
                      className="w-full p-2 border rounded text-right" 
                      value={newObligation.recurrence}
                      onChange={e => setNewObligation({...newObligation, recurrence: e.target.value as RecurrenceType})}
                    >
                      <option value="شهري">شهري</option>
                      <option value="ربع سنوي">ربع سنوي</option>
                      <option value="سنوي">سنوي</option>
                      <option value="مرة واحدة">مرة واحدة</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-right block">ملاحظة إضافية (اختياري)</Label>
                    <Textarea 
                      className="text-right" 
                      placeholder="أضف أي ملاحظات إضافية هنا" 
                      value={newObligation.notes}
                      onChange={e => setNewObligation({...newObligation, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddObligationDialog(false)}>
                      إلغاء
                    </Button>
                    <Button 
                      className="bg-growup hover:bg-growup-dark"
                      onClick={handleAddObligation}
                    >
                      إضافة
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="text-right text-lg font-bold font-cairo">
              إدارة الالتزامات المالية
            </div>
          </div>
          
          {/* ملخص الالتزامات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-right">
                <div className="text-sm text-gray-500">إجمالي الالتزامات</div>
                <div className="text-xl font-bold">{totalObligations} ريال</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-right">
                <div className="text-sm text-gray-500">الراتب بعد الالتزامات</div>
                <div className="text-xl font-bold">{remainingIncome} ريال</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-right">
                <div className="text-sm text-gray-500">المتبقي للادخار</div>
                <div className="text-xl font-bold">{savingsRemaining} ريال</div>
              </CardContent>
            </Card>
            
            <Card className={`${obligationPercentage > 50 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <CardContent className="p-4 text-right">
                <div className="text-sm text-gray-500">نسبة الالتزامات من الدخل</div>
                <div className="text-xl font-bold">{obligationPercentage.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>
          
          {obligationPercentage > 50 && (
            <div className="bg-red-100 border-r-4 border-red-500 p-4 mb-6 flex items-center rounded-md">
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-bold text-red-700">تحذير</span>
                  <AlertTriangle className="h-5 w-5 text-red-700" />
                </div>
                <p className="text-red-700">الالتزامات تستهلك أكثر من 50% من دخلك. يُنصح بمراجعة الإنفاق الشهري.</p>
              </div>
            </div>
          )}
          
          {savingsRemaining < 0 && (
            <div className="bg-amber-100 border-r-4 border-amber-500 p-4 mb-6 flex items-center rounded-md">
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-bold text-amber-700">تنبيه</span>
                  <AlertTriangle className="h-5 w-5 text-amber-700" />
                </div>
                <p className="text-amber-700">
                  أنت بحاجة إلى {Math.abs(savingsRemaining)} ريال إضافية لتحقيق هدف الادخار لهذا الشهر.
                </p>
              </div>
            </div>
          )}
          
          {/* جدول الالتزامات */}
          <div className="mb-6 overflow-x-auto">
            <h3 className="text-lg font-bold mb-3 text-right font-cairo">قائمة الالتزامات</h3>
            {obligations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نسبة التأثير</TableHead>
                    <TableHead className="text-right">حالة السداد</TableHead>
                    <TableHead className="text-right">تاريخ السداد القادم</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">اسم الالتزام</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obligations.map((obligation) => (
                    <TableRow key={obligation.id}>
                      <TableCell className="text-right">{calculateImpact(obligation.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={obligation.isPaid ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => togglePaymentStatus(obligation.id)}
                          className={obligation.isPaid ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {obligation.isPaid ? "تم الدفع" : "غير مدفوع"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right" dir="rtl">
                        {formatDate(getNextPaymentDate(obligation.dueDate, obligation.recurrence))}
                      </TableCell>
                      <TableCell className="text-right">{obligation.amount} ريال</TableCell>
                      <TableCell className="text-right">{obligation.type}</TableCell>
                      <TableCell className="text-right">{obligation.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                لا يوجد التزامات مضافة بعد. قم بإضافة التزام جديد باستخدام الزر أعلاه.
              </div>
            )}
          </div>
          
          {/* الرسوم البيانية والتحليلات */}
          {obligations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right font-cairo">توزيع الالتزامات حسب النوع</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieChartData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value} ريال`}
                      >
                        {pieChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} ريال`} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-right font-cairo">أكثر الالتزامات استنزافاً للراتب</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={obligations
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map(item => ({ name: item.name, amount: item.amount }))
                      }
                      layout="vertical"
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                      <Tooltip formatter={(value) => `${value} ريال`} />
                      <Bar dataKey="amount" fill="#8884d8" name="المبلغ" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* نصائح مالية */}
          <div className="mt-6">
            <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح لإدارة الالتزامات</h3>
                
                <div className="space-y-3 text-right">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-cairo">خصص ما بين 50-30-20 من دخلك: 50% للضروريات، 30% للرغبات، 20% للادخار.</p>
                  </div>
                  
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-cairo">حدد الالتزامات غير الضرورية وفكر في تقليلها أو إلغائها.</p>
                  </div>
                  
                  <div className="bg-white/60 p-3 rounded-lg">
                    <p className="font-cairo">جدول دفعاتك مبكراً لتجنب الغرامات والفوائد الإضافية.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
