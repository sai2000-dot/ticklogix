import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading, isTrialExpired } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && isTrialExpired()) {
      navigate('/pricing', { replace: true });
    }
  }, [loading, isAuthenticated, isTrialExpired, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin-slow"></div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Loading workspace...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
