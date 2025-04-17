'use client';

import { useEffect, useState } from 'react';
import { fetchCurrentAlerts } from '@/lib/noaa';

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
}

export default function CurrentAlerts() {
  const [alerts, setAlerts] = useState<NOAAAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const currentAlerts = await fetchCurrentAlerts();
        setAlerts(currentAlerts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
    // Refresh alerts every 5 minutes
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (alert: NOAAAlert) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          alert: alert.properties,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to alerts');
      }

      setSubscriptionStatus('Successfully subscribed to alerts!');
      setEmail('');
    } catch (err) {
      setSubscriptionStatus('Failed to subscribe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>Loading current alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 rounded-lg">
        <h3 className="font-semibold text-yellow-800">No active alerts</h3>
        <p className="text-yellow-600">Check back for updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Subscribe to Alerts</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 p-2 border rounded"
          />
        </div>
        {subscriptionStatus && (
          <p className={`mt-2 text-sm ${subscriptionStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {subscriptionStatus}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg ${
              alert.properties.severity === 'Extreme'
                ? 'bg-red-100'
                : alert.properties.severity === 'Severe'
                ? 'bg-orange-100'
                : 'bg-yellow-100'
            }`}
          >
            <h3 className="font-semibold capitalize text-lg">
              {alert.properties.event}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(alert.properties.effective).toLocaleString()}
            </p>
            <p className="mt-2">{alert.properties.description}</p>
            <p className="text-sm mt-1">
              <strong>Area:</strong> {alert.properties.areaDesc}
            </p>
            <p className="text-sm">
              <strong>Severity:</strong> {alert.properties.severity}
            </p>
            <p className="text-sm">
              <strong>Certainty:</strong> {alert.properties.certainty}
            </p>
            <p className="text-sm">
              <strong>Urgency:</strong> {alert.properties.urgency}
            </p>
            {alert.properties.instruction && (
              <p className="text-sm mt-2">
                <strong>Instructions:</strong> {alert.properties.instruction}
              </p>
            )}
            <p className="text-sm mt-2">
              <strong>Expires:</strong>{' '}
              {new Date(alert.properties.expires).toLocaleString()}
            </p>
            <button
              onClick={() => handleSubscribe(alert)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Subscribe to this Alert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 