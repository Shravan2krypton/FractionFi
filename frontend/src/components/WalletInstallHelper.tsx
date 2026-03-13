'use client';

import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertTriangle, Smartphone } from 'lucide-react';

export const WalletInstallHelper: React.FC = () => {
  const [selectedBrowser, setSelectedBrowser] = useState('');

  const browsers = [
    {
      name: 'Chrome',
      icon: '🌐',
      downloadUrl: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkdbfnpdlbmf?hl=en',
      instructions: [
        'Click "Add to Chrome"',
        'Pin extension to toolbar',
        'Refresh the page after installation'
      ]
    },
    {
      name: 'Firefox',
      icon: '🦊',
      downloadUrl: 'https://addons.mozilla.org/en-US/firefox/addon/metamask/nkbihfbeogaeaoehlefnkdbfnpdlbmf',
      instructions: [
        'Click "Add to Firefox"',
        'Grant permissions when prompted',
        'Refresh the page after installation'
      ]
    },
    {
      name: 'Brave',
      icon: '🦁',
      downloadUrl: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkdbfnpdlbmf?hl=en',
      instructions: [
        'Brave uses Chrome extensions',
        'Install from Chrome Web Store',
        'Enable in Brave extensions'
      ]
    },
    {
      name: 'Edge',
      icon: '📘',
      downloadUrl: 'https://microsoftedge.microsoft.com/addons/detail/metamask/nkbihfbeogaeaoehlefnkdbfnpdlbmf',
      instructions: [
        'Click "Get" for Edge',
        'Install extension',
        'Refresh the page after installation'
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="mb-6">
          <Smartphone className="h-16 w-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Web3 Wallet Required
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            To use FractionFi, you need a Web3 wallet like MetaMask
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Select Your Browser
            </h2>
            <div className="space-y-3">
              {browsers.map((browser) => (
                <button
                  key={browser.name}
                  onClick={() => setSelectedBrowser(browser.name)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedBrowser === browser.name
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{browser.icon}</span>
                    <span className="font-medium">{browser.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Install MetaMask
            </h2>
            
            {selectedBrowser ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Download MetaMask for {selectedBrowser}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-medium text-blue-900 mb-2">Step 1: Download</h4>
                    <p className="text-sm text-blue-700">
                      Click the button below to visit the official MetaMask download page
                    </p>
                    <a
                      href={browsers.find(b => b.name === selectedBrowser)?.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Download MetaMask
                    </a>
                  </div>

                  <div className="bg-green-50 p-4 rounded">
                    <h4 className="font-medium text-green-900 mb-2">Step 2: Install</h4>
                    <p className="text-sm text-green-700">
                      Follow the installation instructions for {selectedBrowser}
                    </p>
                    <ul className="list-decimal list-inside space-y-2 text-sm text-green-600 mt-2">
                      {browsers.find(b => b.name === selectedBrowser)?.instructions?.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded">
                    <h4 className="font-medium text-yellow-900 mb-2">Step 3: Verify & Connect</h4>
                    <p className="text-sm text-yellow-700">
                      After installation, refresh this page and click "Connect Wallet"
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Page
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-yellow-900 mb-2">
                  Select Your Browser First
                </h3>
                <p className="text-sm text-yellow-700">
                  Please select your browser from the options above to get specific installation instructions.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-100 rounded-lg p-6 inline-block">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              🔐 Security Reminder
            </h3>
            <ul className="text-left text-sm text-gray-600 space-y-1">
              <li>• Only download from official sources</li>
              <li>• Never share your seed phrase or private key</li>
              <li>• Bookmark the official FractionFi site</li>
              <li>• Enable two-factor authentication on your wallet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
