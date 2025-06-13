
import { apiClient } from '@/lib/api';

export interface Installment {
  id: string;
  name: string;
  totalAmount: number;
  monthlyAmount: number;
  remainingAmount: number;
  dueDate: string;
  isPaid: boolean;
  userId: string;
  planId?: string; // Add this to link installments to custom plans
}

export interface CreateInstallmentRequest {
  name: string;
  totalAmount: number;
  monthlyAmount: number;
  dueDate: string;
  planId?: string; // Add this to link installments to custom plans
}

export class InstallmentService {
  static async addInstallment(installment: CreateInstallmentRequest): Promise<Installment> {
    console.log('Adding installment:', installment);
    return apiClient.post<Installment>('/installments', installment);
  }

  static async getUserInstallments(): Promise<Installment[]> {
    console.log('Getting user installments');
    return apiClient.get<Installment[]>('/installments');
  }

  static async getInstallmentById(id: string): Promise<Installment> {
    console.log('Getting installment by id:', id);
    return apiClient.get<Installment>(`/installments/${id}`);
  }

  static async markInstallmentPaid(id: string): Promise<Installment> {
    console.log('Marking installment as paid:', id);
    return apiClient.patch<Installment>(`/installments/${id}/pay`);
  }

  static async updateInstallment(id: string, installment: Partial<CreateInstallmentRequest>): Promise<Installment> {
    console.log('Updating installment:', id, installment);
    return apiClient.put<Installment>(`/installments/${id}`, installment);
  }

  static async deleteInstallment(id: string): Promise<void> {
    console.log('Deleting installment:', id);
    return apiClient.delete(`/installments/${id}`);
  }

  static async getInstallmentsByPlanId(planId: string): Promise<Installment[]> {
    console.log('Getting installments by plan id:', planId);
    return apiClient.get<Installment[]>(`/installments?planId=${planId}`);
  }
}

