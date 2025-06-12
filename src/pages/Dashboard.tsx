
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/ui/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, Target, TrendingUp, Calculator, Shield, CreditCard, Users, Calendar, Zap, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ExpenseService } from "@/services/expenseService";
import { IncomeService } from "@/services/incomeService";
import { WeeklyChart } from "@/components/stats/WeeklyChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get expenses and incomes for charts
  const { data: expensesData = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  const { data: incomesData = [], isLoading: incomesLoading } = useQuery({
    queryKey: ['incomes'],
    queryFn: IncomeService.getUserIncomes,
  });

  if (!isAuthenticated) {
    return null;
  }

  if (expensesLoading || incomesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Calculate weekly data for chart
  const getWeeklyFinancialData = () => {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    return weekDays.map((day, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      
      // Calculate daily expenses
      const dayExpenses = expensesData.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === dayDate.toDateString();
      }).reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      // Calculate daily income
      const dayIncome = incomesData.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.toDateString() === dayDate.toDateString();
      }).reduce((sum, income) => sum + (income.amount || 0), 0);
      
      // Calculate savings percentage (income - expenses)
      const savingsPercentage = dayIncome > 0 ? Math.max(0, ((dayIncome - dayExpenses) / dayIncome) * 100) : 0;
      
      return {
        name: day,
        value: Math.round(savingsPercentage),
        label: 'نسبة الادخار'
      };
    });
  };

  const weeklyData = getWeeklyFinancialData();
  
  // Calculate monthly totals
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expensesData.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() + 1 === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  }).reduce((sum, expense) => sum + (expense.amount || 0), 0);

  const monthlyIncome = incomesData.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate.getMonth() + 1 === currentMonth && 
           incomeDate.getFullYear() === currentYear;
  }).reduce((sum, income) => sum + (income.amount || 0), 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsPercentage = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  // Menu items
  const menuItems = [
    {
      title: "التخطيط المالي",
      description: "إدارة الأموال والميزانية",
      icon: PiggyBank,
      color: "text-green-600",
      bgColor: "bg-green-50",
      path: "/financial-planning"
    },
    {
      title: "الأهداف الكبرى",
      description: "تخطيط الأهداف المالية الكبيرة",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: "/major-goals"
    },
    {
      title: "كسر العادات السيئة",
      description: "التخلص من العادات الضارة",
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-50",
      path: "/break-habits"
    },
    {
      title: "التطوير الذاتي",
      description: "تطوير المهارات والقدرات",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: "/self-development"
    },
    {
      title: "المهام اليومية",
      description: "تنظيم المهام والأنشطة",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      path: "/daily-tasks"
    },
    {
      title: "الإحالات",
      description: "دعوة الأصدقاء واكسب المكافآت",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      path: "/referral"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader showMenu title="لوحة التحكم" onBackClick={() => navigate('/main-menu')} />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* قسم الإحصائيات المالية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                الدخل الشهري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {monthlyIncome.toLocaleString()} ر.س
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                المصروفات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {monthlyExpenses.toLocaleString()} ر.س
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                الادخار الشهري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {monthlySavings.toLocaleString()} ر.س
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {savingsPercentage.toFixed(1)}% من الدخل
              </div>
            </CardContent>
          </Card>
        </div>

        {/* مخطط الادخار الأسبوعي */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">نسبة الادخار الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyData} />
          </CardContent>
        </Card>
        
        {/* قائمة الأقسام الرئيسية */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">الأقسام الرئيسية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {menuItems.map((item, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  onClick={() => navigate(item.path)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
