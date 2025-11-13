import { ethers } from 'ethers';
import IdentityRegistryABI from '../contracts/IdentityRegistry.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '11155111');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
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

      // Initialize contract
      if (CONTRACT_ADDRESS && IdentityRegistryABI.abi) {
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          IdentityRegistryABI.abi,
          this.signer
        );
      }

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
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
          rpcUrls: ['https://sepolia.infura.io/v3/'],
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
    if (!this.contract) {
      // Use read-only provider for verification
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        IdentityRegistryABI.abi,
        this.provider
      );
    }

    try {
      const result = await this.contract.verifyCredential(credentialHash);

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
      throw error;
    }
  }

  /**
   * Get credentials for a subject
   */
  async getCredentialsBySubject(subjectAddress) {
    if (!this.contract) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        IdentityRegistryABI.abi,
        this.provider
      );
    }

    try {
      return await this.contract.getCredentialsBySubject(subjectAddress);
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw error;
    }
  }

  /**
   * Check if DID exists
   */
  async getDID(address) {
    if (!this.contract) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        IdentityRegistryABI.abi,
        this.provider
      );
    }

    try {
      const result = await this.contract.getDID(address);
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
    if (!this.provider) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
}

export default new BlockchainService();
