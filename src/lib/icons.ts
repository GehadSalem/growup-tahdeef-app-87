// src/lib/icons.ts
export const getIconForCategory = (category: string) => {
  if (!category) return '📝';
  
  const normalized = category.trim().toLowerCase();
  const icons: Record<string, string> = {
    'learning': '📚',
    'health': '🧘‍♂️',
    'productivity': '⏱️',
    'finance': '💰',
    'social': '👥',
    'other': '✨',
    'تعلم': '📚',
    'صحة': '🧘‍♂️',
    'إنتاجية': '⏱️',
    'مالي': '💰',
    'اجتماعي': '👥',
    'أخرى': '✨',
    'study': '📚',
    'رياضة': '🏃‍♂️',
    'sport': '🏃‍♂️',
    'work': '💼',
    'عمل': '💼',
  };

  return icons[normalized] || '📝';
};