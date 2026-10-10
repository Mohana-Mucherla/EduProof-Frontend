import React, { useState } from 'react';
import certificateService from '../services/certificateService';

const CertificateModal = ({ certificate, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!certificate) return null;

  const isRevoked = certificate.status === 'REVOKED';
  const verifyUrl = `${window.location.origin}/verify/${certificate.uniqueCertificateCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📜</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
              Digital Academic Credential
            </span>
            <span className={isRevoked ? 'badge badge-revoked' : 'badge badge-valid'}>
              {certificate.status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print Certificate">
              🖨️ Print
            </button>
            <a
              href={certificateService.getDownloadUrl(certificate.certificateId)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              download
            >
              📥 Download PDF
            </a>
            <button onClick={handleCopyLink} className="btn btn-secondary btn-sm">
              {copySuccess ? '✓ Copied!' : '🔗 Share Link'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '0.5rem',
                padding: '0 0.5rem'
              }}
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div style={{ padding: '2rem' }}>
          <div className="certificate-frame">
            {/* Corner Accents */}
            <div className="cert-corner top-left"></div>
            <div className="cert-corner top-right"></div>
            <div className="cert-corner bottom-left"></div>
            <div className="cert-corner bottom-right"></div>

            {/* Revoked Watermark */}
            {isRevoked && (
              <div className="cert-watermark-revoked">
                REVOKED
              </div>
            )}

            {/* University Crest / Title */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🏛️</div>
              <h2 style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.65rem',
                color: '#0f172a',
                letterSpacing: '0.05em',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                Anurag University
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' }}>
                Accredited by NAAC with 'A+' Grade • Recognized by AICTE & UGC • Hyderabad, Telangana, India
              </div>
              <div style={{
                height: '2px',
                width: '180px',
                background: 'linear-gradient(90deg, transparent, #d97706, transparent)',
                margin: '0.75rem auto 0 auto'
              }}></div>
            </div>

            {/* Certificate Type Header */}
            <div className="cert-title-big">
              {certificate.title || certificate.certificateTypeName || 'CERTIFICATE OF EXCELLENCE'}
            </div>
            <div style={{
              fontSize: '0.78rem',
              color: '#d97706',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1.2rem'
            }}>
              Department of {certificate.departmentName || 'Computer Science & Engineering'}
            </div>

            {/* Body */}
            <div style={{ fontSize: '0.98rem', color: '#334155', fontStyle: 'italic', margin: '1rem 0 0.5rem 0' }}>
              This is to formally certify that
            </div>

            <div className="cert-recipient-name">
              {certificate.studentName || 'Student Name'}
            </div>

            <div style={{
              fontSize: '0.95rem',
              color: '#334155',
              lineHeight: 1.7,
              maxWidth: '650px',
              margin: '0.5rem auto 1.5rem auto'
            }}>
              bearing Roll Number <strong style={{ color: '#0f172a' }}>{certificate.studentRollNumber || 'N/A'}</strong> has successfully fulfilled all academic criteria and has been awarded this credential with a cumulative grade point average of{' '}
              <strong style={{ color: '#b45309', fontSize: '1.1rem' }}>
                {certificate.cgpa ? `${certificate.cgpa} / 10.00` : '9.00 / 10.00'}
              </strong>.
              {certificate.academicRemarks && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: '#475569' }}>
                  "{certificate.academicRemarks}"
                </div>
              )}
            </div>

            {/* Golden Seal & Signatures */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(217, 119, 6, 0.25)'
            }}>
              {/* QR Code & ID */}
              <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {(() => {
                  const qr = certificate.qrCodePath || certificate.qrCodeBase64;
                  if (!qr || qr.startsWith('/')) {
                    return (
                      <div style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '6px',
                        border: '1px dashed #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: '#64748b'
                      }}>
                        QR Code
                      </div>
                    );
                  }
                  const src = qr.startsWith('data:') ? qr : `data:image/png;base64,${qr}`;
                  return (
                    <img
                      src={src}
                      alt="Verification QR Code"
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        padding: '4px',
                        background: '#fff'
                      }}
                    />
                  );
                })()}
                <div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
                    Certificate ID
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {certificate.uniqueCertificateCode}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
                    Issued: {certificate.issueDate}
                  </div>
                </div>
              </div>

              {/* Seal */}
              <div className="cert-seal-gold">
                <div>★ ★ ★</div>
                <div style={{ fontSize: '0.56rem' }}>OFFICIAL</div>
                <div>SEAL</div>
              </div>

              {/* Authority Signature */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: '#1e293b',
                  marginBottom: '4px'
                }}>
                  Dean of Academics
                </div>
                <div style={{
                  height: '1px',
                  width: '140px',
                  background: '#94a3b8',
                  marginLeft: 'auto',
                  marginBottom: '4px'
                }}></div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Controller of Examinations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
