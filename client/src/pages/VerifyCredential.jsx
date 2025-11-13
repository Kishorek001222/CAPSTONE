import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blockchainService from '../services/blockchain';
import { credentialAPI } from '../services/api';
import './VerifyCredential.css';

const VerifyCredential = () => {
  const { hash } = useParams();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hash) {
      verifyCredential();
    }
  }, [hash]);

  const verifyCredential = async () => {
    setLoading(true);
    setError('');

    try {
      // Verify on blockchain
      const blockchainResult = await blockchainService.verifyCredential(hash);

      // Get detailed info from API
      let credentialDetails = null;
      try {
        const apiResponse = await credentialAPI.getCredentialByHash(hash);
        credentialDetails = apiResponse.data.data;
      } catch (error) {
        console.log('Could not fetch credential details from API');
      }

      setVerificationResult({
        blockchain: blockchainResult,
        details: credentialDetails,
      });
    } catch (error) {
      console.error('Error verifying credential:', error);
      setError('Failed to verify credential. The credential may not exist or the network may be unavailable.');
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

  if (loading) {
    return (
      <div className="verify-container">
        <div className="loading">Verifying credential on blockchain...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verify-container">
        <div className="card">
          <div className="alert alert-error">{error}</div>
          <button onClick={verifyCredential} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-container">
      <h1 className="verify-title">Credential Verification</h1>

      {verificationResult && (
        <>
          <div className="card">
            <div className="verification-result">
              <div className="result-header">
                {verificationResult.blockchain.isValid ? (
                  <div className="result-status valid">
                    <span className="status-icon">✓</span>
                    <div>
                      <span className="status-text">Valid Credential</span>
                      <p className="status-description">
                        This credential has been verified on the Ethereum blockchain and is authentic.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="result-status invalid">
                    <span className="status-icon">✗</span>
                    <div>
                      <span className="status-text">Invalid Credential</span>
                      <p className="status-description">
                        This credential is either revoked, expired, or does not exist.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {verificationResult.details && verificationResult.blockchain.isValid && (
            <div className="card">
              <h2>📜 Credential Information</h2>

              <div className="credential-info">
                <div className="info-section">
                  <h3>Student Information</h3>
                  <div className="detail-row">
                    <strong>Name:</strong>
                    <span>{verificationResult.details.subject?.name}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong>
                    <span>{verificationResult.details.subject?.email}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Credential Details</h3>
                  <div className="detail-row">
                    <strong>Type:</strong>
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
                </div>

                <div className="info-section">
                  <h3>Issuer Information</h3>
                  <div className="detail-row">
                    <strong>Institution:</strong>
                    <span>{verificationResult.details.issuer?.organization || verificationResult.details.issuer?.name}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Issued Date:</strong>
                    <span>{formatDate(verificationResult.details.issuedAt)}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Expiration Date:</strong>
                    <span>{formatDate(verificationResult.details.expiresAt)}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Blockchain Verification</h3>
                  <div className="detail-row">
                    <strong>Credential Hash:</strong>
                    <code className="hash-display">{hash}</code>
                  </div>
                  <div className="detail-row">
                    <strong>Transaction:</strong>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${verificationResult.details.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      View on Etherscan →
                    </a>
                  </div>
                  <div className="detail-row">
                    <strong>Network:</strong>
                    <span>Ethereum Sepolia Testnet</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card info-card">
            <h3>🔒 About This Verification</h3>
            <p>
              This credential has been verified directly from the Ethereum blockchain. 
              The verification is tamper-proof and does not require trust in any central authority.
            </p>
            <p>
              The credential data is stored on IPFS (InterPlanetary File System) with its hash 
              anchored to the blockchain, ensuring both availability and immutability.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyCredential;
