'use client';

import React from 'react';
import { ExternalLink, Download, AlertCircle } from 'lucide-react';

export const MetaMaskGuide: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Install MetaMask Wallet
          </h3>
          <p className="text-blue-700 mb-4">
            MetaMask is required to connect your wallet and make blockchain transactions.
          </p>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Chrome/Brave/Firefox</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">metamask.io</a></li>
                <li>Click "Download" button</li>
                <li>Install the browser extension</li>
                <li>Refresh this page after installation</li>
              </ol>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              <li>Only install from the official MetaMask website</li>
              <li>Never share your seed phrase or private key</li>
              <li>MetaMask will ask for permission to connect to this site</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ MetaMask Request Pending</h4>
            <p className="text-sm text-yellow-700">
              MetaMask has a pending connection request for this site. This is a security measure.
            </p>
            <div className="space-y-2 text-sm text-yellow-600">
              <p>• Open MetaMask extension</p>
              <p>• Look for pending connection requests</p>
              <p>• Complete or cancel the pending request</p>
              <p>• Click "Connect Wallet" again after resolving</p>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Refresh Page After Installation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
