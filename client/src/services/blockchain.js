import { ethers } from 'ethers';
import IdentityRegistryABI from '../contracts/IdentityRegistry.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '11155111');
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia.org';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.readOnlyProvider = null;
    this.signer = null;
    this.contract = null;
    this.readOnlyContract = null;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask
   */
  async connectWallet() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Initialize provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();

      // Check network
      const network = await this.provider.getNetwork();
      if (network.chainId !== CHAIN_ID) {
        await this.switchNetwork();
      }

      this.initializeSignerContract();

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  initializeSignerContract() {
    if (!CONTRACT_ADDRESS || !IdentityRegistryABI.abi) {
      return;
    }

    if (!this.signer) {
      return;
    }

    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      IdentityRegistryABI.abi,
      this.signer
    );
  }

  getReadOnlyProvider() {
    if (this.readOnlyProvider) {
      return this.readOnlyProvider;
    }

    this.readOnlyProvider = new ethers.providers.JsonRpcProvider(RPC_URL, CHAIN_ID);
    return this.readOnlyProvider;
  }

  getReadOnlyContract() {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address is not configured');
    }

    if (!IdentityRegistryABI.abi) {
      throw new Error('Contract ABI is not available');
    }

    if (this.readOnlyContract) {
      return this.readOnlyContract;
    }

    this.readOnlyContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      IdentityRegistryABI.abi,
      this.getReadOnlyProvider()
    );
    return this.readOnlyContract;
  }

  /**
   * Switch to the correct network
   */
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(CHAIN_ID) }],
      });
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        await this.addNetwork();
      } else {
        throw error;
      }
    }
  }

  /**
   * Add Sepolia network to MetaMask
   */
  async addNetwork() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: ethers.utils.hexValue(CHAIN_ID),
          chainName: 'Sepolia Testnet',
          nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        },
      ],
    });
  }

  /**
   * Get current account
   */
  async getCurrentAccount() {
    if (!this.provider) {
      await this.connectWallet();
    }

    const accounts = await this.provider.listAccounts();
    return accounts[0];
  }

  /**
   * Register a DID on the blockchain
   */
  async registerDID(didDocument) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.registerDID(JSON.stringify(didDocument));
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Error registering DID:', error);
      throw error;
    }
  }

  /**
   * Issue a credential (called by frontend, but typically backend handles this)
   */
  async issueCredential(credentialHash, subjectAddress, credentialType, expiresAt, metadataURI) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const expirationTimestamp = Math.floor(new Date(expiresAt).getTime() / 1000);

      const tx = await this.contract.issueCredential(
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
      };
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  }

  /**
   * Verify a credential on the blockchain
   */
  async verifyCredential(credentialHash) {
    try {
      const contract = this.getReadOnlyContract();
      const result = await contract.verifyCredential(credentialHash);

      return {
        isValid: result.isValid,
        issuer: result.issuer,
        subject: result.subject,
        issuedAt: new Date(result.issuedAt.toNumber() * 1000),
        expiresAt: new Date(result.expiresAt.toNumber() * 1000),
        metadataURI: result.metadataURI,
      };
    } catch (error) {
      console.error('Error verifying credential:', error);
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address is missing. Configure VITE_CONTRACT_ADDRESS.');
      }
      throw new Error('Unable to verify credential from blockchain RPC.');
    }
  }

  /**
   * Get credentials for a subject
   */
  async getCredentialsBySubject(subjectAddress) {
    try {
      const contract = this.getReadOnlyContract();
      return await contract.getCredentialsBySubject(subjectAddress);
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw error;
    }
  }

  /**
   * Check if DID exists
   */
  async getDID(address) {
    try {
      const contract = this.getReadOnlyContract();
      const result = await contract.getDID(address);
      return {
        owner: result.owner_,
        didDocument: result.didDocument_,
        createdAt: new Date(result.createdAt_.toNumber() * 1000),
        isActive: result.isActive_,
      };
    } catch (error) {
      console.error('Error getting DID:', error);
      throw error;
    }
  }

  /**
   * Create credential hash
   */
  createCredentialHash(credentialData) {
    const dataString = JSON.stringify(credentialData);
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataString));
  }

  /**
   * Get account balance
   */
  async getBalance(address) {
    if (!this.provider && this.isMetaMaskInstalled()) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    const provider = this.provider || this.getReadOnlyProvider();
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
}

export default new BlockchainService();
