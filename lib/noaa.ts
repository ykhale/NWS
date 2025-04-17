import { EventType, Severity } from '@prisma/client';

const NOAA_API_KEY = process.env.NOAA_API_KEY;
const NOAA_BASE_URL = 'https://www.ncdc.noaa.gov/cdo-web/api/v2';

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

export async function fetchCurrentAlerts(): Promise<NOAAAlert[]> {
  if (!NOAA_API_KEY) {
    throw new Error('NOAA_API_KEY is not set in environment variables');
  }

  try {
    const response = await fetch('https://api.weather.gov/alerts/active', {
      headers: {
        'User-Agent': 'HurricaneMonitor/1.0',
        'Accept': 'application/geo+json',
      },
    });

    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.features;
  } catch (error) {
    console.error('Error fetching NOAA alerts:', error);
    return [];
  }
}

export function mapNOAAAlertToEvent(alert: NOAAAlert) {
  // Map NOAA severity to our severity enum
  const severityMap: Record<string, Severity> = {
    'Extreme': Severity.EXTREME,
    'Severe': Severity.SEVERE,
    'Moderate': Severity.MODERATE,
    'Minor': Severity.MINOR,
  };

  // Map NOAA event type to our event type enum
  const eventTypeMap: Record<string, EventType> = {
    'Hurricane': EventType.HURRICANE,
    'Tornado': EventType.TORNADO,
    'Flood': EventType.FLOOD,
    'Hail': EventType.HAIL,
    'Storm': EventType.STORM,
  };

  return {
    type: eventTypeMap[alert.properties.event] || EventType.OTHER,
    severity: severityMap[alert.properties.severity] || Severity.MINOR,
    date: new Date(alert.properties.effective),
    description: alert.properties.description,
    data: {
      area: alert.properties.areaDesc,
      certainty: alert.properties.certainty,
      urgency: alert.properties.urgency,
      instructions: alert.properties.instruction,
      expires: alert.properties.expires,
    },
  };
} 