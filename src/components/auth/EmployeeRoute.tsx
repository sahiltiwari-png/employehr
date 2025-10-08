import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface EmployeeRouteProps {
  children: ReactNode;
}

const EmployeeRoute = ({ children }: EmployeeRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const role = user?.role;
  if (!role || role.toLowerCase() !== 'employee') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ accessDenied: true, from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default EmployeeRoute;