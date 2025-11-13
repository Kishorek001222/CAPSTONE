# MVP Demonstration Guide
## Decentralized Identity System - Complete Demo Script

---

## Table of Contents
1. [Pre-Demonstration Setup](#pre-demonstration-setup)
2. [Environment Preparation](#environment-preparation)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Application Launch](#application-launch)
5. [Demo Scenario 1: Student Journey](#demo-scenario-1-student-journey)
6. [Demo Scenario 2: University Credential Issuance](#demo-scenario-2-university-credential-issuance)
7. [Demo Scenario 3: Employer Verification](#demo-scenario-3-employer-verification)
8. [Technical Deep Dive](#technical-deep-dive)
9. [Common Demo Issues](#common-demo-issues)
10. [Presentation Tips](#presentation-tips)

---

## Pre-Demonstration Setup

### Required Accounts (Set up 24 hours before demo)

#### 1. MongoDB Atlas
```
URL: https://www.mongodb.com/cloud/atlas
Steps:
1. Create free account
2. Create new cluster (M0 Free tier)
3. Database Access: Create user (username/password)
4. Network Access: Add IP 0.0.0.0/0 (for demo purposes)
5. Copy connection string
```

#### 2. Infura (Ethereum RPC Provider)
```
URL: https://infura.io/
Steps:
1. Sign up for free account
2. Create new project: "Identity-System-Demo"
3. Copy Sepolia RPC URL
   Format: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

#### 3. Pinata (IPFS Storage)
```
URL: https://app.pinata.cloud/
Steps:
1. Create free account
2. Go to API Keys section
3. Generate new API key
4. Save API Key and Secret API Key
```

#### 4. MetaMask Wallets (Create 3 separate wallets)
```
Wallet 1: Contract Owner/Deployer
- Export private key for deployment
- Get Sepolia ETH from faucet (~0.5 ETH)

Wallet 2: University Issuer
- Export private key for backend
- Get Sepolia ETH (~0.3 ETH)

Wallet 3: Student
- Will be used in browser only
- Get Sepolia ETH (~0.1 ETH)

Wallet 4: Employer (optional)
- Browser only for verification
```

#### 5. Sepolia Test ETH
```
Faucets:
- https://sepoliafaucet.com/ (requires Alchemy account)
- https://www.infura.io/faucet/sepolia
- https://sepolia-faucet.pk910.de/ (PoW faucet)

Request test ETH for all wallets at least 1 hour before demo
```

---

## Environment Preparation

### Step 1: Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/8harath/Kishore-Capstone.git
cd Kishore-Capstone

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

### Step 2: Configure Root Environment (.env)

```bash
# Create .env in root directory
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_ACTUAL_INFURA_PROJECT_ID
PRIVATE_KEY=YOUR_WALLET_1_PRIVATE_KEY_WITHOUT_0x_PREFIX
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY_OPTIONAL
```

### Step 3: Configure Backend Environment (api/.env)

```bash
cd api
cp .env.example .env
```

Edit `api/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/identity-demo?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_for_security
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ISSUER_PRIVATE_KEY=YOUR_WALLET_2_PRIVATE_KEY_FOR_UNIVERSITY
CONTRACT_ADDRESS=WILL_BE_FILLED_AFTER_DEPLOYMENT
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 4: Configure Frontend Environment (client/.env)

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=WILL_BE_FILLED_AFTER_DEPLOYMENT
VITE_CHAIN_ID=11155111
VITE_NETWORK_NAME=Sepolia
```

---

## Smart Contract Deployment

### Step 1: Compile Contract

```bash
# From root directory
npx hardhat compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

### Step 2: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
Deploying IdentityRegistry contract...
IdentityRegistry deployed to: 0x1234567890abcdef1234567890abcdef12345678
Contract ABI and address saved to api/contracts and client/src/contracts
Waiting for block confirmations...
Contract verified successfully
```

**IMPORTANT:** Copy the contract address!

### Step 3: Update Environment Variables

1. Update `api/.env`:
```env
CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

2. Update `client/.env`:
```env
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

### Step 4: Add University as Authorized Issuer

```bash
npx hardhat console --network sepolia
```

In the console:
```javascript
const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
const contract = await IdentityRegistry.attach("YOUR_CONTRACT_ADDRESS");

// Add university wallet as issuer
await contract.addIssuer("WALLET_2_ADDRESS");

// Verify issuer was added
await contract.isIssuer("WALLET_2_ADDRESS");
// Should return: true

// Exit console
.exit
```

### Step 5: Verify Deployment on Etherscan

```
URL: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

Verify:
✅ Contract is verified (source code visible)
✅ Owner address matches Wallet 1
✅ Transaction count > 0
```

---

## Application Launch

### Terminal Setup (Open 3 terminals)

#### Terminal 1: Backend Server
```bash
cd api
npm run dev
```

**Expected Output:**
```
> identity-api@1.0.0 dev
> nodemon server.js

Server running in development mode on port 5000
Connected to MongoDB
Blockchain service initialized successfully
```

**Troubleshooting:**
- If MongoDB connection fails: Check connection string and IP whitelist
- If blockchain fails: Check RPC URL and contract address

#### Terminal 2: Frontend Development Server
```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 432 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

#### Terminal 3: Monitoring (Optional)
```bash
# Monitor backend logs
cd api
tail -f server.log

# OR watch blockchain events
npx hardhat console --network sepolia
```

### Verify Application Access

Open browser and navigate to: `http://localhost:5173`

**Pre-Demo Checklist:**
- [ ] Backend API responds at http://localhost:5000/api/health
- [ ] Frontend loads without errors
- [ ] MetaMask is installed and has Sepolia network
- [ ] All 3 wallets have Sepolia ETH
- [ ] Contract is deployed and verified

---

## Demo Scenario 1: Student Journey

### Objective
Demonstrate how a student creates an account, connects their wallet, and registers a decentralized identity.

### Presentation Script

**"Let me demonstrate how a student interacts with our decentralized identity system."**

### Step 1: Student Registration (2 minutes)

1. Navigate to homepage: `http://localhost:5173`
   - **Say:** "This is the landing page explaining our SSI platform."

2. Click **"Get Started"** or **"Sign Up"**

3. Fill registration form:
   ```
   Name: John Smith
   Email: john.smith@university.edu
   Password: SecurePass123!
   Role: Student
   ```

4. Click **"Sign Up"**

   **Expected Result:** Success message + redirect to login

   **Say:** "The password is hashed using bcrypt with 10 salt rounds before storage. We never store plain text passwords."

### Step 2: Login

1. Enter credentials:
   ```
   Email: john.smith@university.edu
   Password: SecurePass123!
   ```

2. Click **"Login"**

   **Expected Result:** Redirect to Student Dashboard

   **Say:** "Upon successful authentication, a JWT token is generated and stored securely."

### Step 3: Connect MetaMask Wallet (3 minutes)

1. On Student Dashboard, click **"Connect Wallet"**

   **Expected:** MetaMask popup appears

2. Select **Wallet 3** (Student wallet)

3. Click **"Next"** → **"Connect"**

   **Expected Result:**
   - Wallet address appears in dashboard
   - Balance shown in ETH
   - Green "Connected" status

   **Say:** "The wallet connection happens entirely client-side. The private key never leaves the user's browser or MetaMask."

4. If wrong network:
   - MetaMask will prompt to switch to Sepolia
   - Click **"Switch Network"**

   **Say:** "Our application automatically detects the network and prompts users to switch if needed."

### Step 4: Register DID on Blockchain (4 minutes)

**Say:** "Now John will register his Decentralized Identity on the Ethereum blockchain."

1. Click **"Register DID"** button

   **Expected:** MetaMask popup for transaction confirmation

2. **Show MetaMask popup to audience:**
   - Point out: Gas fees
   - Point out: Contract interaction
   - Point out: Transaction data

   **Say:** "This transaction will permanently register John's DID on the Sepolia blockchain. The DID is linked to his wallet address and cannot be altered by any central authority."

3. Click **"Confirm"** in MetaMask

   **Expected:**
   - Loading spinner appears
   - Status message: "Transaction submitted..."
   - Wait 15-30 seconds

4. **During wait time, explain:**
   - "The transaction is being mined and added to a block"
   - "On mainnet, this costs real ETH, but on Sepolia it's free test ETH"
   - "Once mined, the DID is permanently recorded on-chain"

5. **Expected Result:**
   - Success message: "DID registered successfully!"
   - Transaction hash displayed (clickable link to Etherscan)
   - DID section updated with:
     - Status: ✅ Registered
     - Created At: [timestamp]
     - Transaction hash

6. **Click Etherscan link:**

   **Say:** "Let's verify this on the blockchain explorer."

   **Show on Etherscan:**
   - Transaction details
   - From address (student wallet)
   - To address (contract)
   - Function call: `registerDID`
   - Block number
   - Gas used

   **Say:** "This proves the transaction is immutably recorded on the Ethereum blockchain. No centralized authority can modify or delete this record."

---

## Demo Scenario 2: University Credential Issuance

### Objective
Demonstrate how a university issues a verifiable credential to a student.

### Presentation Script

**"Now let's see how a university issues a verifiable academic credential."**

### Step 1: University Registration (2 minutes)

1. **Open new incognito/private browser window**

   **Say:** "I'm opening a separate browser session to simulate the university's perspective."

2. Navigate to: `http://localhost:5173`

3. Click **"Sign Up"**

4. Fill form:
   ```
   Name: Stanford University
   Email: registrar@stanford.edu
   Password: StanfordAdmin2024!
   Role: University
   Organization: Stanford University
   ```

5. Click **"Sign Up"** → Login with same credentials

   **Expected:** Redirect to University Dashboard

### Step 2: University Dashboard Overview (1 minute)

**Say:** "The university dashboard has different capabilities compared to the student dashboard."

**Point out:**
- Credential issuance form
- Previously issued credentials list
- Statistics (if any)

### Step 3: Issue Credential to Student (5 minutes)

**Say:** "Let's issue a Bachelor's degree credential to John Smith."

1. Fill credential issuance form:

   ```
   Student Wallet Address: [COPY FROM STUDENT DASHBOARD - Wallet 3 address]
   Credential Type: Bachelor of Science Degree
   Student Name: John Smith
   Course/Program Name: Computer Science
   Grade/Result: First Class Honors (GPA 3.8/4.0)
   Completion Date: 2024-05-15
   Expiration Date: 2099-12-31
   Additional Info: Major in Artificial Intelligence and Machine Learning
   ```

   **Say:** "Notice we need the student's wallet address. In practice, students would share this address with their university."

2. Click **"Issue Credential"**

   **Expected:** Processing starts

   **Say:** "Now the system performs three critical operations in sequence..."

### Step 4: Monitor Credential Issuance Process

**Phase 1: IPFS Upload (5-10 seconds)**

**Show on screen:**
```
Step 1/3: Uploading credential metadata to IPFS...
```

**Say:** "First, we upload the complete credential data to IPFS, a decentralized storage network. This ensures the credential data is permanently available and cannot be censored or removed."

**Expected:**
- Progress indicator
- IPFS hash displayed (e.g., `QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX`)

**Open Pinata dashboard** (optional):
- Show the uploaded credential JSON
- Point out the timestamp

**Phase 2: Blockchain Transaction (15-30 seconds)**

**Show on screen:**
```
Step 2/3: Recording credential hash on blockchain...
Please confirm transaction in MetaMask
```

**Say:** "Next, we create a cryptographic hash of the credential and record it on the Ethereum blockchain."

**MetaMask popup appears:**

**Point out in MetaMask:**
- Function: `issueCredential`
- Parameters visible in "Hex" tab
- Gas fee estimate

**Click "Confirm"**

**During mining wait:**

**Say:** "The blockchain transaction is being mined. This permanently links the credential to John's wallet address and includes the IPFS hash for retrieving the full data."

**Phase 3: Database Record (1 second)**

**Show on screen:**
```
Step 3/3: Saving credential metadata to database...
```

**Say:** "Finally, we save a reference in our database for quick retrieval, though the source of truth remains on the blockchain."

### Step 5: Success Confirmation

**Expected Result:**
```
✅ Credential issued successfully!

Credential Details:
- Credential Hash: 0xabcd...ef12
- Transaction Hash: 0x1234...5678
- IPFS Hash: QmT5Nv...hCxX
- Issued to: 0x789a...bcde
- Block Number: 4567890
```

**Say:** "The credential is now permanently recorded. Let's verify this on the blockchain."

**Click transaction hash to open Etherscan:**

**Point out:**
- Function: `issueCredential`
- Parameters (encoded)
- Event logs: `CredentialIssued`
- Subject address matches student wallet

### Step 6: View IPFS Data (Optional but Impressive)

**Say:** "Let's look at the actual credential data stored on IPFS."

**Copy IPFS hash, open:**
```
https://gateway.pinata.cloud/ipfs/YOUR_IPFS_HASH
```

**Show JSON structure:**
```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "Bachelor of Science Degree"],
  "issuer": {
    "id": "did:eth:0x...",
    "name": "Stanford University",
    "organization": "Stanford University"
  },
  "issuanceDate": "2024-05-15T00:00:00Z",
  "expirationDate": "2099-12-31T00:00:00Z",
  "credentialSubject": {
    "id": "did:eth:0x...",
    "name": "John Smith",
    "degree": "Bachelor of Science",
    "major": "Computer Science",
    "gpa": "3.8/4.0"
  }
}
```

**Say:** "This follows the W3C Verifiable Credentials standard, making it interoperable with other SSI systems worldwide."

---

## Demo Scenario 3: Employer Verification

### Objective
Demonstrate instant, trustless credential verification by an employer.

### Presentation Script

**"Finally, let's see how an employer instantly verifies John's credential without contacting the university."**

### Step 1: Return to Student Dashboard

1. Switch back to student browser window
2. Refresh if needed

   **Expected:** Credential now appears in "My Credentials" section

### Step 2: Student Views Credential

**Say:** "John can now see his newly issued credential."

**Point out credential card:**
- Credential type
- Issuer name
- Issue date
- Expiration date
- Status: ✅ Valid

Click **"View Details"**

**Show expanded view:**
- Full credential information
- Credential hash (for sharing)
- IPFS link
- Blockchain transaction link
- **"Copy Hash"** button

**Say:** "John can share this credential hash with potential employers. The hash is like a fingerprint of the credential."

### Step 3: Copy Credential Hash

1. Click **"Copy Hash"** button
2. Show copied notification

   **Say:** "John sends this hash to the employer via email or job application."

### Step 4: Employer Registration (Optional)

**Option A: Quick Verification (No Login)**

Navigate to: `http://localhost:5173/verify`

**Say:** "Employers don't even need to create an account for verification. They can use our public verification page."

**Option B: Employer Dashboard (With Login)**

1. Open new incognito window
2. Sign up as employer:
   ```
   Name: Google Inc.
   Email: hr@google.com
   Password: GoogleHR2024!
   Role: Employer
   Company: Google Inc.
   ```

3. Login → Navigate to Employer Dashboard

### Step 5: Verify Credential (3 minutes)

**Say:** "Let's verify John's credential using the hash he provided."

1. Paste credential hash into verification form

2. Click **"Verify Credential"**

   **Say:** "This queries the blockchain directly. No need to contact the university."

**Expected: Loading indicator (5-10 seconds)**

**During wait, explain:**
- "We're querying the Ethereum blockchain"
- "Checking if credential exists and is not revoked"
- "Fetching the full credential data from IPFS"
- "This is completely trustless - no intermediary involved"

### Step 6: Verification Results

**Expected Result: Success Page**

```
✅ CREDENTIAL IS VALID

Blockchain Verification:
━━━━━━━━━━━━━━━━━━━━━━━
Status: Valid
Issued By: 0x7890...cdef
Issued To: 0x789a...bcde
Issue Date: May 15, 2024
Expiration: Dec 31, 2099
Revoked: No

Issuer Information:
━━━━━━━━━━━━━━━━━━━━━━━
Organization: Stanford University
Verified Issuer: ✅

Credential Details:
━━━━━━━━━━━━━━━━━━━━━━━
Type: Bachelor of Science Degree
Name: John Smith
Program: Computer Science
Grade: First Class Honors (GPA 3.8/4.0)
Completion: May 15, 2024

Blockchain Proof:
━━━━━━━━━━━━━━━━━━━━━━━
Transaction: 0x1234...5678 [View on Etherscan]
Block Number: 4567890
IPFS Hash: QmT5Nv...hCxX [View Data]
```

**Say:** "The employer can now see all credential details and verify they are authentic. The blockchain guarantees this credential was genuinely issued by Stanford University and has not been tampered with."

### Step 7: Demonstrate Invalid Credential (Optional)

**Say:** "Let's see what happens with an invalid credential hash."

1. Enter random hash: `0x0000000000000000000000000000000000000000000000000000000000000000`

2. Click **"Verify"**

**Expected Result:**
```
❌ CREDENTIAL IS INVALID

Status: Not Found
This credential does not exist on the blockchain.

Possible reasons:
- Invalid credential hash
- Credential was never issued
- Wrong blockchain network
```

**Say:** "The system immediately detects invalid or non-existent credentials, preventing fraud."

### Step 8: Demonstrate Revoked Credential (Advanced - Optional)

**Only if time permits and want to show revocation:**

1. Switch back to University dashboard
2. Find the issued credential in list
3. Click **"Revoke"** button
4. Confirm MetaMask transaction
5. Wait for mining
6. Return to employer verification
7. Verify same credential hash again

**Expected:**
```
❌ CREDENTIAL IS INVALID

Status: Revoked
This credential has been revoked by the issuer.

Revoked On: [timestamp]
```

**Say:** "If a university discovers fraud or error, they can revoke credentials on-chain, and verifications will immediately reflect this."

---

## Technical Deep Dive

### For Technical Audiences

#### Architecture Overview (2 minutes)

**Draw/Show Architecture Diagram:**

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │◄────────┤    Express   │◄────────┤  MongoDB    │
│  Frontend   │  JWT    │   Backend    │         │  Database   │
└──────┬──────┘         └──────┬───────┘         └─────────────┘
       │                        │
       │ ethers.js         ethers.js
       │                        │
       ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Ethereum Blockchain (Sepolia)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        IdentityRegistry Smart Contract                │  │
│  │  • registerDID()                                      │  │
│  │  • issueCredential()                                  │  │
│  │  • verifyCredential()                                 │  │
│  │  • revokeCredential()                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ IPFS Hash
                               ▼
                      ┌──────────────────┐
                      │   IPFS (Pinata)  │
                      │  Credential Data │
                      └──────────────────┘
```

#### Smart Contract Functions (3 minutes)

**Show contract code snippets:**

```solidity
// DID Registration
function registerDID(string memory _didDocument) external {
    require(!dids[msg.sender].isActive, "DID already registered");
    dids[msg.sender] = DID({
        owner: msg.sender,
        didDocument: _didDocument,
        createdAt: block.timestamp,
        isActive: true
    });
    emit DIDRegistered(msg.sender, block.timestamp);
}

// Credential Issuance (Only authorized issuers)
function issueCredential(
    bytes32 _credentialHash,
    address _subject,
    string memory _credentialType,
    uint256 _expiresAt,
    string memory _metadataURI
) external onlyIssuer didExists(_subject) {
    // Store credential on-chain
    credentials[_credentialHash] = VerifiableCredential({
        credentialHash: _credentialHash,
        issuer: msg.sender,
        subject: _subject,
        credentialType: _credentialType,
        issuedAt: block.timestamp,
        expiresAt: _expiresAt,
        isRevoked: false,
        metadataURI: _metadataURI
    });
    subjectCredentials[_subject].push(_credentialHash);
    emit CredentialIssued(_credentialHash, msg.sender, _subject, block.timestamp);
}

// Verification (Anyone can verify)
function verifyCredential(bytes32 _credentialHash)
    external view returns (
        bool isValid,
        address issuer,
        address subject,
        uint256 issuedAt,
        uint256 expiresAt,
        string memory metadataURI
    )
{
    VerifiableCredential memory cred = credentials[_credentialHash];
    isValid = cred.issuedAt != 0 &&
              !cred.isRevoked &&
              cred.expiresAt > block.timestamp;
    // Return all credential details
}
```

#### Gas Costs Analysis

**Show live gas costs from demo transactions:**

| Operation | Gas Used | Cost (ETH @ 50 gwei) | Cost (USD @ $2000/ETH) |
|-----------|----------|----------------------|------------------------|
| Deploy Contract | ~1,800,000 | 0.09 ETH | $180 |
| Register DID | ~120,000 | 0.006 ETH | $12 |
| Issue Credential | ~180,000 | 0.009 ETH | $18 |
| Revoke Credential | ~45,000 | 0.002 ETH | $4 |
| Verify Credential | 0 (read-only) | FREE | FREE |

**Say:** "On Sepolia testnet, gas is free. On mainnet, costs would vary with network congestion. Layer 2 solutions like Polygon or Arbitrum could reduce these costs by 90%+."

#### Security Features

1. **Access Control:**
   - Only authorized universities can issue credentials
   - Only issuers can revoke their own credentials
   - Owner-based DID management

2. **Cryptographic Security:**
   - Credentials hashed using Keccak256
   - Private keys never leave user's wallet
   - Blockchain immutability prevents tampering

3. **Data Privacy:**
   - Sensitive data on IPFS (off-chain)
   - Only hash stored on-chain
   - Student controls wallet and can prove ownership

#### Code Quality Metrics

**If asked about testing:**

```bash
# Run smart contract tests
npx hardhat test
```

**Show test results:**
```
  IdentityRegistry
    Deployment
      ✓ Should set the right owner (234ms)
    Issuer Management
      ✓ Should add an issuer (156ms)
      ✓ Should remove an issuer (142ms)
      ✓ Should only allow owner to add issuer (98ms)
    DID Registration
      ✓ Should register a new DID (187ms)
      ✓ Should not allow duplicate DID registration (134ms)
    Credential Issuance
      ✓ Should issue a credential (298ms)
      ✓ Should only allow issuers to issue credentials (156ms)
    Credential Verification
      ✓ Should verify a valid credential (187ms)
      ✓ Should return invalid for revoked credential (245ms)
    Get Credentials by Subject
      ✓ Should return all credentials for a subject (312ms)

  11 passing (2.8s)
```

---

## Common Demo Issues

### Issue 1: MetaMask Not Connecting

**Symptoms:**
- "Please install MetaMask" error
- Connection button doesn't work

**Solutions:**
1. Refresh page
2. Ensure MetaMask is unlocked
3. Check browser console for errors
4. Try disconnecting and reconnecting in MetaMask settings

### Issue 2: Wrong Network Error

**Symptoms:**
- "Please switch to Sepolia" message
- Transaction fails immediately

**Solutions:**
1. Open MetaMask → Networks dropdown
2. Select "Sepolia Test Network"
3. If not visible: Settings → Advanced → Show test networks

### Issue 3: Transaction Fails - Insufficient Funds

**Symptoms:**
- "Insufficient funds" error in MetaMask
- Transaction rejected

**Solutions:**
1. Check wallet balance (need at least 0.01 ETH)
2. Visit Sepolia faucet before demo
3. Use different wallet with funds

### Issue 4: Backend Connection Error

**Symptoms:**
- 500 errors from API
- "Cannot connect to server"

**Solutions:**
1. Check backend terminal - is it running?
2. Test: `curl http://localhost:5000/api/health`
3. Check MongoDB connection string
4. Verify contract address in .env

### Issue 5: Slow Transaction Confirmation

**Symptoms:**
- Transaction pending for >2 minutes
- "Still waiting for confirmation..."

**Solutions:**
1. Check Sepolia network status: https://sepolia.etherscan.io/
2. Increase gas price in MetaMask (during next transaction)
3. Wait patiently - Sepolia can be slow
4. Have backup pre-recorded demo ready

### Issue 6: IPFS Upload Fails

**Symptoms:**
- "Failed to upload to IPFS" error
- Credential issuance stops at Step 1

**Solutions:**
1. Verify Pinata API keys in api/.env
2. Test Pinata connection: Visit Pinata dashboard
3. Check internet connection
4. Verify Pinata account limits (free tier = 1GB)

---

## Presentation Tips

### Before Demo

**1 Day Before:**
- [ ] Deploy contract and verify on Etherscan
- [ ] Register test accounts for all roles
- [ ] Issue at least one test credential
- [ ] Test entire flow from start to finish
- [ ] Record backup video of working demo
- [ ] Prepare Etherscan links in advance

**1 Hour Before:**
- [ ] Get fresh Sepolia ETH for all wallets
- [ ] Clear browser cache and cookies
- [ ] Open all required tabs/windows
- [ ] Test internet connection
- [ ] Have backup hotspot ready
- [ ] Check backend/frontend are running
- [ ] Pin important Etherscan transactions

**10 Minutes Before:**
- [ ] Restart backend and frontend servers
- [ ] Clear MetaMask activity
- [ ] Close unnecessary browser tabs
- [ ] Set browser zoom to 150% for visibility
- [ ] Disable notifications
- [ ] Test audio/screen sharing

### During Demo

**Pacing:**
- Speak slowly and clearly
- Pause after each major step
- Wait for transactions to confirm (don't rush)
- Explain what's happening during loading screens

**Common Phrases:**
```
"Notice how..."
"The key point here is..."
"This demonstrates that..."
"In a production environment..."
"The blockchain guarantees..."
"No central authority can..."
```

**Handling Questions:**
- If technical: Show code/contract
- If about scalability: Mention Layer 2 solutions
- If about privacy: Explain IPFS vs on-chain
- If about cost: Show gas cost table
- If stuck: Use backup video while troubleshooting

**Visual Tips:**
- Use dark mode for better visibility
- Zoom in on important information
- Highlight key data with mouse/cursor
- Keep one Etherscan tab open throughout
- Show MetaMask popups to audience

### After Demo

**Cooldown Questions to Anticipate:**

1. **"What happens if IPFS goes down?"**
   - Answer: Multiple IPFS gateways, can pin on multiple providers, data is content-addressed

2. **"How do you handle credential revocation?"**
   - Answer: Show revoke function, immediate on-chain update

3. **"What about privacy concerns?"**
   - Answer: Student controls wallet, selective disclosure possible, can use ZK-proofs in future

4. **"How does this scale?"**
   - Answer: Layer 2 solutions (Polygon, Arbitrum), read operations don't cost gas

5. **"What about regulatory compliance (GDPR)?"**
   - Answer: On-chain data is minimal (hashes), full data on IPFS can be removed, right to be forgotten applies

6. **"How do you monetize this?"**
   - Answer: Universities pay small fee per credential, verification is free, could add premium features

---

## Backup Demo Strategy

### If Live Demo Fails

**Plan A: Use Recorded Video**
- Have pre-recorded successful demo
- Narrate over the video
- Still show code and architecture

**Plan B: Testnet Already Setup**
- Have pre-deployed contract
- Use existing test credentials
- Jump directly to verification

**Plan C: Local Hardhat Network**
- Switch to local node: `npx hardhat node`
- Instant transactions (no waiting)
- Update .env to use localhost

**Plan D: Presentation-Only Mode**
- Show architecture diagrams
- Walk through code
- Show Etherscan of previous transactions
- Use screenshots of working demo

---

## Quick Reference: Important Links

### Your Deployment
```
Smart Contract: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
IPFS Gateway: https://gateway.pinata.cloud/ipfs/
Frontend: http://localhost:5173
Backend: http://localhost:5000
API Health: http://localhost:5000/api/health
```

### External Services
```
Sepolia Faucet: https://sepoliafaucet.com/
Sepolia Explorer: https://sepolia.etherscan.io/
Pinata Dashboard: https://app.pinata.cloud/
MongoDB Atlas: https://cloud.mongodb.com/
```

### Documentation
```
W3C VC Standard: https://www.w3.org/TR/vc-data-model/
DID Specification: https://www.w3.org/TR/did-core/
Ethers.js Docs: https://docs.ethers.org/v5/
Hardhat Docs: https://hardhat.org/docs
```

---

## Success Metrics for Demo

✅ **Technical Success:**
- All transactions confirm within 2 minutes
- No errors or crashes
- All three dashboards functional
- Blockchain verification works

✅ **Presentation Success:**
- Clear explanation of SSI concept
- Demonstrated all three user journeys
- Showed blockchain/IPFS proof
- Answered questions confidently

✅ **Audience Engagement:**
- Questions about implementation
- Interest in trying themselves
- Understanding of decentralization benefits
- Recognition of real-world applications

---

**Good luck with your demo! 🚀**

Remember: Confidence is key. Even if something breaks, your deep understanding of the system will shine through in how you explain and troubleshoot.
