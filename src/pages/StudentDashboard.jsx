import React, { useState, useEffect } from 'react';
import certificateService from '../services/certificateService';
import studentService from '../services/studentService';
import CertificateModal from '../components/CertificateModal';

const StudentDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [certsData, profileData] = await Promise.allSettled([
          certificateService.getAllCertificates(),
          studentService.getMyProfile()
        ]);

        if (certsData.status === 'fulfilled') {
          setCertificates(certsData.value);
        }
        if (profileData.status === 'fulfilled') {
          setProfile(profileData.value);
        }
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCopyLink = (code) => {
    const url = `${window.location.origin}/verify/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="app-container">
      {/* Student Banner */}
      <div className="hero-banner" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="hero-tagline">🎓 Student Credential Locker</div>
          <h1 style={{ fontSize: '2rem' }}>Welcome, {profile?.name || 'Student'}</h1>
          <p className="hero-description">
            Access, download, and share your verified academic credentials issued by Anurag University.
            Every credential is cryptographically tied to our MySQL registry and scannable via QR code.
          </p>
        </div>

        {profile && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Roll Number
            </div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
              {profile.rollNumber}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '4px' }}>
              {profile.departmentName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: '4px', fontWeight: 700 }}>
              CGPA: {profile.cgpa ? `${profile.cgpa} / 10.00` : 'N/A'}
            </div>
          </div>
        )}
      </div>

      {/* Certificates Section */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">My Digital Certificates</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Verified credentials issued by the Anurag University Controller of Examinations
            </div>
          </div>
          <span className="badge badge-info">{certificates.length} Issued</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            Loading credentials from MySQL database...
          </div>
        ) : certificates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📂</div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>No Certificates Found</h3>
            <p style={{ maxWidth: '480px', margin: '0 auto', fontSize: '0.85rem' }}>
              You do not have any digital certificates issued yet. Contact the Anurag University administration office to have your academic certificates issued.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Certificate Title</th>
                  <th>Type</th>
                  <th>Issue Date</th>
                  <th>CGPA / Score</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => {
                  const isRevoked = cert.status === 'REVOKED';
                  return (
                    <tr key={cert.certificateId}>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        {cert.uniqueCertificateCode}
                      </td>
                      <td style={{ fontWeight: 600 }}>{cert.title || cert.certificateTypeName}</td>
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
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="btn btn-primary btn-sm"
                            title="View Official Certificate"
                          >
                            👁️ View
                          </button>
                          <a
                            href={certificateService.getDownloadUrl(cert.certificateId)}
                            className="btn btn-secondary btn-sm"
                            download
                            title="Download PDF"
                          >
                            📥 Download
                          </a>
                          <button
                            onClick={() => handleCopyLink(cert.uniqueCertificateCode)}
                            className="btn btn-secondary btn-sm"
                            title="Copy Verification Link"
                          >
                            {copiedCode === cert.uniqueCertificateCode ? '✓ Copied' : '🔗 Link'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
