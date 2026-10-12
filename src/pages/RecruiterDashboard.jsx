import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import verificationService from '../services/verificationService';
import certificateService from '../services/certificateService';
import CertificateModal from '../components/CertificateModal';

const RecruiterDashboard = () => {
  const [candidateName, setCandidateName] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [logs, setLogs] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const navigate = useNavigate();

  const handleSearch = async (e, overrideName = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = (overrideName !== null ? overrideName : candidateName).trim();
    if (!query) return;

    if (overrideName !== null) {
      setCandidateName(overrideName);
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const data = await verificationService.verifyByStudentName(query, 'Recruiter Dashboard');
      setResults(data.certificates || []);
      loadRecentLogs();
    } catch (err) {
      console.error('Error verifying candidate by name:', err);
      setError('Failed to query certificate registry. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentLogs = async () => {
    try {
      const data = await verificationService.getVerificationLogs();
      setLogs((data || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const handleCopyLink = (code) => {
    const url = `${window.location.origin}/verify/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="app-container">
      {/* Recruiter Hero Banner */}
      <div className="hero-banner" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="hero-tagline">🏢 Recruiter Verification Hub</div>
          <h1 style={{ fontSize: '2rem' }}>Verify Candidates by Student Name</h1>
          <p className="hero-description">
            Recruiters, HR teams, and employers can instantly verify applicant degrees and transcripts
            simply by searching the candidate's full student name. Cryptographically validated against
            Anurag University's MySQL ledger.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.75rem',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Portal Access
          </div>
          <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            RECRUITER / HR
          </div>
          <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px' }}>
            Instant Student Name Lookup
          </div>
        </div>
      </div>

      {/* Candidate Name Search Panel */}
      <div className="panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          🔍 Candidate Search & Verification
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Type any applicant's student name below to retrieve their official degree status, CGPA, and QR code verification.
        </p>

        <form onSubmit={(e) => handleSearch(e)}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, minWidth: '280px', fontSize: '1.05rem', padding: '0.85rem 1.25rem' }}
              placeholder="Enter student name (e.g. Rahul Kumar, Priya Sharma, Vikram Singh)..."
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', whiteSpace: 'nowrap' }}
              disabled={loading}
            >
              {loading ? 'Verifying in MySQL...' : '⚡ Verify Candidate'}
            </button>
          </div>
        </form>

        {/* Quick Sample Candidates */}
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Quick Candidates:
          </span>
          {['Rahul Kumar', 'Priya Sharma', 'Vikram Singh', 'Ramya Mucherla', 'Test Student'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSearch(null, name)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
            >
              👤 {name}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginTop: '1.25rem'
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Verification Search Results */}
      {hasSearched && (
        <div className="panel" style={{ marginBottom: '2rem' }}>
          <div className="panel-header">
            <div>
              <h2 className="panel-title">
                Verification Results for "{candidateName}"
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Directly cross-referenced with Anurag University institutional database records
              </div>
            </div>
            <span className={`badge ${results.length > 0 ? 'badge-valid' : 'badge-revoked'}`}>
              {results.length} Credential(s) Found
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
              Querying candidate credentials from MySQL...
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
              <h3 style={{ fontSize: '1.25rem', color: '#fb7185', marginBottom: '0.5rem' }}>
                No Certificate Found for "{candidateName}"
              </h3>
              <p style={{ maxWidth: '480px', margin: '0 auto', fontSize: '0.85rem' }}>
                No active or historical certificates were found under this student name in the university registry.
                Please ensure the spelling matches the student's official university records.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {results.map((cert) => {
                const isRevoked = cert.status === 'REVOKED';
                return (
                  <div
                    key={cert.certificateId || cert.uniqueCertificateCode}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: isRevoked ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {cert.qrCodeBase64 && (
                        <img
                          src={`data:image/png;base64,${cert.qrCodeBase64}`}
                          alt="QR Code"
                          style={{
                            width: '90px',
                            height: '90px',
                            background: '#fff',
                            padding: '4px',
                            borderRadius: '8px'
                          }}
                        />
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                            {cert.studentName}
                          </h3>
                          <span className={isRevoked ? 'badge badge-revoked' : 'badge badge-valid'}>
                            {cert.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          {cert.title || cert.certificateTitle}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Roll No: <strong className="mono" style={{ color: '#fff' }}>{cert.rollNumber}</strong>
                          {' • '}
                          Dept: <strong>{cert.department || cert.departmentName}</strong>
                          {' • '}
                          Issue Date: <strong>{cert.issueDate}</strong>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent-amber)', marginTop: '2px', fontWeight: 700 }}>
                          Cumulative GPA: {cert.cgpa ? `${cert.cgpa} / 10.00` : 'N/A'}
                        </div>
                        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          Credential Code: {cert.uniqueCertificateCode}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="btn btn-primary btn-sm"
                        title="View Official Certificate"
                      >
                        👁️ View Full Certificate
                      </button>
                      <button
                        onClick={() => navigate(`/verify/${cert.uniqueCertificateCode}?verifier=Recruiter`)}
                        className="btn btn-secondary btn-sm"
                        title="View Institutional Audit Page"
                      >
                        🔍 Public Audit
                      </button>
                      <a
                        href={certificateService.getDownloadUrl(cert.certificateId)}
                        className="btn btn-secondary btn-sm"
                        download
                        title="Download PDF"
                      >
                        📥 PDF
                      </a>
                      <button
                        onClick={() => handleCopyLink(cert.uniqueCertificateCode)}
                        className="btn btn-secondary btn-sm"
                        title="Copy Link"
                      >
                        {copiedCode === cert.uniqueCertificateCode ? '✓ Copied' : '🔗 Link'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recent Verification Logs */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Institutional Verification Audit Logs</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time audit records stored in MySQL verification_logs
            </div>
          </div>
          <span className="badge badge-info">{logs.length} Recent Inquiries</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Certificate Code</th>
                <th>Verifier Organization</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.logId}>
                  <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {log.certificateCode}
                  </td>
                  <td>{log.verifierName}</td>
                  <td>
                    <span className={log.verificationStatus === 'REVOKED' ? 'badge badge-revoked' : 'badge badge-valid'}>
                      {log.verificationStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(log.verifiedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;
