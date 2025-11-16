# Installation Guide

## Quick Start Guide for Decentralized Identity Management System

This guide will walk you through setting up the project from scratch on your local machine.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Software

1. **Node.js (v16 or higher)**
   ```bash
   # Check version
   node --version

   # If not installed, download from https://nodejs.org/
   ```

2. **npm (comes with Node.js)**
   ```bash
   # Check version
   npm --version
   ```

3. **MongoDB**

   **Option A: Local Installation**
   - Download from https://www.mongodb.com/try/download/community
   - Follow installation instructions for your OS

   **Option B: MongoDB Atlas (Cloud - Recommended)**
   - Create free account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster (free tier available)
   - Get connection string

4. **MetaMask Browser Extension**
   - Install from https://metamask.io/download/
   - Create a wallet if you don't have one
   - Save your seed phrase securely!

5. **Git**
   ```bash
   # Check if installed
   git --version

   # If not installed, download from https://git-scm.com/
   ```

### Required Accounts

1. **Infura or Alchemy Account** (for Ethereum RPC access)
   - Infura: https://infura.io/ (Sign up for free)
   - OR Alchemy: https://www.alchemyapi.io/ (Sign up for free)
   - Create a new project and get your API key

2. **Pinata Account** (for IPFS storage)
   - Sign up at https://app.pinata.cloud/
   - Create API keys (in Account → API Keys)
   - Save: API Key, API Secret, and JWT

3. **Sepolia Testnet ETH**
   - Get free test ETH from faucets:
     - https://sepoliafaucet.com/
     - https://www.infura.io/faucet/sepolia
   - You'll need this for deploying contracts and transactions

---

## Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to project directory
cd Kishore-Capstone
```

### Step 2: Install Dependencies

```bash
# Install root dependencies (Hardhat and tools)
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

**Expected output**: Dependencies should install without errors. This may take a few minutes.

---

## Environment Configuration

### Step 1: Root Configuration (Hardhat)

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Fill in the following values:**

```env
# Get this from Infura or Alchemy
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Your MetaMask wallet private key (the deployer wallet)
# IMPORTANT: Use a test wallet, not your main wallet!
# Export from MetaMask: Account Details → Export Private Key
# Remove the '0x' prefix
PRIVATE_KEY=your_private_key_without_0x

# Optional: Get from https://etherscan.io/myapikey
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **SECURITY WARNING**:
- Never commit the `.env` file
- Never share your private key
- Use a separate wallet for testing
- Make sure this wallet has Sepolia ETH for gas fees

### Step 2: API Configuration

```bash
cd api

# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env
```

**Fill in the following values:**

```env
# MongoDB connection string
# Local: mongodb://localhost:27017/decentralized-identity
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=your_mongodb_connection_string

# Generate a secure random string for JWT
# You can use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_generated_secret_key_here

# Blockchain configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS  # Will be filled after deployment
ISSUER_PRIVATE_KEY=0xyour_private_key_here  # Same as root PRIVATE_KEY but WITH 0x

# Pinata IPFS credentials
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Server configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**How to get Pinata credentials:**
1. Go to https://app.pinata.cloud/
2. Sign up/log in
3. Go to "API Keys" in the menu
4. Click "New Key"
5. Enable all permissions
6. Create key and save all three values (API Key, API Secret, JWT)

### Step 3: Client Configuration

```bash
cd ../client  # From api directory

# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env
```

**Fill in the following values:**

```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS  # Will be filled after deployment
VITE_CHAIN_ID=11155111  # Sepolia testnet
VITE_NETWORK_NAME=Sepolia
```

---

## Smart Contract Deployment

### Step 1: Start Local MongoDB (if using local MongoDB)

```bash
# In a new terminal window
mongod

# Leave this running
```

### Step 2: Deploy Smart Contract to Sepolia

```bash
# From the root directory of the project
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected output:**
```
Deploying IdentityRegistry contract...
IdentityRegistry deployed to: 0x1234567890abcdef1234567890abcdef12345678
Contract ABI saved to contracts/IdentityRegistry.json
ABI copied to api/contracts/IdentityRegistry.json
ABI copied to client/src/contracts/IdentityRegistry.json
Deployment complete!
```

**IMPORTANT**: Copy the contract address from the output!

### Step 3: Update Configuration with Contract Address

Update the contract address in both `.env` files:

**api/.env:**
```env
CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

**client/.env:**
```env
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### Step 4: Verify Deployment (Optional but Recommended)

```bash
# Run smart contract tests
npx hardhat test
```

**Expected output:** All tests should pass ✅

---

## Running the Application

### Step 1: Start the API Server

```bash
# From the root directory
cd api

# Start in development mode
npm run dev

