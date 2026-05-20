import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// requiredTypes: optional array of user_type strings (e.g. ['ADMIN', 'SUPERADMIN'])
// If provided, users not in the list are redirected to /products.
export default function ProtectedRoute({ children, requiredTypes }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredTypes && !requiredTypes.includes(currentUser.user_type)) {
    return <Navigate to="/products" replace />;
  }

  return children;
}
