import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Subscription from "@/pages/Subscription";
import MainMenu from "@/pages/MainMenu";
import MajorGoals from "@/pages/MajorGoals";
import DailyTasks from "@/pages/DailyTasks";
import FinancialPlanning from "@/pages/FinancialPlanning";
import SelfDevelopment from "@/pages/SelfDevelopment";
import BreakHabits from "@/pages/BreakHabits";
import Notifications from "@/pages/Notifications";
import Referral from "@/pages/Referral";
import Contact from "@/pages/Contact";
import Logout from "@/pages/Logout";
import NotFound from "@/pages/NotFound";
import OnboardingScreen from "@/pages/OnboardingScreen";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminGoals from "@/pages/admin/AdminGoals";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/onboarding",
    element: <OnboardingScreen />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/main-menu",
    element: <MainMenu />,
  },
  {
    path: "/major-goals",
    element: <MajorGoals />,
  },
  {
    path: "/daily-tasks",
    element: <DailyTasks />,
  },
  {
    path: "/financial-planning",
    element: <FinancialPlanning />,
  },
  {
    path: "/self-development",
    element: <SelfDevelopment />,
  },
  {
    path: "/break-habits",
    element: <BreakHabits />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
  {
    path: "/referral",
    element: <Referral />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/admin",
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "goals",
        element: <AdminGoals />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
