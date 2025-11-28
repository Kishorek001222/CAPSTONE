import { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UniversityDashboardDemo = () => {
  const { user } = useDemo();
  const [students, setStudents] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuingCredential, setIssuingCredential] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    studentId: '',
    credentialType: 'Bachelor Degree',
    degree: '',
    major: '',
    gpa: '',
    honors: '',
    graduationDate: '',
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [studentsRes, credentialsRes] = await Promise.all([
        axios.get(`${API_URL}/api/students`),
        axios.get(`${API_URL}/api/credentials/issuer/${user.id}`)
      ]);
      setStudents(studentsRes.data.data);
      setCredentials(credentialsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleIssueCredential = async (e) => {
    e.preventDefault();
    setIssuingCredential(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_URL}/api/credentials/issue`, {
        issuerId: user.id,
        subjectId: formData.studentId,
        credentialType: formData.credentialType,
        credentialData: {
          degree: formData.degree,
          major: formData.major,
          gpa: parseFloat(formData.gpa),
          honors: formData.honors,
          graduationDate: new Date(formData.graduationDate),
          institution: user.organization
        },
        expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) // 10 years
      });

      setMessage({ type: 'success', text: 'Credential issued successfully!' });
      setShowIssueForm(false);
      setFormData({
        studentId: '',
        credentialType: 'Bachelor Degree',
        degree: '',
        major: '',
        gpa: '',
        honors: '',
        graduationDate: '',
      });
      fetchData(); // Refresh credentials list
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to issue credential' });
    } finally {
      setIssuingCredential(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">University Dashboard</h1>
      <p className="dashboard-subtitle">Issue and manage student credentials</p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* University Info */}
      <div className="card">
        <h2>🏛️ Institution Information</h2>
        <div className="profile-grid">
          <div className="profile-item">
            <label>Institution:</label>
            <span>{user.organization}</span>
          </div>
          <div className="profile-item">
            <label>Contact:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-item">
            <label>Wallet Address:</label>
            <span className="wallet-address">{user.walletAddress}</span>
          </div>
          <div className="profile-item">
            <label>Issued Credentials:</label>
            <span className="badge badge-primary">{credentials.length}</span>
          </div>
        </div>
      </div>

      {/* Issue Credential Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📜 Issue New Credential</h2>
          <button
            onClick={() => setShowIssueForm(!showIssueForm)}
            className="btn btn-primary"
          >
            {showIssueForm ? 'Cancel' : '+ Issue Credential'}
          </button>
        </div>

        {showIssueForm && (
          <form onSubmit={handleIssueCredential} className="issue-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Select Student</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Student --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Credential Type</label>
                <select
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Bachelor Degree">Bachelor Degree</option>
                  <option value="Master Degree">Master Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>

              <div className="form-group">
                <label>Degree Title</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor of Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>Major/Field</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>GPA</label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="e.g., 3.85"
                  required
                />
              </div>

              <div className="form-group">
                <label>Honors (Optional)</label>
                <input
                  type="text"
                  name="honors"
                  value={formData.honors}
                  onChange={handleInputChange}
                  placeholder="e.g., Summa Cum Laude"
                />
              </div>

              <div className="form-group">
                <label>Graduation Date</label>
                <input
                  type="date"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={issuingCredential}
            >
              {issuingCredential ? 'Issuing...' : 'Issue Credential'}
            </button>
          </form>
        )}
      </div>

      {/* Issued Credentials */}
      <div className="card">
        <h2>📋 Issued Credentials ({credentials.length})</h2>

        {loading ? (
          <p>Loading credentials...</p>
        ) : credentials.length === 0 ? (
          <p className="empty-state">No credentials issued yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="credentials-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Degree</th>
                  <th>Major</th>
                  <th>GPA</th>
                  <th>Issued</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {credentials.map((cred) => (
                  <tr key={cred.id}>
                    <td>{cred.subjectDetails?.name}</td>
                    <td>{cred.credentialType}</td>
                    <td>{cred.credentialData?.degree}</td>
                    <td>{cred.credentialData?.major}</td>
                    <td>{cred.credentialData?.gpa}</td>
                    <td>{formatDate(cred.issuedAt)}</td>
                    <td>
                      <span className={`badge ${cred.isRevoked ? 'badge-error' : 'badge-success'}`}>
                        {cred.isRevoked ? 'Revoked' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Demo Info */}
      <div className="demo-notice-box">
        <p>💡 <strong>Demo Mode:</strong> In production, issuing credentials would create real blockchain transactions.</p>
      </div>
    </div>
  );
};

export default UniversityDashboardDemo;
