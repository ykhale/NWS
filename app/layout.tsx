/**
 * Root Layout Component
 * 
 * This is the root layout component that wraps all pages in the application.
 * It provides:
 * - Global styles and fonts
 * - Theme support (dark/light mode)
 * - Authentication context
 * - Toast notifications
 * - Navigation and footer
 */

'use client';

import './globals.css';
import Link from 'next/link';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <header className="relative bg-white shadow-sm">
          <div className="container">
            <div className="flex justify-between items-center py-4 px-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{ color: 'var(--primary)' }}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                    />
                  </svg>
                  <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }} className="hidden sm:inline">
                    Emergency Weather Reporter
                  </span>
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Desktop navigation */}
              <nav className="hidden md:flex space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md hover:bg-gray-100">Home</Link>
                <Link href="/alerts" className="px-3 py-2 rounded-md hover:bg-gray-100">Current Alerts</Link>
                <Link href="/heat-index" className="px-3 py-2 rounded-md hover:bg-gray-100">Heat Index</Link>
                <Link href="/subscribe" className="px-3 py-2 rounded-md hover:bg-gray-100">Subscribe</Link>
              </nav>
            </div>

            {/* Mobile navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                  <Link
                    href="/"
                    className="block px-3 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/alerts"
                    className="block px-3 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Current Alerts
                  </Link>
                  <Link
                    href="/heat-index"
                    className="block px-3 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Heat Index
                  </Link>
                  <Link
                    href="/subscribe"
                    className="block px-3 py-2 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subscribe
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-gray-900 text-white">
          <div className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <div>
                <div className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    style={{ color: '#60a5fa' }}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
                    />
                  </svg>
                  <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    Emergency Weather Reporter
                  </span>
                </div>
                <p className="mt-4 text-gray-400">
                  Stay informed about severe weather with real-time email alerts customized to your location.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/alerts" className="text-gray-400 hover:text-white transition-colors">
                      Current Alerts
                    </Link>
                  </li>
                  <li>
                    <Link href="/heat-index" className="text-gray-400 hover:text-white transition-colors">
                      Heat Index
                    </Link>
                  </li>
                  <li>
                    <Link href="/subscribe" className="text-gray-400 hover:text-white transition-colors">
                      Subscribe
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Data Sources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://www.weather.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      National Weather Service
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.nhc.noaa.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      National Hurricane Center
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Emergency Weather Reporter. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
