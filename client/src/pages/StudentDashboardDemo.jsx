import { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StudentDashboardDemo = () => {
  const { user } = useDemo();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, [user]);

  const fetchCredentials = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/credentials/subject/${user.id}`);
      setCredentials(response.data.data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getVerificationLink = (hash) => {
    return `${window.location.origin}/verify/${hash}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <p className="dashboard-subtitle">View and manage your academic credentials</p>

      {/* Profile Section */}
      <div className="card">
        <h2>👤 Profile Information</h2>
        <div className="profile-grid">
          <div className="profile-item">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          <div className="profile-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-item">
            <label>Institution:</label>
            <span>{user.organization}</span>
          </div>
          <div className="profile-item">
            <label>Wallet Address:</label>
            <span className="wallet-address">{user.walletAddress}</span>
          </div>
          <div className="profile-item">
            <label>DID:</label>
            <span className="did">{user.did}</span>
          </div>
          <div className="profile-item">
            <label>Status:</label>
            <span className="badge badge-success">✓ Verified</span>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="card">
        <h2>🎓 My Credentials</h2>

        {loading ? (
          <p>Loading credentials...</p>
        ) : credentials.length === 0 ? (
          <p className="empty-state">No credentials issued yet.</p>
        ) : (
          <div className="credentials-grid">
            {credentials.map((cred) => (
              <div key={cred.id} className="credential-card">
                <div className="credential-header">
                  <h3>{cred.credentialType}</h3>
                  <span className={`badge ${cred.isRevoked ? 'badge-error' : 'badge-success'}`}>
                    {cred.isRevoked ? 'Revoked' : 'Valid'}
                  </span>
                </div>

                <div className="credential-body">
                  <div className="credential-detail">
                    <label>Degree:</label>
                    <span>{cred.credentialData?.degree}</span>
                  </div>
                  <div className="credential-detail">
                    <label>Major:</label>
                    <span>{cred.credentialData?.major}</span>
                  </div>
                  <div className="credential-detail">
                    <label>Institution:</label>
                    <span>{cred.issuerDetails?.organization}</span>
                  </div>
                  <div className="credential-detail">
                    <label>GPA:</label>
                    <span>{cred.credentialData?.gpa}</span>
                  </div>
                  <div className="credential-detail">
                    <label>Honors:</label>
                    <span>{cred.credentialData?.honors || 'N/A'}</span>
                  </div>
                  <div className="credential-detail">
                    <label>Graduation Date:</label>
                    <span>{formatDate(cred.credentialData?.graduationDate)}</span>
                  </div>
                  <div className="credential-detail">
                    <label>Issued:</label>
                    <span>{formatDate(cred.issuedAt)}</span>
                  </div>
                  <div className="credential-detail">
                    <label>Expires:</label>
                    <span>{formatDate(cred.expiresAt)}</span>
                  </div>
                </div>

                <div className="credential-footer">
                  <button
                    onClick={() => copyToClipboard(getVerificationLink(cred.credentialHash))}
                    className="btn btn-sm btn-outline"
                  >
                    📋 Copy Verification Link
                  </button>
                  <a
                    href={`/verify/${cred.credentialHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    🔍 Verify
                  </a>
                </div>

                <div className="credential-hash">
                  <small>Hash: {cred.credentialHash.substring(0, 20)}...</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Info */}
      <div className="demo-notice-box">
        <p>💡 <strong>Demo Mode:</strong> All credentials shown are demonstration data. In production, these would be real blockchain-verified credentials.</p>
      </div>
    </div>
  );
};

export default StudentDashboardDemo;
