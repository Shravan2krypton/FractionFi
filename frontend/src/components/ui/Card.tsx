'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/styles/design-tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md',
    hover = true,
    children,
    ...props 
  }, ref) => {
    const baseClasses = [
      'rounded-2xl transition-all duration-300',
    ];

    const variantClasses = {
      default: [
        'bg-white border border-gray-200',
        hover && 'hover:shadow-xl hover:border-gray-300'
      ],
      outlined: [
        'bg-white border-2 border-gray-300',
        hover && 'hover:shadow-lg hover:border-blue-400'
      ],
      elevated: [
        'bg-white border border-gray-100 shadow-lg',
        hover && 'hover:shadow-2xl hover:-translate-y-1'
      ],
      glass: [
        'bg-white/80 backdrop-blur-xl border border-white/20',
        hover && 'hover:bg-white/90 hover:shadow-2xl'
      ],
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      className
    );

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
