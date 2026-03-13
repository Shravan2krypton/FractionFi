'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/styles/design-tokens';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ 
  variant = 'default', 
  size = 'md', 
  children, 
  className 
}: BadgeProps) {
  const baseClasses = [
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200',
  ];

  const variantClasses = {
    default: [
      'bg-gray-100 text-gray-800 border border-gray-200'
    ],
    success: [
      'bg-emerald-100 text-emerald-800 border border-emerald-200'
    ],
    warning: [
      'bg-amber-100 text-amber-800 border border-amber-200'
    ],
    error: [
      'bg-red-100 text-red-800 border border-red-200'
    ],
    info: [
      'bg-blue-100 text-blue-800 border border-blue-200'
    ],
    gradient: [
      'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0'
    ],
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <span className={classes}>
      {children}
    </span>
  );
}
