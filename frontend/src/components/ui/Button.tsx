'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/styles/design-tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
    ];

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent',
        'hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg',
        'focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed'
      ],
      secondary: [
        'bg-white text-gray-900 border-gray-300',
        'hover:bg-gray-50 hover:border-gray-400 hover:shadow-md',
        'focus:ring-blue-500'
      ],
      outline: [
        'border-2 border-blue-600 text-blue-600 bg-transparent',
        'hover:bg-blue-50 hover:border-blue-700',
        'focus:ring-blue-500'
      ],
      ghost: [
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        'focus:ring-blue-500'
      ],
      danger: [
        'bg-gradient-to-r from-red-600 to-pink-600 text-white border-transparent',
        'hover:from-red-700 hover:to-pink-700 hover:shadow-lg',
        'focus:ring-red-500 disabled:from-gray-400 disabled:to-gray-500'
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8 8 0 01-8 8 0 018-8 8 0 01-8 8zm0 2a6 6 0 016-6 6 0 016-6 6 0 016-6 6zm0 2a4 4 0 018-4 4 0 018-4 4 0 018-4 4z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
