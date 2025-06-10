
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
}

export interface CreateInstallmentRequest {
  name: string;
  totalAmount: number;
  monthlyAmount: number;
  dueDate: string;
}

export class InstallmentService {
  static async addInstallment(installment: CreateInstallmentRequest): Promise<Installment> {
    return apiClient.post<Installment>('/installments', installment);
  }

  static async getUserInstallments(): Promise<Installment[]> {
    return apiClient.get<Installment[]>('/installments');
  }

  static async getInstallmentById(id: string): Promise<Installment> {
    return apiClient.get<Installment>(`/installments/${id}`);
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
}
