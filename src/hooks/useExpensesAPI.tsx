
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseService, CreateExpenseRequest } from '@/services/expenseService';
import { useToast } from './use-toast';

export const useExpensesAPI = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all expenses
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: ExpenseService.getExpenses,
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: (expenseData: CreateExpenseRequest) => ExpenseService.addExpense(expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "تم إضافة المصروف",
        description: "تمت إضافة المصروف بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المصروف",
        variant: "destructive"
      });
    }
  });

  // Get monthly report
  const getMonthlyReport = (month: number, year: number) => {
    return useQuery({
      queryKey: ['monthlyReport', month, year],
      queryFn: () => ExpenseService.getMonthlyReport(month, year),
    });
  };

  return {
    expenses,
    isLoading,
    addExpense: addExpenseMutation.mutate,
    isAdding: addExpenseMutation.isPending,
    getMonthlyReport,
  };
};
