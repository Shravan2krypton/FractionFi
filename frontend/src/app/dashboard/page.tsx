'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/utils/api';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Building, 
  Coins, 
  Rocket,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  History,
  RefreshCw,
  Activity
} from 'lucide-react';
import { AnimatedChart } from '@/components/charts/AnimatedChart';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart as RePieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Bar,
  Legend
} from 'recharts';

interface Investment {
  id: number;
  asset_name: string;
  asset_type: string;
  tokens_owned: number;
  average_buy_price: number;
  total_invested: number;
  current_value: number;
  profit_loss: number;
}

interface PortfolioStats {
  totalInvested: number;
  currentValue: number;
  totalProfitLoss: number;
  totalAssets: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalInvested: 0,
    currentValue: 0,
    totalProfitLoss: 0,
    totalAssets: 0
  });
  const [loading, setLoading] = useState(true);
  const [profitHistory, setProfitHistory] = useState<{date: string, profit: number}[]>([]);

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch investments
      const investmentsResponse = await apiFetch('/api/investments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const investmentsData = await investmentsResponse.json();
      setInvestments(investmentsData.investments || []);

      // Fetch portfolio stats
      const statsResponse = await apiFetch('/api/investments/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Generate mock profit history for demonstration
      const mockProfitHistory = generateMockProfitHistory(statsData.totalProfitLoss);
      setProfitHistory(mockProfitHistory);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setLoading(false);
    }
  };

  const generateMockProfitHistory = (totalProfit: number) => {
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic profit fluctuations
      const baseProfit = totalProfit * (i / 6);
      const randomVariation = (Math.random() - 0.5) * totalProfit * 0.1;
      const profit = Math.max(0, baseProfit + randomVariation);
      
      history.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        profit: profit
      });
    }
    
    return history;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

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

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'real_estate':
        return '#3B82F6';
      case 'gold':
        return '#F59E0B';
      case 'startup':
        return '#8B5CF6';
      default:
        return '#10B981';
    }
  };

  // Prepare data for charts
  const pieChartData = investments.map(inv => ({
    name: inv.asset_name,
    value: inv.current_value,
    color: getAssetTypeColor(inv.asset_type)
  }));

  const performanceData = investments.map(inv => ({
    name: inv.asset_name,
    invested: inv.total_invested,
    current: inv.current_value,
    profit: inv.profit_loss
  }));

  const monthlyData = [
    { month: 'Jan', value: stats.totalInvested * 0.8 },
    { month: 'Feb', value: stats.totalInvested * 0.85 },
    { month: 'Mar', value: stats.totalInvested * 0.9 },
    { month: 'Apr', value: stats.totalInvested * 0.95 },
    { month: 'May', value: stats.totalInvested },
    { month: 'Jun', value: stats.currentValue }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your portfolio...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Here's your investment overview.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalInvested)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.currentValue)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(stats.totalProfitLoss)}
                </p>
                {stats.totalInvested > 0 && (
                  <p className={`text-sm ${
                    stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage((stats.totalProfitLoss / stats.totalInvested) * 100)}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-full ${
                stats.totalProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {stats.totalProfitLoss >= 0 ? 
                  <TrendingUp className="h-6 w-6 text-green-600" /> :
                  <TrendingDown className="h-6 w-6 text-red-600" />
                }
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assets Owned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* P&L Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profit & Loss Trend (7 Days)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={profitHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke={stats.totalProfitLoss >= 0 ? '#10B981' : '#EF4444'}
                    strokeWidth={2}
                    dot={{ fill: stats.totalProfitLoss >= 0 ? '#10B981' : '#EF4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Portfolio Performance Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Asset Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(Number(value)), name === 'invested' ? 'Amount Invested' : name === 'current' ? 'Current Value' : 'Profit/Loss']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="invested" fill="#94A3B8" name="Invested" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current" fill="#10B981" name="Current Value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Performance Summary */}
              {investments.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {investments.slice(0, 3).map((investment, index) => (
                    <div key={investment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {investment.asset_name}
                        </span>
                        <div className={`p-1 rounded-full ${
                          investment.asset_type === 'real_estate' ? 'bg-blue-100' :
                          investment.asset_type === 'gold' ? 'bg-yellow-100' :
                          'bg-purple-100'
                        }`}>
                          {getAssetIcon(investment.asset_type)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Invested:</span>
                          <span className="font-medium">{formatCurrency(investment.total_invested)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Current:</span>
                          <span className="font-medium">{formatCurrency(investment.current_value)}</span>
                        </div>
                        <div className={`flex justify-between text-xs font-medium ${
                          investment.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <span>P&L:</span>
                          <span>{investment.profit_loss >= 0 ? '+' : ''}{formatCurrency(investment.profit_loss)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Distribution</h2>
              {pieChartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {pieChartData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-600 truncate max-w-[120px]">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">No investments yet</p>
              )}
            </div>

            {/* Recent Investments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Investments</h2>
              {investments.length > 0 ? (
                <div className="space-y-3">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            investment.asset_type === 'real_estate' ? 'bg-blue-100' :
                            investment.asset_type === 'gold' ? 'bg-yellow-100' :
                            'bg-purple-100'
                          }`}>
                            {getAssetIcon(investment.asset_type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {investment.asset_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {investment.tokens_owned.toLocaleString()} tokens
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 text-sm">
                            {formatCurrency(investment.current_value)}
                          </p>
                          <p className={`text-xs ${
                            investment.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.profit_loss >= 0 ? '+' : ''}
                            {formatCurrency(investment.profit_loss)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No investments yet</p>
              )}
              
              {investments.length > 5 && (
                <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700">
                  View All Investments
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
