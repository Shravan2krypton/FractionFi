'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { animations } from '@/styles/animations';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getToastStyles = (type: Toast['type']) => {
    const baseStyles = 'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden';
    
    const typeStyles = {
      success: 'border-l-4 border-emerald-600',
      error: 'border-l-4 border-red-600',
      warning: 'border-l-4 border-amber-600',
      info: 'border-l-4 border-blue-600',
    };
    
    return cn(baseStyles, typeStyles[type]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={getToastStyles(toast.type)}
            style={{
              animation: 'slideInFromRight 0.3s ease-out',
            }}
          >
            <div className="flex p-4">
              <div className="flex-shrink-0">
                {getIcon(toast.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                {toast.title && (
                  <p className="text-sm font-medium text-gray-900">
                    {toast.title}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {toast.message}
                </p>
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeToast(toast.id)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook for easy toast usage
export function toast(type: Toast['type'], message: string, options?: Partial<Toast>) {
  const { addToast } = useToast();
  return addToast({ type, message, ...options });
}

// Convenience functions
export const success = (message: string, options?: Partial<Toast>) => toast('success', message, options);
export const error = (message: string, options?: Partial<Toast>) => toast('error', message, options);
export const warning = (message: string, options?: Partial<Toast>) => toast('warning', message, options);
export const info = (message: string, options?: Partial<Toast>) => toast('info', message, options);
