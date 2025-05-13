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

import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Weather Alert System',
  description: 'Stay informed about severe weather with real-time alerts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header>
          <div className="container">
            <div className="flex justify-between items-center py-4">
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
                  <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                    Weather Alert System
                  </span>
                </Link>
              </div>
              <nav className="flex">
                <Link href="/">Home</Link>
                <Link href="/alerts">Current Alerts</Link>
                <Link href="/heat-index">Heat Index</Link>
                <Link href="/subscribe">Subscribe</Link>
              </nav>
            </div>
          </div>
        </header>

        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>

        <footer>
          <div className="container py-8">
            <div className="grid grid-cols-1 grid-cols-3 gap-8">
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
                    Weather Alert System
                  </span>
                </div>
                <p style={{ marginTop: '1rem', color: '#9ca3af' }}>
                  Stay informed about severe weather with real-time email alerts customized to your location.
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Quick Links
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                      Home
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/alerts" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                      Current Alerts
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/heat-index" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                      Heat Index
                    </Link>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <Link href="/subscribe" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                      Subscribe
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Data Sources
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a 
                      href="https://www.weather.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                    >
                      National Weather Service
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a 
                      href="https://www.nhc.noaa.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                    >
                      National Hurricane Center
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #374151', textAlign: 'center', color: '#9ca3af' }}>
              <p>&copy; {new Date().getFullYear()} Weather Alert System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
