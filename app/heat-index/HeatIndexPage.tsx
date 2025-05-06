'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { getHeatRiskZonesFromAPI } from '@/lib/heatService';

// Import heat map component dynamically without SSR
const HeatMapWithNoSSR = dynamic(() => import('@/components/HeatMap'), {
    ssr: false,
});

interface HeatZone {
    id: string;
    bounds: [number, number][];
    level: number;
    region: string;
}

// Lookup table for all US states
const stateCenters: Record<string, { center: [number, number], zoom: number }> = {
    AL: { center: [32.8067, -86.7911], zoom: 7 },
    AK: { center: [61.3707, -152.4044], zoom: 4 },
    AZ: { center: [33.7298, -111.4312], zoom: 6 },
    AR: { center: [34.9697, -92.3731], zoom: 7 },
    CA: { center: [36.7783, -119.4179], zoom: 5 },
    CO: { center: [39.5501, -105.7821], zoom: 6 },
    CT: { center: [41.6032, -73.0877], zoom: 8 },
    DE: { center: [38.9108, -75.5277], zoom: 9 },
    FL: { center: [27.9944, -81.7603], zoom: 6 },
    GA: { center: [32.1656, -82.9001], zoom: 7 },
    HI: { center: [21.0943, -157.4983], zoom: 7 },
    ID: { center: [44.2405, -114.4788], zoom: 6 },
    IL: { center: [40.3495, -88.9861], zoom: 7 },
    IN: { center: [39.8494, -86.2583], zoom: 7 },
    IA: { center: [42.0115, -93.2105], zoom: 7 },
    KS: { center: [38.5266, -96.7265], zoom: 7 },
    KY: { center: [37.6681, -84.6701], zoom: 7 },
    LA: { center: [31.1695, -91.8678], zoom: 7 },
    ME: { center: [44.6939, -69.3819], zoom: 7 },
    MD: { center: [39.0639, -76.8021], zoom: 8 },
    MA: { center: [42.2302, -71.5301], zoom: 8 },
    MI: { center: [43.3266, -84.5361], zoom: 6 },
    MN: { center: [45.6945, -93.9002], zoom: 6 },
    MS: { center: [32.7416, -89.6787], zoom: 7 },
    MO: { center: [38.4561, -92.2884], zoom: 7 },
    MT: { center: [46.9219, -110.4544], zoom: 6 },
    NE: { center: [41.1254, -98.2681], zoom: 7 },
    NV: { center: [38.3135, -117.0554], zoom: 6 },
    NH: { center: [43.4525, -71.5639], zoom: 8 },
    NJ: { center: [40.2989, -74.5210], zoom: 8 },
    NM: { center: [34.8405, -106.2485], zoom: 6 },
    NY: { center: [42.1657, -74.9481], zoom: 6 },
    NC: { center: [35.6301, -79.8064], zoom: 7 },
    ND: { center: [47.5289, -99.7840], zoom: 6 },
    OH: { center: [40.3888, -82.7649], zoom: 7 },
    OK: { center: [35.5653, -96.9289], zoom: 7 },
    OR: { center: [44.5720, -122.0709], zoom: 6 },
    PA: { center: [40.5908, -77.2098], zoom: 7 },
    RI: { center: [41.6809, -71.5118], zoom: 9 },
    SC: { center: [33.8569, -80.9450], zoom: 7 },
    SD: { center: [44.2998, -99.4388], zoom: 6 },
    TN: { center: [35.7478, -86.6923], zoom: 7 },
    TX: { center: [31.0545, -97.5635], zoom: 5 },
    UT: { center: [40.1500, -111.8624], zoom: 6 },
    VT: { center: [44.0459, -72.7107], zoom: 8 },
    VA: { center: [37.7693, -78.1700], zoom: 7 },
    WA: { center: [47.4009, -121.4905], zoom: 6 },
    WV: { center: [38.4912, -80.9546], zoom: 7 },
    WI: { center: [44.2685, -89.6165], zoom: 6 },
    WY: { center: [42.7559, -107.3025], zoom: 6 },
    DC: { center: [38.9072, -77.0369], zoom: 10 },
};

