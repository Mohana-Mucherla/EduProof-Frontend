import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import verificationService from '../services/verificationService';
import certificateService from '../services/certificateService';
import CertificateModal from '../components/CertificateModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [revokingCertId, setRevokingCertId] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeLoading, setRevokeLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await verificationService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRevokeSubmit = async (e) => {
    e.preventDefault();
    if (!revokingCertId) return;
    try {
      setRevokeLoading(true);
      await certificateService.revokeCertificate(revokingCertId, revokeReason || 'Administrative revocation');
      setRevokingCertId(null);
      setRevokeReason('');
      fetchStats();
    } catch (err) {
      alert('Error revoking certificate: ' + (err.response?.data?.error || err.message));
    } finally {
      setRevokeLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: 'var(--text-muted)' }}>Querying MySQL Database (eduproof)...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Operations Console</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Anurag University Credential Management • Connected to MySQL: <span className="mono" style={{ color: '#34d399' }}>eduproof</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/issue" className="btn btn-primary">
            + Issue New Certificate
          </Link>
          <Link to="/students" className="btn btn-secondary">
            + Manage Students
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          color: '#fb7185',
          marginBottom: '1.5rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon indigo">📜</div>
          <div>
            <div className="stat-num">{stats?.totalCertificates ?? 0}</div>
            <div className="stat-title">Total Certificates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">✓</div>
          <div>
            <div className="stat-num">{stats?.validCertificates ?? 0}</div>
            <div className="stat-title">Active & Valid</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rose">⚠️</div>
          <div>
            <div className="stat-num">{stats?.revokedCertificates ?? 0}</div>
            <div className="stat-title">Revoked Certificates</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">👨‍🎓</div>
          <div>
            <div className="stat-num">{stats?.totalStudents ?? 0}</div>
            <div className="stat-title">Enrolled Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gold">🔍</div>
          <div>
            <div className="stat-num">{stats?.totalVerifications ?? 0}</div>
            <div className="stat-title">QR Verifications</div>
          </div>
        </div>
      </div>

      {/* Recent Issued Certificates Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Recently Issued Certificates</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time records from MySQL table: <code className="mono">certificates</code>
            </div>
          </div>
          <Link to="/certificates" className="btn btn-secondary btn-sm">
            View All Certificates →
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Type</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentCertificates && stats.recentCertificates.length > 0 ? (
                stats.recentCertificates.map((cert) => {
                  const isRevoked = cert.status === 'REVOKED';
                  return (
                    <tr key={cert.certificateId}>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        {cert.uniqueCertificateCode}
                      </td>
                      <td style={{ fontWeight: 600 }}>{cert.studentName}</td>
                      <td className="mono" style={{ color: 'var(--text-muted)' }}>{cert.studentRollNumber}</td>
                      <td>{cert.certificateTypeName}</td>
                      <td>{cert.issueDate}</td>
                      <td>
                        <span className={isRevoked ? 'badge badge-revoked' : 'badge badge-valid'}>
                          {cert.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="btn btn-secondary btn-sm"
                            title="View Certificate"
                          >
                            👁️ View
                          </button>
                          <a
                            href={certificateService.getDownloadUrl(cert.certificateId)}
                            className="btn btn-secondary btn-sm"
                            download
                            title="Download PDF"
                          >
                            📥 PDF
                          </a>
                          {!isRevoked && (
                            <button
                              onClick={() => setRevokingCertId(cert.certificateId)}
                              className="btn btn-danger btn-sm"
                              title="Revoke Certificate"
                            >
                              🚫 Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No certificates issued yet. Click "+ Issue New Certificate" above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Logs Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Recent Verification Activity</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Audit trail logged into MySQL table: <code className="mono">verification_logs</code>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Certificate ID</th>
                <th>Verifier / Entity</th>
                <th>IP Address</th>
                <th>Status Checked</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentVerifications && stats.recentVerifications.length > 0 ? (
                stats.recentVerifications.map((log) => (
                  <tr key={log.logId}>
                    <td className="mono" style={{ color: 'var(--text-dim)' }}>#{log.logId}</td>
                    <td className="mono" style={{ fontWeight: 600 }}>{log.certificateCode}</td>
                    <td>{log.verifierName || 'Public Recruiter'}</td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                    <td>
                      <span className={
                        log.verificationStatus === 'VALID'
                          ? 'badge badge-valid'
                          : log.verificationStatus === 'REVOKED'
                          ? 'badge badge-revoked'
                          : 'badge badge-info'
                      }>
                        {log.verificationStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {log.verifiedAt ? new Date(log.verifiedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No verification scans recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revocation Prompt Modal */}
      {revokingCertId && (
        <div className="modal-backdrop" onClick={() => setRevokingCertId(null)}>
          <div className="modal-box" style={{ maxWidth: '480px', padding: '1.75rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: '#fb7185', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Confirm Certificate Revocation
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Revoking this credential will update its status to <strong>REVOKED</strong> in the MySQL database.
              Public verifiers will immediately receive an invalidity alert.
            </p>

            <form onSubmit={handleRevokeSubmit}>
              <div className="form-group">
                <label className="form-label">Reason for Revocation</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="e.g. Academic misconduct, administrative error, or disciplinary action"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRevokingCertId(null)}
                  className="btn btn-secondary"
                  disabled={revokeLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={revokeLoading}
                >
                  {revokeLoading ? 'Revoking in DB...' : 'Confirm Revoke'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
