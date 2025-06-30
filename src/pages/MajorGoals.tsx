import React, { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Target, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MajorGoalsService } from "@/services/majorGoalsService";
import { NotificationHelper } from "@/services/notificationHelper";
import { DateDropdowns } from "@/components/ui/DateDropdowns";

// أنواع الأهداف الكبرى
const GOAL_TYPES = [
  { id: "marriage", name: "الزواج", icon: "💍" },
  { id: "car", name: "شراء سيارة", icon: "🚗" },
  { id: "house", name: "شراء منزل", icon: "🏠" },
  { id: "business", name: "بدء مشروع", icon: "💼" },
  { id: "education", name: "التعليم", icon: "🎓" },
  { id: "other", name: "أخرى", icon: "🎯" },
];

// الفرص المهنية لزيادة الدخل
const CAREER_OPPORTUNITIES = [
  {
    title: "التطوير البرمجي",
    description: "تعلم البرمجة لتطوير تطبيقات الويب والهواتف",
    avgIncome: "5000-20000 ريال شهرياً",
    resources: ["Udemy", "Coursera", "freeCodeCamp"],
  },
  {
    title: "التسويق الرقمي",
    description: "إدارة حملات التسويق الرقمي والتسويق عبر وسائل التواصل",
    avgIncome: "4000-15000 ريال شهرياً",
    resources: ["Google Digital Garage", "HubSpot Academy"],
  },
  {
    title: "التصميم الجرافيكي",
    description: "تصميم الشعارات والهويات البصرية والمحتوى المرئي",
    avgIncome: "3000-12000 ريال شهرياً",
    resources: ["Adobe Tutorials", "Behance", "Dribbble"],
  },
];

interface MonthlySaving {
  month: string;
  amount: number;
  date: string;
}

