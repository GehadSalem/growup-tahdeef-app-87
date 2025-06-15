
import { apiClient } from '@/lib/api';

export interface Installment {
  id: string;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'paid' | 'late' | 'missed'; // Updated to match backend enum
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'cash' | 'other'; // Updated to match backend enum
  installmentPlanId: string;
  isOnTime?: boolean; // Added from backend
  notes?: string; // Added from backend
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInstallmentRequest {
  amount: number;
  paymentDate: string;
  status?: 'pending' | 'paid' | 'late' | 'missed';
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  installmentPlanId: string;
  isOnTime?: boolean;
  notes?: string;
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

  static async getInstallmentsByPlanId(planId: string): Promise<Installment[]> {
    console.log('Getting installments by plan id:', planId);
    return apiClient.get<Installment[]>(`/installments?installmentPlanId=${planId}`);
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
}
