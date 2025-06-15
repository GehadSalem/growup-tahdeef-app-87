import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import Login from './pages/Login';
import MainMenu from './pages/MainMenu';
import FinancialPlanning from './pages/FinancialPlanning';
import MajorGoals from './pages/MajorGoals';
import BreakHabits from './pages/BreakHabits';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import LegalMenu from './pages/legal/LegalMenu';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import RefundPolicy from './pages/legal/RefundPolicy';
import { Toaster } from "@/components/ui/toaster"
import AdminPanel from './pages/AdminPanel';
import { NotificationProvider } from '@/contexts/NotificationContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NotificationProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/main-menu" element={<MainMenu />} />
              <Route path="/financial-planning" element={<FinancialPlanning />} />
              <Route path="/major-goals" element={<MajorGoals />} />
              <Route path="/break-habits" element={<BreakHabits />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/legal-menu" element={<LegalMenu />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </AuthProvider>
        </NotificationProvider>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
