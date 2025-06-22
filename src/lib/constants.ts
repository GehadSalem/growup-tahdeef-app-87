
export const APP_CATEGORIES = [
  { id: 'health', name: 'الصحة', color: 'bg-green-500', icon: '🏃‍♂️' },
  { id: 'learning', name: 'التعلم', color: 'bg-blue-500', icon: '📚' },
  { id: 'productivity', name: 'الإنتاجية', color: 'bg-purple-500', icon: '⚡' },
  { id: 'mindfulness', name: 'الوعي الذاتي', color: 'bg-orange-500', icon: '🧘‍♂️' },
  { id: 'social', name: 'الاجتماعية', color: 'bg-pink-500', icon: '👥' },
  { id: 'finance', name: 'المالية', color: 'bg-yellow-500', icon: '💰' },
  { id: 'creativity', name: 'الإبداع', color: 'bg-red-500', icon: '🎨' },
  { id: 'spiritual', name: 'الروحانية', color: 'bg-indigo-500', icon: '🕊️' }
];

export const HABIT_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
} as const;

export const DEFAULT_CATEGORIES = [
  'الصحة',
  'التعلم', 
  'الإنتاجية',
  'الوعي الذاتي',
  'الاجتماعية',
  'المالية',
  'الإبداع',
  'الروحانية'
];
