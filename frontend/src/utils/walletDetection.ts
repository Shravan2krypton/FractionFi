// Comprehensive wallet detection utility

export interface WalletInfo {
  name: string;
  installed: boolean;
  provider: any;
  icon: string;
}

export const detectWallets = (): WalletInfo[] => {
  const wallets: WalletInfo[] = [];

  // Check for MetaMask
  if (typeof window !== 'undefined') {
    // MetaMask detection
    if (window.ethereum && window.ethereum.isMetaMask) {
      wallets.push({
        name: 'MetaMask',
        installed: true,
        provider: window.ethereum,
        icon: '🦊'
      });
    }

    // Check for injected ethereum providers
    if (window.ethereum) {
      wallets.push({
        name: 'Injected Web3',
        installed: true,
        provider: window.ethereum,
        icon: '🌐'
      });
    }

    // Check for Web3 providers
    if ((window as any).web3) {
      if ((window as any).web3.currentProvider) {
        wallets.push({
          name: 'Web3 Current Provider',
          installed: true,
          provider: (window as any).web3.currentProvider,
          icon: '🔗'
        });
      }
      
      if ((window as any).web3.givenProvider) {
        wallets.push({
          name: 'Web3 Given Provider',
          installed: true,
          provider: (window as any).web3.givenProvider,
          icon: '🔗'
        });
      }
    }

    // Check for Coinbase Wallet
    if ((window as any).coinbaseWalletExtension) {
      wallets.push({
        name: 'Coinbase Wallet',
        installed: true,
        provider: (window as any).coinbaseWalletExtension,
        icon: '🔵'
      });
    }

    // Check for WalletConnect
    if ((window as any).walletLink) {
      wallets.push({
        name: 'WalletConnect',
        installed: true,
        provider: (window as any).walletLink,
        icon: '🔗'
      });
    }
  }

  return wallets;
};

export const getPrimaryWallet = (): WalletInfo | null => {
  const wallets = detectWallets();
  return wallets.length > 0 ? wallets[0] : null;
};

export const isAnyWalletInstalled = (): boolean => {
  return detectWallets().some(wallet => wallet.installed);
};
