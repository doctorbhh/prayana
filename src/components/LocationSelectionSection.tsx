import React from 'react';
import { ArrowRight } from 'lucide-react';
import LocationSelector from './LocationSelector';

interface LocationSelectionSectionProps {
  fromLocation: string;
  toLocation: string;
  setFromLocation: (location: string) => void;
  setToLocation: (location: string) => void;
  isRiding: boolean;
}

const LocationSelectionSection: React.FC<LocationSelectionSectionProps> = ({
  fromLocation,
  toLocation,
  setFromLocation,
  setToLocation,
  isRiding
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LocationSelector
        label="Pickup Location"
        id="fromLocation"
        value={fromLocation}
        onChange={setFromLocation}
        excludeLocationId={isRiding ? undefined : toLocation}
      />
      
      <div className="flex items-center justify-center md:justify-start">
        <div className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-ebike-softBlue text-ebike-primary">
          <ArrowRight className="h-5 w-5" />
        </div>
        <div className="md:hidden h-10 flex items-center">
          <div className="w-full border-t border-dashed border-ebike-primary"></div>
        </div>
      </div>
      
      <div className="md:col-start-2">
        <LocationSelector
          label="Drop-off Location"
          id="toLocation"
          value={toLocation}
          onChange={setToLocation}
          excludeLocationId={isRiding ? undefined : fromLocation}
        />
      </div>
    </div>
  );
};

export default LocationSelectionSection;