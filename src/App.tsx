
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { appRoutes } from "@/lib/routes";

// إنشاء عميل للاستعلامات
const queryClient = new QueryClient();

// مكون المسارات لاستخدام useRoutes
const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

// المكون الرئيسي للتطبيق
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppRoutes />
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
