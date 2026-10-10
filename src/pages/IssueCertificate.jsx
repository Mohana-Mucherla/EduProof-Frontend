import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import certificateService from '../services/certificateService';
import CertificateModal from '../components/CertificateModal';

const IssueCertificate = () => {
  const [students, setStudents] = useState([]);
  const [certTypes, setCertTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successCert, setSuccessCert] = useState(null);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    certificateTypeId: '',
    certificateTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    cgpa: '9.00',
    academicRemarks: 'Awarded for outstanding academic achievement and fulfilling all institutional graduation requirements.'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studs, types] = await Promise.all([
          studentService.getAllStudents(),
          certificateService.getCertificateTypes()
        ]);
        setStudents(studs);
        setCertTypes(types);

        // Check if studentId was passed in query params
        const params = new URLSearchParams(location.search);
        const initialStudentId = params.get('studentId') || (studs[0]?.studentId || '');
        const initialTypeId = types[0]?.certificateTypeId || '';

        setFormData((prev) => ({
          ...prev,
          studentId: initialStudentId,
          certificateTypeId: initialTypeId,
          certificateTitle: types[0]?.typeName ? `${types[0].typeName.toUpperCase()} OF EXCELLENCE` : 'DEGREE CERTIFICATE'
        }));

        // If initial student found, sync CGPA
        if (initialStudentId) {
          const selectedStudent = studs.find((s) => s.studentId === Number(initialStudentId));
          if (selectedStudent && selectedStudent.cgpa) {
            setFormData((prev) => ({ ...prev, cgpa: selectedStudent.cgpa.toString() }));
          }
        }
      } catch (err) {
        setError('Error fetching student and certificate type options.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleStudentChange = (e) => {
    const sid = e.target.value;
    const selected = students.find((s) => s.studentId === Number(sid));
    setFormData((prev) => ({
      ...prev,
      studentId: sid,
      cgpa: selected?.cgpa ? selected.cgpa.toString() : prev.cgpa
    }));
  };

  const handleTypeChange = (e) => {
    const tid = e.target.value;
    const selectedType = certTypes.find((t) => t.certificateTypeId === Number(tid));
    setFormData((prev) => ({
      ...prev,
      certificateTypeId: tid,
      certificateTitle: selectedType ? selectedType.typeName.toUpperCase() : prev.certificateTitle
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessCert(null);
    setSubmitting(true);

    try {
      const payload = {
        studentId: Number(formData.studentId),
        certificateTypeId: Number(formData.certificateTypeId),
        title: formData.certificateTitle.trim(),
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || null,
        cgpa: formData.cgpa ? Number(formData.cgpa) : null,
        description: formData.academicRemarks.trim()
      };

      const result = await certificateService.issueCertificate(payload);
      setSuccessCert(result);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to issue certificate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Issue Digital Certificate</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Issue tamper-proof academic credentials for Anurag University students. Automatically creates QR code, PDF, and MySQL ledger records.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          color: '#fb7185',
          fontSize: '0.88rem',
          marginBottom: '1.5rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {successCert ? (
        <div className="panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.6rem', color: '#34d399', marginBottom: '0.5rem' }}>
            Certificate Successfully Issued & Saved to MySQL!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The certificate code and ZXing QR verification hash have been saved to the <code className="mono">certificates</code> table.
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            maxWidth: '520px',
            margin: '0 auto 2rem auto',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            {successCert.qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${successCert.qrCodeBase64}`}
                alt="Generated QR"
                style={{ width: '90px', height: '90px', borderRadius: '8px', background: '#fff', padding: '4px' }}
              />
            )}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Unique Certificate ID
              </div>
              <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {successCert.uniqueCertificateCode}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '4px' }}>
                Recipient: <strong>{successCert.studentName}</strong> ({successCert.studentRollNumber})
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', marginTop: '2px' }}>
                {successCert.title}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setSuccessCert(null)} className="btn btn-secondary">
              + Issue Another Certificate
            </button>
            <button
              onClick={() => {
                navigate('/admin');
              }}
              className="btn btn-secondary"
            >
              Go to Dashboard
            </button>
            <a
              href={certificateService.getDownloadUrl(successCert.certificateId)}
              className="btn btn-primary"
              download
            >
              📥 Download Generated PDF
            </a>
          </div>
        </div>
      ) : (
        <div className="panel">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select Student</label>
                <select
                  name="studentId"
                  className="form-select"
                  value={formData.studentId}
                  onChange={handleStudentChange}
                  required
                >
                  {students.map((student) => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.name} ({student.rollNumber}) — {student.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Certificate Type</label>
                <select
                  name="certificateTypeId"
                  className="form-select"
                  value={formData.certificateTypeId}
                  onChange={handleTypeChange}
                  required
                >
                  {certTypes.map((type) => (
                    <option key={type.certificateTypeId} value={type.certificateTypeId}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Certificate Official Title</label>
              <input
                type="text"
                name="certificateTitle"
                className="form-input"
                placeholder="e.g. BACHELOR OF TECHNOLOGY IN COMPUTER SCIENCE"
                value={formData.certificateTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  className="form-input"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cumulative GPA (/ 10.00)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10.00"
                  name="cgpa"
                  className="form-input"
                  placeholder="e.g. 9.42"
                  value={formData.cgpa}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Remarks / Honors Description</label>
              <textarea
                name="academicRemarks"
                className="form-textarea"
                rows="3"
                value={formData.academicRemarks}
                onChange={handleChange}
                placeholder="e.g. Graduated First Class with Distinction, recognized for outstanding technical capstone."
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || loading}
              >
                {submitting ? 'Generating ZXing QR & PDF...' : '⚡ Generate & Issue Certificate'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IssueCertificate;
