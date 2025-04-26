import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Timer as TimerIcon } from 'lucide-react';
import { calculateFare } from '@/services/bikeService';

interface TimerProps {
  isActive: boolean;
  bikeId: string | null;
  startTime: Date | null;
  distanceKm: number;
  onComplete: (fare: number) => void;
}

const Timer: React.FC<TimerProps> = ({ 
  isActive, 
  bikeId, 
  startTime, 
  distanceKm,
  onComplete 
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };
  
  useEffect(() => {
    if (isActive && startTime) {
      setIsRunning(true);
      
      const initialSeconds = startTime 
        ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        : 0;
      setSeconds(initialSeconds);
    } else {
      setIsRunning(false);
    }
    
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [isActive, startTime]);
  
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const estimatedCost = calculateFare(seconds / 60, distanceKm);

  return (
    <Card className={`p-4 ${isActive ? 'border-ebike-primary' : ''}`}>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1 text-ebike-primary" />
            <span>Trip Duration</span>
          </div>
          {isActive && <span className="text-xs font-medium px-2 py-1 bg-ebike-primary text-white rounded-full animate-pulse">Active</span>}
        </div>
        
        <div className="timer-display">
          <TimerIcon className={`h-6 w-6 ${isActive ? 'text-ebike-primary' : 'text-gray-400'}`} />
          <span className={isActive ? 'text-ebike-dark' : 'text-gray-400'}>
            {formatTime(seconds)}
          </span>
        </div>
        
        {isActive && (
          <div className="text-sm mt-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{distanceKm.toFixed(2)} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated cost:</span>
              <span className="font-medium">${estimatedCost.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Timer;
