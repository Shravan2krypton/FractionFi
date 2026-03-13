'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme, resolvedTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  const getNextThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Dark';
      case 'dark':
        return 'System';
      case 'system':
        return 'Light';
      default:
        return 'Light';
    }
  };

  const currentLabel = getLabel();
  const nextLabel = getNextThemeLabel();
  const icon = getIcon();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        resolvedTheme === 'dark' 
          ? 'bg-gray-800 text-gray-100 border-gray-700' 
          : 'bg-white text-gray-900 border-gray-200'
      )}
      title={`Current theme: ${currentLabel}. Click to switch to ${nextLabel}`}
    >
      <div className="relative flex items-center space-x-2">
        {icon}
        <span className="hidden sm:inline text-xs font-medium">
          {currentLabel}
        </span>
      </div>
      
      {/* Animated theme indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={cn(
          'w-2 h-2 rounded-full transition-all duration-300',
          resolvedTheme === 'dark' 
            ? 'bg-blue-500' 
            : 'bg-gray-300'
        )} />
      </div>
    </button>
  );
}
