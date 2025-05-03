// ثوابت وإعدادات التطبيق

import { CategoryItem } from "./types";

// تحديد فئات التطبيق الرئيسية
export const APP_CATEGORIES: CategoryItem[] = [
  {
    id: "self-development",
    title: "تطوير الذات",
    description: "طور مهاراتك وعاداتك الإيجابية",
    icon: "📚",
    route: "/self-development",
    color: "bg-purple-100"
  },
  {
    id: "break-habits",
    title: "كسر العادات السيئة",
    description: "تخلص من العادات السيئة خطوة بخطوة",
    icon: "🎯",
    route: "/break-habits",
    color: "bg-red-100"
  },
  {
    id: "dashboard",
    title: "لوحة التحكم",
    description: "نظرة عامة على تقدمك اليومي",
    icon: "📊",
    route: "/dashboard",
    color: "bg-blue-100"
  },
  {
    id: "financial-planning",
    title: "التخطيط المالي",
    description: "إدارة ميزانيتك ومصاريفك الشهرية",
    icon: "💰",
    route: "/financial-planning",
    color: "bg-green-100"
  },
  {
    id: "major-goals",
    title: "الأهداف الكبرى",
    description: "حدد وتابع أهدافك الرئيسية",
    icon: "🎯",
    route: "/major-goals", 
    color: "bg-orange-100"
  }
];

// بيانات نموذجية للعادات اليومية
export const SAMPLE_HABITS = [
  { id: "1", title: "قرأت 10 صفحات من كتاب", category: "تعلم", completed: false, icon: "📚" },
  { id: "2", title: "استمعت لبودكاست", category: "تطوير", completed: false, icon: "🎧" },
  { id: "3", title: "ممارسة التأمل", category: "صحة", completed: true, icon: "🧘‍♂️" },
  { id: "4", title: "متابعة أخبار مهنية", category: "تطوير", completed: false, icon: "🌐" },
  { id: "5", title: "تواصل مع العائلة", category: "اجتماعي", completed: false, icon: "👨‍👩‍👧" },
];

// بيانات نموذجية للعادات السيئة
export const SAMPLE_BAD_HABITS = [
  {
    id: "1",
    name: "الإقلاع عن التدخين",
    goal: "30 يوم بدون تدخين",
    dayCount: 7,
    alternativeAction: "امشِ 5 دقائق عندما تشعر برغبة في التدخين"
  }
];

// فئات العادات
export const HABIT_CATEGORIES = {
  learning: { name: "تعلم", icon: "📚" },
  health: { name: "صحة", icon: "🧘‍♂️" },
  productivity: { name: "إنتاجية", icon: "⏱️" },
  finance: { name: "مالي", icon: "💰" },
  social: { name: "اجتماعي", icon: "👥" },
  other: { name: "أخرى", icon: "✨" }
};

// أنواع الالتزامات المالية
export const OBLIGATION_TYPES = [
  { value: "loan", label: "قسط" },
  { value: "occasion", label: "مناسبة" },
  { value: "purchase", label: "شراء" },
  { value: "other", label: "آخر" }
];

// تكرار الالتزامات
export const OBLIGATION_FREQUENCIES = [
  { value: "monthly", label: "شهري" },
  { value: "quarterly", label: "ربع سنوي" },
  { value: "yearly", label: "سنوي" },
  { value: "once", label: "مرة واحدة" }
];
