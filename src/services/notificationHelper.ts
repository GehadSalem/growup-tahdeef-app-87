
import { apiClient } from '@/lib/api';

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export class NotificationHelper {
  // Send notification for emergency fund actions
  static async sendEmergencyNotification(type: 'deposit' | 'withdrawal', amount: number) {
    try {
      const notification: CreateNotificationRequest = {
        title: type === 'deposit' ? 'تم إيداع في صندوق الطوارئ' : 'تم سحب من صندوق الطوارئ',
        message: `تم ${type === 'deposit' ? 'إيداع' : 'سحب'} مبلغ ${amount} ريال ${type === 'deposit' ? 'في' : 'من'} صندوق الطوارئ`,
        type: type === 'deposit' ? 'success' : 'warning'
      };
      
      await apiClient.post('/notification', notification);
      console.log('Emergency notification sent:', notification);
    } catch (error) {
      console.error('Error sending emergency notification:', error);
    }
  }

  // Send notification for savings goal actions
  static async sendSavingsGoalNotification(action: 'created' | 'updated' | 'achieved' | 'deposit', goalName: string, amount?: number) {
    try {
      let title = '';
      let message = '';
      let type: CreateNotificationRequest['type'] = 'info';

      switch (action) {
        case 'created':
          title = 'تم إنشاء هدف ادخار جديد';
          message = `تم إنشاء هدف الادخار "${goalName}" بنجاح`;
          type = 'success';
          break;
        case 'updated':
          title = 'تم تحديث هدف الادخار';
          message = `تم تحديث هدف الادخار "${goalName}" بنجاح`;
          type = 'info';
          break;
        case 'achieved':
          title = 'تهانينا! تم تحقيق هدف الادخار';
          message = `تم تحقيق هدف الادخار "${goalName}" بنجاح`;
          type = 'success';
          break;
        case 'deposit':
          title = 'تم إضافة مبلغ للهدف';
          message = `تم إضافة ${amount} ريال إلى هدف "${goalName}"`;
          type = 'success';
          break;
      }

      const notification: CreateNotificationRequest = { title, message, type };
      await apiClient.post('/notification', notification);
      console.log('Savings goal notification sent:', notification);
    } catch (error) {
      console.error('Error sending savings goal notification:', error);
    }
  }

  // Send notification for income actions
  static async sendIncomeNotification(action: 'added' | 'updated' | 'deleted', amount: number, description: string) {
    try {
      let title = '';
      let message = '';
      const type: CreateNotificationRequest['type'] = 'success';

      switch (action) {
        case 'added':
          title = 'تم إضافة دخل جديد';
          message = `تم إضافة دخل بمبلغ ${amount} ريال - ${description}`;
          break;
        case 'updated':
          title = 'تم تحديث الدخل';
          message = `تم تحديث الدخل "${description}" إلى ${amount} ريال`;
          break;
        case 'deleted':
          title = 'تم حذف الدخل';
          message = `تم حذف الدخل "${description}"`;
          break;
      }

      const notification: CreateNotificationRequest = { title, message, type };
      await apiClient.post('/notification', notification);
      console.log('Income notification sent:', notification);
    } catch (error) {
      console.error('Error sending income notification:', error);
    }
  }

  // Send notification for expense actions
  static async sendExpenseNotification(action: 'added' | 'updated' | 'deleted', amount: number, description: string) {
    try {
      let title = '';
      let message = '';
      const type: CreateNotificationRequest['type'] = action === 'deleted' ? 'info' : 'warning';

      switch (action) {
        case 'added':
          title = 'تم إضافة مصروف جديد';
          message = `تم إضافة مصروف بمبلغ ${amount} ريال - ${description}`;
          break;
        case 'updated':
          title = 'تم تحديث المصروف';
          message = `تم تحديث المصروف "${description}" إلى ${amount} ريال`;
          break;
        case 'deleted':
          title = 'تم حذف المصروف';
          message = `تم حذف المصروف "${description}"`;
          break;
      }

      const notification: CreateNotificationRequest = { title, message, type };
      await apiClient.post('/notification', notification);
      console.log('Expense notification sent:', notification);
    } catch (error) {
      console.error('Error sending expense notification:', error);
    }
  }

  // Send notification for installment actions
  static async sendInstallmentNotification(action: 'added' | 'paid' | 'overdue', installmentName: string, amount?: number) {
    try {
      let title = '';
      let message = '';
      let type: CreateNotificationRequest['type'] = 'info';

      switch (action) {
        case 'added':
          title = 'تم إضافة قسط جديد';
          message = `تم إضافة القسط "${installmentName}" بمبلغ ${amount} ريال`;
          type = 'success';
          break;
        case 'paid':
          title = 'تم دفع القسط';
          message = `تم دفع القسط "${installmentName}" بنجاح`;
          type = 'success';
          break;
        case 'overdue':
          title = 'تذكير: قسط متأخر';
          message = `القسط "${installmentName}" متأخر عن موعد الدفع`;
          type = 'warning';
          break;
      }

      const notification: CreateNotificationRequest = { title, message, type };
      await apiClient.post('/notification', notification);
      console.log('Installment notification sent:', notification);
    } catch (error) {
      console.error('Error sending installment notification:', error);
    }
  }

  // Send notification for goal achievements
  static async sendGoalNotification(action: 'created' | 'completed' | 'milestone', goalName: string, progress?: number) {
    try {
      let title = '';
      let message = '';
      let type: CreateNotificationRequest['type'] = 'success';

      switch (action) {
        case 'created':
          title = 'تم إنشاء هدف جديد';
          message = `تم إنشاء الهدف "${goalName}" بنجاح`;
          break;
        case 'completed':
          title = 'تهانينا! تم إكمال الهدف';
          message = `تم إكمال الهدف "${goalName}" بنجاح`;
          break;
        case 'milestone':
          title = 'تقدم ممتاز في الهدف';
          message = `تم الوصول إلى ${progress?.toFixed(1)}% من الهدف "${goalName}"`;
          type = 'info';
          break;
      }

      const notification: CreateNotificationRequest = { title, message, type };
      await apiClient.post('/notification', notification);
      console.log('Goal notification sent:', notification);
    } catch (error) {
      console.error('Error sending goal notification:', error);
    }
  }
}
