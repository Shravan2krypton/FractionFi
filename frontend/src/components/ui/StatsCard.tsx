'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Building, ArrowUpRight } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'percentage' | 'currency';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'percentage',
  icon, 
  trend,
  loading = false,
  className,
  onClick 
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val;
  };

  const formatChange = (val: number) => {
    if (changeType === 'percentage') {
      return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
    }
    return formatValue(val);
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <Card 
      variant={onClick ? 'elevated' : 'default'}
      className={cn(
        'transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-xl hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(value)}
              </p>
            )}
            
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={cn('text-sm font-medium', getTrendColor())}>
                  {formatChange(change)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {onClick && (
          <ArrowUpRight className="h-4 w-4 text-gray-400" />
        )}
      </div>
    </Card>
  );
}
