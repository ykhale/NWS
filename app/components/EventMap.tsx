'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface EventWithRelations {
  id: string;
  type: string;
  severity: string;
  date: Date;
  description: string;
  stateId: string;
  state: {
    id: string;
    name: string;
  };
  zipCode: {
    id: string;
    code: string;
    city: string;
    latitude: number;
    longitude: number;
  } | null;
  data: any;
}

interface EventMapProps {
  events: EventWithRelations[];
}

export default function EventMap({ events }: EventMapProps) {
  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[37.0902, -95.7129]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map((event) => {
          if (event.zipCode) {
            return (
              <Marker
                key={event.id}
                position={[event.zipCode.latitude, event.zipCode.longitude]}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold capitalize">
                      {event.type.toLowerCase()}
                    </h3>
                    <p>{event.description}</p>
                    <p className="text-sm">
                      {event.date.toLocaleDateString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
} 