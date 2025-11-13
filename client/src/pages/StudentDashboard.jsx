import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { credentialAPI } from '../services/api';
import blockchainService from '../services/blockchain';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, updateWallet, updateDID } = useAuth();
  const { account, isConnected, isMetaMaskInstalled, connectWallet, balance } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringDID, setRegisteringDID] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await credentialAPI.getMyCredentials();
      setCredentials(response.data.data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (result.success) {
      await updateWallet(result.address);
      setMessage({ type: 'success', text: 'Wallet connected successfully!' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleRegisterDID = async () => {
    if (!isConnected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setRegisteringDID(true);
    setMessage({ type: '', text: '' });

    try {
      const didDocument = {
        '@context': 'https://www.w3.org/ns/did/v1',
        id: `did:ethr:${account}`,
        authentication: [account],
        created: new Date().toISOString(),
      };

      const result = await blockchainService.registerDID(didDocument);
      
      if (result.success) {
        const did = `did:ethr:${account}`;
        await updateDID(did);
        setMessage({ type: 'success', text: 'DID registered successfully on blockchain!' });
      }
    } catch (error) {
      console.error('Error registering DID:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to register DID' });
    } finally {
      setRegisteringDID(false);
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

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <p className="dashboard-subtitle">Manage your credentials and decentralized identity</p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Wallet Section */}
      <div className="card">
        <h2>🔗 Wallet Connection</h2>
        
        {!isMetaMaskInstalled ? (
          <div className="alert alert-warning">
            <p>MetaMask is not installed. Please install MetaMask to use this application.</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Install MetaMask
            </a>
          </div>
        ) : !isConnected ? (
          <div>
            <p>Connect your MetaMask wallet to interact with the blockchain.</p>
            <button onClick={handleConnectWallet} className="btn btn-primary">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="wallet-info">
            <div className="wallet-detail">
              <strong>Address:</strong>
              <code>{account}</code>
            </div>
            <div className="wallet-detail">
              <strong>Balance:</strong>
              <span>{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
            <div className="wallet-detail">
              <strong>Status:</strong>
              <span className="status-badge status-success">Connected</span>
            </div>
          </div>
        )}
      </div>

      {/* DID Section */}
      <div className="card">
        <h2>🆔 Decentralized Identity (DID)</h2>
        
        {user?.did ? (
          <div className="did-registered">
            <p><strong>Your DID:</strong></p>
            <code className="did-display">{user.did}</code>
            <span className="status-badge status-success">✓ Registered</span>
          </div>
        ) : (
          <div>
            <p>Register your DID on the blockchain to receive credentials.</p>
            <button 
              onClick={handleRegisterDID} 
              className="btn btn-primary"
              disabled={!isConnected || registeringDID}
            >
              {registeringDID ? 'Registering...' : 'Register DID'}
            </button>
            {!isConnected && (
              <p className="error-message">Please connect your wallet first</p>
            )}
          </div>
        )}
      </div>

      {/* Credentials Section */}
      <div className="card">
        <h2>📜 My Credentials</h2>
        
        {loading ? (
          <div className="loading">Loading credentials...</div>
        ) : credentials.length === 0 ? (
          <div className="empty-state">
            <p>No credentials issued yet. Wait for your university to issue credentials.</p>
          </div>
        ) : (
          <div className="credentials-grid">
            {credentials.map((credential) => (
              <div key={credential._id} className="credential-card">
                <div className="credential-header">
                  <h3>{credential.credentialType}</h3>
                  {credential.isRevoked && (
                    <span className="status-badge status-danger">Revoked</span>
                  )}
                  {!credential.isRevoked && new Date(credential.expiresAt) < new Date() && (
                    <span className="status-badge status-warning">Expired</span>
                  )}
                  {!credential.isRevoked && new Date(credential.expiresAt) > new Date() && (
                    <span className="status-badge status-success">Valid</span>
                  )}
                </div>

                <div className="credential-body">
                  <div className="credential-field">
                    <strong>Issuer:</strong>
                    <span>{credential.issuer?.organization || credential.issuer?.name}</span>
                  </div>
                  
                  {credential.credentialData?.degree && (
                    <div className="credential-field">
                      <strong>Degree:</strong>
                      <span>{credential.credentialData.degree}</span>
                    </div>
                  )}
                  
                  {credential.credentialData?.major && (
                    <div className="credential-field">
                      <strong>Major:</strong>
                      <span>{credential.credentialData.major}</span>
                    </div>
                  )}
                  
                  <div className="credential-field">
                    <strong>Issued:</strong>
                    <span>{formatDate(credential.issuedAt)}</span>
                  </div>
                  
                  <div className="credential-field">
                    <strong>Expires:</strong>
                    <span>{formatDate(credential.expiresAt)}</span>
                  </div>

                  <div className="credential-field">
                    <strong>Transaction:</strong>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${credential.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      View on Etherscan
                    </a>
                  </div>

                  <div className="credential-actions">
                    <button 
                      onClick={() => {
                        const link = getVerificationLink(credential.credentialHash);
                        navigator.clipboard.writeText(link);
                        setMessage({ type: 'success', text: 'Verification link copied!' });
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Copy Verification Link
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
