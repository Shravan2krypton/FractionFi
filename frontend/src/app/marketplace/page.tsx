'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Building, Coins, Rocket, TrendingUp, Eye, Star, ArrowUpRight, Filter, Search } from 'lucide-react';
import { apiFetch } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';
import { AdvancedFilters, FilterGroup } from '@/components/ui/AdvancedFilters';
import { cn } from '@/lib/utils';

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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState('roi_desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

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

  // Filter and sort assets
  const processedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || asset.asset_type === selectedType;
      const matchesPrice = asset.token_price >= priceRange.min && asset.token_price <= priceRange.max;
      return matchesSearch && matchesType && matchesPrice;
    });

    // Sort assets
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.token_price - b.token_price;
        case 'price_desc':
          return b.token_price - a.token_price;
        case 'roi_desc':
          return (b.roi_estimate || 0) - (a.roi_estimate || 0);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [assets, searchTerm, selectedType, priceRange, sortBy]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'real_estate':
        return <Building className="h-5 w-5" />;
      case 'gold':
        return <Coins className="h-5 w-5" />;
      case 'startup':
        return <Rocket className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    const suggestions = assets.slice(0, 10).map(asset => ({
      id: asset.id.toString(),
      text: asset.name,
      type: 'asset' as const,
      category: asset.asset_type.replace('_', ' '),
      icon: getAssetIcon(asset.asset_type)
    }));
    
    // Add popular searches
    const popularSearches = [
      { id: 'popular-1', text: 'Real Estate', type: 'popular' as const, category: 'Asset Type' },
      { id: 'popular-2', text: 'Gold Investment', type: 'popular' as const, category: 'Asset Type' },
      { id: 'popular-3', text: 'Tech Startups', type: 'popular' as const, category: 'Asset Type' },
    ];
    
    return [...popularSearches, ...suggestions];
  }, [assets]);

  // Filter configuration for advanced filters
  const filterGroups: FilterGroup[] = [
    {
      id: 'type',
      label: 'Asset Type',
      type: 'select',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'gold', label: 'Gold & Precious Metals' },
        { value: 'startup', label: 'Startups & Tech' },
      ],
      value: selectedType,
      placeholder: 'Select asset type'
    },
    {
      id: 'price',
      label: 'Price Range',
      type: 'range',
      min: 0,
      max: 1000000,
      value: priceRange,
      placeholder: 'Enter price range'
    },
    {
      id: 'sort',
      label: 'Sort By',
      type: 'select',
      options: [
        { value: 'roi_desc', label: 'Highest ROI' },
        { value: 'price_asc', label: 'Lowest Price' },
        { value: 'price_desc', label: 'Highest Price' },
        { value: 'name_asc', label: 'Name (A-Z)' },
      ],
      value: sortBy,
      placeholder: 'Sort by'
    }
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    switch (filterId) {
      case 'type':
        setSelectedType(value);
        break;
      case 'price':
        setPriceRange(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setPriceRange({ min: 0, max: 1000000 });
    setSortBy('roi_desc');
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'real_estate':
        return 'from-blue-500 to-cyan-600';
      case 'gold':
        return 'from-amber-500 to-yellow-600';
      case 'startup':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
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

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0%';
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              FractionFi Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Discover premium investment opportunities
            </p>
          </div>

          {/* Loading Skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card variant="elevated" className="h-96">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div>
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            FractionFi Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover premium investment opportunities
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <Card variant="glass" className="mb-8">
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search assets by name, type, or description..."
                suggestions={searchSuggestions}
                className="max-w-2xl mx-auto"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
                {(selectedType !== 'all' || priceRange.max < 1000000) && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </Button>

              {/* Results Count */}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{processedAssets.length}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">{assets.length}</span> assets
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <AdvancedFilters
                filters={filterGroups}
                values={{
                  type: selectedType,
                  price: priceRange,
                  sort: sortBy
                }}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                className="mt-4"
              />
            )}

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={selectedType === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All Assets
              </Button>
              <Button
                variant={selectedType === 'real_estate' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('real_estate')}
              >
                <Building className="h-3 w-3 mr-1" />
                Real Estate
              </Button>
              <Button
                variant={selectedType === 'gold' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('gold')}
              >
                <Coins className="h-3 w-3 mr-1" />
                Gold
              </Button>
              <Button
                variant={selectedType === 'startup' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('startup')}
              >
                <Rocket className="h-3 w-3 mr-1" />
                Startups
              </Button>
            </div>
          </div>
        </Card>

        {/* Assets Grid */}
        {processedAssets.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No assets found</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {searchTerm || selectedType !== 'all' || priceRange.max < 1000000
                ? 'Try adjusting your filters or search terms'
                : 'Check back later for new investment opportunities'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {processedAssets.map((asset, index) => (
              <Card 
                key={asset.id} 
                variant="elevated" 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Asset Header */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className={cn(
                    'h-2 bg-gradient-to-r opacity-90',
                    getAssetTypeColor(asset.asset_type)
                  )}></div>
                  
                  <div className="relative p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          'inline-flex items-center justify-center w-12 h-12 rounded-full',
                          asset.asset_type === 'real_estate' ? 'bg-blue-100 text-blue-600' :
                          asset.asset_type === 'gold' ? 'bg-amber-100 text-amber-600' :
                          'bg-purple-100 text-purple-600'
                        )}>
                          {getAssetIcon(asset.asset_type)}
                        </div>
                        <Badge 
                          variant="gradient" 
                          size="sm"
                        >
                          {asset.asset_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      {/* ROI Badge */}
                      {asset.roi_estimate && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-yellow-600">
                            {formatPercentage(asset.roi_estimate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {asset.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {asset.description || 'Premium investment opportunity with high growth potential'}
                  </p>
                </div>

                {/* Asset Details */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Value</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(asset.total_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Token Price</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(asset.token_price)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Tokens</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {asset.available_tokens.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {asset.total_supply.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Funding Progress</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={cn(
                          'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                          getAssetTypeColor(asset.asset_type)
                        )}
                        style={{ 
                          width: `${((asset.total_supply - asset.available_tokens) / asset.total_supply) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6">
                  <Button 
                    className="w-full group-hover:scale-105"
                    onClick={() => window.location.href = `/assets/${asset.id}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                    <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