export default function HeatIndexPage() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([37.8, -96]);
    const [mapZoom, setMapZoom] = useState(4);
    const [selectedState, setSelectedState] = useState<string>('');
    const [loadingData, setLoadingData] = useState(false);
    const [heatZones, setHeatZones] = useState<HeatZone[]>([]);

    // Effect to fetch heat zone data based on selected state
    useEffect(() => {
        async function fetchHeatData() {
            setLoadingData(true);
            try {
                // Build query parameters
                const params = new URLSearchParams();
                if (selectedState) {
                    params.append('state', selectedState);
                }
                // Always use today's date
                const today = new Date().toISOString().split('T')[0];
                params.append('date', today);

                // Fetch data from our API
                const response = await fetch(`/api/weather/heatrisk?${params.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch heat data');
                }

                const data = await response.json();
                if (!data.points || data.points.length === 0) {
                    console.warn('No heat data points received');
                    setHeatZones([]);
                } else {
                    // Transform the points into heat zones
                    const zones = data.points.map((point: any) => ({
                        id: `zone-${point.region}`,
                        bounds: [
                            [point.latitude - 0.5, point.longitude - 0.5],
                            [point.latitude + 0.5, point.longitude + 0.5]
                        ],
                        level: point.value,
                        region: `ZIP ${point.region}`
                    }));
                    setHeatZones(zones);
                }
            } catch (error) {
                console.error('Error fetching heat data:', error);
                setHeatZones([]);
            } finally {
                setLoadingData(false);
            }
        }

        fetchHeatData();
    }, [selectedState]);

    // Handler for state selection
    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedState(event.target.value);

        const stateInfo = stateCenters[event.target.value];
        if (stateInfo) {
            setMapCenter(stateInfo.center);
            setMapZoom(stateInfo.zoom);
        } else {
            setMapCenter([37.8, -96]);
            setMapZoom(4);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section style={{ position: 'relative', padding: '3rem 0', backgroundColor: '#e53e3e', color: 'white' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.3, zIndex: 0 }}>
                    <Image
                        src="https://images.pexels.com/photos/712392/pexels-photo-712392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Heat wave"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Heat Index Map</h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '42rem', margin: '0 auto' }}>
                        Monitor extreme heat conditions across the United States with our interactive heat index map.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section style={{ padding: '2rem 0', backgroundColor: '#f9fafb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                            Current Heat Conditions
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <label htmlFor="state-filter" style={{ color: '#374151', fontWeight: '500', marginRight: '0.5rem' }}>
                                    Filter by State:
                                </label>
                                <select
                                    id="state-filter"
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    style={{
                                        backgroundColor: 'white',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        padding: '0.5rem 1rem',
                                        color: '#111827'
                                    }}
                                >
                                    <option value="">All States</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="CA">California</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="IL">Illinois (Chicago, Springfield, Rockford)</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana (Billings, Missoula, Great Falls)</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota (Fargo, Bismarck, Grand Forks)</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota (Sioux Falls, Rapid City, Aberdeen)</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah (Salt Lake City, Provo, Ogden)</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming (Cheyenne, Casper, Laramie)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Heat Index Legend */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Heat Index Legend</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#FFFFFF', border: '1px solid #ccc' }}></div>
                                <span>Level 0: Little to no heat</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#FFFF00' }}></div>
                                <span>Level 1: Mild heat</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#FFA500' }}></div>
                                <span>Level 2: Moderate heat</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#FF4500' }}></div>
                                <span>Level 3: High heat</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '1.5rem', height: '1.5rem', backgroundColor: '#FF0000' }}></div>
                                <span>Level 4: Extreme heat</span>
                            </div>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {loadingData && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '8rem' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '50%',
                                border: '4px solid #e5e7eb',
                                borderTopColor: '#3b82f6',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                    )}

                    {/* Heat Map */}
                    {!loadingData && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            height: '600px',
                        }}>
                            <HeatMapWithNoSSR center={mapCenter} zoom={mapZoom} heatZones={heatZones} />
                        </div>
                    )}

                    {/* Heat Safety Tips */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        padding: '1.5rem',
                        marginTop: '2rem',
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Heat Safety Tips</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>For Extreme Heat (Level 4)</h4>
                                <ul style={{ paddingLeft: '1.5rem' }}>
                                    <li>Stay indoors in air-conditioned areas</li>
                                    <li>Drink plenty of water, even if not thirsty</li>
                                    <li>Avoid outdoor activities, especially during peak hours</li>
                                    <li>Check on elderly or vulnerable individuals</li>
                                    <li>Never leave children or pets in vehicles</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>For High Heat (Level 3)</h4>
                                <ul style={{ paddingLeft: '1.5rem' }}>
                                    <li>Limit outdoor activities to morning and evening</li>
                                    <li>Take frequent breaks if working outdoors</li>
                                    <li>Wear lightweight, light-colored clothing</li>
                                    <li>Use sunscreen with SPF 15 or higher</li>
                                    <li>Drink water regularly throughout the day</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Signs of Heat-Related Illness</h4>
                                <ul style={{ paddingLeft: '1.5rem' }}>
                                    <li>Headache, dizziness, or fainting</li>
                                    <li>Excessive sweating or hot, dry skin</li>
                                    <li>Nausea or vomiting</li>
                                    <li>Rapid heartbeat</li>
                                    <li>Confusion or disorientation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            < section style={{ padding: '4rem 0', backgroundColor: '#f3f4f6' }
            }>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Stay Informed</h2>
                    <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '48rem', margin: '0 auto 2rem' }}>
                        Get personalized heat alerts delivered straight to your inbox. Subscribe to our alert system today.
                    </p>
                    <Link
                        href="/subscribe"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#e53e3e',
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
            </section >
        </div >
    );
}