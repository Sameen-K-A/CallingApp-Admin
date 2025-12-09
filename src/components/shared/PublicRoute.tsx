import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTE } from '@/routes/router';

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTE.DASHBOARD} replace />;
  }

  return <Outlet />;
};