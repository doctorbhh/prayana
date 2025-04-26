import React, { useEffect, useRef, useState } from 'react';
import { Location, LOCATIONS } from '@/services/bikeService';
import { Card } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  fromLocationId: string | null;
  toLocationId: string | null;
}

const MapView: React.FC<MapViewProps> = ({ fromLocationId, toLocationId }) => {
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize the map and add markers for all locations from LOCATIONS
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Define fixed location for VIT-AP
    const vitApPosition: [number, number] = [16.494776, 80.499138]; // VIT-AP, Amaravati

    // Center the map on VIT-AP with a closer zoom level
    const center: [number, number] = vitApPosition;
    const zoom = 16; // Closer zoom to focus on VIT-AP

    // Initialize the map
    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Add marker for VIT-AP
  

    // Add a marker for each location from LOCATIONS
    LOCATIONS.forEach(location => {
      const marker = L.marker([location.lat, location.lng], {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup(location.name);
      markersRef.current.push(marker);
    });

    // Clean up on unmount
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
    };
  }, []);

  // Update fromLocation and toLocation
  useEffect(() => {
    if (fromLocationId) {
      const location = LOCATIONS.find(loc => loc.id === fromLocationId) || null;
      setFromLocation(location);
    } else {
      setFromLocation(null);
    }

    if (toLocationId) {
      const location = LOCATIONS.find(loc => loc.id === toLocationId) || null;
      setToLocation(location);
    } else {
      setToLocation(null);
    }
  }, [fromLocationId, toLocationId]);

  // Update markers and polyline based on fromLocation and toLocation
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing pickup and dropoff markers
    markersRef.current.forEach(marker => {
      if (marker.getPopup()?.getContent()?.includes('(Pickup)') || marker.getPopup()?.getContent()?.includes('(Dropoff)')) {
        marker.remove();
      }
    });
    markersRef.current = markersRef.current.filter(
      marker => !marker.getPopup()?.getContent()?.includes('(Pickup)') && !marker.getPopup()?.getContent()?.includes('(Dropoff)')
    );
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Add marker for fromLocation (pickup)
    if (fromLocation) {
      const fromMarker = L.marker([fromLocation.lat, fromLocation.lng], {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup(`${fromLocation.name} (Pickup)`);
      markersRef.current.push(fromMarker);
    }

    // Add marker for toLocation (dropoff)
    if (toLocation) {
      const toMarker = L.marker([toLocation.lat, toLocation.lng], {
        icon: new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup(`${toLocation.name} (Dropoff)`);
      markersRef.current.push(toMarker);
    }

    // Draw a line between fromLocation and toLocation if both are selected
    if (fromLocation && toLocation) {
      const routePositions: [number, number][] = [
        [fromLocation.lat, fromLocation.lng],
        [toLocation.lat, toLocation.lng],
      ];
      polylineRef.current = L.polyline(routePositions, {
        color: '#1EAEDB',
        weight: 3,
        dashArray: '6,6',
        className: 'animate-pulse',
      }).addTo(mapRef.current);
    }
  }, [fromLocation, toLocation]);

  return (
    <Card className="map-container w-full h-64 md:h-96 bg-ebike-softBlue">
      <div className="h-full w-full relative">
        <div
          ref={mapContainerRef}
          style={{ height: '100%', width: '100%' }}
          className="z-0 rounded-lg"
        />

        {/* Overlay for placeholder message */}
        {(!fromLocation && !toLocation) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center text-gray-500 bg-white bg-opacity-80 p-4 rounded-lg">
              <div className="mb-2 text-ebike-dark">Select locations to view on map</div>
              <div className="text-sm">Your route will appear here</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MapView;