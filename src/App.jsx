import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Students from './pages/Students';
import Certificates from './pages/Certificates';
import IssueCertificate from './pages/IssueCertificate';
import Verification from './pages/Verification';
import VerificationResult from './pages/VerificationResult';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 75px)', paddingBottom: '3rem' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/verify/:code" element={<VerificationResult />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Certificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/issue"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <IssueCertificate />
              </ProtectedRoute>
            }
          />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        background: 'rgba(10, 14, 26, 0.95)'
      }}>
        <div>EduProof • Digital Credential & Certificate Verification System</div>
        <div style={{ marginTop: '4px' }}>
          Anurag University, Hyderabad, Telangana, India • Powered by Spring Boot 3 & MySQL
        </div>
      </footer>
    </div>
  );
}

export default App;
