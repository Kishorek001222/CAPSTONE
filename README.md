# Decentralized Identity Management System for Educational Credentials

## Table of Contents
- [Executive Summary](#executive-summary)
- [Academic Context](#academic-context)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Executive Summary

This capstone project presents a **blockchain-based Decentralized Identity (DID) Management System** designed to revolutionize how educational credentials are issued, stored, and verified. By leveraging Ethereum smart contracts, IPFS distributed storage, and modern web technologies, this system eliminates the need for centralized authorities while ensuring credential authenticity, immutability, and user sovereignty.

The platform serves three primary stakeholders:
- **Students**: Own and control their verifiable digital credentials
- **Universities**: Issue tamper-proof credentials on the blockchain
- **Employers**: Instantly verify credential authenticity without intermediaries

---

## Academic Context

### Purpose

This project was developed as a capstone demonstration of advanced software engineering concepts, specifically:

1. **Blockchain Technology & Smart Contracts**: Implementation of Ethereum-based smart contracts using Solidity, demonstrating understanding of decentralized consensus mechanisms and immutable ledger technology.

2. **Decentralized Identity (DID) Standards**: Application of W3C Decentralized Identifier standards to create self-sovereign identity solutions.

3. **Full-Stack Decentralized Application (dApp) Development**: Integration of blockchain backend with traditional web application architecture (MERN stack + Web3).

4. **Distributed Systems**: Utilization of IPFS for decentralized storage, showcasing peer-to-peer file sharing and content addressing.

5. **Cryptographic Security**: Implementation of public-key cryptography, digital signatures, and hash functions for data integrity and authentication.

6. **Software Engineering Best Practices**: Modular architecture, separation of concerns, RESTful API design, comprehensive testing, and secure coding practices.

### Why This Application Exists

Educational credential fraud is a growing global problem, with studies indicating that up to **30% of job applicants** misrepresent their educational qualifications. Traditional verification methods are:
- **Time-consuming**: Manual verification can take weeks
- **Costly**: Universities charge fees for each verification request
- **Inefficient**: Requires human intervention and multiple communications
- **Fraud-prone**: Fake credentials can be easily created

This application addresses these challenges by:
- Providing **instant, automated verification** of credentials
- Ensuring **cryptographic proof of authenticity** via blockchain
- Eliminating **single points of failure** through decentralization
- Giving students **complete ownership** of their credentials
- Reducing **operational costs** for all stakeholders

---

## Problem Statement

### Current Challenges in Credential Management

1. **Centralization Risks**
   - Credentials stored in centralized databases vulnerable to breaches
   - Single point of failure in verification systems
   - Dependence on institutional infrastructure and cooperation

2. **Verification Inefficiency**
   - Time-intensive manual verification processes
   - High costs for credential verification services
   - Cross-border verification complexities

3. **Fraud & Forgery**
   - Easy to create counterfeit credentials
   - Difficult to detect sophisticated forgeries
   - No transparent audit trail

4. **Lack of Student Control**
   - Students don't own their credential data
   - No portability across platforms
   - Privacy concerns with third-party verification services

---

## Solution Overview

### How This System Solves the Problem

Our decentralized identity management system leverages blockchain technology to create a trustless, transparent, and efficient credential ecosystem:

1. **Immutable Credential Storage**
   - Credentials recorded on Ethereum blockchain cannot be altered or deleted
   - Cryptographic hashing ensures data integrity
   - Complete audit trail of all issuances and revocations

2. **Self-Sovereign Identity (SSI)**
   - Students control their Decentralized Identifiers (DIDs)
   - Credentials linked to blockchain addresses, not centralized accounts
   - Privacy-preserving verification (share only what's necessary)

3. **Instant Verification**
   - Anyone can verify a credential in seconds
   - No intermediary required
   - Publicly auditable without exposing private data

4. **Distributed Storage**
   - Credential metadata stored on IPFS
   - Decentralized, censorship-resistant storage
   - Content-addressed for guaranteed integrity

5. **Role-Based Access Control**
   - Smart contract enforces authorization rules
   - Only authorized universities can issue credentials
   - Only issuers can revoke their own credentials

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Student    │  │  University  │  │  Employer/Verifier   │  │
│  │  Dashboard   │  │  Dashboard   │  │     Dashboard        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                     React Frontend (Vite)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   Web3 Layer    │
                    │   (ethers.js)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        │                    │                     │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│   Backend API  │  │     Ethereum    │  │      IPFS       │
│  (Express.js)  │  │  Smart Contract │  │    (Pinata)     │
│                │  │ IdentityRegistry│  │                 │
│  - Auth        │  │                 │  │  Credential     │
│  - Credentials │  │  - DIDs         │  │  Metadata       │
│  - Users       │  │  - Credentials  │  │  Storage        │
└───────┬────────┘  │  - Verification │  └─────────────────┘
        │           └─────────────────┘
        │
┌───────▼────────┐
│    MongoDB     │
│   Database     │
│                │
│  - Users       │
│  - Credentials │
│  - Sessions    │
└────────────────┘
```

### Component Interaction Flow

#### Credential Issuance Flow
```
University → API (POST /credentials/issue) → Pinata IPFS (store metadata)
                                           → Smart Contract (issueCredential)
                                           → MongoDB (save record)
                                           → Student receives credential
```

#### Credential Verification Flow
```
Verifier → API (GET /credentials/:hash) → Smart Contract (verifyCredential)
                                       → IPFS (fetch metadata)
                                       → Return verification result
```

---

## Technology Stack

### Blockchain Layer
- **Ethereum**: Blockchain platform (Sepolia testnet)
- **Solidity 0.8.19**: Smart contract programming language
- **Hardhat**: Development environment, testing framework, deployment tool
- **OpenZeppelin**: Secure smart contract libraries and patterns
- **ethers.js v5**: Ethereum interaction library

### Backend Layer
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for off-chain data
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Axios**: HTTP client

### Frontend Layer
- **React 18**: UI library
- **Vite**: Build tool and development server
- **React Router v6**: Client-side routing
- **ethers.js**: Web3 integration
- **MetaMask**: Web3 wallet integration
- **CSS3**: Custom styling

### Storage & Infrastructure
- **IPFS**: Distributed file storage
- **Pinata**: IPFS pinning service
- **Infura/Alchemy**: Ethereum RPC provider

---

## Features

### Implemented Features

#### 1. User Management
- ✅ Multi-role registration (Student, University, Employer)
- ✅ Secure authentication with JWT (30-day sessions)
- ✅ Password hashing with bcryptjs
- ✅ Wallet address management
- ✅ Profile management

#### 2. Decentralized Identity (DID)
- ✅ DID registration on Ethereum blockchain
- ✅ DID document storage and retrieval
- ✅ DID updates and management
- ✅ Wallet-based identity verification

#### 3. Credential Issuance (Universities)
- ✅ Issue verifiable credentials to students
- ✅ Store credential metadata on IPFS
- ✅ Record credentials on blockchain
- ✅ Support for multiple credential types (degrees, certificates)
- ✅ Expiration date configuration
- ✅ Credential revocation capability

#### 4. Credential Management (Students)
- ✅ View all issued credentials
- ✅ DID registration interface
- ✅ MetaMask wallet connection
- ✅ Credential sharing capabilities
- ✅ Credential status monitoring

#### 5. Credential Verification (Employers)
- ✅ Verify credentials by hash
- ✅ Check revocation status
- ✅ Validate expiration dates
- ✅ View credential metadata from IPFS
- ✅ Public verification interface

#### 6. Smart Contract Features
- ✅ Issuer authorization system (owner-controlled)
- ✅ Credential verification logic
- ✅ Revocation management
- ✅ Event logging for all transactions
- ✅ Gas-optimized operations

#### 7. Security Features
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication middleware
- ✅ Protected API routes
- ✅ Smart contract access modifiers
- ✅ Input validation and sanitization

#### 8. Testing
- ✅ Comprehensive smart contract unit tests
- ✅ Hardhat test suite with Chai assertions
- ✅ Deployment verification scripts

---

## Installation

### Prerequisites

Before installation, ensure you have:
- **Node.js** (v16 or higher) and npm
- **MongoDB** (local installation or MongoDB Atlas account)
- **MetaMask** browser extension
- **Git** for version control
- **Infura/Alchemy** account for Ethereum RPC access
- **Pinata** account for IPFS storage

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Kishore-Capstone
```

### Step 2: Install Dependencies

```bash
# Install root dependencies (Hardhat)
npm install

# Install API dependencies
cd api
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Root `.env` (for Hardhat)
```bash
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

#### API `.env`
```bash
cd api
cp .env.example .env
```

Edit `api/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/decentralized-identity
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173

# Blockchain
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=0x... # Set after deployment
PRIVATE_KEY=your_wallet_private_key

# IPFS (Pinata)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token
```

#### Client `.env`
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x... # Set after deployment
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia
```

### Step 4: Start MongoDB

```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure your connection string is in api/.env
```

### Step 5: Deploy Smart Contract

```bash
# Deploy to local Hardhat network (for testing)
npx hardhat node  # In one terminal
npx hardhat run scripts/deploy.js --network localhost  # In another terminal

# Deploy to Sepolia testnet (recommended for MVP)
npx hardhat run scripts/deploy.js --network sepolia
```

**Important**: After deployment, copy the contract address from the output and update:
- `api/.env` → `CONTRACT_ADDRESS`
- `client/.env` → `VITE_CONTRACT_ADDRESS`

### Step 6: Start the Application

```bash
# Terminal 1: Start API server
cd api
npm run dev
# API runs on http://localhost:5000

# Terminal 2: Start client
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Step 7: Initialize First University (Owner)

The deployer address needs to add universities as authorized issuers:

1. Register a university account on the platform
2. Connect MetaMask with the deployer wallet
3. Use the smart contract's `addIssuer` function to authorize the university's wallet address

---

## Configuration

### Network Configuration

The system is configured for **Sepolia Testnet** by default. To use other networks:

#### Hardhat Configuration (`hardhat.config.js`)
```javascript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111
  },
  // Add other networks as needed
}
```

#### Frontend Configuration
Update `client/.env`:
```env
VITE_CHAIN_ID=11155111  # Sepolia
VITE_NETWORK_NAME=Sepolia
```

### MongoDB Configuration

Edit `api/config/database.js` if you need custom MongoDB settings.

---

## Usage

### For Students

1. **Register an Account**
   - Navigate to `/signup`
   - Select role: "Student"
   - Provide name, email, and password

2. **Connect Wallet**
   - Install MetaMask browser extension
   - Switch to Sepolia testnet
   - Click "Connect Wallet" in dashboard
   - Approve connection in MetaMask

3. **Register DID**
   - Click "Register DID" button
   - Confirm blockchain transaction
   - Wait for transaction confirmation

4. **View Credentials**
   - Navigate to "My Credentials" section
   - View all issued credentials
   - Check credential status (active/revoked)
   - See credential details and metadata

### For Universities

1. **Register as University**
   - Sign up with role "University"
   - Provide organization name

2. **Get Authorized as Issuer**
   - Contact system administrator (contract owner)
   - Provide your wallet address
   - Administrator must call `addIssuer(yourAddress)` on contract

3. **Issue Credentials**
   - Navigate to "Issue Credential" section
   - Select student from list
   - Fill in credential details:
     - Degree name
     - Major
     - Graduation date
     - GPA
     - Honors
   - Click "Issue Credential"
   - Confirm transactions (IPFS upload + blockchain transaction)

4. **Revoke Credentials**
   - Navigate to issued credentials list
   - Click "Revoke" on target credential
   - Confirm blockchain transaction

### For Employers/Verifiers

1. **Register as Employer** (or use public verification)
   - Sign up with role "Employer"
   - Provide organization name

2. **Verify Credentials**
   - Navigate to "Verify Credential" page
   - Enter credential hash (provided by student)
   - Click "Verify"
   - View verification results:
     - ✅ Valid credential
     - ❌ Revoked credential
     - ⏰ Expired credential
     - 🔍 Credential details from IPFS

---

## Smart Contract

### Contract: `IdentityRegistry.sol`

**Location**: `/contracts/IdentityRegistry.sol`

#### Key Features

1. **DID Management**
   - Register new DIDs linked to Ethereum addresses
   - Update DID documents
   - Query DID information

2. **Issuer Authorization**
   - Owner-controlled issuer registry
   - Add/remove authorized credential issuers

3. **Credential Operations**
   - Issue verifiable credentials
   - Verify credential validity
   - Revoke credentials
   - Query credentials by subject

#### Main Functions

```solidity
// DID Management
function registerDID(string memory _didDocument) external
function updateDID(string memory _didDocument) external
function getDID(address _didAddress) external view returns (DID memory)

// Issuer Management (owner only)
function addIssuer(address _issuer) external onlyOwner
function removeIssuer(address _issuer) external onlyOwner

// Credential Operations
function issueCredential(
    bytes32 _credentialHash,
    address _subject,
    string memory _credentialType,
    uint256 _expiresAt,
    string memory _metadataURI
) external onlyIssuer

function verifyCredential(bytes32 _credentialHash) external view returns (bool, string memory)
function revokeCredential(bytes32 _credentialHash) external
function getCredentialsBySubject(address _subject) external view returns (bytes32[] memory)
```

#### Events

```solidity
event DIDRegistered(address indexed owner, string didDocument, uint256 timestamp);
event DIDUpdated(address indexed owner, string didDocument, uint256 timestamp);
event IssuerAdded(address indexed issuer);
event IssuerRemoved(address indexed issuer);
event CredentialIssued(bytes32 indexed credentialHash, address indexed issuer, address indexed subject);
event CredentialRevoked(bytes32 indexed credentialHash, address indexed revoker);
```

### Deployment

Deploy using Hardhat:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

The deployment script:
1. Deploys the contract
2. Saves ABI to `contracts/IdentityRegistry.json`
3. Copies ABI to `api/contracts/` and `client/src/contracts/`
4. Verifies contract on Etherscan (if API key provided)

### Contract Address

After deployment, the contract address is displayed in console. Update:
- `api/.env` → `CONTRACT_ADDRESS=0x...`
- `client/.env` → `VITE_CONTRACT_ADDRESS=0x...`

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication Routes

**POST /auth/signup**
- Description: Register new user
- Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "student",
    "organization": "Optional for university/employer"
  }
  ```
- Response: JWT token + user object

**POST /auth/login**
- Description: User login
- Body:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- Response: JWT token + user object

**GET /auth/me**
- Description: Get current user info
- Auth: Required
- Response: User object

**PUT /auth/wallet**
- Description: Update wallet address
- Auth: Required
- Body:
  ```json
  {
    "walletAddress": "0x..."
  }
  ```

**PUT /auth/did**
- Description: Update DID
- Auth: Required
- Body:
  ```json
  {
    "did": "did:ethr:0x..."
  }
  ```

#### Credential Routes

**POST /credentials/issue**
- Description: Issue new credential
- Auth: Required (University only)
- Body:
  ```json
  {
    "subjectId": "user_id_of_student",
    "credentialData": {
      "degree": "Bachelor of Science",
      "major": "Computer Science",
      "graduationDate": "2024-05-15",
      "gpa": 3.8,
      "honors": "Summa Cum Laude",
      "institution": "University Name"
    },
    "expiresAt": "2034-05-15T00:00:00Z"
  }
  ```

**GET /credentials/my**
- Description: Get user's credentials
- Auth: Required
- Response: Array of credentials

**GET /credentials/students**
- Description: Get all students (for universities)
- Auth: Required (University only)
- Response: Array of student users

**GET /credentials/:hash**
- Description: Verify credential by hash
- Auth: Not required (public)
- Response: Credential details + verification status

**PUT /credentials/:id/revoke**
- Description: Revoke a credential
- Auth: Required (Issuer only)
- Response: Updated credential

---

## Testing

### Smart Contract Tests

Located in `/test/IdentityRegistry.test.js`

Run tests:
```bash
npx hardhat test
```

Test coverage:
- ✅ Contract deployment
- ✅ Issuer management (add/remove)
- ✅ DID registration and updates
- ✅ Credential issuance
- ✅ Credential verification
- ✅ Credential revocation
- ✅ Access control validation
- ✅ Edge cases and error handling

### Manual Testing Checklist

#### End-to-End Flow
1. ✅ Deploy smart contract to testnet
2. ✅ Start API and client servers
3. ✅ Register university account
4. ✅ Add university as authorized issuer (via contract owner)
5. ✅ Register student account
6. ✅ Student connects MetaMask and registers DID
7. ✅ University issues credential to student
8. ✅ Student views credential in dashboard
9. ✅ Employer verifies credential using hash
10. ✅ University revokes credential
11. ✅ Verification shows revoked status

---

## Security Considerations

### Implemented Security Measures

1. **Smart Contract Security**
   - Access control modifiers (`onlyOwner`, `onlyIssuer`)
   - Input validation for all functions
   - Reentrancy-safe operations
   - Event logging for audit trail
   - No hardcoded addresses or magic numbers

2. **API Security**
   - JWT authentication with expiration
   - Password hashing with bcryptjs (10 salt rounds)
   - Role-based authorization middleware
   - Input validation and sanitization
   - Error handling without information leakage
   - CORS configuration

3. **Frontend Security**
   - Protected routes based on roles
   - Token stored in localStorage (consider httpOnly cookies for production)
   - Wallet signature verification
   - No sensitive data in client-side code

4. **Data Security**
   - Private data stored off-chain (MongoDB)
   - Only hashes and metadata URIs on blockchain
   - IPFS used for credential metadata (immutable)
   - No plain-text passwords in database

### Known Limitations & Recommendations

⚠️ **For Production Deployment**:
1. Use HTTPS for all communications
2. Implement rate limiting on API endpoints
3. Add input sanitization libraries (express-validator)
4. Use httpOnly cookies instead of localStorage for tokens
5. Implement refresh token mechanism
6. Add smart contract audit by security firm
7. Implement circuit breakers for external services
8. Add comprehensive logging and monitoring
9. Use environment-specific configurations
10. Implement backup and disaster recovery procedures

---

## Future Enhancements

### Potential Improvements

#### Technical Enhancements
- [ ] Multi-signature wallet support for institutional accounts
- [ ] Batch credential issuance
- [ ] Credential templates system
- [ ] Advanced search and filtering in dashboards
- [ ] Email notifications for credential events
- [ ] QR code generation for credential sharing
- [ ] Mobile application (React Native)
- [ ] Progressive Web App (PWA) support

#### Blockchain Enhancements
- [ ] Layer 2 scaling solution (Polygon, Optimism)
- [ ] Cross-chain credential verification
- [ ] Verifiable presentations (VP) with selective disclosure
- [ ] Zero-knowledge proof integration for privacy
- [ ] Gasless transactions (meta-transactions)
- [ ] Credential delegation and sharing permissions

#### Feature Enhancements
- [ ] Skills and micro-credentials support
- [ ] Credential expiration reminders
- [ ] Credential renewal workflow
- [ ] Revocation reasons and audit logs
- [ ] Bulk verification API for employers
- [ ] Analytics dashboard for institutions
- [ ] Credential marketplace
- [ ] Integration with LinkedIn, Indeed, etc.

#### Compliance & Standards
- [ ] W3C Verifiable Credentials standard compliance
- [ ] GDPR compliance features
- [ ] Accessibility (WCAG 2.1 Level AA)
- [ ] Multi-language support (i18n)

---

## Project Structure

```
Kishore-Capstone/
├── contracts/                      # Smart contracts
│   └── IdentityRegistry.sol        # Main DID & credential contract
├── scripts/                        # Deployment scripts
│   └── deploy.js                   # Contract deployment script
├── test/                           # Smart contract tests
│   └── IdentityRegistry.test.js    # Contract unit tests
├── api/                            # Backend server
│   ├── server.js                   # Express server entry
│   ├── config/                     # Configuration files
│   ├── models/                     # Mongoose schemas
│   ├── controllers/                # Request handlers
│   ├── routes/                     # API routes
│   ├── middlewares/                # Custom middleware
│   ├── services/                   # Business logic
│   └── .env.example                # Environment template
├── client/                         # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   ├── components/             # Reusable components
│   │   ├── context/                # React Context
│   │   ├── hooks/                  # Custom hooks
│   │   ├── services/               # API & blockchain services
│   │   └── main.jsx                # App entry point
│   ├── vite.config.js              # Vite configuration
│   └── .env.example                # Environment template
├── hardhat.config.js               # Hardhat configuration
├── package.json                    # Root dependencies
└── README.md                       # This file
```

---

## Contributing

This is an academic capstone project. For educational purposes:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Include tests for new functionality
- Ensure all tests pass before submitting PR

---

## License

This project is developed for academic purposes as a capstone project.

**Educational Use**: This code is provided for educational and demonstration purposes. Use at your own risk.

**No Warranty**: The software is provided "as is", without warranty of any kind.

---

## Acknowledgments

- **Ethereum Foundation** - For blockchain infrastructure
- **OpenZeppelin** - For secure smart contract libraries
- **Hardhat** - For development environment
- **IPFS & Pinata** - For decentralized storage
- **MetaMask** - For wallet integration
- **W3C** - For DID and Verifiable Credentials standards

---

## Contact & Support

For questions or support regarding this capstone project:

- **GitHub Issues**: [Create an issue](../../issues)
- **Documentation**: See inline code comments and this README
- **Academic Supervisor**: Contact via institutional channels

---

## Academic Integrity Statement

This project represents original work developed for academic evaluation. All external libraries, frameworks, and code snippets are properly attributed. The architectural design, implementation, and integration represent the independent work of the project author(s).

**References**:
- W3C Decentralized Identifiers (DIDs) v1.0: https://www.w3.org/TR/did-core/
- W3C Verifiable Credentials Data Model: https://www.w3.org/TR/vc-data-model/
- Ethereum Documentation: https://ethereum.org/en/developers/docs/
- Solidity Documentation: https://docs.soliditylang.org/

---

**Last Updated**: November 2025
**Version**: 1.0.0 (MVP)
**Status**: Academic Capstone Project - MVP Ready
