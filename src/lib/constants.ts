
import { 
  Target, 
  PiggyBank, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  Brain,
  UserCheck,
  BarChart3
} from "lucide-react";

// App categories for navigation
export const APP_CATEGORIES = [
  {
    id: "dashboard",
    name: "اللوحة الرئيسية",
    title: "اللوحة الرئيسية",
    description: "نظرة عامة على تقدمك",
    icon: "BarChart3",
    route: "/dashboard",
    color: "blue"
  },
  {
    id: "major-goals",
    name: "الأهداف الرئيسية",
    title: "الأهداف الرئيسية", 
    description: "حدد وتابع أهدافك الكبيرة",
    icon: "Target",
    route: "/major-goals",
    color: "green"
  },
  {
    id: "financial-planning",
    name: "التخطيط المالي",
    title: "التخطيط المالي",
    description: "إدارة مالية ذكية",
    icon: "PiggyBank", 
    route: "/financial-planning",
    color: "emerald"
  },
  {
    id: "daily-tasks",
    name: "المهام اليومية",
    title: "المهام اليومية",
    description: "نظم يومك بفعالية",
    icon: "CheckCircle2",
    route: "/daily-tasks", 
    color: "purple"
  },
  {
    id: "self-development",
    name: "التطوير الذاتي",
    title: "التطوير الذاتي",
    description: "بناء عادات إيجابية",
    icon: "Brain",
    route: "/self-development",
    color: "orange"
  },
  {
    id: "break-habits",
    name: "كسر العادات السيئة", 
    title: "كسر العادات السيئة",
    description: "تخلص من العادات الضارة",
    icon: "UserCheck",
    route: "/break-habits",
    color: "red"
  }
];
// بيانات نموذجية للعادات اليومية
export const SAMPLE_HABITS = [
  { id: "1", name: "قرأت 10 صفحات من كتاب", category: "تعلم", completed: false, icon: "📚" },
  { id: "2", name: "استمعت لبودكاست", category: "تطوير", completed: false, icon: "🎧" },
  { id: "3", name: "ممارسة التأمل", category: "صحة", completed: true, icon: "🧘‍♂️" },
  { id: "4", name: "متابعة أخبار مهنية", category: "تطوير", completed: false, icon: "🌐" },
  { id: "5", name: "تواصل مع العائلة", category: "اجتماعي", completed: false, icon: "👨‍👩‍👧" },
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
