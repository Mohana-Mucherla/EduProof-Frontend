import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const [certCode, setCertCode] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin, isStudent } = useAuth();

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certCode.trim()) {
      navigate(`/verify/${certCode.trim()}`);
    }
  };

  return (
    <div className="app-container home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-tagline">🏛️ Anurag University • Official Credential Registry</div>
          <h1>College Digital Certificate Issuance & Verification</h1>
          <p className="hero-description" style={{color: 'var(--text-main)'}}>
            EduProof is an enterprise digital credential management system. It enables Anurag University
            It issues tamper‑proof digital degrees, transcripts, bonafides, and merit certificates,
            stores them encrypted in MySQL, digitally signs each record, and provides instant QR‑based verification.
          </p>

<div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
  {user ? null : (
    <>
      <Link to={isAdmin ? '/admin' : '/student'} className="btn btn-primary">
        Go to {isAdmin ? 'Admin Dashboard' : 'Student Portal'} →
      </Link>
      <Link to="/login" className="btn btn-primary">
        Sign In to Portal
      </Link>
      <Link to="/verify" className="btn btn-primary">
        Verify a Certificate
      </Link>
    </>
  )}
</div>
        </div>

        {/* Quick Verification Search Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid var(--border-focus)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Quick Credential Verification</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#fff', marginBottom: '1.2rem' }}>
            Recruiters, universities, or employers can instantly verify the authenticity of any certificate issued by Anurag University.
          </p>

          <form onSubmit={handleVerifySubmit}>
            <div className="form-group">
              <label className="form-label" style={{color: '#fff'}}>Enter Student Name or Certificate Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Kumar or EDU-CERT-2026-00001"
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Verify Authenticity Now ⚡
            </button>
          </form>

          <div style={{ marginTop: '1rem', fontSize: '0.74rem', color: '#fff' }}>
            Try samples:{' '}
            <span
              onClick={() => navigate('/verify/Rahul%20Kumar')}
              style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Rahul Kumar
            </span>
            {' | '}
            <span
              onClick={() => navigate('/verify/EDU-CERT-2026-00001')}
              style={{ color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              EDU-CERT-2026-00001
            </span>
            {' | '}
            <span
              onClick={() => navigate('/verify/EDU-CERT-2025-00003')}
              style={{ color: 'var(--accent-rose)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              EDU-CERT-2025-00003 (Revoked)
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.2rem', textAlign: 'center' }}>
          Core System Capabilities
        </h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon indigo">💾</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>MySQL Database</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                All students, certificates, and logs are persisted directly in local MySQL tables.
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan">📱</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>ZXing QR Generation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Every issued certificate is automatically embedded with a scannable QR verification code.
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon emerald">📄</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>iText PDF Engine</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Generates high-resolution academic degree PDFs ready for instant download and printing.
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gold">🛡️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Instant Revocation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Revoked credentials immediately show warning banners and verification timestamps.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Test Portal Quick Links */}
      <section className="panel" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Demo Portal Accounts</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Test the full stack application using these pre-configured Anurag University demo credentials:
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            minWidth: '280px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎓</span>
              <strong style={{ color: '#818cf8' }}>College Admin</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email: <code className="mono" style={{ color: '#fff' }}>admin@college.edu</code></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password: <code className="mono" style={{ color: '#fff' }}>Admin@123</code></div>
            <div style={{ marginTop: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Sign In as Admin
              </Link>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            minWidth: '280px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>👨‍🎓</span>
              <strong style={{ color: '#34d399' }}>Student (Rahul Kumar)</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email: <code className="mono" style={{ color: '#fff' }}>rahul.kumar@college.edu</code></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password: <code className="mono" style={{ color: '#fff' }}>Student@123</code></div>
            <div style={{ marginTop: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Sign In as Student
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