export default function MajorGoals() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isAddingMonthlySaving, setIsAddingMonthlySaving] = useState(false);
  const [newMonthlySaving, setNewMonthlySaving] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  // نموذج لإضافة هدف جديد
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    estimatedCost: 0,
    currentAmount: 0,
    targetDate: "",
    category: "marriage",
  });

  // Get major goals from API
  const {
    data: goals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["major-goals"],
    queryFn: MajorGoalsService.getUserMajorGoals,
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: MajorGoalsService.createMajorGoal,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["major-goals"] });
      await NotificationHelper.sendGoalNotification("created", data.title);
      toast({
        title: "تم إضافة الهدف",
        description: "تم إضافة الهدف الجديد بنجاح",
      });
      setNewGoal({
        title: "",
        description: "",
        estimatedCost: 0,
        currentAmount: 0,
        targetDate: "",
        category: "marriage",
      });
    },
    onError: (error: any) => {
      console.error("Create goal error:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة الهدف",
        variant: "destructive",
      });
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({
      id,
      currentAmount,
    }: {
      id: string;
      currentAmount: number;
    }) => MajorGoalsService.updateMajorGoal(id, { currentAmount } as any),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["major-goals"] });
      // Check if goal is achieved
      if (data.estimatedCost && data.currentAmount >= data.estimatedCost) {
        await NotificationHelper.sendGoalNotification("completed", data.title);
      } else {
        const progress = data.currentAmount
          ? (data.currentAmount / data.estimatedCost) * 100
          : 0;
        if (progress >= 50 && progress < 100) {
          await NotificationHelper.sendGoalNotification(
            "milestone",
            data.title,
            progress
          );
        }
      }

      toast({
        title: "تم تحديث التقدم",
        description: "تم تحديث مبلغ الادخار بنجاح",
      });
    },
    onError: (error: any) => {
      console.error("Update progress error:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث التقدم",
        variant: "destructive",
      });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: MajorGoalsService.deleteMajorGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["major-goals"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الهدف بنجاح",
      });
    },
    onError: (error: any) => {
      console.error("Delete goal error:", error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف الهدف",
        variant: "destructive",
      });
    },
  });

  // حساب المدة المتبقية بالشهور للوصول للهدف
  const calculateMonthsToGoal = (goal: any): number => {
    if (!goal.targetDate) return 0;
    console.log("passs");

    const monthlyRequired = calculateRequiredMonthlySaving(goal);
    console.log("monthlyRequired", monthlyRequired);

    if (monthlyRequired >= 0) return monthlyRequired;

    const remainingAmount =
      (goal.targetAmount || 0) - (goal.currentAmount || 0);
    return Math.ceil(remainingAmount / monthlyRequired);
  };

  // تنسيق عرض المدة المتبقية بالسنوات والشهور
  const formatRemainingTime = (months: number): string => {
    if (months <= 0) return "0 شهر";

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} شهر`;
    } else if (remainingMonths === 0) {
      return `${years} سنة`;
    } else {
      return `${years} سنة و${remainingMonths} أشهر`;
    }
  };

  // حساب المبلغ الشهري اللازم توفيره للوصول للهدف في الوقت المحدد
  const calculateRequiredMonthlySaving = (goal: any): number => {
    if (!goal.targetDate) return 0;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);

    // حساب الفرق بالشهور
    const monthsDiff =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());

    if (monthsDiff >= 0) return monthsDiff;
  };
  const calculateMoneyRequiredMonthlySaving = (goal: any): number => {
    if (!goal.targetDate) return 0;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);

    // حساب الفرق بالشهور
    const monthsDiff =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());

    const remainingAmount =
      (goal.estimatedCost || 0) - (goal.currentAmount || 0);

    return Math.ceil(remainingAmount / monthsDiff);
  };
  // إضافة هدف جديد
  const handleAddGoal = () => {
    if (newGoal.title.trim() === "") {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الهدف",
        variant: "destructive",
      });
      return;
    }

    if (newGoal.estimatedCost <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال تكلفة صحيحة للهدف",
        variant: "destructive",
      });
      return;
    }

    if (!newGoal.targetDate) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد تاريخ مستهدف للهدف",
        variant: "destructive",
      });
      return;
    }

    const targetDate = new Date(newGoal.targetDate);
    const today = new Date();

    if (targetDate <= today) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون التاريخ المستهدف في المستقبل",
        variant: "destructive",
      });
      return;
    }

    createGoalMutation.mutate(newGoal);
  };

  // فتح مربع حوار إضافة توفير شهري
  const openAddMonthlySavingDialog = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsAddingMonthlySaving(true);
  };

  // إضافة توفير شهري جديد
  const handleAddMonthlySaving = () => {
    if (!selectedGoalId) return;

    if (newMonthlySaving <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح للتوفير",
        variant: "destructive",
      });
      return;
    }

    const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);
    if (selectedGoal) {
      const newCurrentAmount =
        (selectedGoal.currentAmount || 0) + newMonthlySaving;
      updateProgressMutation.mutate({
        id: selectedGoalId,
        currentAmount: newCurrentAmount,
      });
    }

    // إغلاق مربع الحوار وإعادة تعيين القيم
    setIsAddingMonthlySaving(false);
    setSelectedGoalId(null);
    setNewMonthlySaving(0);
  };

  // حساب نسبة التقدم نحو الهدف
  const calculateProgress = (goal: any): number => {
    if (!goal.estimatedCost || goal.estimatedCost <= 0) return 0;
    return Math.min(
      100,
      ((goal.currentAmount || 0) / goal.estimatedCost) * 100
    );
  };

  // تنسيق التاريخ بشكل مقروء
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // الحصول على أيقونة الهدف
  const getGoalIcon = (category: string): string => {
    const goalType = GOAL_TYPES.find((g) => g.id === category);
    return goalType ? goalType.icon : "🎯";
  };

  // حذف هدف
  const handleDeleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader
          showMenu
          title="الأهداف الكبرى"
          onBackClick={() => navigate("/main-menu")}
        />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl font-cairo text-gray-600">
              جاري التحميل...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Major goals error:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        showMenu
        title="الأهداف الكبرى"
        onBackClick={() => navigate("/main-menu")}
      />
      <div className="container mx-auto py-4 sm:py-6 px-4">
        <div className="space-y-4 sm:space-y-6">
          {/* نموذج إضافة هدف جديد */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                إضافة هدف مالي جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-type">نوع الهدف</Label>
                    <select
                      id="goal-type"
                      className="w-full rounded-md border border-gray-300 p-2 mt-1 text-sm"
                      value={newGoal.category}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, category: e.target.value })
                      }
                    >
                      {GOAL_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-name">اسم الهدف</Label>
                    <Input
                      id="goal-name"
                      placeholder="مثال: شراء سيارة تويوتا كامري"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="goal-description">وصف الهدف (اختياري)</Label>
                  <Input
                    id="goal-description"
                    placeholder="وصف تفصيلي للهدف"
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="goal-cost">تكلفة الهدف (ريال)</Label>
                    <Input
                      id="goal-cost"
                      type="number"
                      placeholder="التكلفة الإجمالية"
                      value={newGoal.estimatedCost || ""}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          estimatedCost: Number(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-current-amount">
                      المبلغ المتوفر حالياً (ريال)
                    </Label>
                    <Input
                      id="goal-current-amount"
                      type="number"
                      placeholder="المبلغ المتوفر حالياً"
                      value={newGoal.currentAmount || ""}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          currentAmount: Number(e.target.value),
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-target-date">تاريخ تحقيق الهدف</Label>
                    <DateDropdowns
                      value={newGoal.targetDate || format(new Date(), "yyyy-MM-dd")}
                      onChange={(date) => setNewGoal({...newGoal, targetDate: date})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddGoal}
                  disabled={createGoalMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createGoalMutation.isPending
                    ? "جاري الإضافة..."
                    : "إضافة الهدف"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* قائمة الأهداف */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold">
              أهدافك المالية ({goals.length})
            </h2>

            {goals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Target className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500 text-sm sm:text-base">
                    لم تقم بإضافة أي هدف مالي بعد
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base sm:text-lg">
                          <span className="inline-block mr-2">
                            {getGoalIcon(goal.category)}
                          </span>
                          {goal.title}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8 px-2 text-xs"
                            onClick={() => handleDeleteGoal(goal.id)}
                            disabled={deleteGoalMutation.isPending}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 sm:space-y-4">
                        {goal.description && (
                          <div className="text-xs sm:text-sm text-gray-600">
                            {goal.description}
                          </div>
                        )}

                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>التكلفة الإجمالية:</span>
                          <span className="font-bold">
                            {(goal.estimatedCost || 0).toLocaleString()} ريال
                          </span>
                        </div>

                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>المبلغ المتوفر حالياً:</span>
                          <span className="font-bold">
                            {(goal.currentAmount || 0).toLocaleString()} ريال
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>نسبة الإنجاز:</span>
                            <span className="font-bold">
                              {calculateProgress(goal).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={calculateProgress(goal)}
                            className="h-2"
                          />
                        </div>

                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>المبلغ الشهري المطلوب:</span>
                          <span className="font-bold">
                            {calculateMoneyRequiredMonthlySaving(
                              goal
                            ).toLocaleString()}{" "}
                            ريال
                          </span>
                        </div>

                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>المدة المتبقية:</span>
                          <span className="font-bold">
                            {formatRemainingTime(calculateMonthsToGoal(goal))}
                          </span>
                        </div>

                        {goal.targetDate && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>التاريخ المستهدف:</span>
                            <span className="font-bold">
                              {formatDate(goal.targetDate)}
                            </span>
                          </div>
                        )}

                        {/* قسم الادخار الشهري */}
                        <div className="pt-3 border-t border-gray-200">
                          <Button
                            size="sm"
                            onClick={() => openAddMonthlySavingDialog(goal.id)}
                            className="bg-green-600 hover:bg-green-700 text-xs w-full sm:w-auto"
                            disabled={updateProgressMutation.isPending}
                          >
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                            إضافة مبلغ للهدف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* فرص زيادة الدخل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                فرص لزيادة الدخل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CAREER_OPPORTUNITIES.map((opportunity, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm sm:text-lg mb-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        {opportunity.description}
                      </p>
                      <p className="text-xs sm:text-sm mb-2">
                        <span className="font-bold">متوسط الدخل: </span>
                        {opportunity.avgIncome}
                      </p>
                      <div>
                        <span className="text-xs sm:text-sm font-bold">
                          مصادر للتعلم:{" "}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {opportunity.resources.map((resource, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* مربع حوار إضافة توفير شهري */}
      <Dialog
        open={isAddingMonthlySaving}
        onOpenChange={setIsAddingMonthlySaving}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo">
              إضافة مبلغ للهدف
              {selectedGoalId && (
                <div className="text-sm font-normal text-gray-500 mt-1">
                  {goals.find((g) => g.id === selectedGoalId)?.title}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right col-span-1">
                المبلغ
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="أدخل المبلغ المراد إضافته"
                  value={newMonthlySaving || ""}
                  onChange={(e) => setNewMonthlySaving(Number(e.target.value))}
                  className="text-sm"
                />
                <span className="text-sm">ريال</span>
              </div>
            </div>

            {selectedGoalId && (
              <div className="text-xs sm:text-sm text-amber-600 mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>المبلغ المطلوب شهرياً:</span>
                  <strong>
                    {calculateRequiredMonthlySaving(
                      goals.find((g) => g.id === selectedGoalId) || {}
                    ).toLocaleString()}{" "}
                    ريال
                  </strong>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingMonthlySaving(false)}
              className="text-sm"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAddMonthlySaving}
              disabled={updateProgressMutation.isPending}
              className="text-sm"
            >
              {updateProgressMutation.isPending
                ? "جاري الحفظ..."
                : "حفظ المبلغ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
