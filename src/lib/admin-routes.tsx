
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

// مكون التحميل المشترك
const AdminLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
    </div>
  </div>
);

// استيراد صفحات لوحة التحكم باستخدام التحميل الكسول
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminSubscriptions = lazy(() => import('@/pages/admin/Subscriptions'));
const AdminContent = lazy(() => import('@/pages/admin/Content'));
const AdminSupport = lazy(() => import('@/pages/admin/Support'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));

// تعريف مسارات لوحة التحكم
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <Suspense fallback={<AdminLoading />}>
        <AdminDashboard />
      </Suspense>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <Suspense fallback={<AdminLoading />}>
        <AdminUsers />
      </Suspense>
    ),
  },
  {
    path: '/admin/subscriptions',
    element: (
      <Suspense fallback={<AdminLoading />}>
        <AdminSubscriptions />
      </Suspense>
    ),
  },
  {
    path: '/admin/content',
    element: (
      <Suspense fallback={<AdminLoading />}>
        <AdminContent />
      </Suspense>
    ),
  },
  {
    path: '/admin/support',
    element: (
      <Suspense fallback={<AdminLoading />}>
        <AdminSupport />
      </Suspense>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <Suspense fallback={<AdminLoading />}>
        <AdminSettings />
      </Suspense>
    ),
  },
];
