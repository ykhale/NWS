/**
 * Alerts Page
 * 
 * Displays current weather alerts and warnings.
 * Features:
 * - Interactive map showing alert locations
 * - Filterable list of active alerts
 * - Detailed alert information
 * - State-based filtering
 * - Real-time updates
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Import map component dynamically without SSR
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

interface NOAAAlert {
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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<NOAAAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<NOAAAlert | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [states, setStates] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch('https://api.weather.gov/alerts/active');

        if (!response.ok) {
          throw new Error(`Failed to fetch alerts: ${response.statusText}`);
        }

        const data = await response.json();
        setAlerts(data.features);

        // Extract unique states from alerts
        const stateSet = new Set<string>();
        data.features.forEach((alert: NOAAAlert) => {
          const state = alert.properties.areaDesc.split(',').pop()?.trim();
          if (state) stateSet.add(state);
        });
        setStates(Array.from(stateSet).sort());

        setError(null);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update map when an alert is selected
    if (selectedAlert && selectedAlert.geometry) {
      const { type } = selectedAlert.geometry;

      try {
        // Handle different geometry types
        if (type === 'Point') {
          // Handle Point geometry
          handlePointGeometry(selectedAlert.geometry.coordinates);
        } else if (type === 'Polygon') {
          // Handle Polygon geometry
          handlePolygonGeometry(selectedAlert.geometry.coordinates);
        } else if (type === 'MultiPolygon') {
          // Handle MultiPolygon geometry
          handleMultiPolygonGeometry(selectedAlert.geometry.coordinates);
        } else {
          // Default fallback if geometry type is not recognized
          console.warn(`Unsupported geometry type: ${type}`);
          setDefaultMapView();
        }
      } catch (error) {
        console.error('Error centering map:', error);
        setDefaultMapView();
      }
    }
  }, [selectedAlert]);

  // Helper functions for different geometry types
  const handlePointGeometry = (coordinates: any) => {
    if (Array.isArray(coordinates) && coordinates.length === 2 &&
      typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
      setMapCenter([coordinates[1], coordinates[0]]);
      setMapZoom(8);
    } else {
      setDefaultMapView();
    }
  };

  const handlePolygonGeometry = (coordinates: any) => {
    if (Array.isArray(coordinates) && coordinates.length > 0 && Array.isArray(coordinates[0])) {
      const ring = coordinates[0];
      if (Array.isArray(ring) && ring.length > 0) {
        // Calculate center of polygon (simple average of coordinates)
        let sumLat = 0;
        let sumLng = 0;

        ring.forEach(coord => {
          if (Array.isArray(coord) && coord.length >= 2) {
            sumLat += coord[1];
            sumLng += coord[0];
          }
        });

        if (ring.length > 0) {
          setMapCenter([sumLat / ring.length, sumLng / ring.length]);
          setMapZoom(7);
        } else {
          setDefaultMapView();
        }
      } else {
        setDefaultMapView();
      }
    } else {
      setDefaultMapView();
    }
  };

  const handleMultiPolygonGeometry = (coordinates: any) => {
    if (Array.isArray(coordinates) && coordinates.length > 0 &&
      Array.isArray(coordinates[0]) && coordinates[0].length > 0) {
      const firstPolygon = coordinates[0];

      if (Array.isArray(firstPolygon) && firstPolygon.length > 0 &&
        Array.isArray(firstPolygon[0])) {
        const ring = firstPolygon[0];

        if (Array.isArray(ring) && ring.length > 0) {
          // Calculate center of the first polygon (simple average of coordinates)
          let sumLat = 0;
          let sumLng = 0;

          ring.forEach(coord => {
            if (Array.isArray(coord) && coord.length >= 2) {
              sumLat += coord[1];
              sumLng += coord[0];
            }
          });

          if (ring.length > 0) {
            setMapCenter([sumLat / ring.length, sumLng / ring.length]);
            setMapZoom(6); // Zoom out a bit more for MultiPolygon which tend to cover larger areas
          } else {
            setDefaultMapView();
          }
        } else {
          setDefaultMapView();
        }
      } else {
        setDefaultMapView();
      }
    } else {
      setDefaultMapView();
    }
  };

  const setDefaultMapView = () => {
    // Use a default center for the US
    setMapCenter([39.8283, -98.5795]);
    setMapZoom(4);
  };

  const filteredAlerts = selectedState
    ? alerts.filter(alert => alert.properties.areaDesc.includes(selectedState))
    : alerts;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Extreme':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'Severe':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'Moderate':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '3rem 0', backgroundColor: '#1e40af', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, zIndex: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1534274988757-a28bf1a57c17"
            alt="Storm clouds"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Current Weather Alerts</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '42rem', margin: '0 auto' }}>
            Stay informed about active weather alerts across the United States.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: '2rem 0', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                border: '4px solid #e5e7eb',
                borderTopColor: '#3b82f6',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : error ? (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
              <p>Error loading alerts: {error}</p>
              <p style={{ marginTop: '0.5rem' }}>Please try again later.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                    {filteredAlerts.length} Active Alert{filteredAlerts.length === 1 ? '' : 's'}
                  </h2>
                  {selectedState && (
                    <p style={{ color: '#6b7280' }}>Filtered by: {selectedState}</p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label htmlFor="state-filter" style={{ color: '#374151', fontWeight: '500' }}>
                    Filter by State:
                  </label>
                  <select
                    id="state-filter"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      color: '#111827'
                    }}
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem' }}>
                {/* Alert List */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  height: '700px',
                  overflow: 'auto'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    Alert List
                  </h3>

                  {filteredAlerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <p style={{ color: '#6b7280' }}>No active alerts found.</p>
                      {selectedState && (
                        <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Try selecting a different state.</p>
                      )}
                    </div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {filteredAlerts.map((alert) => {
                        const bgColor = alert.properties.severity === 'Extreme' ? '#fee2e2' :
                          alert.properties.severity === 'Severe' ? '#ffedd5' :
                            '#fef3c7';
                        const borderColor = alert.properties.severity === 'Extreme' ? '#ef4444' :
                          alert.properties.severity === 'Severe' ? '#f97316' :
                            '#f59e0b';
                        const textColor = alert.properties.severity === 'Extreme' ? '#991b1b' :
                          alert.properties.severity === 'Severe' ? '#9a3412' :
                            '#92400e';

                        return (
                          <li
                            key={alert.id}
                            onClick={() => setSelectedAlert(alert)}
                            style={{
                              padding: '0.75rem',
                              borderLeft: `4px solid ${borderColor}`,
                              backgroundColor: selectedAlert?.id === alert.id ? `${bgColor}50` : bgColor,
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              boxShadow: selectedAlert?.id === alert.id ? '0 0 0 2px #3b82f6' : 'none'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: textColor }}>{alert.properties.event}</div>
                            <div style={{ fontSize: '0.875rem' }}>{alert.properties.areaDesc}</div>
                            <div style={{ fontSize: '0.75rem' }}>
                              Expires: {new Date(alert.properties.expires).toLocaleString()}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Map and Alert Details */}
                <div>
                  {/* Map Component */}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    marginBottom: '1.5rem',
                    height: '400px'
                  }}>
                    <MapWithNoSSR center={mapCenter} zoom={mapZoom} warning={selectedAlert} />
                  </div>

                  {/* Alert Details */}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    padding: '1.5rem'
                  }}>
                    {selectedAlert ? (
                      <div>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          backgroundColor: selectedAlert.properties.severity === 'Extreme' ? '#fee2e2' :
                            selectedAlert.properties.severity === 'Severe' ? '#ffedd5' :
                              '#fef3c7',
                          color: selectedAlert.properties.severity === 'Extreme' ? '#991b1b' :
                            selectedAlert.properties.severity === 'Severe' ? '#9a3412' :
                              '#92400e'
                        }}>
                          {selectedAlert.properties.severity} Severity
                        </div>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                          {selectedAlert.properties.event}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem' }}>Area</h3>
                            <p style={{ fontWeight: '500' }}>{selectedAlert.properties.areaDesc}</p>
                          </div>
                          <div>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem' }}>Status</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <span style={{ fontWeight: '500' }}>Certainty: {selectedAlert.properties.certainty}</span>
                              <span>•</span>
                              <span style={{ fontWeight: '500' }}>Urgency: {selectedAlert.properties.urgency}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem' }}>Effective</h3>
                            <p style={{ fontWeight: '500' }}>
                              {new Date(selectedAlert.properties.effective).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expires</h3>
                            <p style={{ fontWeight: '500' }}>
                              {new Date(selectedAlert.properties.expires).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <h3 style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem' }}>Description</h3>
                          <p style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem', color: '#374151' }}>
                            {selectedAlert.properties.description}
                          </p>
                        </div>

                        {selectedAlert.properties.instruction && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#374151', fontWeight: '600', marginBottom: '0.5rem' }}>Instructions</h3>
                            <p style={{
                              backgroundColor: '#f9fafb',
                              padding: '1rem',
                              borderRadius: '0.375rem',
                              color: '#374151',
                              borderLeft: '4px solid #3b82f6'
                            }}>
                              {selectedAlert.properties.instruction}
                            </p>
                          </div>
                        )}

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                          <Link
                            href={`/subscribe?state=${selectedAlert.properties.areaDesc.split(',').pop()?.trim()}`}
                            style={{
                              backgroundColor: '#2563eb',
                              color: 'white',
                              padding: '0.5rem 1.5rem',
                              borderRadius: '0.375rem',
                              textDecoration: 'none',
                              fontWeight: '500',
                              transition: 'background-color 0.2s'
                            }}
                          >
                            Subscribe to Similar Alerts
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        padding: '3rem 0',
                        textAlign: 'center'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '4rem', width: '4rem', marginBottom: '1rem', color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>Select an Alert</p>
                        <p style={{ maxWidth: '20rem' }}>
                          Click on an alert from the list to view detailed information.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f3f4f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Stay Informed</h2>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto 2rem' }}>
            Get personalized weather alerts delivered straight to your inbox. Subscribe to our alert system today.
          </p>
          <Link
            href="/subscribe"
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            Subscribe Now
          </Link>
        </div>
      </section>
    </div>
  );
} 