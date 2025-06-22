
import { lazy, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Loading } from '@/components/shared/Loading';

// Core Pages
import OnboardingScreen from '@/pages/OnboardingScreen';
import Login from '@/pages/Login';
import MainMenu from '@/pages/MainMenu';
import NotFound from '@/pages/NotFound';
import Subscription from '@/pages/Subscription';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Referral from '@/pages/Referral';
import Logout from '@/pages/Logout';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Contact from '@/pages/Contact';
import DailyTasks from '@/pages/DailyTasks';

// Legal Pages
import LegalMenu from '@/pages/legal/LegalMenu';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TermsOfService from '@/pages/legal/TermsOfService';
import RefundPolicy from '@/pages/legal/RefundPolicy';

// Lazy Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const SelfDevelopment = lazy(() => import('@/pages/SelfDevelopment'));
const BreakHabits = lazy(() => import('@/pages/BreakHabits'));
const FinancialPlanning = lazy(() => import('@/pages/FinancialPlanning'));
const MajorGoals = lazy(() => import('@/pages/MajorGoals'));

// Admin Lazy Pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminSubscriptions = lazy(() => import('@/pages/admin/Subscriptions'));
const AdminContent = lazy(() => import('@/pages/admin/Content'));
const AdminSupport = lazy(() => import('@/pages/admin/Support'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const userRole = user ? JSON.parse(user).role : null;

  if (!token) return <Navigate to="/login" replace />;
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/not-authorized'} replace />;
  }

  return <>{children}</>;
};

const withSidebar = (Component: React.ComponentType) => (
  <SidebarProvider>
    <AppSidebar />
    <div className="flex-1">
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </div>
  </SidebarProvider>
);

export const appRoutes: RouteObject[] = [
  // Root route - check for authentication and redirect appropriately
  {
    path: '/',
    element: (() => {
      const token = localStorage.getItem('token');
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      
      if (!token) {
        if (onboardingCompleted === 'true') {
          return <Navigate to="/login" replace />;
        } else {
          return <Navigate to="/onboarding" replace />;
        }
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    })(),
  },

  // Public Routes
  { path: '/onboarding', element: <OnboardingScreen /> },
  {
    path: '/login',
    element: localStorage.getItem('token') ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Login />
    ),
  },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/legal', element: <LegalMenu /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-of-service', element: <TermsOfService /> },
  { path: '/refund-policy', element: <RefundPolicy /> },
  { path: '/contact', element: <Contact /> },
  { path: '/not-authorized', element: <div className="p-4 text-center">ليس لديك صلاحية الوصول إلى هذه الصفحة</div> },

  // Main Menu Route
  {
    path: '/main-menu',
    element: (
      <ProtectedRoute>
        <MainMenu />
      </ProtectedRoute>
    ),
  },

  // Protected Routes - User
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        {withSidebar(Dashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/self-development',
    element: (
      <ProtectedRoute>
        {withSidebar(SelfDevelopment)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/break-habits',
    element: (
      <ProtectedRoute>
        {withSidebar(BreakHabits)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/financial-planning',
    element: (
      <ProtectedRoute>
        {withSidebar(FinancialPlanning)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/major-goals',
    element: (
      <ProtectedRoute>
        {withSidebar(MajorGoals)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/daily-tasks',
    element: (
      <ProtectedRoute>
        <DailyTasks />
      </ProtectedRoute>
    ),
  },
  {
    path: '/subscription',
    element: (
      <ProtectedRoute>
        <Subscription />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: '/referral',
    element: (
      <ProtectedRoute>
        <Referral />
      </ProtectedRoute>
    ),
  },
  { path: '/logout', element: <Logout /> },

  // Protected Routes - Admin
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSidebar(AdminDashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSidebar(AdminUsers)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/subscriptions',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSidebar(AdminSubscriptions)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/content',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSidebar(AdminContent)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/support',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSidebar(AdminSupport)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <ProtectedRoute requiredRole="admin">
        {withSidebar(AdminSettings)}
      </ProtectedRoute>
    ),
  },

  // 404 Fallback
  { path: '*', element: <NotFound /> },
];
