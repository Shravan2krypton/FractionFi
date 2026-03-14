'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { detectWallets, getPrimaryWallet } from '../utils/walletDetection';

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionRequested: boolean;
  manuallyDisconnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionRequested, setConnectionRequested] = useState(false);
  const [manuallyDisconnected, setManuallyDisconnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    checkConnection();
    setupEventListeners();
  }, []);

  // Function to clear pending MetaMask requests
  const clearPendingRequests = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum && (window as any).ethereum.request) {
        // Try to clear pending permissions
        await (window as any).ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
      }
    } catch (error) {
      console.error('Error clearing pending requests:', error);
    }
  };

  const checkConnection = async () => {
    // If user manually disconnected, don't auto-reconnect
    if (manuallyDisconnected) {
      console.log('User manually disconnected, skipping auto-connection');
      return;
    }

    if (typeof window === 'undefined') {
      console.log('Window not available');
      return;
    }

    const wallets = detectWallets();
    console.log('Detected wallets:', wallets);

    if (wallets.length === 0) {
      console.log('No wallets detected');
      return;
    }

    const primaryWallet = getPrimaryWallet();
    if (!primaryWallet) {
      console.log('No primary wallet found');
      return;
    }

    console.log('Using primary wallet:', primaryWallet.name);

    try {
      const provider = new ethers.BrowserProvider(primaryWallet.provider);
      console.log('Provider created:', provider);

      // Check for already connected accounts (don't request new ones)
      const accounts = await provider.send('eth_accounts', []);
      console.log('Connected accounts:', accounts);

      if (!accounts || accounts.length === 0) {
        console.log('No accounts currently connected');
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log('Connected to address:', address);

      setAccount(address);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
      setError(null);
    } catch (error: any) {
      console.error('Error checking connection:', error);
      setError(error.message || 'Failed to check wallet connection');
    }
  };

  const setupEventListeners = () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    // Prevent multiple connection requests
    if (connectionRequested) {
      setError('Already requested for wallet connection. Please check your Wallet.');
      return;
    }

    setIsConnecting(true);
    setConnectionRequested(true);
    setError(null);
    setManuallyDisconnected(false); // Reset manual disconnect flag

    try {
      const wallets = detectWallets();
      if (wallets.length === 0) {
        setError('No wallet detected. Please install MetaMask or another Web3 wallet.');
        setConnectionRequested(false);
        return;
      }

      const primaryWallet = getPrimaryWallet();
      if (!primaryWallet) {
        setError('No wallet available');
        setConnectionRequested(false);
        return;
      }

      console.log('Using primary wallet:', primaryWallet.name);

      const provider = new ethers.BrowserProvider(primaryWallet.provider);
      console.log('Provider created:', provider);

      // Request accounts
      const accounts = await provider.send('eth_requestAccounts', []);
      console.log('Accounts received:', accounts);

      if (!accounts || accounts.length === 0) {
        setError('No accounts found. Please make sure your wallet is unlocked.');
        setConnectionRequested(false);
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log('Connected to address:', address);

      setAccount(address);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
      setConnectionRequested(false);
      setManuallyDisconnected(false);
      setError(null);
    } catch (error: any) {
      // Handle user rejection specifically - don't log to console as this is expected behavior
      if (error.code === 4001 || error.message?.includes('User rejected the request')) {
        setError('Connection cancelled. You can try again when ready.');
      } else {
        console.error('Error connecting wallet:', error);
        setError(error.message || 'Failed to connect wallet');
      }
      
      setConnectionRequested(false);
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear local state first (this is the most important part)
      setAccount(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionRequested(false);
      setManuallyDisconnected(true);
      setError(null);

      // Optional: Try to revoke MetaMask permissions (but don't force it)
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Only try to revoke permissions, don't request new ones
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [
              {
                eth_accounts: {}
              }
            ]
          });
          console.log('Revoked MetaMask permissions');
        } catch (revokeError) {
          console.log('Could not revoke permissions (this is normal):', revokeError);
        }
      }
    } catch (error) {
      console.error('Error during disconnect:', error);
      // Still clear local state even if MetaMask disconnect fails
      setAccount(null);
      setProvider(null);
      setSigner(null);
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionRequested(false);
      setManuallyDisconnected(true);
      setError(null);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        isConnected,
        isConnecting,
        connectionRequested,
        manuallyDisconnected,
        connectWallet,
        disconnectWallet,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Extend window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}
