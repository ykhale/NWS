/**
 * Home Page
 * 
 * The main landing page of the application.
 * Features:
 * - Hero section with call-to-action
 * - Overview of weather alert system
 * - Key features and benefits
 * - Testimonials or statistics
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import WarningsList from '../components/WarningsList';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import Image from 'next/image';

// Load the Map component without server-side rendering (Leaflet needs the browser)
const MapWithNoSSR = dynamic(() => import('../components/Map'), { ssr: false });

interface Warning {
  id: string;
  properties: {
    event: string;
    areaDesc: string;
    severity: string;
    certainty: string;
    urgency: string;
    description: string;
    instruction: string;
    effective: string;
    expires: string;
  };
  geometry?: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

export default function Home() {
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.8, -96]);
  const [mapZoom, setMapZoom] = useState(4);

  const handleWarningSelect = (warning: Warning) => {
    setSelectedWarning(warning);
    
    // If the warning has geometry, calculate the center point
    if (warning.geometry) {
      let coordinates: number[];
      if (warning.geometry.type === 'Point') {
        coordinates = warning.geometry.coordinates as number[];
      } else if (warning.geometry.type === 'Polygon' && Array.isArray(warning.geometry.coordinates[0])) {
        // For polygons, calculate the center point of the first ring
        const ring = warning.geometry.coordinates[0] as number[][];
        const lats = ring.map(coord => coord[1]);
        const lngs = ring.map(coord => coord[0]);
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        coordinates = [centerLng, centerLat];
      } else {
        return;
      }

      if (coordinates && coordinates.length >= 2) {
        const [lng, lat] = coordinates;
        setMapCenter([lat, lng]);
        setMapZoom(9); // Zoom in closer when a warning is selected
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ 
        backgroundColor: '#1e40af', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div className="hero-content" style={{ width: '100%', maxWidth: '800px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Stay Safe with Real-Time Weather Alerts
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', 
            marginBottom: '2rem', 
            maxWidth: '42rem', 
            margin: '0 auto 2rem',
            padding: '0 1rem'
          }}>
            Get instant notifications about severe weather events directly to your inbox.
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            alignItems: 'center',
            padding: '0 1rem'
          }}>
            <Link href="/subscribe" className="btn btn-secondary" style={{ 
              padding: '1rem 2rem', 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              Subscribe Now
            </Link>
            <Link href="#how-it-works" className="btn" style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderColor: 'white', 
              borderWidth: '2px', 
              color: 'white', 
              padding: '1rem 2rem', 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <h2 className="text-center" style={{ 
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', 
            marginBottom: '4rem', 
            color: '#1f2937',
            padding: '0 1rem'
          }}>
            Why Choose Our Alert System?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem', padding: '0 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '5rem', height: '5rem', backgroundColor: '#dbeafe', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2.5rem', width: '2.5rem', color: '#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Real-Time Alerts</h3>
              <p style={{ color: '#6b7280' }}>Receive immediate notifications about severe weather events as they develop.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '5rem', height: '5rem', backgroundColor: '#dbeafe', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2.5rem', width: '2.5rem', color: '#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Location Specific</h3>
              <p style={{ color: '#6b7280' }}>Customize alerts by state to only receive notifications relevant to you.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '5rem', height: '5rem', backgroundColor: '#dbeafe', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '2.5rem', width: '2.5rem', color: '#2563eb' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Detailed Information</h3>
              <p style={{ color: '#6b7280' }}>Get comprehensive weather event details including severity, instructions, and timing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: 'clamp(2rem, 5vw, 5rem) 1rem', 
        background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
        color: 'white' 
      }}>
        <div className="container text-center">
          <h2 style={{ 
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', 
            fontWeight: '700', 
            marginBottom: '1.5rem' 
          }}>
            Ready to Stay Informed?
          </h2>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
            marginBottom: '2.5rem', 
            maxWidth: '42rem', 
            margin: '0 auto 2.5rem',
            padding: '0 1rem'
          }}>
            Join thousands of users who rely on our service for critical weather updates.
          </p>
          <Link href="/subscribe" className="btn btn-secondary" style={{ 
            padding: '1rem 2rem', 
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            display: 'inline-block',
            width: '100%',
            maxWidth: '300px',
            textAlign: 'center'
          }}>
            Subscribe Now
          </Link>
        </div>
      </section>
    </div>
  );
}
