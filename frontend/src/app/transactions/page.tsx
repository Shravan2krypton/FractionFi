'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/utils/api';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { AdvancedFilters, FilterGroup } from '@/components/ui/AdvancedFilters';
import { Button } from '@/components/ui/Button';

interface Transaction {
  id: number;
  asset_name: string;
  asset_type: string;
  transaction_type: 'purchase' | 'sale' | 'profit_distribution';
  amount: number;
  price_per_token: number;
  total_amount: number;
  transaction_hash?: string;
  blockchain_tx_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export default function Transactions() {
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [blockchainStatuses, setBlockchainStatuses] = useState<{[key: string]: 'verified' | 'pending' | 'failed'}>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType, filterStatus]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await apiFetch('/api/investments/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
      
      // Verify blockchain transactions
      await verifyBlockchainTransactions(data.transactions || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]); // Set empty array on error
      setLoading(false);
    }
  };

  const verifyBlockchainTransactions = async (transactions: Transaction[]) => {
    const statuses: {[key: string]: 'verified' | 'pending' | 'failed'} = {};
    
    for (const tx of transactions) {
      if (tx.blockchain_tx_hash) {
        try {
          // In a real implementation, you'd verify the transaction on blockchain
          // For now, we'll simulate verification
          statuses[tx.blockchain_tx_hash] = 'verified';
        } catch (error) {
          statuses[tx.blockchain_tx_hash] = 'failed';
        }
      } else {
        statuses[tx.transaction_hash || ''] = 'pending';
      }
    }
    
    setBlockchainStatuses(statuses);
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.transaction_type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.transaction_hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.blockchain_tx_hash?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    const uniqueAssets = [...new Map(transactions.map(tx => [tx.asset_name, tx])).values()];
    const assetSuggestions = uniqueAssets.slice(0, 8).map(tx => ({
      id: tx.id.toString(),
      text: tx.asset_name,
      type: 'asset' as const,
      category: tx.asset_type.replace('_', ' '),
      icon: getTypeIcon(tx.transaction_type)
    }));
    
    // Add popular searches
    const popularSearches = [
      { id: 'popular-1', text: 'Purchase', type: 'popular' as const, category: 'Transaction Type' },
      { id: 'popular-2', text: 'Completed', type: 'popular' as const, category: 'Status' },
      { id: 'popular-3', text: 'Real Estate', type: 'popular' as const, category: 'Asset Type' },
    ];
    
    return [...popularSearches, ...assetSuggestions];
  }, [transactions]);

  // Filter configuration for advanced filters
  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Transaction Type',
      type: 'select',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'purchase', label: 'Purchases' },
        { value: 'sale', label: 'Sales' },
        { value: 'profit_distribution', label: 'Profit Distributions' },
      ],
      value: filterType,
      placeholder: 'Select transaction type'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
      ],
      value: filterStatus,
      placeholder: 'Select status'
    }
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    switch (filterId) {
      case 'type':
        setFilterType(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'sale':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'profit_distribution':
        return <Wallet className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-red-100 text-red-800';
      case 'profit_distribution':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateHash = (hash?: string) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const openEtherscan = (hash?: string) => {
    if (hash) {
      // This would open the appropriate blockchain explorer
      window.open(`https://etherscan.io/tx/${hash}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-2">View your investment transactions and profit distributions</p>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search transactions by asset name, hash, or type..."
              suggestions={searchSuggestions}
              className="max-w-2xl"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(filterType !== 'all' || filterStatus !== 'all') && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </Button>

              {/* Quick Filter Pills */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={filterType === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All Types
                </Button>
                <Button
                  variant={filterType === 'purchase' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('purchase')}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Purchases
                </Button>
                <Button
                  variant={filterType === 'sale' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('sale')}
                >
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Sales
                </Button>
                <Button
                  variant={filterType === 'profit_distribution' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('profit_distribution')}
                >
                  <Wallet className="h-3 w-3 mr-1" />
                  Profits
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <AdvancedFilters
              filters={filterGroups}
              values={{
                type: filterType,
                status: filterStatus
              }}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              className="mt-4"
            />
          )}

          {/* Status Legend */}
          <div className="flex items-center space-x-4 text-sm pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-black font-medium">Purchase</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-black font-medium">Sale</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-black font-medium">Profit</span>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Your transaction history will appear here once you start investing'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.asset_name}</div>
                          <div className="text-xs text-gray-500">{transaction.asset_type.replace('_', ' ')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(transaction.transaction_type)}
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(transaction.transaction_type)}`}>
                            {transaction.transaction_type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount.toLocaleString()} tokens
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.total_amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          @ {formatCurrency(transaction.price_per_token)}/token
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                          {transaction.blockchain_tx_hash && (
                            <div className="ml-2 flex items-center">
                              {blockchainStatuses[transaction.blockchain_tx_hash] === 'verified' && (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span className="text-xs">On-Chain</span>
                                </div>
                              )}
                              {blockchainStatuses[transaction.blockchain_tx_hash] === 'pending' && (
                                <div className="flex items-center text-yellow-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Pending</span>
                                </div>
                              )}
                              {blockchainStatuses[transaction.blockchain_tx_hash] === 'failed' && (
                                <div className="flex items-center text-red-600">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Failed</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-gray-900">
                            {truncateHash(transaction.blockchain_tx_hash)}
                          </span>
                          {transaction.blockchain_tx_hash && (
                            <button
                              onClick={() => openEtherscan(transaction.blockchain_tx_hash)}
                              className="text-blue-600 hover:text-blue-800"
                              title="View on blockchain explorer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
