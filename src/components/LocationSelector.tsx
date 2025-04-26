import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { db } from '@/config/firebase';
import { ref, get } from 'firebase/database';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface LocationSelectorProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  excludeLocationId?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  id,
  value,
  onChange,
  excludeLocationId
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  
  useEffect(() => {
    // Fetch available locations from the database
    const fetchLocations = async () => {
      try {
        const locationsRef = ref(db, 'locations');
        const snapshot = await get(locationsRef);
        if (snapshot.exists()) {
          const locationsData = snapshot.val();
          const locationsArray = Object.values(locationsData) as Location[];
          setLocations(locationsArray);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        // Fallback to static locations if database fetch fails
        setLocations([
          { id: 'location1', name: 'Downtown', lat: 40.7128, lng: -74.0060 },
          { id: 'location2', name: 'Uptown', lat: 40.7831, lng: -73.9712 }
        ]);
      }
    };
    fetchLocations();
  }, []);
  
  const filteredLocations = excludeLocationId 
    ? locations.filter(location => location.id !== excludeLocationId)
    : locations;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-ebike-primary" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Locations</SelectLabel>
              {filteredLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;