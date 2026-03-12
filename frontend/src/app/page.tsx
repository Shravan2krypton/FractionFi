'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { TrendingUp, Building, Coins, Rocket, ArrowRight, Shield, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Invest in Fractional
              <span className="text-yellow-400"> High-Value Assets</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Own pieces of premium real estate, gold reserves, and promising startups. 
              Start investing with as little as ₹100 through blockchain-powered tokenization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Explore Assets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Building className="h-24 w-24" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Coins className="h-24 w-24" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FractionFi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Democratizing investment opportunities through blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Transparent</h3>
              <p className="text-gray-600">
                All transactions recorded on blockchain with complete transparency and immutable records.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Low Barrier Entry</h3>
              <p className="text-gray-600">
                Start investing with minimal amounts. No minimum investment requirements.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor your portfolio performance and asset values in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Invest in What Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from carefully curated high-value assets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <Building className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Estate</h3>
                <p className="text-gray-600 mb-4">
                  Invest in premium commercial and residential properties across major cities.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Rental income distribution</li>
                  <li>• Property appreciation</li>
                  <li>• Professional management</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <Coins className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Gold Reserves</h3>
                <p className="text-gray-600 mb-4">
                  Own fractions of securely stored physical gold with guaranteed authenticity.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Inflation hedge</li>
                  <li>• Secure vault storage</li>
                  <li>• Easy liquidity</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <Rocket className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Startups</h3>
                <p className="text-gray-600 mb-4">
                  Back innovative early-stage companies with high growth potential.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• High growth potential</li>
                  <li>• Diversified portfolio</li>
                  <li>• Exit opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How FractionFi Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your investment journey in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">
                Create your account and complete KYC verification
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-gray-600 text-sm">
                Link your MetaMask wallet for secure transactions
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Buy Tokens</h3>
              <p className="text-gray-600 text-sm">
                Purchase fractional tokens of your chosen assets
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Earn Returns</h3>
              <p className="text-gray-600 text-sm">
                Receive rental income and profit distributions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of investors already earning passive income through fractional ownership.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">FractionFi</span>
            </div>
            <p className="text-sm">
              © 2024 FractionFi. All rights reserved. | Blockchain-powered micro-investment platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
