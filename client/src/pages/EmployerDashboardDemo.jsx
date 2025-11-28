import { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import axios from 'axios';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EmployerDashboardDemo = () => {
  const { user } = useDemo();
  const [credentialHash, setCredentialHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample credential hashes for demo
  const sampleHashes = [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      label: 'John Doe - MIT Bachelor Degree'
    },
    {
      hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
      label: 'Jane Smith - Stanford Master Degree'
    },
    {
      hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      label: 'Alice Johnson - Harvard MBA'
    }
  ];

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const response = await axios.post(`${API_URL}/api/credentials/verify`, {
        credentialHash
      });

      setVerificationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify credential');
    } finally {
      setLoading(false);
    }
  };

  const useSampleHash = (hash) => {
    setCredentialHash(hash);
    setVerificationResult(null);
    setError('');
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
      <h1 className="dashboard-title">Employer Dashboard</h1>
      <p className="dashboard-subtitle">Verify candidate credentials instantly</p>

      {/* Employer Info */}
      <div className="card">
        <h2>💼 Organization Information</h2>
        <div className="profile-grid">
          <div className="profile-item">
            <label>Organization:</label>
            <span>{user.organization}</span>
          </div>
          <div className="profile-item">
            <label>Contact:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-item">
            <label>Role:</label>
            <span className="badge badge-primary">Employer/Verifier</span>
          </div>
        </div>
      </div>

      {/* Verification Form */}
      <div className="card">
        <h2>🔍 Verify Credential</h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Enter a credential hash to verify its authenticity and view details.
        </p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Credential Hash</label>
            <input
              type="text"
              value={credentialHash}
              onChange={(e) => setCredentialHash(e.target.value)}
              placeholder="0x..."
              className="input-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Verifying...' : '🔍 Verify Credential'}
          </button>
        </form>

        {/* Sample Hashes */}
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Try Sample Credentials:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sampleHashes.map((sample, index) => (
              <button
                key={index}
                onClick={() => useSampleHash(sample.hash)}
                className="btn btn-sm btn-outline"
                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>📋 Verification Result</h2>
            {verificationResult.isValid ? (
              <span className="badge badge-success" style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
                ✓ VALID
              </span>
            ) : (
              <span className="badge badge-error" style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
                ✗ INVALID
              </span>
            )}
          </div>

          {verificationResult.data && (
            <div className="verification-details">
              <div className="detail-section">
                <h3>Student Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{verificationResult.data.subjectDetails?.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{verificationResult.data.subjectDetails?.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Wallet Address:</label>
                    <span className="wallet-address">{verificationResult.data.subjectAddress}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Credential Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{verificationResult.data.credentialType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Degree:</label>
                    <span>{verificationResult.data.credentialData?.degree}</span>
                  </div>
                  <div className="detail-item">
                    <label>Major:</label>
                    <span>{verificationResult.data.credentialData?.major}</span>
                  </div>
                  <div className="detail-item">
                    <label>GPA:</label>
                    <span>{verificationResult.data.credentialData?.gpa}</span>
                  </div>
                  <div className="detail-item">
                    <label>Honors:</label>
                    <span>{verificationResult.data.credentialData?.honors || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Graduation Date:</label>
                    <span>{formatDate(verificationResult.data.credentialData?.graduationDate)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Issuing Institution</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Institution:</label>
                    <span>{verificationResult.data.issuerDetails?.organization}</span>
                  </div>
                  <div className="detail-item">
                    <label>Issuer:</label>
                    <span>{verificationResult.data.issuerDetails?.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Issuer Address:</label>
                    <span className="wallet-address">{verificationResult.data.issuerAddress}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Blockchain Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Issued:</label>
                    <span>{formatDate(verificationResult.data.issuedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Expires:</label>
                    <span>{formatDate(verificationResult.data.expiresAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`badge ${verificationResult.data.isRevoked ? 'badge-error' : 'badge-success'}`}>
                      {verificationResult.data.isRevoked ? 'Revoked' : 'Active'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Transaction Hash:</label>
                    <span className="hash">{verificationResult.data.transactionHash}</span>
                  </div>
                  <div className="detail-item">
                    <label>IPFS Hash:</label>
                    <span className="hash">{verificationResult.data.ipfsHash}</span>
                  </div>
                  <div className="detail-item">
                    <label>Verified At:</label>
                    <span>{new Date(verificationResult.data.verifiedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demo Info */}
      <div className="demo-notice-box">
        <p>💡 <strong>Demo Mode:</strong> Verification is simulated. In production, this would query the Ethereum blockchain and IPFS.</p>
      </div>
    </div>
  );
};

export default EmployerDashboardDemo;
