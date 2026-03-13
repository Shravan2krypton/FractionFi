// Advanced wallet detection with multiple fallback methods

export const checkAllPossibleWallets = (): any[] => {
  const results: any[] = [];

  if (typeof window === 'undefined') {
    return results;
  }

  // Method 1: Direct window.ethereum check
  if (window.ethereum) {
    results.push({
      source: 'window.ethereum',
      provider: window.ethereum,
      isMetaMask: window.ethereum.isMetaMask || false,
      detected: true
    });
  }

  // Method 2: Web3 providers
  if ((window as any).web3) {
    const web3 = (window as any).web3;
    
    if (web3.currentProvider) {
      results.push({
        source: 'web3.currentProvider',
        provider: web3.currentProvider,
        detected: true
      });
    }

    if (web3.givenProvider) {
      results.push({
        source: 'web3.givenProvider',
        provider: web3.givenProvider,
        detected: true
      });
    }
  }

  // Method 3: Ethereum object in different locations
  const globalEthereum = (window as any).ethereum || 
                          (window as any).web3?.ethereum ||
                          (globalThis as any).ethereum;

  if (globalEthereum) {
    results.push({
      source: 'global ethereum',
      provider: globalEthereum,
      detected: true
    });
  }

  // Method 4: Check for common wallet objects
  const walletObjects = [
    'ethereum',
    'web3',
    'tronWeb3',
    'tronLink',
    'BinanceChain',
    'MathWallet'
  ];

  for (const obj of walletObjects) {
    if ((window as any)[obj]) {
      results.push({
        source: obj,
        provider: (window as any)[obj],
        detected: true
      });
    }
  }

  // Method 5: Check for injected providers array
  if ((window as any).ethereum?.providers) {
    for (const provider of (window as any).ethereum.providers) {
      results.push({
        source: 'ethereum.providers',
        provider: provider,
        detected: true
      });
    }
  }

  return results;
};

export const detectMetaMaskSpecifically = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for MetaMask specifically
  return !!(
    window.ethereum?.isMetaMask ||
    (window as any)._web3ref?.currentProvider?.isMetaMask ||
    (window as any).web3?.currentProvider?.isMetaMask ||
    document.querySelector('meta-mask-sdk') !== null
  );
};

export const getWalletDetectionReport = () => {
  const allWallets = checkAllPossibleWallets();
  const hasMetaMask = detectMetaMaskSpecifically();
  
  return {
    totalProviders: allWallets.length,
    hasMetaMask,
    providers: allWallets.map(w => w.source),
    details: allWallets
  };
};
