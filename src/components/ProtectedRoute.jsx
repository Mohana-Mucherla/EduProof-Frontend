import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAdmin, isStudent, isRecruiter } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: 'var(--text-muted)' }}>Loading credentials & session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/student" replace />;
  }

  if (requiredRole === 'STUDENT' && !isStudent && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole === 'RECRUITER' && !isRecruiter) {
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default ProtectedRoute;
