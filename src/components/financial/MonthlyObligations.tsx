
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { AddObligationDialog } from './obligations/AddObligationDialog';
import { ObligationsList } from './obligations/ObligationsList';
import { ObligationsSummary } from './obligations/ObligationsSummary';
import { ObligationsCharts } from './obligations/ObligationsCharts';
import { ObligationsTips } from './obligations/ObligationsTips';

import type { Obligation, ObligationType } from '@/lib/types';
import { apiClient } from '@/lib/api';

function safeNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export default function MonthlyObligations() {
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [savingsGoal, setSavingsGoal] = useState(1600);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Load sample data with all required fields
  // useEffect(() => {
  //   const sampleObligations: Obligation[] = [
  //     {
  //       id: '1',
  //       name: 'إيجار المنزل',
  //       totalAmount: 2500,
  //       type: 'إيجار' as ObligationType,
  //       dueDate: '2024-01-01',
  //       recurrence: 'شهري',
  //       isPaid: false,
  //       enableNotifications: true
  //     },
  //     {
  //       id: '2',
  //       name: 'فواتير الكهرباء والماء',
  //       totalAmount: 300,
  //       type: 'فواتير' as ObligationType,
  //       dueDate: '2024-01-05',
  //       recurrence: 'شهري',
  //       isPaid: false,
  //       enableNotifications: true
  //     },
  //     {
  //       id: '3',
  //       name: 'قسط السيارة',
  //       totalAmount: 800,
  //       type: 'قرض' as ObligationType,
  //       dueDate: '2024-01-10',
  //       recurrence: 'شهري',
  //       isPaid: false,
  //       enableNotifications: true
  //     }
  //   ];
  //   setObligations(sampleObligations);
  // }, []);
useEffect(() => {
  const fetchObligations = async () => {
    try {
      const response = await apiClient.get<Obligation[]>('/custom-installment-plans');
      setObligations(response);
    } catch (error) {
      console.error('فشل تحميل الالتزامات:', error);
    }
  };

  fetchObligations();
}, []);
  const totalObligations = obligations.reduce((sum, o) => sum + safeNumber(o.totalAmount), 0);
  const remainingIncome = safeNumber(monthlyIncome) - totalObligations;
  const savingsRemaining = remainingIncome - safeNumber(savingsGoal);
  const obligationPercentage = safeNumber(monthlyIncome) > 0 ? (totalObligations / safeNumber(monthlyIncome)) * 100 : 0;

  const addObligation = async (newObligation: Omit<Obligation, 'id'>) => {
  try {
    const response = await apiClient.post<Obligation>('/custom-installment-plans', newObligation);
    setObligations(prev => [...prev, response]);
  } catch (error) {
    console.error("فشل في إضافة الالتزام:", error);
  }
};

  const updateObligation = (id: string, updatedObligation: Partial<Obligation>) => {
    setObligations(prev =>
      prev.map(obligation =>
        obligation.id === id ? { ...obligation, ...updatedObligation } : obligation
      )
    );
  };

  const togglePaymentStatus = (id: string) => {
    setObligations(prev =>
      prev.map(obligation =>
        obligation.id === id ? { ...obligation, isPaid: !obligation.isPaid } : obligation
      )
    );
  };

  const deleteObligation = (id: string) => {
    setObligations(prev => prev.filter(obligation => obligation.id !== id));
  };

  return (
    <div className="min-w-[340px] w-[340px] px-2">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-cairo">الالتزامات الشهرية</h1>
        <Button
          className="bg-growup hover:bg-growup-dark"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="ml-2 h-4 w-4" />
          إضافة التزام
        </Button>
      </div>

      {/* Summary Cards */}
      <ObligationsSummary 
      obligations={obligations}
        totalObligations={totalObligations}
        remainingIncome={remainingIncome}
        savingsRemaining={savingsRemaining}
        obligationPercentage={obligationPercentage}
      />

      {/* Obligations List */}
      <ObligationsList 
  obligations={obligations}
  onUpdate={updateObligation}
  onDelete={deleteObligation}
  togglePaymentStatus={togglePaymentStatus}
/>

      {/* Tips */}
      <ObligationsTips 
        obligationPercentage={obligationPercentage}
        savingsRemaining={savingsRemaining}
      />

      <AddObligationDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddObligation={addObligation}
      />
    </div>
    </div>
    
  );
}
