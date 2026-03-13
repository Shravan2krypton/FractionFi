'use client';

import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, Link, LogOut, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { 
    account, 
    provider,
    signer,
    isConnected, 
    isConnecting,
    connectionRequested,
    connectWallet, 
    disconnectWallet, 
    error 
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-xl shadow-lg shadow-green-500/25">
          <CheckCircle className="h-5 w-5 text-white" />
          <span className="text-sm font-semibold text-white">
            {formatAddress(account)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}
      
      <button
          onClick={connectWallet}
          disabled={isConnecting || connectionRequested}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-75 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Connecting...</span>
            </>
          ) : connectionRequested ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Already Requested</span>
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">Connect Wallet</span>
            </>
          )}
        </button>
      
      {!isConnected && !isConnecting && !connectionRequested && (
        <p className="text-xs text-gray-500 text-center">
          Connect your MetaMask wallet to start investing
        </p>
      )}
    </div>
  );
};
