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
    return <Navigate to="/verify" replace />;
  }

  if (requiredRole === 'STUDENT' && !(isStudent || isAdmin || isRecruiter)) {
    return <Navigate to="/verify" replace />;
  }

  if (requiredRole === 'RECRUITER' && !isRecruiter) {
    return <Navigate to="/verify" replace />;
  }

  // VERIFIER = Admin OR Recruiter (used for verification result page)
  if (requiredRole === 'VERIFIER' && !(isAdmin || isRecruiter)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
