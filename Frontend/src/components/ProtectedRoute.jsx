import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
     // If user tries to access admin route but is just a ranger
     return <Navigate to="/dashboard" replace />;
  }

  return children;
}
