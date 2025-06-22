import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MajorGoalsService } from "@/services/majorGoalsService";
import { MajorGoalForm } from "@/components/major-goals/MajorGoalForm";
import { MajorGoalCard } from "@/components/major-goals/MajorGoalCard";
import { useNavigate } from "react-router-dom";
import { MajorGoal } from "@/lib/types";

export default function MajorGoals() {
  const [majorGoals, setMajorGoals] = useState<MajorGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMajorGoals();
  }, []);

  const fetchMajorGoals = async () => {
    setIsLoading(true);
    try {
      const goals = await MajorGoalsService.getMajorGoals();
      setMajorGoals(goals);
    } catch (error) {
      console.error("Failed to fetch major goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMajorGoal = async (goal: Omit<MajorGoal, 'id' | 'createdAt' | 'userId' | 'currentProgress' | 'status'>) => {
    try {
      const newGoal = await MajorGoalsService.createMajorGoal({
        ...goal,
        totalSteps: parseInt(goal.totalSteps.toString(), 10)
      });
      setMajorGoals(prevGoals => [...prevGoals, newGoal]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add major goal:", error);
    }
  };

  const updateMajorGoal = async (id: string, updates: Partial<MajorGoal>) => {
    try {
      const updatedGoal = await MajorGoalsService.updateMajorGoal(id, updates);
      setMajorGoals(prevGoals =>
        prevGoals.map(goal => (goal.id === id ? updatedGoal : goal))
      );
    } catch (error) {
      console.error("Failed to update major goal:", error);
    }
  };

  const deleteMajorGoal = async (id: string) => {
    try {
      await MajorGoalsService.deleteMajorGoal(id);
      setMajorGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    } catch (error) {
      console.error("Failed to delete major goal:", error);
    }
  };

  const calculateProgress = (goal: MajorGoal) => {
    if (goal.totalSteps === 0) return 0;
    return Math.round((goal.currentProgress / goal.totalSteps) * 100);
  };

  const getProgressText = (goal: MajorGoal) => {
    return `${goal.currentProgress} من ${goal.totalSteps}`;
  };

  const handleAddGoal = (goal: Omit<MajorGoal, 'id' | 'createdAt' | 'userId' | 'currentProgress' | 'status'>) => {
    addMajorGoal(goal);
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const goal = majorGoals.find(g => g.id === goalId);
    if (goal) {
      updateMajorGoal(goalId, {
        ...goal,
        currentProgress: newProgress
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader
        showMenu
        title="الأهداف الكبرى"
        onBackClick={() => navigate("/main-menu")}
      />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* العنوان */}
        <section className="mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md text-center border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold font-cairo mb-2">
              وجهة حياتك
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 font-cairo">
              كل خطوة تقربك من حلمك
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 text-growup font-bold hover:bg-growup/5 rounded-lg px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>إضافة هدف كبير</span>
              </button>
            </div>
          </div>
        </section>

        {/* نموذج الإضافة */}
        {showAddForm && (
          <section className="mb-6">
            <MajorGoalForm
              onAddGoal={handleAddGoal}
              onCancel={() => setShowAddForm(false)}
            />
          </section>
        )}

        {/* عرض الأهداف أو شاشة التحميل */}
        {isLoading ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4 font-cairo text-sm sm:text-base">
              جاري التحميل...
            </p>
          </div>
        ) : (
          <section className="space-y-4 sm:space-y-6">
            {majorGoals.length > 0 ? (
              majorGoals.map((goal) => (
                <MajorGoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdateProgress={updateGoalProgress}
                  progressPercentage={calculateProgress(goal)}
                  progressText={getProgressText(goal)}
                />
              ))
            ) : (
              !showAddForm && (
                <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 mb-4 font-cairo text-sm sm:text-base">
                    لم تقم بإضافة أي أهداف بعد
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-growup hover:bg-growup-dark text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Plus className="mr-0 ml-2 h-4 w-4" />
                    إضافة هدف كبير
                  </Button>
                </div>
              )
            )}
          </section>
        )}
      </div>
    </div>
  );
}
