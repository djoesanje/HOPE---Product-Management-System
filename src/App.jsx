import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { UserRightsProvider } from './contexts/UserRightsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import DeletedItemsPage from './pages/DeletedItemsPage';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading && location.pathname !== '/auth/callback') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <UserRightsProvider>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/products" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={currentUser ? <Navigate to="/products" replace /> : <RegisterPage />} 
        />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deleted-items"
          element={
            <ProtectedRoute requiredTypes={['ADMIN', 'SUPERADMIN']}>
              <Layout>
                <DeletedItemsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagementPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </UserRightsProvider>
  );
}

export default App;
