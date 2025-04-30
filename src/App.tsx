
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

// Pages
import OnboardingScreen from "./pages/OnboardingScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SelfDevelopment from "./pages/SelfDevelopment";
import BreakHabits from "./pages/BreakHabits";
import FinancialPlanning from "./pages/FinancialPlanning";
import Investment from "./pages/Investment";
import NotFound from "./pages/NotFound";
import Menu from "./pages/Menu";
import MajorGoals from "./pages/MajorGoals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Routes>
              <Route path="/" element={<OnboardingScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/menu" element={<Menu />} />
              
              {/* Dashboard Routes - These will have the sidebar */}
              <Route
                path="/dashboard"
                element={
                  <>
                    <AppSidebar />
                    <div className="flex-1">
                      <Dashboard />
                    </div>
                  </>
                }
              />
              <Route
                path="/self-development"
                element={
                  <>
                    <AppSidebar />
                    <div className="flex-1">
                      <SelfDevelopment />
                    </div>
                  </>
                }
              />
              <Route
                path="/break-habits"
                element={
                  <>
                    <AppSidebar />
                    <div className="flex-1">
                      <BreakHabits />
                    </div>
                  </>
                }
              />
              <Route
                path="/financial-planning"
                element={
                  <>
                    <AppSidebar />
                    <div className="flex-1">
                      <FinancialPlanning />
                    </div>
                  </>
                }
              />
              <Route
                path="/investment"
                element={
                  <>
                    <AppSidebar />
                    <div className="flex-1">
                      <Investment />
                    </div>
                  </>
                }
              />
              <Route
                path="/major-goals"
                element={
                  <>
                    <AppSidebar />
                    <div className="flex-1">
                      <MajorGoals />
                    </div>
                  </>
                }
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