# OR start normally
npm start
```

**Expected output:**
```
Server is running on port 5000
MongoDB connected successfully
```

**If you see errors:**
- Check MongoDB is running
- Check all API environment variables are set
- Check MongoDB connection string is correct

### Step 2: Start the Client (in a new terminal)

```bash
# From the root directory
cd client

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. You should see the home page of the application

---

## Initial Configuration

### Step 1: Configure MetaMask

1. Open MetaMask extension
2. Click on the network dropdown (top of MetaMask)
3. Click "Add Network" or "Add Network Manually"
4. Enter the following details:
   - **Network Name**: Sepolia Test Network
   - **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://sepolia.etherscan.io
5. Save and switch to Sepolia network
6. Ensure your wallet has some Sepolia ETH

### Step 2: Register Your First University

1. Go to http://localhost:5173/signup
2. Create an account with:
   - **Role**: University
   - **Organization Name**: Your University Name
   - **Email**: your-email@university.edu
   - **Password**: (create a strong password)
3. After signup, you'll be logged in

### Step 3: Add University as Authorized Issuer

The university needs to be authorized to issue credentials. This requires the contract owner (deployer):

**Method 1: Using Hardhat Console**

```bash
# From root directory
npx hardhat console --network sepolia
```

In the console:
```javascript
const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
const contract = await IdentityRegistry.attach("YOUR_CONTRACT_ADDRESS");

// Replace with the university's wallet address
await contract.addIssuer("0xUNIVERSITY_WALLET_ADDRESS");
```

**Method 2: Using Etherscan**

1. Go to https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
2. Click "Contract" tab
3. Click "Write Contract"
4. Connect your MetaMask (deployer wallet)
5. Find `addIssuer` function
6. Enter university's wallet address
7. Click "Write"
8. Confirm transaction in MetaMask

### Step 4: Test the System

1. **Create a Student Account**
   - Register as a student
   - Connect MetaMask wallet
   - Register DID on blockchain

2. **Issue a Credential** (as University)
   - Log in as university
   - Go to "Issue Credential"
   - Select the student
   - Fill in credential details
   - Submit (this will interact with MetaMask)

3. **Verify the Credential**
   - Log in as student
   - View credentials in dashboard
   - Copy credential hash
   - Go to verification page
   - Paste hash and verify

---

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to MongoDB"

**Solution:**
- Check if MongoDB is running: `sudo systemctl status mongod` (Linux)
- Check connection string in `api/.env`
- If using Atlas, check network access settings (allow your IP)

#### 2. "Transaction failed" or "Insufficient funds"

**Solution:**
- Ensure wallet has Sepolia ETH
- Get test ETH from faucets
- Check network is set to Sepolia in MetaMask

#### 3. "Contract not deployed" error

**Solution:**
- Verify contract was deployed successfully
- Check CONTRACT_ADDRESS in both .env files
- Ensure the ABI files were copied correctly

#### 4. "CORS error" in browser console

**Solution:**
- Check CLIENT_URL in `api/.env` matches your frontend URL
- Restart API server after changing .env

#### 5. "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Do the same for api/ and client/
```

#### 6. MetaMask not connecting

**Solution:**
- Refresh the page
- Check MetaMask is unlocked
- Check you're on Sepolia network
- Try disconnecting and reconnecting wallet

#### 7. "Invalid signature" or "Nonce too high"

**Solution:**
- In MetaMask: Settings → Advanced → Reset Account
- This clears transaction history and resets nonce

---

## Verification Checklist

After installation, verify everything is working:

- [ ] MongoDB is connected (check API logs)
- [ ] API server is running on port 5000
- [ ] Client is running on port 5173
- [ ] Smart contract is deployed to Sepolia
- [ ] Contract address is in both .env files
- [ ] MetaMask is connected to Sepolia
- [ ] Can create user accounts
- [ ] Can connect wallet
- [ ] Can register DID
- [ ] University can issue credentials (after being added as issuer)
- [ ] Can verify credentials

---

## Next Steps

Once everything is running:

1. Read the main **README.md** for detailed documentation
2. Review **MVP_SUGGESTIONS.md** for production improvements
3. Explore the different dashboards:
   - Student Dashboard
   - University Dashboard
   - Employer Dashboard
4. Test the complete workflow end-to-end

---

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md
2. Review error messages carefully
3. Check browser console for errors (F12)
4. Check API server logs
5. Verify all environment variables are set correctly

---

## Security Reminders

- ✅ Never commit `.env` files
- ✅ Never share private keys
- ✅ Use test wallets only
- ✅ Keep test ETH separate from real ETH
- ✅ This is for development/testing only

---

**Installation Guide Version**: 1.0
**Last Updated**: November 2025

Good luck with your capstone project! 🎓
