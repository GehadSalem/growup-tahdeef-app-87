
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { AppSidebar } from '@/components/sidebar/AppSidebar';

// استيراد الصفحات الأساسية بشكل مباشر (تحميل أولي)
import OnboardingScreen from '@/pages/OnboardingScreen';
import Login from '@/pages/Login';
import Menu from '@/pages/Menu';
import NotFound from '@/pages/NotFound';
import Subscription from '@/pages/Subscription'; // تغيير من lazy إلى استيراد مباشر

// استيراد الصفحات الأخرى باستخدام التحميل الكسول (lazy loading)
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const SelfDevelopment = lazy(() => import('@/pages/SelfDevelopment'));
const BreakHabits = lazy(() => import('@/pages/BreakHabits'));
const FinancialPlanning = lazy(() => import('@/pages/FinancialPlanning'));
const Investment = lazy(() => import('@/pages/Investment'));
const MajorGoals = lazy(() => import('@/pages/MajorGoals'));

// مكون التحميل
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
    </div>
  </div>
);

// إنشاء مكون لتغليف الصفحات التي تستخدم الشريط الجانبي
const withSidebar = (Component: React.ComponentType) => (
  <>
    <AppSidebar />
    <div className="flex-1">
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </div>
  </>
);

// تعريف مسارات التطبيق
export const appRoutes: RouteObject[] = [
  // المسارات العامة
  { path: '/', element: <OnboardingScreen /> },
  { path: '/login', element: <Login /> },
  { path: '/onboarding', element: <OnboardingScreen /> },
  { path: '/menu', element: <Menu /> },
  
  // صفحة الاشتراك
  { path: '/subscription', element: <Subscription /> },
  
  // مسارات لوحة التحكم مع الشريط الجانبي
  { path: '/dashboard', element: withSidebar(Dashboard) },
  { path: '/self-development', element: withSidebar(SelfDevelopment) },
  { path: '/break-habits', element: withSidebar(BreakHabits) },
  { path: '/financial-planning', element: withSidebar(FinancialPlanning) },
  { path: '/investment', element: withSidebar(Investment) },
  { path: '/major-goals', element: withSidebar(MajorGoals) },
  
  // مسار غير موجود
  { path: '*', element: <NotFound /> }
];
