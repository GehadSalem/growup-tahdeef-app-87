import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from '@/components/shared/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const userData = JSON.parse(user);
    
    if (requiredRole && userData.role !== requiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }

    return <>{children}</>;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};