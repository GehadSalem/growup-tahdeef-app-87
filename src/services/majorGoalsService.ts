
import { apiClient } from '@/lib/api';
import { NotificationHelper } from './notificationHelper';

// أنواع البيانات
interface BackendGoal {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  targetDate: string;
  category: 'financial' | 'personal' | 'health' | 'education';
  status: 'planned' | 'in-progress' | 'completed' | 'postponed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface FrontendGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

// دالة لتحويل الفئات من Frontend إلى Backend
function mapCategoryToBackend(frontendCategory: string): 'financial' | 'personal' | 'health' | 'education' {
  const categoryMap: Record<string, 'financial' | 'personal' | 'health' | 'education'> = {
    'marriage': 'personal',
    'car': 'financial',
    'house': 'financial',
    'business': 'financial',
    'education': 'education',
    'other': 'personal'
  };
  return categoryMap[frontendCategory] || 'personal';
}

// دالة لتحويل الفئات من Backend إلى Frontend
function mapCategoryToFrontend(backendCategory: string): string {
  const reverseCategoryMap: Record<string, string> = {
    'financial': 'car',
    'personal': 'marriage',
    'health': 'other',
    'education': 'education'
  };
  return reverseCategoryMap[backendCategory] || 'other';
}

export const MajorGoalsService = {
  async createMajorGoal(goalData: Omit<FrontendGoal, 'id'>): Promise<FrontendGoal> {
    try {
      const backendGoal = {
        title: goalData.title,
        description: goalData.description,
        estimatedCost: goalData.targetAmount,
        targetDate: goalData.targetDate,
        category: mapCategoryToBackend(goalData.category),
        progress: (goalData.currentAmount / goalData.targetAmount) * 100 || 0
      };

      console.log('Creating major goal:', backendGoal);
      const response = await apiClient.post<BackendGoal>('/majorgoals', backendGoal);
      console.log('Major goal created:', response);
      return MajorGoalsService.mapToFrontendModel(response);
    } catch (error) {
      console.error('Create goal error:', error);
      throw new Error('فشل في إضافة الهدف');
    }
  },

  async getUserMajorGoals(): Promise<FrontendGoal[]> {
    try {
      console.log('Fetching major goals...');
      const response = await apiClient.get<BackendGoal[]>('/majorgoals');
      console.log('Major goals fetched:', response);
      return response.map(MajorGoalsService.mapToFrontendModel);
    } catch (error) {
      console.error('Get goals error:', error);
      throw new Error('فشل في جلب الأهداف');
    }
  },

  async getMajorGoalById(goalId: string): Promise<BackendGoal> {
    try {
      console.log('Fetching major goal by id:', goalId);
      const response = await apiClient.get<BackendGoal>(`/majorgoals/${goalId}`);
      console.log('Major goal fetched:', response);
      return response;
    } catch (error) {
      console.error('Get single goal error:', error);
      throw new Error('فشل في جلب الهدف');
    }
  },

  async updateProgress(goalId: string, { currentAmount }: { currentAmount: number }): Promise<FrontendGoal> {
    try {
      const goal = await MajorGoalsService.getMajorGoalById(goalId);
      const newProgress = (currentAmount / goal.estimatedCost) * 100;

      console.log('Updating major goal progress:', goalId, { progress: newProgress });
      const response = await apiClient.put<BackendGoal>(`/majorgoals/${goalId}`, {
        progress: newProgress
      });
      console.log('Major goal progress updated:', response);

      return MajorGoalsService.mapToFrontendModel(response);
    } catch (error) {
      console.error('Update progress error:', error);
      throw new Error('فشل في تحديث التقدم');
    }
  },

  async deleteMajorGoal(goalId: string): Promise<void> {
    try {
      console.log('Deleting major goal:', goalId);
      await apiClient.delete(`/majorgoals/${goalId}`);
      console.log('Major goal deleted successfully');
    } catch (error) {
      console.error('Delete goal error:', error);
      throw new Error('فشل في حذف الهدف');
    }
  },

  mapToFrontendModel(backendGoal: BackendGoal): FrontendGoal {
    return {
      id: backendGoal.id,
      title: backendGoal.title,
      description: backendGoal.description,
      targetAmount: backendGoal.estimatedCost,
      currentAmount: (backendGoal.progress / 100) * backendGoal.estimatedCost,
      targetDate: backendGoal.targetDate,
      category: mapCategoryToFrontend(backendGoal.category)
    };
  }
};
