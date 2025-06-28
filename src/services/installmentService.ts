
import { apiClient } from '@/lib/api';

export interface Installment {
  id: string;
  amount: number;
  paymentDate: string;
  installmentPlanId: string;
  status: 'pending' | 'paid' | 'overdue';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstallmentRequest {
  amount: number;
  paymentDate: string;
  installmentPlanId: string;
}

export class InstallmentService {
  static async addInstallment(installment: CreateInstallmentRequest): Promise<Installment> {
    return apiClient.post<Installment>('/installments', installment);
  }

  static async getUserInstallments(): Promise<Installment[]> {
    return apiClient.get<Installment[]>('/installments');
  }


  static async markInstallmentPaid(id: string): Promise<Installment> {
    return apiClient.patch<Installment>(`/installments/${id}/pay`);
  }

  static async updateInstallment(id: string, installment: Partial<CreateInstallmentRequest>): Promise<Installment> {
    return apiClient.put<Installment>(`/installments/${id}`, installment);
  }

  static async deleteInstallment(id: string): Promise<void> {
    return apiClient.delete(`/installments/${id}`);
  }
  static async getInstallmentById(id: string): Promise<Installment> {
    return apiClient.get<Installment>(`/installments/${id}`);
  }

  // Fetch all installments for a given plan ID
  static async getInstallmentsByPlanId(planId: string): Promise<Installment[]> {
    return apiClient.get<Installment[]>(`/installments?installmentPlanId=${planId}`);
  }
}
