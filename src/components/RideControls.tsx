
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bike } from 'lucide-react';
import { calculateFare } from '@/services/bikeService';

interface RideControlsProps {
  isRiding: boolean;
  fromLocation: string;
  toLocation: string;
  handleStartRide: () => Promise<void>;
  handleEndRide: (fare: number) => Promise<void>;
  distance: number;
}

const RideControls: React.FC<RideControlsProps> = ({
  isRiding,
  fromLocation,
  toLocation,
  handleStartRide,
  handleEndRide,
  distance
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {isRiding ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-medium">Your ride is in progress</div>
              <p className="text-sm text-gray-500">
                The timer will automatically stop when you reach your destination or if the bike goes offline.
              </p>
            </div>
            <Button 
              onClick={() => handleEndRide(calculateFare(distance / 60, distance))}
              className="w-full bg-ebike-accent hover:bg-red-600"
            >
              End Ride Early
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Bike size={48} className="text-ebike-primary" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ebike-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-ebike-accent"></span>
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-medium">Ready to ride?</div>
              <p className="text-sm text-gray-500 mt-1">
                Select your pickup and drop-off locations to start.
              </p>
            </div>
            
            <Button 
              onClick={handleStartRide}
              disabled={!fromLocation || !toLocation}
              className="w-full btn-primary"
            >
              Start Ride
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideControls;
