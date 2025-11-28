// In-Memory Demo Data Store for MVP

// Generate unique IDs
let userId = 1;
let credentialId = 1;

// Demo Users
const users = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@student.mit.edu',
    role: 'student',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    did: 'did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    organization: 'Massachusetts Institute of Technology',
    isVerified: true,
    createdAt: new Date('2023-09-01')
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@student.stanford.edu',
    role: 'student',
    walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    did: 'did:ethr:0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    organization: 'Stanford University',
    isVerified: true,
    createdAt: new Date('2023-09-01')
  },
  {
    id: 'user-3',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.harvard.edu',
    role: 'student',
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    did: 'did:ethr:0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    organization: 'Harvard University',
    isVerified: true,
    createdAt: new Date('2023-09-01')
  },
  {
    id: 'user-4',
    name: 'MIT Registrar',
    email: 'registrar@mit.edu',
    role: 'university',
    walletAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    did: 'did:ethr:0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    organization: 'Massachusetts Institute of Technology',
    isVerified: true,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'user-5',
    name: 'Stanford Credentials Office',
    email: 'credentials@stanford.edu',
    role: 'university',
    walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    did: 'did:ethr:0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    organization: 'Stanford University',
    isVerified: true,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'user-6',
    name: 'Harvard Registrar',
    email: 'registrar@harvard.edu',
    role: 'university',
    walletAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    did: 'did:ethr:0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    organization: 'Harvard University',
    isVerified: true,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'user-7',
    name: 'Tech Corp HR',
    email: 'hr@techcorp.com',
    role: 'employer',
    walletAddress: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    did: 'did:ethr:0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    organization: 'Tech Corp',
    isVerified: true,
    createdAt: new Date('2023-01-01')
  }
];

// Demo Credentials
const credentials = [
  {
    id: 'cred-1',
    credentialHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    issuer: 'user-4', // MIT
    issuerAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    subject: 'user-1', // John Doe
    subjectAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    credentialType: 'Bachelor Degree',
    credentialData: {
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      graduationDate: new Date('2024-05-15'),
      gpa: 3.85,
      honors: 'Magna Cum Laude',
      institution: 'Massachusetts Institute of Technology',
      additionalInfo: {
        studentId: 'MIT-2020-12345',
        degreeLevel: 'Undergraduate'
      }
    },
    ipfsHash: 'QmX7M9CiYXjVzn5tNc3F8qvSKZp4Qr5WtJnLbvV8kL9mN2',
    transactionHash: '0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    issuedAt: new Date('2024-05-20'),
    expiresAt: new Date('2034-05-20'),
    isRevoked: false,
    blockchainStatus: 'confirmed'
  },
  {
    id: 'cred-2',
    credentialHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    issuer: 'user-5', // Stanford
    issuerAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    subject: 'user-2', // Jane Smith
    subjectAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    credentialType: 'Master Degree',
    credentialData: {
      degree: 'Master of Science',
      major: 'Electrical Engineering',
      graduationDate: new Date('2024-06-10'),
      gpa: 3.92,
      honors: 'With Distinction',
      institution: 'Stanford University',
      additionalInfo: {
        studentId: 'STAN-2022-67890',
        degreeLevel: 'Graduate',
        thesis: 'Advanced Neural Network Architectures'
      }
    },
    ipfsHash: 'QmY8N0DjZwKaXkWnUd4GhZq6Ws7LpXvW9kMoCxY2nP3oQ4',
    transactionHash: '0xdef4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    issuedAt: new Date('2024-06-15'),
    expiresAt: new Date('2034-06-15'),
    isRevoked: false,
    blockchainStatus: 'confirmed'
  },
  {
    id: 'cred-3',
    credentialHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    issuer: 'user-6', // Harvard
    issuerAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    subject: 'user-3', // Alice Johnson
    subjectAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    credentialType: 'MBA Certificate',
    credentialData: {
      degree: 'Master of Business Administration',
      major: 'Business Administration',
      graduationDate: new Date('2024-05-25'),
      gpa: 3.78,
      honors: 'Baker Scholar',
      institution: 'Harvard Business School',
      additionalInfo: {
        studentId: 'HBS-2022-11111',
        degreeLevel: 'Graduate',
        concentration: 'Entrepreneurship & Innovation'
      }
    },
    ipfsHash: 'QmZ9O1EkAbYbXlWoVe5IjKr8Xt9MpDyF0rNpGzA4qR5sT6',
    transactionHash: '0x123abc7890def4561234abc7890def4561234abc7890def4561234abc7890def',
    issuedAt: new Date('2024-05-30'),
    expiresAt: new Date('2034-05-30'),
    isRevoked: false,
    blockchainStatus: 'confirmed'
  }
];

// Helper functions
const findUserById = (id) => users.find(u => u.id === id);
const findUserByWallet = (wallet) => users.find(u => u.walletAddress?.toLowerCase() === wallet?.toLowerCase());
const findUsersByRole = (role) => users.filter(u => u.role === role);
const findCredentialById = (id) => credentials.find(c => c.id === id);
const findCredentialByHash = (hash) => credentials.find(c => c.credentialHash === hash);
const findCredentialsBySubject = (subjectId) => credentials.filter(c => c.subject === subjectId);
const findCredentialsByIssuer = (issuerId) => credentials.filter(c => c.issuer === issuerId);

// Mock blockchain functions
const generateTransactionHash = () => {
  return '0x' + Array.from({length: 64}, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const generateCredentialHash = () => {
  return '0x' + Array.from({length: 64}, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const generateIpfsHash = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = 'Qm';
  for (let i = 0; i < 44; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

// Add new credential
const addCredential = (credentialData) => {
  const newCredential = {
    id: `cred-${credentialId++}`,
    credentialHash: generateCredentialHash(),
    ipfsHash: generateIpfsHash(),
    transactionHash: generateTransactionHash(),
    issuedAt: new Date(),
    isRevoked: false,
    blockchainStatus: 'confirmed',
    ...credentialData
  };
  credentials.push(newCredential);
  return newCredential;
};

module.exports = {
  users,
  credentials,
  findUserById,
  findUserByWallet,
  findUsersByRole,
  findCredentialById,
  findCredentialByHash,
  findCredentialsBySubject,
  findCredentialsByIssuer,
  addCredential,
  generateTransactionHash,
  generateCredentialHash,
  generateIpfsHash
};
