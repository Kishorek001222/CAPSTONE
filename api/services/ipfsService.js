const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY;
    this.pinataBaseUrl = 'https://api.pinata.cloud';
  }

  /**
   * Upload JSON data to IPFS via Pinata
   * @param {Object} jsonData - JSON object to upload
   * @param {String} name - Optional name for the pin
   * @returns {Promise<String>} - IPFS hash
   */
  async uploadJSON(jsonData, name = 'credential') {
    try {
      const url = `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`;

      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: name,
          keyvalues: {
            type: 'verifiable-credential'
          }
        }
      };

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        }
      });

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error.response?.data || error.message);
      throw new Error('Failed to upload to IPFS');
    }
  }

  /**
   * Fetch data from IPFS
   * @param {String} ipfsHash - IPFS hash to fetch
   * @returns {Promise<Object>} - Retrieved data
   */
  async fetchJSON(ipfsHash) {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching from IPFS:', error.message);
      throw new Error('Failed to fetch from IPFS');
    }
  }

  /**
   * Test Pinata connection
   * @returns {Promise<Boolean>} - Connection status
   */
  async testConnection() {
    try {
      const url = `${this.pinataBaseUrl}/data/testAuthentication`;
      const response = await axios.get(url, {
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        }
      });
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
    } catch (error) {
      console.error('Pinata connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Create a verifiable credential object
   * @param {Object} params - Credential parameters
   * @returns {Object} - Verifiable credential
   */
  createVerifiableCredential(params) {
    const {
      issuer,
      subject,
      credentialType,
      credentialData,
      issuedAt = new Date().toISOString(),
      expiresAt
    } = params;

    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      id: `urn:uuid:${this.generateUUID()}`,
      type: ['VerifiableCredential', credentialType],
      issuer: {
        id: issuer.did || issuer.walletAddress,
        name: issuer.name,
        organization: issuer.organization
      },
      issuanceDate: issuedAt,
      expirationDate: expiresAt,
      credentialSubject: {
        id: subject.did || subject.walletAddress,
        name: subject.name,
        email: subject.email,
        ...credentialData
      }
    };
  }

  /**
   * Generate a simple UUID
   * @returns {String} - UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

module.exports = new IPFSService();
