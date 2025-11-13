import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { credentialAPI } from '../services/api';
import blockchainService from '../services/blockchain';
import './Dashboard.css';

const UniversityDashboard = () => {
  const { user, updateWallet } = useAuth();
  const { account, isConnected, isMetaMaskInstalled, connectWallet } = useWallet();
  const [students, setStudents] = useState([]);
  const [issuedCredentials, setIssuedCredentials] = useState([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    studentEmail: '',
    credentialType: 'Bachelor Degree',
    degree: '',
    major: '',
    graduationDate: '',
    gpa: '',
    honors: '',
    expiresAt: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, credentialsRes] = await Promise.all([
        credentialAPI.getStudents(),
        credentialAPI.getMyCredentials(),
      ]);
      setStudents(studentsRes.data.data);
      setIssuedCredentials(credentialsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIssueCredential = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setIssuing(true);
    setMessage({ type: '', text: '' });

    try {
      // Find student
      const student = students.find(s => s.email === formData.studentEmail);
      if (!student) {
        throw new Error('Student not found');
      }

      if (!student.walletAddress) {
        throw new Error('Student has not connected their wallet');
      }

      // Create credential data
      const credentialData = {
        degree: formData.degree,
        major: formData.major,
        graduationDate: formData.graduationDate,
        gpa: parseFloat(formData.gpa),
        honors: formData.honors,
        institution: user.organization,
        issuedBy: user.name,
      };

      // Create credential hash
      const credentialHash = blockchainService.createCredentialHash({
        ...credentialData,
        subject: student.email,
        issuer: user.email,
        timestamp: Date.now(),
      });

      // Create verifiable credential for IPFS
      const verifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', formData.credentialType],
        issuer: {
          id: user.did || user.walletAddress,
          name: user.name,
          organization: user.organization,
        },
        issuanceDate: new Date().toISOString(),
        expirationDate: formData.expiresAt,
        credentialSubject: {
          id: student.did || student.walletAddress,
          name: student.name,
          email: student.email,
          ...credentialData,
        },
      };

      // In production, upload to IPFS here
      const ipfsHash = `Qm${Math.random().toString(36).substring(7)}`;

      // Issue on blockchain
      const expiresAt = formData.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const txResult = await blockchainService.issueCredential(
        credentialHash,
        student.walletAddress,
        formData.credentialType,
        expiresAt,
        `ipfs://${ipfsHash}`
      );

      if (!txResult.success) {
        throw new Error('Blockchain transaction failed');
      }

      // Save to database
      await credentialAPI.issueCredential({
        subjectEmail: formData.studentEmail,
        credentialType: formData.credentialType,
        credentialData,
        ipfsHash,
        credentialHash,
        transactionHash: txResult.transactionHash,
        expiresAt,
      });

      setMessage({ 
        type: 'success', 
        text: 'Credential issued successfully!' 
      });

      // Reset form
      setFormData({
        studentEmail: '',
        credentialType: 'Bachelor Degree',
        degree: '',
        major: '',
        graduationDate: '',
        gpa: '',
        honors: '',
        expiresAt: '',
      });
      setShowIssueForm(false);

      // Refresh credentials
      fetchData();
    } catch (error) {
      console.error('Error issuing credential:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to issue credential' 
      });
    } finally {
      setIssuing(false);
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

      {/* Wallet Section */}
      <div className="card">
        <h2>🔗 Wallet Connection</h2>
        
        {!isMetaMaskInstalled ? (
          <div className="alert alert-warning">
            <p>MetaMask is not installed.</p>
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
            <p>Connect your wallet to issue credentials on the blockchain.</p>
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
              <strong>Status:</strong>
              <span className="status-badge status-success">Connected</span>
            </div>
          </div>
        )}
      </div>

      {/* Issue Credential Section */}
      <div className="card">
        <div className="card-header">
          <h2>📜 Issue New Credential</h2>
          {!showIssueForm && (
            <button 
              onClick={() => setShowIssueForm(true)} 
              className="btn btn-primary"
              disabled={!isConnected}
            >
              + Issue Credential
            </button>
          )}
        </div>

        {showIssueForm && (
          <form onSubmit={handleIssueCredential} className="issue-form">
            <div className="form-row">
              <div className="form-group">
                <label>Student Email *</label>
                <select
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student.email}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Credential Type *</label>
                <select
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Bachelor Degree">Bachelor's Degree</option>
                  <option value="Master Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Degree Name *</label>
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
                <label>Major *</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Graduation Date *</label>
                <input
                  type="date"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.75"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Honors</label>
                <input
                  type="text"
                  name="honors"
                  value={formData.honors}
                  onChange={handleInputChange}
                  placeholder="e.g., Summa Cum Laude"
                />
              </div>

              <div className="form-group">
                <label>Expiration Date</label>
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={issuing}>
                {issuing ? 'Issuing...' : 'Issue Credential'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowIssueForm(false)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Issued Credentials */}
      <div className="card">
        <h2>📋 Issued Credentials ({issuedCredentials.length})</h2>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : issuedCredentials.length === 0 ? (
          <div className="empty-state">
            <p>No credentials issued yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="credentials-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Degree</th>
                  <th>Issued Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuedCredentials.map((credential) => (
                  <tr key={credential._id}>
                    <td>{credential.subject?.name}</td>
                    <td>{credential.credentialType}</td>
                    <td>{credential.credentialData?.degree}</td>
                    <td>{formatDate(credential.issuedAt)}</td>
                    <td>
                      {credential.isRevoked ? (
                        <span className="status-badge status-danger">Revoked</span>
                      ) : (
                        <span className="status-badge status-success">Active</span>
                      )}
                    </td>
                    <td>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${credential.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        View TX
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDashboard;
