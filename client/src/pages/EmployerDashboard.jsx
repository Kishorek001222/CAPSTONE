import { useState } from 'react';
import blockchainService from '../services/blockchain';
import { credentialAPI } from '../services/api';
import './Dashboard.css';

const EmployerDashboard = () => {
  const [credentialHash, setCredentialHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!credentialHash) {
      setMessage({ type: 'error', text: 'Please enter a credential hash' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setVerificationResult(null);

    try {
      // Verify on blockchain
      const blockchainResult = await blockchainService.verifyCredential(credentialHash);

      // Get detailed info from API
      let credentialDetails = null;
      try {
        const apiResponse = await credentialAPI.getCredentialByHash(credentialHash);
        credentialDetails = apiResponse.data.data;
      } catch (error) {
        console.log('Could not fetch credential details from API');
      }

      setVerificationResult({
        blockchain: blockchainResult,
        details: credentialDetails,
      });

      if (blockchainResult.isValid) {
        setMessage({ type: 'success', text: '✓ Credential is valid and verified!' });
      } else {
        setMessage({ type: 'warning', text: '⚠ Credential is invalid or revoked' });
      }
    } catch (error) {
      console.error('Error verifying credential:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to verify credential. Please check the hash and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
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

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h2>🔍 Verify Credential</h2>
        <p>
          Enter the credential hash provided by the candidate to verify its authenticity 
          on the blockchain.
        </p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Credential Hash</label>
            <input
              type="text"
              value={credentialHash}
              onChange={(e) => setCredentialHash(e.target.value)}
              placeholder="0x..."
              required
            />
            <small>The credential hash is a unique identifier starting with "0x"</small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>
      </div>

      {verificationResult && (
        <div className="card">
          <h2>Verification Result</h2>

          <div className="verification-result">
            <div className="result-header">
              {verificationResult.blockchain.isValid ? (
                <div className="result-status valid">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Valid Credential</span>
                </div>
              ) : (
                <div className="result-status invalid">
                  <span className="status-icon">✗</span>
                  <span className="status-text">Invalid Credential</span>
                </div>
              )}
            </div>

            <div className="result-details">
              <h3>Blockchain Information</h3>
              
              <div className="detail-row">
                <strong>Issuer Address:</strong>
                <code>{verificationResult.blockchain.issuer}</code>
              </div>

              <div className="detail-row">
                <strong>Subject Address:</strong>
                <code>{verificationResult.blockchain.subject}</code>
              </div>

              <div className="detail-row">
                <strong>Issued Date:</strong>
                <span>{formatDate(verificationResult.blockchain.issuedAt)}</span>
              </div>

              <div className="detail-row">
                <strong>Expiration Date:</strong>
                <span>{formatDate(verificationResult.blockchain.expiresAt)}</span>
              </div>

              <div className="detail-row">
                <strong>IPFS URI:</strong>
                <span>{verificationResult.blockchain.metadataURI}</span>
              </div>
            </div>

            {verificationResult.details && (
              <div className="result-details">
                <h3>Credential Details</h3>

                <div className="detail-row">
                  <strong>Student Name:</strong>
                  <span>{verificationResult.details.subject?.name}</span>
                </div>

                <div className="detail-row">
                  <strong>Credential Type:</strong>
                  <span>{verificationResult.details.credentialType}</span>
                </div>

                {verificationResult.details.credentialData?.degree && (
                  <div className="detail-row">
                    <strong>Degree:</strong>
                    <span>{verificationResult.details.credentialData.degree}</span>
                  </div>
                )}

                {verificationResult.details.credentialData?.major && (
                  <div className="detail-row">
                    <strong>Major:</strong>
                    <span>{verificationResult.details.credentialData.major}</span>
                  </div>
                )}

                {verificationResult.details.credentialData?.gpa && (
                  <div className="detail-row">
                    <strong>GPA:</strong>
                    <span>{verificationResult.details.credentialData.gpa}</span>
                  </div>
                )}

                {verificationResult.details.credentialData?.graduationDate && (
                  <div className="detail-row">
                    <strong>Graduation Date:</strong>
                    <span>{formatDate(verificationResult.details.credentialData.graduationDate)}</span>
                  </div>
                )}

                {verificationResult.details.credentialData?.honors && (
                  <div className="detail-row">
                    <strong>Honors:</strong>
                    <span>{verificationResult.details.credentialData.honors}</span>
                  </div>
                )}

                <div className="detail-row">
                  <strong>Issuing Institution:</strong>
                  <span>{verificationResult.details.issuer?.organization || verificationResult.details.issuer?.name}</span>
                </div>

                <div className="detail-row">
                  <strong>Transaction Hash:</strong>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${verificationResult.details.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card info-card">
        <h2>ℹ️ How to Use</h2>
        <ol>
          <li>Ask the candidate for their credential verification link or hash</li>
          <li>Enter the credential hash in the form above</li>
          <li>Click "Verify Credential" to check authenticity on the blockchain</li>
          <li>Review the verification result and credential details</li>
        </ol>
        <p>
          <strong>Note:</strong> All verifications are done directly on the Ethereum blockchain,
          ensuring tamper-proof and instant validation.
        </p>
      </div>
    </div>
  );
};

export default EmployerDashboard;
