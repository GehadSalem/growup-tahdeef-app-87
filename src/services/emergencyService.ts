import { apiClient } from '@/lib/api';

export interface EmergencyFund {
  id: string;
  amount: number;
  description: string;
  type: 'deposit' | 'withdrawal';
  date: string;
  userId: string;
}

export interface EmergencyFundRequest {
  amount: number;
  description: string;
  type: 'deposit' | 'withdrawal';
}

export interface EmergencyFundSummary {
  totalAmount: number;
  transactions: EmergencyFund[];
}

export class EmergencyService {
  static async addToEmergencyFund(data: EmergencyFundRequest): Promise<EmergencyFund> {
    return apiClient.post<EmergencyFund>('/emergency', data);
  }

  static async getEmergencyFunds(): Promise<EmergencyFundSummary> {
    return apiClient.get<EmergencyFundSummary>('/emergency');
  }
}
