import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell, LightbulbIcon, ShieldAlert, Wallet } from "lucide-react";
import { EmergencyService } from "@/services/emergencyService.ts";

interface EmergencyFundProps {
  income: number;
  setIncome: (value: number) => void;
}

export function EmergencyFund({ income, setIncome }: EmergencyFundProps) {
  const { toast } = useToast();
  const [emergencyPercentage, setEmergencyPercentage] = useState(10);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalEmergencyFund, setTotalEmergencyFund] = useState(0);

  const targetEmergencyFund = income * 6;
  const fundProgress = targetEmergencyFund > 0 ? (totalEmergencyFund / targetEmergencyFund) * 100 : 0;

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
  };

  const fetchEmergencyData = async () => {
    try {
      const data = await EmergencyService.getEmergencyFunds();
      setTransactions(data.transactions || []);
      setTotalEmergencyFund(data.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching emergency fund:", error);
      toast({ title: "خطأ", description: "تعذر تحميل البيانات", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  // useEffect(() => {
  //   if (income > 0) {
  //     const monthlyContribution = (income * emergencyPercentage) / 100;

  //     EmergencyService.addToEmergencyFund({
  //       amount: monthlyContribution,
  //       description: "المساهمة الشهرية التلقائية",
  //       type: "deposit",
  //     }).then(() => {
  //       toast({
  //         title: "تم إضافة المساهمة الشهرية",
  //         description: `تمت إضافة ${monthlyContribution.toFixed(0)} ريال لصندوق الطوارئ`,
  //       });
  //       fetchEmergencyData();
  //     }).catch(() => {
  //       toast({ title: "خطأ", description: "فشل الإضافة", variant: "destructive" });
  //     });
  //   }
  // }, [income, emergencyPercentage]);

  const handleWithdrawal = () => {
    if (withdrawalAmount <= 0 || withdrawalAmount > totalEmergencyFund || withdrawalReason.trim() === "") {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة وسبب صالحين",
        variant: "destructive"
      });
      return;
    }

    EmergencyService.addToEmergencyFund({
      amount: withdrawalAmount,
      description: withdrawalReason,
      type: "withdrawal"
    }).then(() => {
      toast({
        title: "تم السحب",
        description: `تم سحب ${withdrawalAmount.toFixed(0)} ريال من صندوق الطوارئ`,
      });
      setWithdrawalAmount(0);
      setWithdrawalReason("");
      setShowWithdrawDialog(false);
      fetchEmergencyData();
    }).catch(() => {
      toast({ title: "خطأ", description: "فشل عملية السحب", variant: "destructive" });
    });
  };

  const handlePercentageChange = (value: string) => {
    const newPercentage = parseInt(value);
    setEmergencyPercentage(newPercentage);
    toast({
      title: "تم تغيير النسبة",
      description: `تم تعديل النسبة إلى ${newPercentage}%`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-right flex justify-end items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            صندوق الطوارئ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {typeof fundProgress === "number" ? fundProgress.toFixed(1) : "0"}% من الهدف
                </div>
                <div className="font-bold">
                  {typeof totalEmergencyFund === "number" ? totalEmergencyFund.toFixed(0) : "0"} /{" "}
                  {typeof targetEmergencyFund === "number" ? targetEmergencyFund.toFixed(0) : "0"} ريال
                </div>
              </div>

              <Progress value={Math.min(fundProgress, 100)} className="h-3 bg-amber-200" />
              <div className="text-sm text-gray-600 text-right">الهدف: 6 أشهر من الدخل</div>

              {totalEmergencyFund > 0 && (
                <Alert className="bg-green-50 border-green-200">
                  <Bell className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-right text-green-700">ممتاز!</AlertTitle>
                  <AlertDescription className="text-right text-green-700">
                    💡 أنت تدخر للطوارئ بنسبة {emergencyPercentage}% من دخلك. استمر!
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>سحب من صندوق الطوارئ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>المبلغ (ريال)</Label>
                        <Input
                          type="number"
                          value={withdrawalAmount || ""}
                          onChange={e => setWithdrawalAmount(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>سبب السحب</Label>
                        <Input
                          value={withdrawalReason}
                          onChange={e => setWithdrawalReason(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>إلغاء</Button>
                        <Button onClick={handleWithdrawal}>سحب</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex flex-col items-end mb-2">
                  <div className="text-lg font-bold">
                    {typeof totalEmergencyFund === "number" ? totalEmergencyFund.toFixed(0) : "0"} ريال
                  </div>
                  <div className="text-sm text-gray-500">الرصيد الحالي</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <div className="text-right mb-2 font-bold">نسبة المساهمة الشهرية</div>
                <RadioGroup
                  value={emergencyPercentage.toString()}
                  onValueChange={handlePercentageChange}
                  className="flex flex-row-reverse gap-6 justify-end"
                >
                  {[10, 15, 20].map(p => (
                    <div key={p} className="flex items-center gap-2 flex-row-reverse">
                      <RadioGroupItem value={p.toString()} id={`r_${p}`} />
                      <Label htmlFor={`r_${p}`}>{p}%</Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-sm text-right mt-2 text-gray-600">
                  سيتم تخصيص {emergencyPercentage}% من الدخل (
                  {typeof income === "number"
                    ? ((income * emergencyPercentage) / 100).toFixed(0)
                    : "0"} ريال)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3 text-right">سجل المعاملات</h3>
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
                    {transactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className={`text-right font-bold ${t.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                          {t.type === "deposit" ? "إيداع" : "سحب"}
                        </TableCell>
                        <TableCell className={`text-right ${t.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                          {typeof t.amount === "number" ? t.amount.toFixed(0) : "—"} ريال
                        </TableCell>
                        <TableCell className="text-right">{t.description}</TableCell>
                        <TableCell className="text-right">{formatDate(t.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">لا توجد معاملات بعد</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
