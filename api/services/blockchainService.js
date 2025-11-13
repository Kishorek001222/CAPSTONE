const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.issuerWallet = null;
    this.initialized = false;
  }

  /**
   * Initialize blockchain connection
   */
  async initialize() {
    try {
      // Connect to Ethereum network
      const rpcUrl = process.env.SEPOLIA_RPC_URL || process.env.RPC_URL;
      if (!rpcUrl) {
        throw new Error('RPC URL not configured');
      }

      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      // Load contract ABI and address
      const contractPath = path.join(__dirname, '../contracts/IdentityRegistry.json');
      
      if (!fs.existsSync(contractPath)) {
        console.warn('Contract ABI not found. Please deploy the contract first.');
        return false;
      }

      const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      const contractAddress = contractData.address || process.env.CONTRACT_ADDRESS;
      
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      // Create contract instance
      this.contract = new ethers.Contract(
        contractAddress,
        contractData.abi,
        this.provider
      );

      // Setup issuer wallet if private key is provided
      if (process.env.ISSUER_PRIVATE_KEY) {
        this.issuerWallet = new ethers.Wallet(
          process.env.ISSUER_PRIVATE_KEY,
          this.provider
        );
      }

      this.initialized = true;
      console.log('Blockchain service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error.message);
      return false;
    }
  }

  /**
   * Check if an address is an authorized issuer
   * @param {String} address - Ethereum address
   * @returns {Promise<Boolean>}
   */
  async isIssuer(address) {
    try {
      if (!this.initialized) await this.initialize();
      return await this.contract.isIssuer(address);
    } catch (error) {
      console.error('Error checking issuer status:', error.message);
      throw error;
    }
  }

  /**
   * Register a DID on the blockchain
   * @param {String} didDocument - DID document (JSON string)
   * @param {Object} wallet - User's wallet (ethers.Wallet or signer)
   * @returns {Promise<Object>} - Transaction receipt
   */
  async registerDID(didDocument, wallet) {
    try {
      if (!this.initialized) await this.initialize();
      
      const contractWithSigner = this.contract.connect(wallet);
      const tx = await contractWithSigner.registerDID(didDocument);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error registering DID:', error.message);
      throw error;
    }
  }

  /**
   * Issue a credential on the blockchain
   * @param {Object} params - Credential parameters
   * @returns {Promise<Object>} - Transaction receipt
   */
  async issueCredential(params) {
    try {
      if (!this.initialized) await this.initialize();
      
      const {
        credentialHash,
        subjectAddress,
        credentialType,
        expiresAt,
        metadataURI,
        issuerWallet
      } = params;

      // Use provided wallet or default issuer wallet
      const wallet = issuerWallet || this.issuerWallet;
      if (!wallet) {
        throw new Error('No wallet available for issuing credentials');
      }

      const contractWithSigner = this.contract.connect(wallet);

      // Convert expiration date to Unix timestamp
      const expirationTimestamp = Math.floor(new Date(expiresAt).getTime() / 1000);

      const tx = await contractWithSigner.issueCredential(
        credentialHash,
        subjectAddress,
        credentialType,
        expirationTimestamp,
        metadataURI
      );

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        credentialHash
      };
    } catch (error) {
      console.error('Error issuing credential:', error.message);
      throw error;
    }
  }

  /**
   * Verify a credential on the blockchain
   * @param {String} credentialHash - Credential hash
   * @returns {Promise<Object>} - Credential verification result
   */
  async verifyCredential(credentialHash) {
    try {
      if (!this.initialized) await this.initialize();
      
      const result = await this.contract.verifyCredential(credentialHash);
      
      return {
        isValid: result.isValid,
        issuer: result.issuer,
        subject: result.subject,
        issuedAt: new Date(result.issuedAt.toNumber() * 1000),
        expiresAt: new Date(result.expiresAt.toNumber() * 1000),
        metadataURI: result.metadataURI
      };
    } catch (error) {
      console.error('Error verifying credential:', error.message);
      throw error;
    }
  }

  /**
   * Get all credentials for a subject
   * @param {String} subjectAddress - Subject's Ethereum address
   * @returns {Promise<Array>} - Array of credential hashes
   */
  async getCredentialsBySubject(subjectAddress) {
    try {
      if (!this.initialized) await this.initialize();
      return await this.contract.getCredentialsBySubject(subjectAddress);
    } catch (error) {
      console.error('Error getting credentials:', error.message);
      throw error;
    }
  }

  /**
   * Revoke a credential on the blockchain
   * @param {String} credentialHash - Credential hash
   * @param {Object} issuerWallet - Issuer's wallet
   * @returns {Promise<Object>} - Transaction receipt
   */
  async revokeCredential(credentialHash, issuerWallet) {
    try {
      if (!this.initialized) await this.initialize();
      
      const wallet = issuerWallet || this.issuerWallet;
      if (!wallet) {
        throw new Error('No wallet available for revoking credentials');
      }

      const contractWithSigner = this.contract.connect(wallet);
      const tx = await contractWithSigner.revokeCredential(credentialHash);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error revoking credential:', error.message);
      throw error;
    }
  }

  /**
   * Get DID information
   * @param {String} didAddress - DID address
   * @returns {Promise<Object>} - DID information
   */
  async getDID(didAddress) {
    try {
      if (!this.initialized) await this.initialize();
      
      const result = await this.contract.getDID(didAddress);
      
      return {
        owner: result.owner_,
        didDocument: result.didDocument_,
        createdAt: new Date(result.createdAt_.toNumber() * 1000),
        isActive: result.isActive_
      };
    } catch (error) {
      console.error('Error getting DID:', error.message);
      throw error;
    }
  }

  /**
   * Create credential hash from credential data
   * @param {Object} credentialData - Credential data
   * @returns {String} - Keccak256 hash
   */
  createCredentialHash(credentialData) {
    const dataString = JSON.stringify(credentialData);
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataString));
  }
}

module.exports = new BlockchainService();
