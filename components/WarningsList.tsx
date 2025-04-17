'use client';

import { useEffect, useState } from 'react';

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

interface WarningsListProps {
  onSelectWarning: (warning: Warning) => void;
}

export default function WarningsList({ onSelectWarning }: WarningsListProps) {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [states, setStates] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchWarnings() {
      try {
        const response = await fetch('https://api.weather.gov/alerts/active', {
          headers: {
            'User-Agent': 'HurricaneMonitor/1.0',
            'Accept': 'application/geo+json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch warnings: ${response.statusText}`);
        }

        const data = await response.json();
        setWarnings(data.features);
        
        // Extract unique states from warnings
        const stateSet = new Set<string>();
        data.features.forEach((warning: Warning) => {
          const state = warning.properties.areaDesc.split(',').pop()?.trim();
          if (state) stateSet.add(state);
        });
        setStates(stateSet);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching warnings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch warnings');
      } finally {
        setLoading(false);
      }
    }

    fetchWarnings();
    // Refresh warnings every 5 minutes
    const interval = setInterval(fetchWarnings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredWarnings = warnings.filter(warning => 
    !selectedState || warning.properties.areaDesc.includes(selectedState)
  );

  if (loading) {
    return <div>Loading warnings...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ 
      height: '500px', 
      overflowY: 'auto', 
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <style jsx>{`
        .warning-item {
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid #ddd;
          transition: transform 0.2s ease-in-out;
        }
        .warning-item:hover {
          transform: translateX(5px);
        }
      `}</style>

      <div style={{ marginBottom: '15px' }}>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        >
          <option value="">All States</option>
          {Array.from(states).sort().map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <div style={{ fontSize: '0.9em', color: '#666' }}>
          {filteredWarnings.length} warnings found
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredWarnings.map((warning) => (
          <div
            key={warning.id}
            onClick={() => onSelectWarning(warning)}
            className="warning-item"
            style={{
              backgroundColor: warning.properties.severity === 'Extreme' 
                ? '#ffebee' 
                : warning.properties.severity === 'Severe'
                ? '#fff3e0'
                : '#fff'
            }}
          >
            <h3 style={{ 
              margin: '0 0 5px 0',
              fontSize: '1em',
              color: warning.properties.severity === 'Extreme' 
                ? '#c62828' 
                : warning.properties.severity === 'Severe'
                ? '#ef6c00'
                : '#333'
            }}>
              {warning.properties.event}
            </h3>
            <p style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>
              {warning.properties.areaDesc}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.8em',
              marginTop: '5px',
              color: '#666'
            }}>
              <span>{warning.properties.severity}</span>
              <span>Expires: {new Date(warning.properties.expires).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 