'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Building, Coins, Rocket, ArrowLeft, TrendingUp, Users, Shield, Calculator, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/utils/api';

interface Asset {
  id: number;
  name: string;
  asset_type: 'real_estate' | 'gold' | 'startup';
  total_value: number;
  total_supply: number;
  token_price: number;
  available_tokens: number;
  roi_estimate?: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export default function AssetDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isConnected, account, signer } = useWallet();
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState<string>('0');

  useEffect(() => {
    if (params.id) {
      fetchAsset(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (isConnected && signer) {
      fetchWalletBalance();
    }
  }, [isConnected, signer]);

  const fetchWalletBalance = async () => {
    try {
      if (!signer) return;
      const balance = await signer.provider.getBalance(account || await signer.getAddress());
      const balanceInEth = parseFloat(balance.toString()) / 1e18;
      setWalletBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchAsset = async (id: string) => {
    try {
      const response = await apiFetch(`/api/assets/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Asset not found');
      }
      
      setAsset(data.asset);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching asset:', error);
      setError(error instanceof Error ? error.message : 'Failed to load asset');
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      setError('Please login to make a purchase');
      return;
    }

    if (!isConnected) {
      setError('Please connect your wallet to make a purchase');
      return;
    }

    if (!purchaseAmount || parseInt(purchaseAmount) <= 0) {
      setError('Please enter a valid purchase amount');
      return;
    }

    if (asset && parseInt(purchaseAmount) > asset.available_tokens) {
      setError('Not enough tokens available');
      return;
    }

    setIsPurchasing(true);
    setError('');

    try {
      // Use blockchain contract for purchase
      const { getContract, mockContract } = await import('@/utils/contract');
      
      if (!signer) {
        throw new Error('Wallet not connected');
      }
      
      // Check wallet balance before proceeding
      const balance = await signer.provider.getBalance(account || await signer.getAddress());
      const balanceInEth = parseFloat(balance.toString()) / 1e18;
      
      if (balanceInEth === 0) {
        throw new Error('Your wallet has no ETH. Please add funds to make purchases.');
      }
      
      let contract;
      try {
        contract = getContract(signer);
      } catch (contractError) {
        console.log('Using mock contract - real contract not configured:', contractError);
        contract = mockContract;
      }
      
      if (!contract) {
        throw new Error('Contract not available');
      }
      
      // Calculate total cost
      const tokenPrice = asset?.token_price || 1000; // Fallback price
      const totalCost = parseInt(purchaseAmount) * tokenPrice;
      
      // Execute blockchain transaction
      let tx;
      if (contract === mockContract) {
        // Mock contract expects different parameters
        tx = await (contract as any).buyTokens(
          parseInt(params.id as string),
          parseInt(purchaseAmount),
          totalCost.toString()
        );
      } else {
        // Real contract with value object
        tx = await (contract as any).buyTokens(
          parseInt(params.id as string),
          parseInt(purchaseAmount),
          { value: totalCost.toString() }
        );
      }
      
      console.log('Transaction sent:', tx.hash);
      
      // Also record in backend for tracking
      const response = await apiFetch('/api/investments/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          asset_id: asset?.id,
          token_amount: parseInt(purchaseAmount),
          wallet_address: account,
          transaction_hash: tx.hash,
          total_amount: totalCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Purchase failed');
      }

      // Refresh asset data
      await fetchAsset(params.id as string);
      setPurchaseAmount('');
      
      // Show success message
      alert('Purchase successful! Tokens will be transferred to your wallet.');
    } catch (error: any) {
      console.error('Purchase error:', error);
      
      // Handle specific error types
      if (error.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds. Please add ETH to your wallet to complete this purchase.');
      } else if (error.message?.includes('insufficient funds')) {
        setError('Insufficient funds. Please add ETH to your wallet to complete this purchase.');
      } else if (error.message?.includes('User rejected')) {
        setError('Transaction was cancelled. Please try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Purchase failed. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'real_estate':
        return <Building className="h-8 w-8" />;
      case 'gold':
        return <Coins className="h-8 w-8" />;
      case 'startup':
        return <Rocket className="h-8 w-8" />;
      default:
        return <TrendingUp className="h-8 w-8" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalCost = () => {
    if (!asset || !purchaseAmount) return 0;
    return asset.token_price * parseInt(purchaseAmount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 dark:bg-gradient-to-br">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 dark:bg-gradient-to-br">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 dark:bg-gradient-to-br">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Marketplace
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                asset.asset_type === 'real_estate' ? 'bg-blue-100 text-blue-600' :
                asset.asset_type === 'gold' ? 'bg-yellow-100 text-yellow-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {getAssetIcon(asset.asset_type)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{asset.name}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  asset.asset_type === 'real_estate' ? 'bg-blue-100 text-blue-800' :
                  asset.asset_type === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {asset.asset_type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Token Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(asset.token_price)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">About this Asset</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {asset.description || 'No description available for this asset.'}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(asset.total_value)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {asset.total_supply.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-purple-600 mr-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {asset.available_tokens.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Calculator className="h-5 w-5 text-orange-600 mr-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Est. ROI</p>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    {asset.roi_estimate ? `+${asset.roi_estimate}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Token Sale Progress</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tokens Sold</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {asset.total_supply - asset.available_tokens} / {asset.total_supply}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((asset.total_supply - asset.available_tokens) / asset.total_supply) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  {Math.round(((asset.total_supply - asset.available_tokens) / asset.total_supply) * 100)}% of tokens sold
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Purchase Tokens</h2>
              
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    Please <a href="/login" className="font-medium underline">login</a> to make a purchase.
                  </p>
                </div>
              )}
              
              {user && !isConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    Please connect your wallet to make a purchase.
                  </p>
                </div>
              )}
              
              {user && isConnected && (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Your Wallet Balance:</span>
                      <span className={`text-sm font-bold ${parseFloat(walletBalance) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {walletBalance} ETH
                      </span>
                    </div>
                    {parseFloat(walletBalance) === 0 && (
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Your wallet has no ETH. Please add funds to make purchases.
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tokens
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={asset.available_tokens}
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {asset.available_tokens.toLocaleString()} tokens
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(calculateTotalCost())}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Gas Fees (est.)</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(500)} {/* Estimated gas fee */}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="font-bold text-lg text-gray-900">
                          {formatCurrency(calculateTotalCost() + 500)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing || !purchaseAmount || parseInt(purchaseAmount) <= 0}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPurchasing ? 'Processing...' : 'Purchase Tokens'}
                  </button>
                  
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>Connected wallet: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                    <p className="mt-1">All transactions are secured by blockchain</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
