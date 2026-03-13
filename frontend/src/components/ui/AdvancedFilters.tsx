'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  value?: any;
  placeholder?: string;
}

interface AdvancedFiltersProps {
  filters: FilterGroup[];
  values: Record<string, any>;
  onChange: (filterId: string, value: any) => void;
  onReset: () => void;
  className?: string;
  compact?: boolean;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = '',
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  React.useEffect(() => {
    let count = 0;
    Object.entries(values).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          count += value.length > 0 ? 1 : 0;
        } else if (typeof value === 'object') {
          const hasValue = Object.values(value).some(v => v !== '' && v !== null && v !== undefined);
          if (hasValue) count++;
        } else {
          count++;
        }
      }
    });
    setActiveFiltersCount(count);
  }, [values]);

  const renderFilter = (filter: FilterGroup) => {
    const currentValue = values[filter.id];

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className={cn('space-y-2', !compact && 'w-full')}>
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <select
              value={currentValue || ''}
              onChange={(e) => onChange(filter.id, e.target.value)}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-lg',
                'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200',
                compact && 'py-1.5 text-sm'
              )}
            >
              <option value="">{filter.placeholder || `Select ${filter.label}`}</option>
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                  {option.count !== undefined && ` (${option.count})`}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filter.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(currentValue) && currentValue.includes(option.value)}
                    onChange={(e) => {
                      const currentArray = Array.isArray(currentValue) ? currentValue : [];
                      if (e.target.checked) {
                        onChange(filter.id, [...currentArray, option.value]);
                      } else {
                        onChange(filter.id, currentArray.filter((v: string) => v !== option.value));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'range':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {filter.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={currentValue?.min || ''}
                onChange={(e) => onChange(filter.id, { ...currentValue, min: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-lg',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200',
                  compact && 'py-1.5 text-sm'
                )}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={currentValue?.max || ''}
                onChange={(e) => onChange(filter.id, { ...currentValue, max: e.target.value })}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-lg',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200',
                  compact && 'py-1.5 text-sm'
                )}
              />
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={filter.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={filter.id}
              checked={currentValue || false}
              onChange={(e) => onChange(filter.id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={filter.id} className="text-sm font-medium text-gray-700 cursor-pointer">
              {filter.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className={cn('flex items-center space-x-4', className)}>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto">
          {filters.slice(0, 3).map((filter) => renderFilter(filter))}
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex-shrink-0"
          >
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg shadow border border-gray-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-3 w-3 mr-1" />
              Reset All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={cn(
        'transition-all duration-200',
        isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-0 overflow-hidden'
      )}>
        <div className="p-4 space-y-4">
          {filters.map((filter) => renderFilter(filter))}
        </div>
      </div>

      {/* Quick Filter Tags */}
      {activeFiltersCount > 0 && !isExpanded && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {Object.entries(values).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.id === key);
              if (!filter) return null;

              const getDisplayValue = () => {
                if (Array.isArray(value)) {
                  return value.length > 1 ? `${value.length} selected` : 
                        filter.options?.find(o => o.value === value[0])?.label || value[0];
                }
                if (typeof value === 'object') {
                  const rangeValues = Object.values(value).filter(v => v !== '' && v !== null && v !== undefined);
                  return rangeValues.length > 0 ? 'Custom range' : null;
                }
                return filter.options?.find(o => o.value === value)?.label || value;
              };

              const displayValue = getDisplayValue();
              if (!displayValue) return null;

              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  <span>{filter.label}: {displayValue}</span>
                  <button
                    onClick={() => onChange(key, filter.type === 'multiselect' ? [] : '')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
