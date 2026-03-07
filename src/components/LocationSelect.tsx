import React from "react";
import { AIMAGS } from "@/lib/locations";
import { MapPin } from "lucide-react";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  iconColor?: string;
  className?: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  placeholder,
  iconColor = "text-primary",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${iconColor} pointer-events-none`} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 pl-9 pr-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {AIMAGS.map((aimag) => (
          <option key={aimag} value={aimag}>
            {aimag}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LocationSelect;
