
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

// Sample habits for development
export const SAMPLE_HABITS = [
  {
    id: "1",
    name: "قراءة 15 دقيقة",
    title: "قراءة 15 دقيقة",
    category: "تطوير شخصي",
    completed: false,
    streak: 0
  },
  {
    id: "2", 
    name: "شرب 8 أكواب ماء",
    title: "شرب 8 أكواب ماء",
    category: "صحة",
    completed: true,
    streak: 5
  }
];

// Sample bad habits for development
export const SAMPLE_BAD_HABITS = [
  {
    id: "1",
    name: "التدخين",
    goal: "الإقلاع عن التدخين نهائياً",
    dayCount: 0,
    alternativeAction: "مضغ العلكة أو شرب الماء"
  },
  {
    id: "2",
    name: "السهر المفرط",
    goal: "النوم قبل الساعة 11 مساءً",
    dayCount: 2,
    alternativeAction: "قراءة كتاب أو ممارسة التأمل"
  }
];

// Other existing constants can go here
export const DEFAULT_CATEGORIES = APP_CATEGORIES;
