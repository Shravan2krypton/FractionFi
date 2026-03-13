'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'asset';
  category?: string;
  icon?: React.ReactNode;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  showSuggestions?: boolean;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  suggestions = [],
  onSuggestionClick,
  showSuggestions = true,
  debounceMs = 300
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim() && showSuggestions) {
        const filtered = suggestions.filter(suggestion =>
          suggestion.text.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setIsOpen(filtered.length > 0 || recentSearches.length > 0);
      } else if (!value.trim() && recentSearches.length > 0) {
        // Show recent searches when input is empty
        const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 5).map(search => ({
          id: `recent-${search}`,
          text: search,
          type: 'recent'
        }));
        setFilteredSuggestions(recentSuggestions);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, suggestions, recentSearches, showSuggestions, debounceMs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        } else if (value.trim()) {
          saveToRecentSearches(value.trim());
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    saveToRecentSearches(suggestion.text);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSuggestionClick?.(suggestion);
  };

  const saveToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    setFilteredSuggestions([]);
    setIsOpen(false);
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    if (suggestion.icon) return suggestion.icon;
    
    switch (suggestion.type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'asset':
        return <Search className="h-4 w-4 text-gray-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Recent';
      case 'popular':
        return 'Popular';
      case 'asset':
        return 'Asset';
      default:
        return '';
    }
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (!value.trim() && recentSearches.length > 0) {
              const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 5).map(search => ({
                id: `recent-${search}`,
                text: search,
                type: 'recent'
              }));
              setFilteredSuggestions(recentSuggestions);
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all duration-200',
            'bg-white text-gray-900 placeholder-gray-500',
            'hover:border-gray-400'
          )}
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
              setHighlightedIndex(-1);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className={cn(
          'absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50',
          'max-h-80 overflow-y-auto'
        )}>
          {/* Recent Searches Header */}
          {!value.trim() && recentSearches.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Recent Searches</span>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {/* Suggestions List */}
          <div className="py-1">
            {filteredSuggestions.length === 0 && value.trim() ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions found</p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors',
                    'text-left border-b border-gray-50 last:border-b-0',
                    highlightedIndex === index && 'bg-blue-50'
                  )}
                >
                  {getSuggestionIcon(suggestion)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </div>
                    {suggestion.category && (
                      <div className="text-xs text-gray-500">
                        {suggestion.category}
                      </div>
                    )}
                  </div>
                  {suggestion.type && (
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      suggestion.type === 'recent' && 'bg-gray-100 text-gray-600',
                      suggestion.type === 'popular' && 'bg-blue-100 text-blue-600',
                      suggestion.type === 'asset' && 'bg-green-100 text-green-600'
                    )}>
                      {getSuggestionTypeLabel(suggestion.type)}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Search Hint */}
          {value.trim() && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd> to search, 
                <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded text-xs ml-1">↑↓</kbd> to navigate
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
