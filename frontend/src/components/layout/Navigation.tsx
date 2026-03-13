'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Wallet, LogOut, User, TrendingUp, Home, Menu, X, AlertCircle, CheckCircle, Loader2, Settings, ChevronDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { account, isConnected, isConnecting, connectionRequested, connectWallet, disconnectWallet, error } = useWallet();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Helper function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname === href;
  };

  // Helper function to get active link styles
  const getActiveLinkStyles = (href: string) => {
    const isActive = isActiveLink(href);
    return cn(
      'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
      isActive 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
    );
  };

  // Helper function to get active mobile link styles
  const getActiveMobileLinkStyles = (href: string) => {
    const isActive = isActiveLink(href);
    return cn(
      'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
      isActive 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
    );
  };

  const handleWalletToggle = () => {
    if (isConnected) {
      setShowWalletMenu(!showWalletMenu);
    } else {
      connectWallet();
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnectWallet();
      setShowWalletMenu(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatWalletError = (error: string) => {
    if (error.includes('Already processing')) {
      return 'MetaMask connection already in progress. Please wait...';
    }
    if (error.includes('User rejected')) {
      return 'Connection request was cancelled. Please try again.';
    }
    if (error.includes('No provider')) {
      return 'Please install MetaMask to connect your wallet.';
    }
    // Don't show MetaMask extension error to users, handle it silently
    if (error.includes('MetaMask') || error.includes('extension')) {
      return null; // Return null to suppress this error
    }
    return error || 'An error occurred while connecting MetaMask.';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and main navigation */}
            <div className="flex items-center z-10">
              <Link href="/" className="flex items-center space-x-3 group relative z-20">
                <div className="relative flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-blue-600 transform transition-transform group-hover:scale-110" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-cyan-700 transition-all duration-300 whitespace-nowrap">
                  FractionFi
                </span>
              </Link>
            
            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6 ml-8">
              <Link 
                href="/" 
                className={getActiveLinkStyles('/')}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/marketplace" 
                className={getActiveLinkStyles('/marketplace')}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Explore Assets</span>
              </Link>
              {user && (
                <Link 
                  href="/dashboard" 
                  className={getActiveLinkStyles('/dashboard')}
                >
                  <Wallet className="h-4 w-4" />
                  <span>Portfolio</span>
                </Link>
              )}
              {user && (
                <Link 
                  href="/transactions" 
                  className={getActiveLinkStyles('/transactions')}
                >
                  <Activity className="h-4 w-4" />
                  <span>Transactions</span>
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className={getActiveLinkStyles('/admin')}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Wallet connection */}
            <div className="relative">
              {/* Wallet error display */}
              {error && formatWalletError(error) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg z-50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">MetaMask Connection Error</p>
                      <p className="text-xs text-red-700 mt-1">{formatWalletError(error)}</p>
                      <button
                        onClick={() => window.open('https://metamask.io/download/', '_blank')}
                        className="text-xs text-red-600 hover:text-red-800 font-medium mt-2 underline"
                      >
                        Install MetaMask
                      </button>
                    </div>
                    <button
                      onClick={() => {/* Clear error - will be handled by wallet context */}}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleWalletToggle}
                disabled={isConnecting || connectionRequested}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  isConnected 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/25 hover:shadow-green-500/40' 
                    : isConnecting || connectionRequested
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/25 hover:shadow-blue-600/40'
                )}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="sm:hidden">...</span>
                    <span className="hidden sm:inline">Connecting...</span>
                  </>
                ) : connectionRequested ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="sm:hidden">...</span>
                    <span className="hidden sm:inline">Requested</span>
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span className="sm:hidden">Connected</span>
                    <span className="hidden sm:inline">Wallet Connected</span>
                    <ChevronDown className={cn('h-3 w-3 transition-transform', showWalletMenu && 'rotate-180')} />
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span className="sm:hidden">Connect</span>
                    <span className="hidden sm:inline">Connect Wallet</span>
                  </>
                )}
              </button>

              {/* Wallet dropdown menu */}
              {isConnected && showWalletMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">🦊</span>
                      <p className="text-sm font-medium text-gray-900">MetaMask Connected</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <p className="text-xs text-gray-500 font-mono truncate flex-1">
                        {account}
                      </p>
                      <button
                        onClick={() => navigator.clipboard.writeText(account || '')}
                        className="text-xs text-blue-600 hover:text-blue-800 ml-1 flex-shrink-0"
                        title="Copy address"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Connected to Ethereum</span>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDisconnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Disconnecting...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Disconnect MetaMask</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', showUserMenu && 'rotate-180')} />
                </button>
                
                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">Premium Investor</p>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Theme</span>
                        <ThemeToggle />
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm mx-auto shadow-xl">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-bold text-gray-900">FractionFi</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Theme toggle for mobile */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Navigation links */}
              <div className="px-2 py-4 space-y-2">
                <Link
                  href="/"
                  className={getActiveMobileLinkStyles('/')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                
                <Link
                  href="/marketplace"
                  className={getActiveMobileLinkStyles('/marketplace')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Explore Assets</span>
                </Link>

                {user && (
                  <>
                    <Link
                      href="/dashboard"
                      className={getActiveMobileLinkStyles('/dashboard')}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Wallet className="h-5 w-5" />
                      <span className="font-medium">Portfolio</span>
                    </Link>

                    <Link
                      href="/transactions"
                      className={getActiveMobileLinkStyles('/transactions')}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Activity className="h-5 w-5" />
                      <span className="font-medium">Transactions</span>
                    </Link>
                  </>
                )}

                {user && user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={getActiveMobileLinkStyles('/admin')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
              </div>

              {!user && (
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>

    </>
  );
};
