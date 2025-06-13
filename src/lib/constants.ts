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

// Other existing constants can go here
export const DEFAULT_CATEGORIES = APP_CATEGORIES;
