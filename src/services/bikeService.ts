import { db } from '@/config/firebase';
import { ref, get, set } from 'firebase/database';
export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}
export const LOCATIONS: Location[] = [
  { id: 'location1', name: 'Central Block', lat: 16.494812, lng: 80.499074 },
  { id: 'location2', name: 'AB-1', lat: 16.495239, lng: 80.500849 },
  { id: 'location3', name: 'AB-2', lat: 16.495679, lng: 80.498451 },
  { id: 'location4', name: 'FOOD-STREET', lat: 16.493725, lng: 80.498484 },
  { id: 'location5', name: 'Student Activity Centre (SAC)', lat: 16.494686, lng: 80.498317 },
  { id: 'location6', name: 'MAIN ENTRANCE', lat: 16.496720, lng: 80.499186 },
];
interface Bike {
  id: string;
  location: string;
  status: 'available' | 'in-use';
  lastUsed: string;
}

export const findAvailableBike = async (locationId: string): Promise<Bike | null> => {
  try {
    const bikesRef = ref(db, 'bikes');
    const snapshot = await get(bikesRef);
    
    if (snapshot.exists()) {
      const bikes = snapshot.val();
      const availableBike = Object.values(bikes as Record<string, Bike>)
        .find(bike => bike.location === locationId && bike.status === 'available');
      
      if (availableBike) {
        console.log(`Found available bike at ${locationId}:`, availableBike);
        return availableBike;
      }
    }
    console.log(`No available bikes at ${locationId}`);
    return null;
  } catch (error) {
    console.error("Error finding available bike:", error);
    return null;
  }
};

export const startBikeRental = async (bikeId: string): Promise<boolean> => {
  try {
    const bikeRef = ref(db, `bikes/${bikeId}`);
    await set(bikeRef, {
      id: bikeId,
      location: (await get(bikeRef)).val().location,
      status: 'in-use',
      lastUsed: new Date().toISOString()
    });
    console.log(`Bike ${bikeId} rental started`);
    return true;
  } catch (error) {
    console.error("Error starting bike rental:", error);
    return false;
  }
};

export const endBikeRental = async (bikeId: string, toLocation: string): Promise<boolean> => {
  try {
    const bikeRef = ref(db, `bikes/${bikeId}`);
    await set(bikeRef, {
      id: bikeId,
      location: toLocation,
      status: 'available',
      lastUsed: new Date().toISOString()
    });
    console.log(`Bike ${bikeId} rental ended at ${toLocation}`);
    return true;
  } catch (error) {
    console.error("Error ending bike rental:", error);
    return false;
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

export const calculateFare = (durationMinutes: number, distanceKm: number): number => {
  const baseRate = 1.00; // $1 to start the ride
  const ratePerMinute = 0.15; // $0.15 per minute
  const ratePerKm = 0.50; // $0.50 per km

  const durationCost = durationMinutes * ratePerMinute;
  const distanceCost = distanceKm * ratePerKm;
  const totalFare = baseRate + durationCost + distanceCost;

  return Number(totalFare.toFixed(2)); // Round to 2 decimal places
};