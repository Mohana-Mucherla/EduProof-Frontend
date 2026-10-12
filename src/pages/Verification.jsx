import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Verification = () => {
  const [code, setCode] = useState('');
  const [verifierName, setVerifierName] = useState('');
  const [showAuthWall, setShowAuthWall] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, isRecruiter, loading } = useAuth();

  // Only admins and recruiters can verify
  const canVerify = isAdmin || isRecruiter;

  const handleVerify = (e) => {
    e.preventDefault();
    if (!canVerify) {
      setShowAuthWall(true);
      return;
    }
    if (code.trim()) {
      const name = verifierName.trim() || (user?.name || user?.email || 'Recruiter / Verification Agency');
      navigate(`/verify/${encodeURIComponent(code.trim())}?verifier=${encodeURIComponent(name)}`);
    }
  };

  const handleSampleClick = (sampleCode) => {
    if (!canVerify) {
      setShowAuthWall(true);
      return;
    }
    const name = verifierName.trim() || (user?.name || user?.email || 'Recruiter / Verification Agency');
    navigate(`/verify/${sampleCode}?verifier=${encodeURIComponent(name)}`);
  };

  return (
    <div className="app-container" style={{ maxWidth: '680px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Credential Verification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0.5rem auto 0 auto' }}>
          Official verification portal for Anurag University digital certificates.
          Instantly verify the integrity and active standing of any issued academic degree.
        </p>

        {/* Role badge */}
        {!loading && (
          <div style={{ marginTop: '1rem' }}>
            {canVerify ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399', borderRadius: '999px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', fontWeight: 700
              }}>
                ✅ Verified {isAdmin ? 'Admin' : 'Recruiter'} — Full access granted
              </span>
            ) : user ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#f59e0b', borderRadius: '999px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', fontWeight: 700
              }}>
                ⚠️ Students cannot perform verifications
              </span>
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#818cf8', borderRadius: '999px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', fontWeight: 700
              }}>
                🔒 Sign in as Recruiter or Admin to verify
              </span>
            )}
          </div>
        )}
      </div>

      {/* Auth Wall Modal */}
      {showAuthWall && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthWall(false); }}
        >
          <div style={{
            background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)', padding: '2.5rem', maxWidth: '420px', width: '90%',
            textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Authentication Required
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {user
                ? 'Only Recruiters and Admins can verify certificates. Students do not have verification access.'
                : 'You must sign in as a Recruiter or Admin to verify certificates.'}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!user && (
                <Link
                  to="/login"
                  state={{ from: { pathname: '/verify' } }}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', padding: '0.65rem 1.5rem' }}
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setShowAuthWall(false)}
                className="btn"
                style={{
                  padding: '0.65rem 1.5rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Form */}
      <div className="panel" style={{ padding: '2rem', position: 'relative' }}>
        {/* Overlay for non-authorized users */}
        {!loading && !canVerify && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)',
            background: 'rgba(10, 14, 26, 0.55)', backdropFilter: 'blur(3px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 2, gap: '1rem', cursor: 'pointer'
          }}
            onClick={() => setShowAuthWall(true)}
          >
            <div style={{ fontSize: '2.5rem' }}>🔒</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                {user ? 'Recruiter / Admin Access Only' : 'Sign In to Verify'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {user
                  ? 'Your student account cannot perform verifications.'
                  : 'Recruiters and Admins can verify credentials.'}
              </div>
            </div>
            {!user && (
              <Link
                to="/login"
                state={{ from: { pathname: '/verify' } }}
                className="btn btn-primary"
                style={{ textDecoration: 'none', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                Sign In to Verify
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">Candidate Student Name or Certificate Code</label>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '1.05rem', padding: '0.85rem 1rem' }}
              placeholder="e.g. Rahul Kumar or EDU-CERT-2026-00001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={!canVerify}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Verifier Name / Organization (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder={canVerify
                ? (user?.name || user?.email || 'e.g. Google India HR / Tata Consultancy Services')
                : 'Sign in to enter your organization name'}
              value={verifierName}
              onChange={(e) => setVerifierName(e.target.value)}
              disabled={!canVerify}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={!canVerify}
          >
            ⚡ Verify Authenticity
          </button>
        </form>

        {/* Quick Verification Samples */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.85rem'
          }}>
            Try Live Database Test Records:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { code: 'EDU-CERT-2026-00001', name: 'Rahul Kumar • B.Tech Degree', valid: true },
              { code: 'EDU-CERT-2026-00002', name: 'Priya Sharma • B.Tech Degree', valid: true },
              { code: 'EDU-CERT-2025-00003', name: 'Vikram Singh • Revoked Credential', valid: false },
            ].map((item) => (
              <div
                key={item.code}
                onClick={() => handleSampleClick(item.code)}
                style={{
                  background: item.valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                  border: `1px solid ${item.valid ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  cursor: canVerify ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  opacity: canVerify ? 1 : 0.5
                }}
              >
                <div>
                  <span className="mono" style={{ color: item.valid ? '#34d399' : '#fb7185', fontWeight: 700 }}>
                    {item.code}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                    {item.name}
                  </span>
                </div>
                <span className={`badge ${item.valid ? 'badge-valid' : 'badge-revoked'}`}>
                  {item.valid ? 'VALID' : 'REVOKED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info note for guests */}
      {!loading && !user && (
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          padding: '1rem',
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          🔒 Verification is restricted to authorized <strong style={{ color: '#818cf8' }}>Recruiters</strong> and{' '}
          <strong style={{ color: '#818cf8' }}>Admins</strong>.{' '}
          <Link to="/login" style={{ color: '#818cf8', textDecoration: 'underline' }}>
            Sign in here
          </Link>{' '}
          to access the full verification system.
        </div>
      )}
    </div>
  );
};

export default Verification;
