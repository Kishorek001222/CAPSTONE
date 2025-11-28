const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const demoData = require('./demoData');

// Load env vars
dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// ==================== DEMO ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running in DEMO MODE',
    timestamp: new Date().toISOString(),
    demoMode: true
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Decentralized Identity System API - DEMO MODE',
    version: '1.0.0 (MVP)',
    demoMode: true,
    endpoints: {
      users: '/api/users',
      credentials: '/api/credentials',
      health: '/api/health'
    }
  });
});

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', (req, res) => {
  const { role } = req.query;
  const users = role
    ? demoData.findUsersByRole(role)
    : demoData.users;

  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = demoData.findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// Get user by wallet address
app.get('/api/users/wallet/:address', (req, res) => {
  const user = demoData.findUserByWallet(req.params.address);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// Get students (for university dashboard)
app.get('/api/students', (req, res) => {
  const students = demoData.findUsersByRole('student');

  res.json({
    success: true,
    count: students.length,
    data: students
  });
});

// ==================== CREDENTIAL ROUTES ====================

// Get all credentials
app.get('/api/credentials', (req, res) => {
  res.json({
    success: true,
    count: demoData.credentials.length,
    data: demoData.credentials
  });
});

// Get credential by hash
app.get('/api/credentials/hash/:hash', (req, res) => {
  const credential = demoData.findCredentialByHash(req.params.hash);

  if (!credential) {
    return res.status(404).json({
      success: false,
      message: 'Credential not found'
    });
  }

  // Populate issuer and subject details
  const issuer = demoData.findUserById(credential.issuer);
  const subject = demoData.findUserById(credential.subject);

  res.json({
    success: true,
    data: {
      ...credential,
      issuerDetails: issuer,
      subjectDetails: subject
    }
  });
});

// Get credentials by subject (student)
app.get('/api/credentials/subject/:subjectId', (req, res) => {
  const credentials = demoData.findCredentialsBySubject(req.params.subjectId);

  // Populate issuer details for each credential
  const populatedCredentials = credentials.map(cred => {
    const issuer = demoData.findUserById(cred.issuer);
    return {
      ...cred,
      issuerDetails: issuer
    };
  });

  res.json({
    success: true,
    count: populatedCredentials.length,
    data: populatedCredentials
  });
});

// Get credentials by issuer (university)
app.get('/api/credentials/issuer/:issuerId', (req, res) => {
  const credentials = demoData.findCredentialsByIssuer(req.params.issuerId);

  // Populate subject details for each credential
  const populatedCredentials = credentials.map(cred => {
    const subject = demoData.findUserById(cred.subject);
    return {
      ...cred,
      subjectDetails: subject
    };
  });

  res.json({
    success: true,
    count: populatedCredentials.length,
    data: populatedCredentials
  });
});

// Issue new credential (POST)
app.post('/api/credentials/issue', (req, res) => {
  try {
    const {
      issuerId,
      subjectId,
      credentialType,
      credentialData,
      expiresAt
    } = req.body;

    // Validate input
    if (!issuerId || !subjectId || !credentialType || !credentialData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find issuer and subject
    const issuer = demoData.findUserById(issuerId);
    const subject = demoData.findUserById(subjectId);

    if (!issuer || !subject) {
      return res.status(404).json({
        success: false,
        message: 'Issuer or subject not found'
      });
    }

    if (issuer.role !== 'university') {
      return res.status(403).json({
        success: false,
        message: 'Only universities can issue credentials'
      });
    }

    // Create new credential
    const newCredential = demoData.addCredential({
      issuer: issuerId,
      issuerAddress: issuer.walletAddress,
      subject: subjectId,
      subjectAddress: subject.walletAddress,
      credentialType,
      credentialData,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) // 10 years default
    });

    res.status(201).json({
      success: true,
      message: 'Credential issued successfully',
      data: {
        ...newCredential,
        issuerDetails: issuer,
        subjectDetails: subject
      }
    });
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error issuing credential',
      error: error.message
    });
  }
});

// Verify credential
app.post('/api/credentials/verify', (req, res) => {
  try {
    const { credentialHash } = req.body;

    if (!credentialHash) {
      return res.status(400).json({
        success: false,
        message: 'Credential hash is required'
      });
    }

    const credential = demoData.findCredentialByHash(credentialHash);

    if (!credential) {
      return res.json({
        success: true,
        isValid: false,
        message: 'Credential not found on blockchain'
      });
    }

    // Check if expired
    const isExpired = new Date(credential.expiresAt) < new Date();

    // Check if revoked
    const isRevoked = credential.isRevoked;

    const isValid = !isExpired && !isRevoked && credential.blockchainStatus === 'confirmed';

    // Get issuer and subject details
    const issuer = demoData.findUserById(credential.issuer);
    const subject = demoData.findUserById(credential.subject);

    res.json({
      success: true,
      isValid,
      data: {
        ...credential,
        issuerDetails: issuer,
        subjectDetails: subject,
        isExpired,
        isRevoked,
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error verifying credential:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying credential',
      error: error.message
    });
  }
});

// Mock DID registration
app.post('/api/did/register', (req, res) => {
  const { walletAddress, didDocument } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  res.json({
    success: true,
    message: 'DID registered successfully (demo)',
    data: {
      did: `did:ethr:${walletAddress}`,
      transactionHash: demoData.generateTransactionHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
      timestamp: new Date().toISOString()
    }
  });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Decentralized Identity System API');
  console.log('='.repeat(50));
  console.log(`📍 Mode: DEMO (MVP)`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Demo Users: ${demoData.users.length}`);
  console.log(`📜 Demo Credentials: ${demoData.credentials.length}`);
  console.log('='.repeat(50));
  console.log('✅ No MongoDB required');
  console.log('✅ No Authentication required');
  console.log('✅ No Blockchain required');
  console.log('✅ Ready for demo!');
  console.log('='.repeat(50));
});
