import { useState, useEffect } from "react";
import {
  MonthlyFinancialData,
  ExpenseItem,
  InstallmentItem,
} from "@/types/financial";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// محاكاة قاعدة البيانات المحلية (في التطبيق الحقيقي ستكون Supabase)
const STORAGE_KEY = "financial_data";

export function useFinancialData() {
  const [financialData, setFinancialData] = useState<MonthlyFinancialData[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [loading, setLoading] = useState(true);

  // تحميل البيانات من التخزين المحلي
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setFinancialData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات المالية:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // حفظ البيانات في التخزين المحلي
  const saveData = (data: MonthlyFinancialData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setFinancialData(data);
    } catch (error) {
      console.error("خطأ في حفظ البيانات المالية:", error);
    }
  };

  // الحصول على البيانات للشهر الحالي أو إنشاءها
  const getCurrentMonthData = (): MonthlyFinancialData => {
    const existingData = financialData.find((d) => d.month === currentMonth);

    if (existingData) {
      return existingData;
    }

    // إنشاء بيانات جديدة للشهر الحالي
    const newData: MonthlyFinancialData = {
      id: `${currentMonth}-${Date.now()}`,
      userId: "user-1", // في التطبيق الحقيقي سيكون من المصادقة
      month: currentMonth,
      monthName: format(new Date(currentMonth + "-01"), "MMMM yyyy", {
        locale: ar,
      }),
      income: 0,
      expenses: [],
      installments: [],
      emergencyFundAmount: 0,
      emergencyFundPercentage: 15,
      totalExpenses: 0,
      totalInstallments: 0,
      netRemaining: 0,
      savingsTarget: 0,
      actualSavings: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newData;
  };

  // حساب القيم المالية تلقائياً
  const calculateFinancials = (
    data: MonthlyFinancialData
  ): MonthlyFinancialData => {
    const totalExpenses = data.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalInstallments = data.installments.reduce(
      (sum, installment) => sum + installment.amount,
      0
    );
    const emergencyFundAmount =
      (data.income * data.emergencyFundPercentage) / 100;
    const netRemaining =
      data.income - totalExpenses - totalInstallments - emergencyFundAmount;
    const actualSavings = Math.max(0, netRemaining);

    return {
      ...data,
      totalExpenses,
      totalInstallments,
      emergencyFundAmount,
      netRemaining,
      actualSavings,
      updatedAt: new Date().toISOString(),
    };
  };

  // تحديث الدخل الشهري
  const updateIncome = (income: number) => {
    const currentData = getCurrentMonthData();
    const updatedData = calculateFinancials({ ...currentData, income });

    const newFinancialData = financialData.filter(
      (d) => d.month !== currentMonth
    );
    newFinancialData.push(updatedData);

    saveData(newFinancialData);
  };

  // إضافة مصروف جديد
  const addExpense = (expense: Omit<ExpenseItem, "id">) => {
    const currentData = getCurrentMonthData();
    const newExpense: ExpenseItem = {
      ...expense,
      id: `expense-${Date.now()}`,
    };

    const updatedData = calculateFinancials({
      ...currentData,
      expenses: [...currentData.expenses, newExpense],
    });

    const newFinancialData = financialData.filter(
      (d) => d.month !== currentMonth
    );
    newFinancialData.push(updatedData);

    saveData(newFinancialData);
  };

  // إضافة قسط جديد
  const addInstallment = (installment: Omit<InstallmentItem, "id">) => {
    const currentData = getCurrentMonthData();
    const newInstallment: InstallmentItem = {
      ...installment,
      id: `installment-${Date.now()}`,
    };

    const updatedData = calculateFinancials({
      ...currentData,
      installments: [...currentData.installments, newInstallment],
    });

    const newFinancialData = financialData.filter(
      (d) => d.month !== currentMonth
    );
    newFinancialData.push(updatedData);

    saveData(newFinancialData);
  };

  // تحديث نسبة صندوق الطوارئ
  const updateEmergencyFundPercentage = (percentage: number) => {
    const currentData = getCurrentMonthData();
    const updatedData = calculateFinancials({
      ...currentData,
      emergencyFundPercentage: Math.max(0, Math.min(50, percentage)),
    });

    const newFinancialData = financialData.filter(
      (d) => d.month !== currentMonth
    );
    newFinancialData.push(updatedData);

    saveData(newFinancialData);
  };

  // تغيير الشهر المحدد
  const changeMonth = (month: string) => {
    setCurrentMonth(month);
  };

  return {
    financialData,
    currentMonthData: getCurrentMonthData(),
    currentMonth,
    loading,
    updateIncome,
    addExpense,
    addInstallment,
    updateEmergencyFundPercentage,
    changeMonth,
  };
}
