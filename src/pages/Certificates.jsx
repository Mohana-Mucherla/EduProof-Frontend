import React, { useState, useEffect } from 'react';
import certificateService from '../services/certificateService';
import CertificateModal from '../components/CertificateModal';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCert, setSelectedCert] = useState(null);
  const [revokingCertId, setRevokingCertId] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeLoading, setRevokeLoading] = useState(false);

  const loadCertificates = async (query = '') => {
    try {
      setLoading(true);
      const data = await certificateService.getAllCertificates(query);
      setCertificates(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCertificates(search);
  };

  const handleRevokeSubmit = async (e) => {
    e.preventDefault();
    if (!revokingCertId) return;
    try {
      setRevokeLoading(true);
      await certificateService.revokeCertificate(revokingCertId, revokeReason || 'Administrative revocation');
      setRevokingCertId(null);
      setRevokeReason('');
      loadCertificates(search);
    } catch (err) {
      alert('Error revoking certificate: ' + (err.response?.data?.error || err.message));
    } finally {
      setRevokeLoading(false);
    }
  };

  const filteredCertificates = certificates.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Institutional Certificate Registry</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Query, inspect, and revoke digital credentials persisted in MySQL table: <code className="mono">certificates</code>
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name, roll number, or certificate code (e.g. EDU-CERT)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
            {search && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setSearch(''); loadCertificates(''); }}
              >
                Clear
              </button>
            )}
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All ({certificates.length})
            </button>
            <button
              onClick={() => setStatusFilter('VALID')}
              className={`btn btn-sm ${statusFilter === 'VALID' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Active Valid
            </button>
            <button
              onClick={() => setStatusFilter('REVOKED')}
              className={`btn btn-sm ${statusFilter === 'REVOKED' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Revoked
            </button>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="panel">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            Loading certificate registry from MySQL database...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>Certificate Type</th>
                  <th>Issue Date</th>
                  <th>CGPA (/10)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.length > 0 ? (
                  filteredCertificates.map((cert) => {
                    const isRevoked = cert.status === 'REVOKED';
                    return (
                      <tr key={cert.certificateId}>
                        <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {cert.uniqueCertificateCode}
                        </td>
                        <td style={{ fontWeight: 600 }}>{cert.studentName}</td>
                        <td className="mono" style={{ color: 'var(--text-muted)' }}>{cert.studentRollNumber}</td>
                        <td>{cert.departmentName || 'Engineering'}</td>
                        <td>{cert.certificateTypeName}</td>
                        <td>{cert.issueDate}</td>
                        <td className="mono" style={{ fontWeight: 700, color: '#fbbf24' }}>
                          {cert.cgpa ? `${cert.cgpa} / 10.00` : '—'}
                        </td>
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
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No certificates found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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

export default Certificates;
