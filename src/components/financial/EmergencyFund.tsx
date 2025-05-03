
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Bell, ShieldAlert, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define transaction type for emergency fund
interface EmergencyTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: "deposit" | "withdrawal";
}

interface EmergencyFundProps {
  income: number;
  setIncome: (value: number) => void;
}

export function EmergencyFund({ income, setIncome }: EmergencyFundProps) {
  const { toast } = useToast();
  const [totalEmergencyFund, setTotalEmergencyFund] = useState<number>(0);
  const [transactions, setTransactions] = useState<EmergencyTransaction[]>([]);
  const [emergencyPercentage, setEmergencyPercentage] = useState<number>(15);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [withdrawalReason, setWithdrawalReason] = useState<string>("");
  
  // Target emergency fund (6 months of income is recommended)
  const targetEmergencyFund = income * 6;
  
  // Progress calculation
  const fundProgress = targetEmergencyFund > 0 ? (totalEmergencyFund / targetEmergencyFund) * 100 : 0;
  
  // Format date in Arabic
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // Add monthly contribution automatically when income changes
  useEffect(() => {
    if (income > 0) {
      const monthlyContribution = (income * emergencyPercentage) / 100;
      
      // Simulate monthly deposit
      const newTransaction: EmergencyTransaction = {
        id: `deposit-${Date.now()}`,
        date: new Date().toISOString(),
        amount: monthlyContribution,
        description: "المساهمة الشهرية التلقائية",
        type: "deposit"
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setTotalEmergencyFund(prev => prev + monthlyContribution);
      
      toast({
        title: "تم إضافة المساهمة الشهرية",
        description: `تمت إضافة ${monthlyContribution.toFixed(0)} ريال لصندوق الطوارئ (${emergencyPercentage}% من دخلك)`,
      });
    }
  }, [income, emergencyPercentage, toast]);
  
  // Check if emergency fund is below threshold (2 months of income)
  useEffect(() => {
    const threshold = income * 2;
    if (totalEmergencyFund < threshold && totalEmergencyFund > 0) {
      toast({
        title: "تنبيه صندوق الطوارئ",
        description: "رصيد صندوق الطوارئ أقل من المستوى الموصى به (راتب شهرين)",
        variant: "destructive",
      });
    }
  }, [totalEmergencyFund, income, toast]);

  // Handle withdrawal
  const handleWithdrawal = () => {
    if (withdrawalAmount <= 0) {
      toast({
        title: "خطأ",
        description: "يجب إدخال قيمة صحيحة",
        variant: "destructive"
      });
      return;
    }
    
    if (withdrawalAmount > totalEmergencyFund) {
      toast({
        title: "خطأ",
        description: "المبلغ المطلوب أكبر من الرصيد المتاح",
        variant: "destructive"
      });
      return;
    }
    
    if (withdrawalReason.trim() === "") {
      toast({
        title: "خطأ",
        description: "يرجى إدخال سبب السحب",
        variant: "destructive"
      });
      return;
    }
    
    const newTransaction: EmergencyTransaction = {
      id: `withdrawal-${Date.now()}`,
      date: new Date().toISOString(),
      amount: withdrawalAmount,
      description: withdrawalReason,
      type: "withdrawal"
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setTotalEmergencyFund(prev => prev - withdrawalAmount);
    
    setWithdrawalAmount(0);
    setWithdrawalReason("");
    setShowWithdrawDialog(false);
    
    toast({
      title: "تم السحب",
      description: `تم سحب ${withdrawalAmount.toFixed(0)} ريال من صندوق الطوارئ`,
    });
  };

  // Change contribution percentage
  const handlePercentageChange = (value: string) => {
    const newPercentage = parseInt(value);
    setEmergencyPercentage(newPercentage);
    
    toast({
      title: "تم تغيير نسبة المساهمة",
      description: `تم تعديل نسبة المساهمة الشهرية إلى ${newPercentage}% من الدخل`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-right font-cairo flex items-center justify-end gap-2">
            <ShieldAlert className="h-5 w-5" />
            صندوق الطوارئ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 font-cairo">
                  {fundProgress.toFixed(1)}% من الهدف
                </div>
                <div className="font-cairo font-bold">
                  {totalEmergencyFund.toFixed(0)} / {targetEmergencyFund.toFixed(0)} ريال
                </div>
              </div>
              
              <Progress value={fundProgress > 100 ? 100 : fundProgress} className="bg-amber-200 h-3">
                <div className="h-full bg-amber-500 transition-all" />
              </Progress>
              
              <div className="text-sm text-gray-600 text-right font-cairo">
                الهدف الموصى به: ما يعادل 6 أشهر من الدخل الشهري
              </div>
              
              {totalEmergencyFund < income * 2 && totalEmergencyFund > 0 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-right">تحذير</AlertTitle>
                  <AlertDescription className="text-right">
                    رصيد صندوق الطوارئ أقل من المستوى الموصى به (راتب شهرين على الأقل)
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Wallet className="h-4 w-4 ml-1" />
                      سحب من الصندوق
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-right">سحب من صندوق الطوارئ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-right block">المبلغ (ريال)</Label>
                        <Input 
                          type="number" 
                          className="text-right" 
                          placeholder="مثال: 3000" 
                          value={withdrawalAmount || ''}
                          onChange={e => setWithdrawalAmount(Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-right block">سبب السحب</Label>
                        <Input 
                          className="text-right" 
                          placeholder="مثال: إصلاح سيارة" 
                          value={withdrawalReason}
                          onChange={e => setWithdrawalReason(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                          إلغاء
                        </Button>
                        <Button 
                          className="bg-growup hover:bg-growup-dark"
                          onClick={handleWithdrawal}
                        >
                          سحب المبلغ
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div>
                  <div className="flex flex-col items-end mb-2">
                    <div className="text-lg font-bold font-cairo">{totalEmergencyFund.toFixed(0)} ريال</div>
                    <div className="text-sm text-gray-500">الرصيد الحالي</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg">
                <div className="text-right mb-3 font-cairo font-bold">نسبة المساهمة الشهرية</div>
                <RadioGroup 
                  defaultValue="15" 
                  value={emergencyPercentage.toString()} 
                  onValueChange={handlePercentageChange} 
                  className="flex flex-row-reverse gap-6 justify-end"
                >
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <RadioGroupItem value="10" id="r_10" />
                    <Label htmlFor="r_10">10%</Label>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <RadioGroupItem value="15" id="r_15" />
                    <Label htmlFor="r_15">15%</Label>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <RadioGroupItem value="20" id="r_20" />
                    <Label htmlFor="r_20">20%</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-600 text-right mt-2 font-cairo">
                  سيتم تخصيص {emergencyPercentage}% من دخلك الشهري ({((income * emergencyPercentage) / 100).toFixed(0)} ريال)
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3 text-right font-cairo">سجل المعاملات</h3>
            {transactions.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className={`text-right font-bold ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "deposit" ? "إيداع" : "سحب"}
                        </TableCell>
                        <TableCell className={`text-right ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount.toFixed(0)} ريال
                        </TableCell>
                        <TableCell className="text-right">{transaction.description}</TableCell>
                        <TableCell className="text-right" dir="rtl">
                          {formatDate(transaction.date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                لا توجد معاملات بعد
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-end gap-2 mb-2">
                <div className="text-lg font-bold text-right font-cairo">نصائح صندوق الطوارئ</div>
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <ul className="space-y-2 text-right font-cairo">
                <li>- ابدأ بتجميع راتب شهر، ثم راتب شهرين، وصولاً لراتب 6 أشهر</li>
                <li>- استخدم صندوق الطوارئ للحالات الطارئة فقط مثل الإصلاحات المفاجئة أو المشاكل الصحية</li>
                <li>- حاول تعويض المبلغ المسحوب في أقرب وقت ممكن</li>
                <li>- احتفظ بجزء من صندوق الطوارئ في حساب يسهل الوصول إليه بسرعة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
