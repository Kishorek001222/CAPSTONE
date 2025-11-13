# 🔐 Decentralized Identity System (SSI Platform)

A Self-Sovereign Identity (SSI) platform built on blockchain technology where users control their digital credentials. This MVP enables:
- **Students (Holders)**: Own and manage their verifiable credentials
- **Universities (Issuers)**: Issue tamper-proof digital credentials
- **Employers (Verifiers)**: Instantly verify credential authenticity

## 🎯 Features

### Core Functionality
- ✅ **Decentralized Identity (DID)** registration on Ethereum blockchain
- ✅ **Verifiable Credentials** issued by authorized institutions
- ✅ **IPFS Storage** for credential metadata (via Pinata)
- ✅ **Instant Verification** without third-party intermediaries
- ✅ **Role-Based Access** (Student, University, Employer)
- ✅ **MetaMask Integration** for wallet connectivity
- ✅ **JWT Authentication** for secure API access

### Technical Stack
- **Smart Contracts**: Solidity 0.8.19
- **Blockchain**: Ethereum (Sepolia Testnet for MVP)
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React 18, Vite, Ethers.js
- **Storage**: IPFS (Pinata)
- **Development**: Hardhat

---

## 📋 Prerequisites

### Required Software
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MetaMask** browser extension ([Install](https://metamask.io/))

### Required Accounts (All Free)
1. **MongoDB Atlas** - Database hosting ([Sign up](https://www.mongodb.com/cloud/atlas))
2. **Infura** or **Alchemy** - Ethereum RPC provider ([Infura](https://infura.io/) | [Alchemy](https://www.alchemy.com/))
3. **Pinata** - IPFS storage ([Sign up](https://app.pinata.cloud/))
4. **Sepolia Faucet** - Test ETH ([Get ETH](https://sepoliafaucet.com/))

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Kishore-Capstone
```

### 2. Install Dependencies

```bash
# Install root dependencies (Hardhat)
npm install --legacy-peer-deps

# Install backend dependencies
cd api
npm install
cd ..

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

#### Root Directory (.env)
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_METAMASK_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

#### Backend (api/.env)
```bash
cd api
cp .env.example .env
```

Edit `api/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/identity-db
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ISSUER_PRIVATE_KEY=YOUR_ISSUER_WALLET_PRIVATE_KEY
CONTRACT_ADDRESS=<will_be_set_after_deployment>
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_api_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Frontend (client/.env)
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=<will_be_set_after_deployment>
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia
```

### 4. Get Sepolia Test ETH

1. Go to [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your MetaMask wallet address
3. Receive free test ETH (needed for deploying contracts)

### 5. Deploy Smart Contract

```bash
# Compile the contract
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Important**: After deployment, copy the contract address and update:
- `api/.env` → `CONTRACT_ADDRESS`
- `client/.env` → `VITE_CONTRACT_ADDRESS`

### 6. Configure MongoDB

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Copy the connection string to `api/.env` → `MONGODB_URI`

### 7. Get Pinata API Keys

1. Sign up at [Pinata](https://app.pinata.cloud/)
2. Go to API Keys section
3. Create a new key
4. Copy API Key and Secret to `api/.env`

### 8. Add University as Issuer (One-time Setup)

After deploying the contract, you need to authorize university wallets to issue credentials:

```bash
# In Hardhat console
npx hardhat console --network sepolia

# Add issuer (replace with university wallet address)
const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
const contract = await IdentityRegistry.attach("YOUR_CONTRACT_ADDRESS");
await contract.addIssuer("UNIVERSITY_WALLET_ADDRESS");
```

---

## 💻 Running the Application

### Development Mode

Open 3 separate terminals:

#### Terminal 1: Backend API
```bash
cd api
npm run dev
```
Server will run on `http://localhost:5000`

#### Terminal 2: Frontend
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Terminal 3: Local Hardhat Node (Optional - for local testing)
```bash
npx hardhat node
```

### Access the Application

Open your browser and go to `http://localhost:5173`

---

## 📖 User Guide

### For Students

1. **Sign Up**
   - Navigate to Sign Up page
   - Select "Student" role
   - Provide name, email, password
   - Click Register

2. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure you're on Sepolia network

3. **Register DID**
   - Go to Student Dashboard
   - Click "Register DID" button
   - Confirm MetaMask transaction
   - Wait for blockchain confirmation

4. **View Credentials**
   - Your issued credentials will appear in the dashboard
   - Click "View Details" to see full credential info
   - Download or share credential hash with employers

### For Universities

1. **Sign Up**
   - Select "University" role
   - Provide organization name
   - Complete registration

2. **Issue Credentials**
   - Go to University Dashboard
   - Fill in credential details:
     - Student wallet address
     - Credential type (e.g., "Bachelor's Degree")
     - Student name
     - Course name
     - Completion date
     - Expiry date
   - Click "Issue Credential"
   - Approve IPFS upload
   - Confirm blockchain transaction

3. **Manage Credentials**
   - View all issued credentials
   - Revoke credentials if needed

### For Employers

1. **Sign Up**
   - Select "Employer" role
   - Provide company name
   - Complete registration

2. **Verify Credentials**
   - Go to Employer Dashboard
   - Enter credential hash (provided by student)
   - Click "Verify Credential"
   - View verification results:
     - ✅ Valid: Credential is authentic and not revoked
     - ❌ Invalid: Credential is revoked or doesn't exist
   - See full credential details from IPFS

---

## 🏗️ Project Structure

```
Kishore-Capstone/
├── contracts/                  # Solidity smart contracts
│   └── IdentityRegistry.sol   # Main DID and credential registry
├── scripts/                    # Deployment scripts
│   └── deploy.js              # Contract deployment script
├── test/                       # Smart contract tests
│   └── IdentityRegistry.test.js
├── api/                        # Backend (Node.js/Express)
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic (signup, login)
│   │   └── credentialController.js # Credential operations
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── roleMiddleware.js  # Role-based access
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   ├── User.js            # User model (with password hashing)
│   │   └── Credential.js      # Credential metadata model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── credentialRoutes.js # Credential endpoints
│   ├── services/
│   │   ├── ipfsService.js     # Pinata IPFS integration
│   │   └── blockchainService.js # Smart contract interaction
│   ├── .env.example           # Environment variables template
│   └── server.js              # Express server entry point
├── client/                     # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx     # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── hooks/
│   │   │   └── useWallet.js   # MetaMask integration hook
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── UniversityDashboard.jsx
│   │   │   ├── EmployerDashboard.jsx
│   │   │   └── VerifyCredential.jsx
│   │   ├── services/
│   │   │   ├── api.js         # Axios API client
│   │   │   └── blockchain.js  # Contract interaction
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── .env.example           # Frontend environment template
│   └── index.html
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Root dependencies (Hardhat)
└── README.md                  # This file
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user profile

### Credentials
- `POST /api/credentials/issue` - Issue credential (University only)
- `GET /api/credentials/my` - Get my credentials (Student only)
- `GET /api/credentials/:hash` - Get credential by hash
- `POST /api/credentials/revoke` - Revoke credential (University only)

---

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/IdentityRegistry.test.js
```

### Test Coverage Includes:
- ✅ Contract deployment
- ✅ Issuer management (add/remove)
- ✅ DID registration
- ✅ Credential issuance
- ✅ Credential verification
- ✅ Credential revocation
- ✅ Access control (role-based)

---

## 🔐 Security Considerations

### Current MVP Security Features
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ Private key management via environment variables
- ✅ HTTPS recommended for production

### Production Recommendations
- [ ] Implement rate limiting
- [ ] Add CAPTCHA for signup
- [ ] Enable 2FA for university accounts
- [ ] Use hardware wallets for issuer keys
- [ ] Implement contract upgrade mechanism
- [ ] Add credential revocation monitoring
- [ ] Set up monitoring and alerting

---

## 🚧 Known Limitations (MVP)

1. **Testnet Only**: Currently deployed on Sepolia testnet
2. **Centralized Backend**: API server is centralized (can be decentralized)
3. **Manual Issuer Addition**: Contract owner must manually add issuers
4. **No Backup/Recovery**: Wallet recovery not implemented
5. **Limited Credential Types**: Basic credential structure
6. **No Batch Operations**: One credential at a time

---

## 📈 Future Enhancements

### Phase 2 Features
- [ ] Multi-chain support (Polygon, Binance Smart Chain)
- [ ] Credential templates
- [ ] QR code generation
- [ ] Email notifications
- [ ] Batch credential issuance
- [ ] Mobile app (React Native)
- [ ] Credential marketplace
- [ ] Zero-knowledge proofs for privacy

### Phase 3 Features
- [ ] DAO governance for issuer approval
- [ ] Reputation system
- [ ] Integration with LinkedIn
- [ ] ENS domain support
- [ ] IPFS pinning service redundancy
- [ ] Credential analytics dashboard

---

## 🐛 Troubleshooting

### MetaMask Connection Issues
**Problem**: "Please install MetaMask" error
**Solution**: Install MetaMask extension and refresh page

### Wrong Network Error
**Problem**: "Please switch to Sepolia network"
**Solution**:
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia Test Network"
4. If not visible, enable "Show test networks" in Settings

### Transaction Fails
**Problem**: Transaction reverts or fails
**Solution**:
- Check you have enough Sepolia ETH
- Ensure gas limit is sufficient
- Verify contract address is correct

### CORS Errors
**Problem**: CORS policy blocks requests
**Solution**: Ensure `CLIENT_URL` in `api/.env` matches frontend URL

### MongoDB Connection Failed
**Problem**: Cannot connect to database
**Solution**:
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

---

## 📊 Gas Costs (Approximate)

| Operation | Estimated Gas | Cost (@ 50 gwei) |
|-----------|---------------|------------------|
| Deploy Contract | ~1,800,000 | ~0.09 ETH |
| Register DID | ~120,000 | ~0.006 ETH |
| Issue Credential | ~180,000 | ~0.009 ETH |
| Revoke Credential | ~45,000 | ~0.002 ETH |
| Verify Credential | 0 (read-only) | FREE |

*Note: Mainnet costs will be significantly higher*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- **Ethereum Foundation** for blockchain infrastructure
- **OpenZeppelin** for smart contract patterns
- **Pinata** for IPFS hosting
- **MongoDB** for database hosting
- **Hardhat** for development tools

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review smart contract comments

---

## 🎓 Educational Purpose

This project is built for educational purposes as part of a capstone project to demonstrate:
- Blockchain development skills
- Full-stack web development
- Decentralized identity concepts
- Smart contract security
- IPFS integration

---

**Built with ❤️ for a decentralized future**