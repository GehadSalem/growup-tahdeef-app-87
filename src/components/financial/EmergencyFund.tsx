
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
import { Bell, LightbulbIcon, ShieldAlert, Wallet, Plus } from "lucide-react";
import { EmergencyService } from "@/services/emergencyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface EmergencyFundProps {
  income: number;
  setIncome: (value: number) => void;
}

export function EmergencyFund({ income, setIncome }: EmergencyFundProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emergencyPercentage, setEmergencyPercentage] = useState(10);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositReason, setDepositReason] = useState("");
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);

  const targetEmergencyFund = income * 6;

  // Get emergency fund data
  const { data: emergencyData, isLoading } = useQuery({
    queryKey: ['emergency'],
    queryFn: EmergencyService.getEmergencyFunds,
  });

  const totalEmergencyFund = emergencyData?.totalAmount || 0;
  const transactions = emergencyData?.transactions || [];
  const fundProgress = targetEmergencyFund > 0 ? (totalEmergencyFund / targetEmergencyFund) * 100 : 0;

  // Add deposit mutation
  const addDepositMutation = useMutation({
    mutationFn: EmergencyService.addToEmergencyFund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency'] });
      toast({
        title: "تم إضافة المبلغ",
        description: `تمت إضافة ${depositAmount} ريال لصندوق الطوارئ`,
      });
      setDepositAmount(0);
      setDepositReason("");
      setShowDepositDialog(false);
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إضافة المبلغ", variant: "destructive" });
    }
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: EmergencyService.withdrawFromEmergencyFund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency'] });
      toast({
        title: "تم السحب",
        description: `تم سحب ${withdrawalAmount} ريال من صندوق الطوارئ`,
      });
      setWithdrawalAmount(0);
      setWithdrawalReason("");
      setShowWithdrawDialog(false);
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل عملية السحب", variant: "destructive" });
    }
  });

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
  };

  const handleDeposit = () => {
    if (depositAmount <= 0 || depositReason.trim() === "") {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة وسبب صالحين",
        variant: "destructive"
      });
      return;
    }

    addDepositMutation.mutate({
      amount: depositAmount,
      description: depositReason,
      type: "deposit"
    });
  };

  const handleWithdrawal = () => {
    if (withdrawalAmount <= 0 || withdrawalAmount > totalEmergencyFund || withdrawalReason.trim() === "") {
      toast({
        title: "خطأ",
        description: "يرجى إدخال قيمة وسبب صالحين",
        variant: "destructive"
      });
      return;
    }

    withdrawMutation.mutate({
      amount: withdrawalAmount,
      description: withdrawalReason
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-cairo text-gray-600">جاري تحميل صندوق الطوارئ...</p>
        </div>
      </div>
    );
  }

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
                  {fundProgress.toFixed(1)}% من الهدف
                </div>
                <div className="font-bold">
                  {totalEmergencyFund.toFixed(0)} / {targetEmergencyFund.toFixed(0)} ريال
                </div>
              </div>

              <Progress value={Math.min(fundProgress, 100)} className="h-3 bg-amber-200" />
              <div className="text-sm text-gray-600 text-right">الهدف: 6 أشهر من الدخل</div>
<div className="flex justify-between mb-2">
                  <div className="text-lg font-bold">
                    {totalEmergencyFund.toFixed(0)} ريال
                  </div>
                  <div className="text-sm text-gray-500">الرصيد الحالي</div>
                </div>
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
              <div className="flex justify-between items-center gap-2">
                {/* Add to Emergency Fund Dialog */}
                <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-1 bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة للصندوق
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة مبلغ لصندوق الطوارئ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>المبلغ (ريال)</Label>
                        <Input
                          type="number"
                          value={depositAmount || ""}
                          onChange={e => setDepositAmount(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>سبب الإضافة</Label>
                        <Input
                          value={depositReason}
                          onChange={e => setDepositReason(e.target.value)}
                          placeholder="مثال: مكافأة شهرية"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowDepositDialog(false)}>إلغاء</Button>
                        <Button onClick={handleDeposit} disabled={addDepositMutation.isPending}>
                          {addDepositMutation.isPending ? "جاري الإضافة..." : "إضافة"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Withdraw from Emergency Fund Dialog */}
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
                          placeholder="مثال: طارئ طبي"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>إلغاء</Button>
                        <Button onClick={handleWithdrawal} disabled={withdrawMutation.isPending}>
                          {withdrawMutation.isPending ? "جاري السحب..." : "سحب"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                
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
                  {((income * emergencyPercentage) / 100).toFixed(0)} ريال)
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
                          {t.amount ? Number(t.amount).toFixed(0) : "—"} ريال
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