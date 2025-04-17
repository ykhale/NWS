'use client';

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Feature, Geometry } from 'geojson';

// Fix for Leaflet's default icon issues
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIconPng.src,
  shadowUrl: markerShadowPng.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

interface MapProps {
  center: [number, number];
  zoom: number;
  warning: Warning | null;
}

// Component to handle map center and zoom updates
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

const Map = ({ center, zoom, warning }: MapProps) => {
  useEffect(() => {
    // This is needed to fix the map rendering issues in Next.js
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIconPng.src,
      shadowUrl: markerShadowPng.src,
    });
  }, []);

  // Style function for the GeoJSON layer
  const style = {
    color: '#ff4444',
    weight: 2,
    opacity: 0.6,
    fillOpacity: 0.1
  };

  // Convert warning to GeoJSON feature
  const warningToGeoJSON = (warning: Warning): Feature => ({
    type: 'Feature',
    properties: warning.properties,
    geometry: warning.geometry as Geometry
  });

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater center={center} zoom={zoom} />
        {warning && warning.geometry && (
          <GeoJSON
            key={warning.id}
            data={warningToGeoJSON(warning)}
            style={style}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map; 