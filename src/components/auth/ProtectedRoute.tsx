import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    const dashboardPath = `/dashboard/${user.role.replace('_', '-')}`;
    return <Navigate to={dashboardPath} replace />;

    // Redirect to appropriate dashboard based on role
    const roleToPathMap = {
  president: 'president',
  club_president: 'president',
  venue_coordinator: 'venue-coordinator',
  faculty: 'faculty',
  hod: 'hod',
  dean: 'dean',
  director: 'director',
};

  }

  return <>{children}</>;
};

export default ProtectedRoute;