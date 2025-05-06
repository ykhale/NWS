import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const NOAA_HEADERS = {
    'User-Agent': 'WeatherAlertSystem/1.0 (samantharol303@gmail.com)',
    'Accept': 'application/json'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const majorCities = [
  { name: 'New York, NY', state: 'NY', lat: 40.7128, lon: -74.0060 },
  { name: 'Los Angeles, CA', state: 'CA', lat: 34.0522, lon: -118.2437 },
  { name: 'Chicago, IL', state: 'IL', lat: 41.8781, lon: -87.6298 },
  { name: 'Houston, TX', state: 'TX', lat: 29.7604, lon: -95.3698 },
  { name: 'Phoenix, AZ', state: 'AZ', lat: 33.4484, lon: -112.0740 },
  { name: 'Philadelphia, PA', state: 'PA', lat: 39.9526, lon: -75.1652 },
  { name: 'San Antonio, TX', state: 'TX', lat: 29.4241, lon: -98.4936 },
  { name: 'San Diego, CA', state: 'CA', lat: 32.7157, lon: -117.1611 },
  { name: 'Dallas, TX', state: 'TX', lat: 32.7767, lon: -96.7970 },
  { name: 'San Jose, CA', state: 'CA', lat: 37.3382, lon: -121.8863 },
  { name: 'Austin, TX', state: 'TX', lat: 30.2672, lon: -97.7431 },
  { name: 'Jacksonville, FL', state: 'FL', lat: 30.3322, lon: -81.6557 },
  { name: 'Fort Worth, TX', state: 'TX', lat: 32.7555, lon: -97.3308 },
  { name: 'Columbus, OH', state: 'OH', lat: 39.9612, lon: -82.9988 },
  { name: 'Charlotte, NC', state: 'NC', lat: 35.2271, lon: -80.8431 },
  { name: 'San Francisco, CA', state: 'CA', lat: 37.7749, lon: -122.4194 },
  { name: 'Indianapolis, IN', state: 'IN', lat: 39.7684, lon: -86.1581 },
  { name: 'Seattle, WA', state: 'WA', lat: 47.6062, lon: -122.3321 },
  { name: 'Denver, CO', state: 'CO', lat: 39.7392, lon: -104.9903 },
  { name: 'Washington, DC', state: 'DC', lat: 38.9072, lon: -77.0369 },
  { name: 'Boston, MA', state: 'MA', lat: 42.3601, lon: -71.0589 },
  { name: 'El Paso, TX', state: 'TX', lat: 31.7619, lon: -106.4850 },
  { name: 'Nashville, TN', state: 'TN', lat: 36.1627, lon: -86.7816 },
  { name: 'Detroit, MI', state: 'MI', lat: 42.3314, lon: -83.0458 },
  { name: 'Oklahoma City, OK', state: 'OK', lat: 35.4676, lon: -97.5164 },
  { name: 'Portland, OR', state: 'OR', lat: 45.5051, lon: -122.6750 },
  { name: 'Las Vegas, NV', state: 'NV', lat: 36.1699, lon: -115.1398 },
  { name: 'Memphis, TN', state: 'TN', lat: 35.1495, lon: -90.0490 },
  { name: 'Louisville, KY', state: 'KY', lat: 38.2527, lon: -85.7585 },
  { name: 'Baltimore, MD', state: 'MD', lat: 39.2904, lon: -76.6122 },
  { name: 'Milwaukee, WI', state: 'WI', lat: 43.0389, lon: -87.9065 },
  { name: 'Albuquerque, NM', state: 'NM', lat: 35.0844, lon: -106.6504 },
  { name: 'Tucson, AZ', state: 'AZ', lat: 32.2226, lon: -110.9747 },
  { name: 'Fresno, CA', state: 'CA', lat: 36.7378, lon: -119.7871 },
  { name: 'Mesa, AZ', state: 'AZ', lat: 33.4152, lon: -111.8315 },
  { name: 'Sacramento, CA', state: 'CA', lat: 38.5816, lon: -121.4944 },
  { name: 'Atlanta, GA', state: 'GA', lat: 33.7490, lon: -84.3880 },
  { name: 'Kansas City, MO', state: 'MO', lat: 39.0997, lon: -94.5786 },
  { name: 'Colorado Springs, CO', state: 'CO', lat: 38.8339, lon: -104.8214 },
  { name: 'Omaha, NE', state: 'NE', lat: 41.2565, lon: -95.9345 },
  { name: 'Raleigh, NC', state: 'NC', lat: 35.7796, lon: -78.6382 },
  { name: 'Miami, FL', state: 'FL', lat: 25.7617, lon: -80.1918 },
  { name: 'Minneapolis, MN', state: 'MN', lat: 44.9778, lon: -93.2650 },
  { name: 'Tulsa, OK', state: 'OK', lat: 36.1539, lon: -95.9928 },
  { name: 'Wichita, KS', state: 'KS', lat: 37.6872, lon: -97.3301 },
  { name: 'New Orleans, LA', state: 'LA', lat: 29.9511, lon: -90.0715 },
  { name: 'Arlington, TX', state: 'TX', lat: 32.7357, lon: -97.1081 },
  { name: 'Cleveland, OH', state: 'OH', lat: 41.4993, lon: -81.6944 },
  { name: 'Bakersfield, CA', state: 'CA', lat: 35.3733, lon: -119.0187 },
  { name: 'Tampa, FL', state: 'FL', lat: 27.9506, lon: -82.4572 },
  { name: 'Aurora, CO', state: 'CO', lat: 39.7294, lon: -104.8319 },
  { name: 'Honolulu, HI', state: 'HI', lat: 21.3069, lon: -157.8583 },
  { name: 'Anchorage, AK', state: 'AK', lat: 61.2181, lon: -149.9003 },
];

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        const allPoints: any[] = [];
        const batchSize = 10;
        for (let i = 0; i < majorCities.length; i += batchSize) {
            const batch = majorCities.slice(i, i + batchSize);
            await Promise.allSettled(batch.map(async (city) => {
                try {
                    const pointUrl = `https://api.weather.gov/points/${city.lat},${city.lon}`;
                    const pointRes = await axios.get(pointUrl, { headers: NOAA_HEADERS });
                    const forecastGridUrl = pointRes.data?.properties?.forecastGridData;
                    if (!forecastGridUrl) return;
                    const gridRes = await axios.get(forecastGridUrl, { headers: NOAA_HEADERS });
                    const values = gridRes.data?.properties?.apparentTemperature?.values || [];
                    let filteredValues = values;
                    if (date) {
                        filteredValues = values.filter((entry: any) => {
                            const entryDateStr = entry.validTime.split('T')[0];
                            return entryDateStr === date;
                        });
                    }
                    if (filteredValues.length > 0) {
                        const value = filteredValues[0];
                        const point = {
                            latitude: city.lat,
                            longitude: city.lon,
                            value: Math.min(Math.floor(value.value / 10), 4),
                            region: city.name
                        };
                        allPoints.push(point);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(`Error fetching data for city ${city.name}:`, {
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            data: error.response?.data
                        });
                    } else {
                        console.error(`Error fetching data for city ${city.name}:`, error);
                    }
                }
            }));
            await delay(150); // 150ms pause between batches
        }

        if (allPoints.length === 0) {
            console.warn('No points were successfully fetched from NOAA API');
        } else {
            console.log(`Successfully fetched ${allPoints.length} points`);
        }

        return NextResponse.json({ points: allPoints });
    } catch (err: any) {
        console.error('Error generating heat risk zones:', err.message);
        return NextResponse.json({ error: 'Server failed to build heat zones' }, { status: 500 });
    }
}
