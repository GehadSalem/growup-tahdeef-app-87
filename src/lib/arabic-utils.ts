
// تحويل الأرقام الإنجليزية إلى العربية
export const toArabicNumerals = (num: string | number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

// تحويل التاريخ إلى صيغة عربية
export const formatArabicDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  return `${toArabicNumerals(day)} ${arabicMonths[month - 1]} ${toArabicNumerals(year)}`;
};

// تحويل الشهر والسنة إلى صيغة عربية
export const formatArabicMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split("-");
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  return `${arabicMonths[parseInt(month) - 1]} ${toArabicNumerals(year)}`;
};

// تحويل عدد الأشهر إلى نص عربي
export const formatArabicDuration = (months: number): string => {
  if (months <= 0) return "٠ شهر";
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${toArabicNumerals(remainingMonths)} شهر`;
  } else if (remainingMonths === 0) {
    return `${toArabicNumerals(years)} سنة`;
  } else {
    return `${toArabicNumerals(years)} سنة و${toArabicNumerals(remainingMonths)} أشهر`;
  }
};
