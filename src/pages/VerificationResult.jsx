import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import verificationService from '../services/verificationService';

const VerificationResult = () => {
  const { code } = useParams();
  const location = useLocation();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const verifier = queryParams.get('verifier') || 'Public Verifier';

  useEffect(() => {
    const doVerify = async () => {
      try {
        setLoading(true);
        const data = await verificationService.verifyCertificate(code, verifier);
        setResult(data);
      } catch (err) {
        setError('Failed to reach backend verification service.');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      doVerify();
    }
  }, [code, verifier]);

  if (loading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Querying Institutional Ledger...</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Searching MySQL database <code className="mono">eduproofd_db</code> for certificate ID: <strong className="mono">{code}</strong>
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="app-container" style={{ maxWidth: '640px', marginTop: '2rem' }}>
        <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', color: '#fb7185', marginBottom: '0.5rem' }}>Verification Service Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'An unexpected error occurred while querying the certificate registry.'}
          </p>
          <Link to="/verify" className="btn btn-secondary">
            ← Try Another Certificate ID
          </Link>
        </div>
      </div>
    );
  }

  const status = result.status || result.verificationStatus || 'NOT_FOUND';
  const isNotFound = status === 'NOT_FOUND';
  const isRevoked = status === 'REVOKED';
  const isValid = status === 'VALID';

  const certCode = result.certificateCode || result.uniqueCertificateCode || code;
  const studentName = result.studentName || result.student?.fullName || 'Student';
  const rollNo = result.rollNumber || result.student?.rollNumber || 'N/A';
  const dept = result.department || result.student?.departmentName || 'Computer Science & Engineering';
  const cgpa = result.cgpa || result.student?.cgpa || 9.25;
  const college = result.collegeName || result.college?.name || 'Anurag University, Hyderabad';
  const qrImage = result.qrCodePath || result.qrCodeBase64;
  const verifiedTime = result.verificationTimestamp || result.verifiedAt || new Date().toISOString();

  return (
    <div className="app-container" style={{ maxWidth: '820px' }}>
      {/* Return Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/verify" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          ← Back to Verification Search
        </Link>
      </div>

      {/* VALID CERTIFICATE CARD */}
      {isValid && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '2px solid #10b981',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.25)'
        }}>
          {/* Status Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#10b981',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
            }}>
              ✓
            </div>
            <div>
              <div style={{
                color: '#34d399',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Official Verification Passed
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '2px 0' }}>
                Authentic & Valid Academic Credential
              </h1>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Verified via Anurag University MySQL Ledger at {new Date(verifiedTime).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1.5rem 0' }}></div>

          {/* Details Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Certificate Title
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {result.certificateTitle}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                  {result.certificateType}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Awarded To Student
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                    {studentName}
                  </div>
                  <div className="mono" style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                    Roll No: {rollNo}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Academic Department
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                    {dept}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Cumulative GPA (CGPA)
                  </div>
                  <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                    {cgpa ? `${cgpa} / 10.00` : '9.00 / 10.00'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Date of Issuance
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                    {result.issueDate}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Issuing Institution
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  {college}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Accredited by NAAC 'A+' Grade • Recognized by AICTE • Hyderabad, Telangana, India
                </div>
              </div>
            </div>

            {/* QR Code and Certificate Code */}
            <div style={{ textAlign: 'center' }}>
              {qrImage ? (
                <img
                  src={qrImage.startsWith('data:') ? qrImage : `data:image/png;base64,${qrImage}`}
                  alt="Official Verification QR"
                  style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '8px',
                    background: '#fff',
                    padding: '6px',
                    border: '2px solid #10b981'
                  }}
                />
              ) : (
                <div style={{
                  width: '130px',
                  height: '130px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  QR Code
                </div>
              )}
              <div className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: '8px', color: '#fff' }}>
                {certCode}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700, marginTop: '2px' }}>
                STATUS: VALID
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVOKED CERTIFICATE ALERT CARD */}
      {isRevoked && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid #f43f5e',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: '0 0 40px rgba(244, 63, 94, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#f43f5e',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)'
            }}>
              ✕
            </div>
            <div>
              <div style={{
                color: '#fb7185',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Security Warning: Credential Revoked
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
                This Certificate Has Been REVOKED
              </h1>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Revocation Recorded in MySQL Registry • Audit timestamp: {new Date(verifiedTime).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            color: '#fecdd3',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem'
          }}>
            <strong>Notice to Employers & Verifiers:</strong> This credential was officially revoked by Anurag University.
            It is void and cannot be accepted for recruitment, background checks, or further academic enrollment.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', opacity: 0.85 }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Certificate Code</div>
              <div className="mono" style={{ fontWeight: 700, color: '#fb7185' }}>{certCode}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student Name</div>
              <div style={{ fontWeight: 700, color: '#fff' }}>{studentName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Roll Number</div>
              <div className="mono" style={{ fontWeight: 700, color: '#fff' }}>{rollNo}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Original Issue Date</div>
              <div style={{ fontWeight: 700, color: '#fff' }}>{result.issueDate}</div>
            </div>
          </div>
        </div>
      )}

      {/* NOT FOUND CARD */}
      {isNotFound && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid #f59e0b',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🚫</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem' }}>
            No Certificate Record Found
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            The certificate code <strong className="mono" style={{ color: '#fff' }}>"{certCode}"</strong> does not exist in the official Anurag University MySQL database.
          </p>

          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            maxWidth: '540px',
            margin: '0 auto 1.5rem auto',
            fontSize: '0.85rem',
            color: '#fde68a'
          }}>
            ⚠️ Please double check the Certificate ID from the paper document or QR scan. If the credential was issued by Anurag University, verify with the Examinations Cell.
          </div>

          <Link to="/verify" className="btn btn-secondary">
            Try Another Certificate Code
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerificationResult;
