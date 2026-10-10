import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../services/studentService';
import certificateService from '../services/certificateService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    rollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    enrollmentYear: new Date().getFullYear(),
    cgpa: '8.50',
    status: 'ACTIVE',
    initialPassword: 'Student@123'
  });

  const navigate = useNavigate();

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      const [studs, depts] = await Promise.all([
        studentService.getAllStudents(query),
        certificateService.getDepartments()
      ]);
      setStudents(studs);
      setDepartments(depts);
      if (depts.length > 0 && !formData.departmentId) {
        setFormData((prev) => ({ ...prev, departmentId: depts[0].departmentId }));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData(search);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      await studentService.createStudent(
        {
          rollNumber: formData.rollNumber.trim(),
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          departmentId: Number(formData.departmentId),
          course: 'B.Tech',
          year: '1st Year',
          admissionYear: Number(formData.enrollmentYear),
          graduationYear: Number(formData.enrollmentYear) + 4,
          cgpa: formData.cgpa ? Number(formData.cgpa) : null,
          status: formData.status
        },
        formData.initialPassword
      );

      setShowAddModal(false);
      setFormData({
        rollNumber: '',
        fullName: '',
        email: '',
        phone: '',
        departmentId: departments[0]?.departmentId || '',
        enrollmentYear: new Date().getFullYear(),
        cgpa: '8.50',
        status: 'ACTIVE',
        initialPassword: 'Student@123'
      });
      loadData(search);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'Failed to enroll student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"? This action removes their MySQL records.`)) {
      try {
        await studentService.deleteStudent(id);
        loadData(search);
      } catch (err) {
        alert('Error deleting student: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage registered Anurag University students stored in MySQL table: <code className="mono">students</code>
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          + Enroll New Student
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by student name or roll number (e.g. 21AG1A0501)..."
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
              onClick={() => { setSearch(''); loadData(''); }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Students Data Table */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Enrolled Students ({students.length})</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            Fetching student records from MySQL...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>CGPA (/10)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.studentId}>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {student.rollNumber}
                      </td>
                      <td style={{ fontWeight: 600 }}>{student.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                      <td>{student.departmentName || 'Computer Science'}</td>
                      <td>{student.year || '—'}</td>
                      <td className="mono" style={{ fontWeight: 700, color: '#fbbf24' }}>
                        {student.cgpa ? `${student.cgpa} / 10.00` : '—'}
                      </td>
                      <td>
                        <span className="badge badge-valid">
                          {student.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => navigate(`/issue?studentId=${student.studentId}`)}
                            className="btn btn-primary btn-sm"
                            title="Issue certificate for this student"
                          >
                            + Issue Cert
                          </button>
                          <button
                            onClick={() => handleDelete(student.studentId, student.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Student"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: '600px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👨‍🎓</span> Enroll New Student
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Enrolls student in Anurag University registry, automatically creating a MySQL user account and student record.
            </p>

            {errorMessage && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                color: '#fb7185',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleAddSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    className="form-input mono"
                    placeholder="e.g. 21AG1A0503"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Suresh Reddy"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. suresh.reddy@college.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="departmentId"
                    className="form-select"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    required
                  >
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName} ({dept.departmentCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Enrollment Year</label>
                  <input
                    type="number"
                    name="enrollmentYear"
                    className="form-input"
                    value={formData.enrollmentYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CGPA (Out of 10.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10.00"
                    name="cgpa"
                    className="form-input"
                    placeholder="e.g. 8.75"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Student Portal Password</label>
                  <input
                    type="text"
                    name="initialPassword"
                    className="form-input mono"
                    value={formData.initialPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving to MySQL...' : 'Save & Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
