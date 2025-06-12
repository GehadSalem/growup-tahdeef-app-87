
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Edit2, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SavingsGoalsService } from "@/services/savingsGoalsService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SavingsGoalProps {
  income: number;
}

export function SavingsGoal({ income }: SavingsGoalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState(0);
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [addAmount, setAddAmount] = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddAmountDialog, setShowAddAmountDialog] = useState(false);

  // Get savings goals from API
  const { data: savingsGoals = [], isLoading } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: SavingsGoalsService.getUserSavingsGoals,
  });

  // Create savings goal mutation
  const createGoalMutation = useMutation({
    mutationFn: SavingsGoalsService.createSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "تم إنشاء الهدف",
        description: "تم إنشاء هدف التوفير بنجاح"
      });
      setNewGoalName("");
      setNewGoalAmount(0);
      setNewGoalDescription("");
      setShowAddDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء هدف التوفير",
        variant: "destructive"
      });
    }
  });

  // Add to savings goal mutation
  const addToGoalMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: { amount: number } }) => 
      SavingsGoalsService.addToSavingsGoal(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "تم إضافة المبلغ",
        description: "تم إضافة المبلغ إلى هدف التوفير بنجاح"
      });
      setAddAmount(0);
      setShowAddAmountDialog(false);
      setSelectedGoalId(null);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة المبلغ",
        variant: "destructive"
      });
    }
  });

  // Delete savings goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: SavingsGoalsService.deleteSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "تم حذف الهدف",
        description: "تم حذف هدف التوفير بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف هدف التوفير",
        variant: "destructive"
      });
    }
  });

  const handleCreateGoal = () => {
    if (!newGoalName || newGoalAmount <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم الهدف ومبلغ صحيح",
        variant: "destructive"
      });
      return;
    }

    createGoalMutation.mutate({
      goalName: newGoalName,
      targetAmount: newGoalAmount,
      description: newGoalDescription
    });
  };

  const handleAddToGoal = () => {
    if (!selectedGoalId || addAmount <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال مبلغ صحيح",
        variant: "destructive"
      });
      return;
    }

    addToGoalMutation.mutate({
      id: selectedGoalId,
      amount: { amount: addAmount }
    });
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الهدف؟")) {
      deleteGoalMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-cairo text-gray-600">جاري تحميل أهداف التوفير...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="mb-4 sm:mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-cairo flex justify-between items-center text-base sm:text-lg">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Plus className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  إضافة هدف توفير
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-right font-cairo">إضافة هدف توفير جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-right block font-cairo">اسم الهدف</Label>
                    <Input
                      placeholder="مثل: شراء سيارة، رحلة، طوارئ..."
                      className="text-right"
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block font-cairo">المبلغ المستهدف (ر.س)</Label>
                    <Input
                      type="number"
                      placeholder="مثل: 50000"
                      className="text-right"
                      value={newGoalAmount || ''}
                      onChange={(e) => setNewGoalAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-right block font-cairo">وصف الهدف (اختياري)</Label>
                    <Input
                      placeholder="تفاصيل إضافية عن الهدف..."
                      className="text-right"
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      onClick={handleCreateGoal}
                      disabled={createGoalMutation.isPending}
                      className="bg-growup hover:bg-growup-dark"
                    >
                      {createGoalMutation.isPending ? "جاري الإنشاء..." : "إنشاء الهدف"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <span>أهداف التوفير</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savingsGoals.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-cairo mb-4">لا توجد أهداف توفير حالياً</p>
              <p className="text-sm text-gray-400 font-cairo">أضف هدف توفير جديد لتبدأ في تحقيق أهدافك المالية</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savingsGoals.map((goal) => {
                const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                
                return (
                  <div key={goal.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedGoalId(goal.id);
                            setShowAddAmountDialog(true);
                          }}
                          className="text-xs"
                        >
                          <Plus className="h-3 w-3 ml-1" />
                          إضافة مبلغ
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold font-cairo text-sm sm:text-base">{goal.name}</h3>
                        {goal.description && (
                          <p className="text-xs sm:text-sm text-gray-600 font-cairo">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-cairo">{Math.round(progress)}% مكتمل</span>
                        <span className="font-cairo font-bold">
                          {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} ر.س
                        </span>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-growup rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dialog for adding amount to savings goal */}
          <Dialog open={showAddAmountDialog} onOpenChange={setShowAddAmountDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right font-cairo">إضافة مبلغ للهدف</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block font-cairo">المبلغ المراد إضافته (ر.س)</Label>
                  <Input
                    type="number"
                    placeholder="مثل: 1000"
                    className="text-right"
                    value={addAmount || ''}
                    onChange={(e) => setAddAmount(Number(e.target.value))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    onClick={handleAddToGoal}
                    disabled={addToGoalMutation.isPending}
                    className="bg-growup hover:bg-growup-dark"
                  >
                    {addToGoalMutation.isPending ? "جاري الإضافة..." : "إضافة المبلغ"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddAmountDialog(false);
                      setAddAmount(0);
                      setSelectedGoalId(null);
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </section>
  );
}
