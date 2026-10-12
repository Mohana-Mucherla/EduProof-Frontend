import React from 'react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, isAdmin, isStudent } = useAuth();

  return (
    <div className="app-container" style={{ maxWidth: '640px' }}>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            👤
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user?.name || 'User Profile'}</h1>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: isAdmin ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isAdmin ? '#818cf8' : '#34d399',
            fontWeight: 700,
            fontSize: '0.78rem',
            marginTop: '0.5rem'
          }}>
            {isAdmin ? 'COLLEGE ADMINISTRATOR' : 'REGISTERED STUDENT'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#000', fontSize: '0.85rem' }}>Email Address</span>
            <span className="mono" style={{ color: '#000', fontWeight: 600 }}>{user?.email}</span>
          </div>

          {user?.rollNumber && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Roll Number</span>
              <span className="mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{user.rollNumber}</span>
            </div>
          )}

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Institution</span>
            <span style={{ color: '#000', fontWeight: 600 }}>Anurag University, Hyderabad</span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Database Ledger</span>
            <span className="mono" style={{ color: '#34d399', fontSize: '0.85rem' }}>MySQL (eduproofd_db)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
