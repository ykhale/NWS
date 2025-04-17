import axios from 'axios';
import { checkAndSendStateAlerts } from './emailService';

interface NOAAAlert {
  id: string;
  properties: {
    event: string;
    areaDesc: string;
    sent: string;
    severity: string;
    certainty: string;
    urgency: string;
    description: string;
    instruction: string;
    effective: string;
    expires: string;
    status: string;
    messageType: string;
    category: string;
  };
  geometry?: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

export const fetchWeatherAlerts = async (): Promise<NOAAAlert[]> => {
  try {
    const response = await axios.get('https://api.weather.gov/alerts/active');
    const alerts = response.data.features;

    // Check each alert for state-based subscriptions
    for (const alert of alerts) {
      await checkAndSendStateAlerts(alert.properties);
    }

    return alerts;
  } catch (error) {
    console.error('Error fetching NOAA data:', error);
    throw new Error('Failed to fetch weather alerts from NOAA');
  }
}; 