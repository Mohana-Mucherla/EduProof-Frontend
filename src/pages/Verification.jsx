import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const [code, setCode] = useState('');
  const [verifierName, setVerifierName] = useState('Recruiter / Verification Agency');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/verify/${encodeURIComponent(code.trim())}?verifier=${encodeURIComponent(verifierName.trim())}`);
    }
  };

  const handleSampleClick = (sampleCode) => {
    navigate(`/verify/${sampleCode}?verifier=${encodeURIComponent(verifierName.trim())}`);
  };

  return (
    <div className="app-container" style={{ maxWidth: '680px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Public Credential Verification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0.5rem auto 0 auto' }}>
          Official verification portal for Anurag University digital certificates.
          Instantly verify the integrity and active standing of any issued academic degree.
        </p>
      </div>

      <div className="panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">Certificate Identification Code</label>
            <input
              type="text"
              className="form-input mono"
              style={{ fontSize: '1.05rem', padding: '0.85rem 1rem' }}
              placeholder="e.g. EDU-CERT-2026-00001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Verifier Name / Organization (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Google India HR / Tata Consultancy Services / Public Verifier"
              value={verifierName}
              onChange={(e) => setVerifierName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            ⚡ Verify Authenticity Against MySQL
          </button>
        </form>

        {/* Clickable Quick Verification Samples */}
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
            <div
              onClick={() => handleSampleClick('EDU-CERT-2026-00001')}
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <span className="mono" style={{ color: '#34d399', fontWeight: 700 }}>EDU-CERT-2026-00001</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                  Rahul Kumar • B.Tech Degree
                </span>
              </div>
              <span className="badge badge-valid">VALID</span>
            </div>

            <div
              onClick={() => handleSampleClick('EDU-CERT-2026-00002')}
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <span className="mono" style={{ color: '#34d399', fontWeight: 700 }}>EDU-CERT-2026-00002</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                  Priya Sharma • B.Tech Degree
                </span>
              </div>
              <span className="badge badge-valid">VALID</span>
            </div>

            <div
              onClick={() => handleSampleClick('EDU-CERT-2025-00003')}
              style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <span className="mono" style={{ color: '#fb7185', fontWeight: 700 }}>EDU-CERT-2025-00003</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                  Vikram Singh • Revoked Credential
                </span>
              </div>
              <span className="badge badge-revoked">REVOKED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
