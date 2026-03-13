'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Building, Coins, Rocket, Filter, Search, TrendingUp, Eye } from 'lucide-react';
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

export default function Marketplace() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, selectedType]);

  const fetchAssets = async () => {
    try {
      const response = await apiFetch('/api/assets');
      const data = await response.json();
      setAssets(data.assets || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.asset_type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssets(filtered);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'real_estate':
        return <Building className="h-6 w-6" />;
      case 'gold':
        return <Coins className="h-6 w-6" />;
      case 'startup':
        return <Rocket className="h-6 w-6" />;
      default:
        return <TrendingUp className="h-6 w-6" />;
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

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assets...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Marketplace</h1>
          <p className="text-gray-600">Explore and invest in tokenized high-value assets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="real_estate">Real Estate</option>
                <option value="gold">Gold</option>
                <option value="startup">Startups</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAssets.length} of {assets.length} assets
            </p>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Check back later for new investment opportunities'
              }
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Asset Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                      asset.asset_type === 'real_estate' ? 'bg-blue-100 text-blue-600' :
                      asset.asset_type === 'gold' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {getAssetIcon(asset.asset_type)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      asset.asset_type === 'real_estate' ? 'bg-blue-100 text-blue-800' :
                      asset.asset_type === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {asset.asset_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{asset.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{asset.description}</p>
                </div>

                {/* Asset Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Value</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(asset.total_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Token Price</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(asset.token_price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Available Tokens</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatLargeNumber(asset.available_tokens)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Est. ROI</p>
                      <p className="text-lg font-semibold text-green-600">
                        {asset.roi_estimate ? `+${asset.roi_estimate}%` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Tokens Sold</span>
                      <span>{Math.round(((asset.total_supply - asset.available_tokens) / asset.total_supply) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((asset.total_supply - asset.available_tokens) / asset.total_supply) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => window.location.href = `/assets/${asset.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
