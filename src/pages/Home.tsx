import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import LocationSelectionSection from '@/components/LocationSelectionSection';
import MapView from '@/components/MapView';
import Timer from '@/components/Timer';
import RideControls from '@/components/RideControls';
import { 
  findAvailableBike, 
  startBikeRental, 
  endBikeRental,
  calculateDistance,
  LOCATIONS
} from '@/services/bikeService';
import { db } from '@/config/firebase';
import { ref, get, set, update } from 'firebase/database';

const Home = () => {
  const { currentUser, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [isRiding, setIsRiding] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [bikeId, setBikeId] = useState<string | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      // Fetch the user's name and balance from the Realtime Database
      const fetchUserData = async () => {
        try {
          const userRef = ref(db, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserName(userData.name || currentUser.email?.split('@')[0] || 'User');
            setUserBalance(userData.balance || 0);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserName(currentUser.email?.split('@')[0] || 'User');
          setUserBalance(0);
        }
      };
      fetchUserData();
    }
  }, [currentUser, navigate]);

  const handleStartRide = async () => {
    if (!fromLocation || !toLocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both pickup and drop-off locations"
      });
      return;
    }

    console.log("Finding available bike at location:", fromLocation);
    const bike = await findAvailableBike(fromLocation);
    
    if (!bike) {
      toast({
        variant: "destructive",
        title: "No Bikes Available",
        description: "Sorry, there are no bikes available at this location"
      });
      return;
    }
    
    const fromLoc = LOCATIONS.find(loc => loc.id === fromLocation);
    const toLoc = LOCATIONS.find(loc => loc.id === toLocation);
    
    if (fromLoc && toLoc) {
      const calculatedDistance = calculateDistance(
        fromLoc.lat, fromLoc.lng, 
        toLoc.lat, toLoc.lng
      );
      setDistance(calculatedDistance);
    }
    
    const success = await startBikeRental(bike.id);
    
    if (success) {
      setBikeId(bike.id);
      setStartTime(new Date());
      setIsRiding(true);
    }
  };

  const handleEndRide = async (fare: number) => {
    if (!bikeId || !toLocation || !startTime || !currentUser) return;
    
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.ceil(durationMs / 1000 / 60); // Convert to minutes and round up

    const success = await endBikeRental(bikeId, toLocation);
    
    if (success) {
      toast({
        title: "Ride Completed",
        description: `Your total fare is $${fare.toFixed(2)}`
      });

      // Update user's balance
      const newBalance = Math.max(0, userBalance - fare);
      setUserBalance(newBalance);

      // Store ride details in the database
      const rideId = `ride_${Date.now()}`;
      await set(ref(db, `rides/${currentUser.uid}/${rideId}`), {
        bikeId,
        fromLocation,
        toLocation,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMinutes,
        distanceKm: distance,
        fare,
        timestamp: new Date().toISOString()
      });

      // Update user's balance in the database
      await update(ref(db, `users/${currentUser.uid}`), {
        balance: newBalance
      });

      setIsRiding(false);
      setBikeId(null);
      setStartTime(null);
      setTimeout(() => {
        setFromLocation('');
        setToLocation('');
        setDistance(0);
      }, 3000);
    }
  };

  if (!currentUser) {
    return null;
  }

  // Create a user object for Header.tsx
  const userForHeader = {
    name: userName,
    email: currentUser.email || '',
    balance: userBalance
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={userForHeader} logout={signOut} />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6">
          <section className="space-y-6">
            <div className="flex justify-between items-center space-y-2">
              <div>
                <h1 className="text-2xl font-bold text-ebike-dark">
                  Welcome, {userName.split(' ')[0]}!
                </h1>
                <p className="text-gray-500">Where would you like to ride today?</p>
              </div>
            </div>

            <LocationSelectionSection
              fromLocation={fromLocation}
              toLocation={toLocation}
              setFromLocation={setFromLocation}
              setToLocation={setToLocation}
              isRiding={isRiding}
            />

            <MapView 
              fromLocationId={fromLocation || null}
              toLocationId={toLocation || null}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Timer 
                  isActive={isRiding}
                  bikeId={bikeId}
                  startTime={startTime}
                  distanceKm={distance}
                  onComplete={handleEndRide}
                />
              </div>
              
              <div className="md:col-span-2 flex items-center">
                <RideControls 
                  isRiding={isRiding}
                  fromLocation={fromLocation}
                  toLocation={toLocation}
                  handleStartRide={handleStartRide}
                  handleEndRide={handleEndRide}
                  distance={distance}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;