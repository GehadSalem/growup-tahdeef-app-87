
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loading } from '@/components/shared/Loading';

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
      <Suspense fallback={<Loading />}>
        <AdminDashboard />
      </Suspense>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminUsers />
      </Suspense>
    ),
  },
  {
    path: '/admin/subscriptions',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminSubscriptions />
      </Suspense>
    ),
  },
  {
    path: '/admin/content',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminContent />
      </Suspense>
    ),
  },
  {
    path: '/admin/support',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminSupport />
      </Suspense>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminSettings />
      </Suspense>
    ),
  },
];
