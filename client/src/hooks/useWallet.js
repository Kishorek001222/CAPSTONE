import { useState, useEffect } from 'react';
import blockchainService from '../services/blockchain';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskInstalled(blockchainService.isMetaMaskInstalled());

    // Check if already connected
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            loadAccountData(accounts[0]);
          }
        })
        .catch(console.error);

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const loadAccountData = async (address) => {
    try {
      const bal = await blockchainService.getBalance(address);
      setBalance(bal);

      const network = await blockchainService.provider.getNetwork();
      setChainId(network.chainId);
    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAccount(null);
      setIsConnected(false);
      setBalance('0');
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
      loadAccountData(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      const address = await blockchainService.connectWallet();
      setAccount(address);
      setIsConnected(true);
      await loadAccountData(address);
      return { success: true, address };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return {
        success: false,
        message: error.message || 'Failed to connect wallet',
      };
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance('0');
  };

  const switchNetwork = async () => {
    try {
      await blockchainService.switchNetwork();
      return { success: true };
    } catch (error) {
      console.error('Error switching network:', error);
      return {
        success: false,
        message: error.message || 'Failed to switch network',
      };
    }
  };

  return {
    account,
    isConnected,
    isMetaMaskInstalled,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};
