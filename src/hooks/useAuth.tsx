
import { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '@/services/authService';
import { useToast } from './use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login({ email, password });
      setUser(response.user);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في تطبيق GrowUp",
        duration: 5000
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "خطأ في تسجيل الدخول";
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await AuthService.register({ email, password, name });
      setUser(response.user);
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في تطبيق GrowUp",
        duration: 5000
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "خطأ في إنشاء الحساب";
      toast({
        title: "خطأ في إنشاء الحساب",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
      duration: 3000
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
