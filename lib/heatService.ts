/**
 * Heat Service
 * 
 * Service to handle heat-related data and operations.
 * Features:
 * - Fetch heat zone data from external APIs
 * - Calculate heat index based on temperature and humidity
 * - Generate heat level classifications
 * - Format heat data for display
*/

import axios from 'axios';

// Interface for heat zone data
export interface HeatZone {
    id: string;
    bounds: [number, number][]; // [[lat1, lng1], [lat2, lng2]]
    level: number; // 0-4 heat level
    region: string;
}

// Interface for API response
interface HeatIndexAPIResponse {
    zones: Array<{
        id: string;
        region: string;
        coordinates: {
            ne: { lat: number; lng: number };
            sw: { lat: number; lng: number };
        };
        heatIndex: number;
        temperature: number;
        relativeHumidity: number;
    }>;
}

// Get a human-readable description of the heat level
export function getHeatLevelDescription(level: number): string {
    switch (level) {
        case 0:
            return 'Little to no heat risk';
        case 1:
            return 'Mild heat - Caution';
        case 2:
            return 'Moderate heat - Extreme Caution';
        case 3:
            return 'High heat - Danger';
        case 4:
            return 'Extreme heat - Extreme Danger';
        default:
            return 'Unknown level';
    }
}

// Get color based on heat level
export function getHeatColor(level: number): string {
    switch (level) {
        case 0:
            return '#FFFFFF'; // White - little to no heat
        case 1:
            return '#FFFF00'; // Yellow - mild heat
        case 2:
            return '#FFA500'; // Orange - moderate heat
        case 3:
            return '#FF4500'; // OrangeRed - high heat
        case 4:
            return '#FF0000'; // Red - extreme heat
        default:
            return '#CCCCCC'; // Default gray
    }
}

// Get opacity based on heat level
export function getHeatOpacity(level: number): number {
    switch (level) {
        case 0:
            return 0.1;
        case 1:
            return 0.3;
        case 2:
            return 0.5;
        case 3:
            return 0.7;
        case 4:
            return 0.8;
        default:
            return 0.5;
    }
}

// Mock data generator for demo purposes
function getMockHeatZones(stateCode?: string): HeatZone[] {
    // Default zones that show across the US
    const defaultZones: HeatZone[] = [
        {
            id: '1',
            bounds: [[33.5, -117.5], [34.5, -116.5]],
            level: 4,
            region: 'Southern California'
        },
        {
            id: '2',
            bounds: [[33.0, -115.5], [34.0, -114.5]],
            level: 4,
            region: 'Arizona Border'
        },
        {
            id: '3',
            bounds: [[35.5, -119.5], [36.5, -118.5]],
            level: 3,
            region: 'Central California'
        },
        {
            id: '4',
            bounds: [[32.5, -106.5], [33.5, -105.5]],
            level: 4,
            region: 'New Mexico'
        },
        {
            id: '5',
            bounds: [[33.5, -102.5], [34.5, -101.5]],
            level: 3,
            region: 'Texas Panhandle'
        },
        {
            id: '6',
            bounds: [[30.5, -98.5], [31.5, -97.5]],
            level: 4,
            region: 'Central Texas'
        },
        {
            id: '7',
            bounds: [[25.5, -82.5], [26.5, -81.5]],
            level: 3,
            region: 'Southern Florida'
        },
        {
            id: '8',
            bounds: [[28.5, -82.5], [29.5, -81.5]],
            level: 4,
            region: 'Central Florida'
        },
        {
            id: '9',
            bounds: [[35.5, -78.5], [36.5, -77.5]],
            level: 2,
            region: 'North Carolina'
        },
        {
            id: '10',
            bounds: [[41.5, -73.5], [42.5, -72.5]],
            level: 1,
            region: 'New England'
        }
    ];

    // State-specific zones - add more states as needed
    if (stateCode === 'CA') {
        return [
            {
                id: 'ca1',
                bounds: [[33.5, -117.5], [34.5, -116.5]],
                level: 4,
                region: 'Southern California'
            },
            {
                id: 'ca2',
                bounds: [[34.0, -118.5], [35.0, -117.5]],
                level: 4,
                region: 'Los Angeles Area'
            },
            {
                id: 'ca3',
                bounds: [[35.5, -119.5], [36.5, -118.5]],
                level: 3,
                region: 'Central California'
            },
            {
                id: 'ca4',
                bounds: [[37.5, -122.5], [38.5, -121.5]],
                level: 2,
                region: 'San Francisco Bay Area'
            },
            {
                id: 'ca5',
                bounds: [[39.5, -121.5], [40.5, -120.5]],
                level: 3,
                region: 'Northern California'
            },
            {
                id: 'ca6',
                bounds: [[32.5, -115.5], [33.5, -114.5]],
                level: 4,
                region: 'Imperial Valley'
            }
        ];
    } else if (stateCode === 'FL') {
        return [
            {
                id: 'fl1',
                bounds: [[25.5, -82.5], [26.5, -81.5]],
                level: 3,
                region: 'Southern Florida'
            },
            {
                id: 'fl2',
                bounds: [[28.5, -82.5], [29.5, -81.5]],
                level: 4,
                region: 'Central Florida'
            },
            {
                id: 'fl3',
                bounds: [[30.5, -87.5], [31.5, -86.5]],
                level: 3,
                region: 'Northwestern Florida'
            },
            {
                id: 'fl4',
                bounds: [[26.5, -80.5], [27.5, -79.5]],
                level: 3,
                region: 'Miami Area'
            },
            {
                id: 'fl5',
                bounds: [[27.5, -82.5], [28.5, -81.5]],
                level: 3,
                region: 'Tampa Area'
            }
        ];
    } else if (stateCode === 'TX') {
        return [
            {
                id: 'tx1',
                bounds: [[30.5, -98.5], [31.5, -97.5]],
                level: 4,
                region: 'Central Texas'
            },
            {
                id: 'tx2',
                bounds: [[33.5, -102.5], [34.5, -101.5]],
                level: 3,
                region: 'Texas Panhandle'
            },
            {
                id: 'tx3',
                bounds: [[29.5, -95.5], [30.5, -94.5]],
                level: 4,
                region: 'Houston Area'
            },
            {
                id: 'tx4',
                bounds: [[31.5, -106.5], [32.5, -105.5]],
                level: 3,
                region: 'El Paso Area'
            },
            {
                id: 'tx5',
                bounds: [[27.5, -98.5], [28.5, -97.5]],
                level: 4,
                region: 'South Texas'
            }
        ];
    }

    // Return default zones if no state is specified or state not found
    return defaultZones;
}

export async function getHeatRiskZonesFromAPI(): Promise<HeatZone[]> {
    try {
        const response = await fetch('/api/weather/heatrisk');
        const data = await response.json();
        const rawPoints = data?.points || [];

        return rawPoints.map((point: any, index: number) => ({
            id: `zone-${index}`, // ✅ No longer tied to state
            bounds: [
                [point.latitude - 0.55, point.longitude - 0.55],
                [point.latitude + 0.55, point.longitude + 0.55],
            ],
            level: Math.min(Math.floor(point.value), 4),
            region: point.region || 'Unknown',
        }));
    } catch (error) {
        console.error('Error fetching heat risk zones from API:', error);
        return [];
    }
}

export default {
    getHeatRiskZonesFromAPI,
    getHeatColor,
    getHeatOpacity,
    getHeatLevelDescription
};