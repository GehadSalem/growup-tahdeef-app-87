import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { appRoutes } from "@/lib/routes";
import { Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { NotificationProvider } from "./context/NotificationContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// إنشاء عميل للاستعلامات
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// مكون التحميل
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
    </div>
  </div>
);

// إنشاء المسارات
const router = createBrowserRouter(appRoutes);

// المكون الرئيسي للتطبيق
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <RouterProvider 
                router={router}
                fallbackElement={<Loading />}
              />
            </div>
          </SidebarProvider>
        </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;