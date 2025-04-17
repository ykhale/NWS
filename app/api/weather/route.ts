import { NextResponse } from 'next/server';
import { fetchWeatherAlerts } from '../../../lib/noaaService';

export async function GET() {
  try {
    const alerts = await fetchWeatherAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather alerts' },
      { status: 500 }
    );
  }
} 