
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { toArabicNumerals } from '@/lib/arabic-utils';

interface DateDropdownsProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  className?: string;
}

export function DateDropdowns({ value, onChange, className }: DateDropdownsProps) {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // استخراج القيم من التاريخ المحدد
  const dateObj = new Date(value || today);
  const selectedYear = dateObj.getFullYear();
  const selectedMonth = dateObj.getMonth() + 1;
  const selectedDay = dateObj.getDate();
  
  // الأشهر بالعربية
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  // حساب عدد الأيام في الشهر المحدد
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  
  // تحديث التاريخ عند تغيير أي قائمة
  const updateDate = (year: number, month: number, day: number) => {
    // التأكد من أن اليوم صالح للشهر المحدد
    const maxDays = getDaysInMonth(year, month);
    const validDay = Math.min(day, maxDays);
    
    const newDate = `${year}-${month.toString().padStart(2, '0')}-${validDay.toString().padStart(2, '0')}`;
    onChange(newDate);
  };
  
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {/* قائمة السنوات */}
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => updateDate(parseInt(value), selectedMonth, selectedDay)}
      >
        <SelectTrigger className="text-right">
          <SelectValue placeholder="السنة" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 20 }, (_, i) => currentYear - 10 + i).map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {toArabicNumerals(year)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* قائمة الأشهر */}
      <Select
        value={selectedMonth.toString()}
        onValueChange={(value) => updateDate(selectedYear, parseInt(value), selectedDay)}
      >
        <SelectTrigger className="text-right">
          <SelectValue placeholder="الشهر" />
        </SelectTrigger>
        <SelectContent>
          {arabicMonths.map((month, index) => (
            <SelectItem key={index + 1} value={(index + 1).toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* قائمة الأيام */}
      <Select
        value={selectedDay.toString()}
        onValueChange={(value) => updateDate(selectedYear, selectedMonth, parseInt(value))}
      >
        <SelectTrigger className="text-right">
          <SelectValue placeholder="اليوم" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <SelectItem key={day} value={day.toString()}>
              {toArabicNumerals(day)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
