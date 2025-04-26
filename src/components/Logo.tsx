
import React from "react";
import { Bike } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", withText = true }) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Bike 
          size={size === "sm" ? 24 : size === "md" ? 32 : 40} 
          className="text-ebike-primary" 
        />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ebike-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-ebike-accent"></span>
        </span>
      </div>
      {withText && (
        <span className={`font-bold ${sizeClasses[size]} text-ebike-dark`}>
          PRAYANA
        </span>
      )}
    </div>
  );
};

export default Logo;
