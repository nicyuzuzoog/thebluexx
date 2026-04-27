import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const AdminRoute = ({ children }) => {
  const { isAdmin, isPublisher, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && !isPublisher) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;