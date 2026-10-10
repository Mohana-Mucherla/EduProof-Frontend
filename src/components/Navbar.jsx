import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <div className="brand-icon">🎓</div>
        <div>
          <div className="brand-title">EduProof</div>
          <div className="brand-sub">Credential & Certificate System</div>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
          Home
        </NavLink>

        <NavLink to="/verify" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Verify
        </NavLink>

        {user && isAdmin && (
          <>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Dashboard
            </NavLink>
            <NavLink to="/students" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Students
            </NavLink>
            <NavLink to="/certificates" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              All Certificates
            </NavLink>
            <NavLink to="/issue" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              + Issue
            </NavLink>
          </>
        )}

        {user && isStudent && (
          <>
            <NavLink to="/student" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              My Credentials
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Profile
            </NavLink>
          </>
        )}

        <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: isAdmin ? '#818cf8' : '#34d399', fontWeight: 700 }}>
                  {isAdmin ? 'COLLEGE ADMIN' : 'STUDENT'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Sign out">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
