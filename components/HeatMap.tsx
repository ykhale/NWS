import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Rectangle, Tooltip, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getHeatColor, getHeatOpacity, getHeatLevelDescription } from '@/lib/heatService';

// Define the heatLevel type for our heat zones
interface HeatZone {
    id: string;
    bounds: L.LatLngBoundsExpression;
    level: number; // 0-4 where 0 is little to no heat and 4 is extreme heat
    region: string;
}

interface HeatMapProps {
    center: [number, number];
    zoom: number;
    heatZones?: HeatZone[];
}

// Component to update map view when props change
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
}

const HeatMap: React.FC<HeatMapProps> = ({ center, zoom, heatZones = [] }) => {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.Overlay checked name="Heat Index">
                        <>
                            {heatZones.map((zone) => (
                                <Rectangle
                                    key={zone.id}
                                    bounds={zone.bounds}
                                    pathOptions={{
                                        color: getHeatColor(zone.level),
                                        weight: 1,
                                        fillColor: getHeatColor(zone.level),
                                        fillOpacity: getHeatOpacity(zone.level),
                                    }}
                                >
                                    <Tooltip sticky>
                                        <div>
                                            <strong>{zone.region}</strong>
                                            <p>Heat Level: {zone.level} - {getHeatLevelDescription(zone.level)}</p>
                                        </div>
                                    </Tooltip>
                                </Rectangle>
                            ))}
                        </>
                    </LayersControl.Overlay>
                </LayersControl>

                <MapUpdater center={center} zoom={zoom} />
            </MapContainer>
        </div>
    );
};

export default HeatMap;