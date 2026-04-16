import React, { useState } from "react";
import { AIMAGS } from "@/lib/locations";
import { SOUMS } from "@/lib/soums";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSelectedAimag(null);
  };

  return (
    <div className="relative w-full overflow-visible z-50">
      {/* icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
        />
      </svg>

      {/* button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-11 pl-9 pr-8 rounded-md border border-input bg-background text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/30 truncate"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
      </button>

      {/* arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in backdrop-blur z-[9999] max-h-60 overflow-y-auto">
          {!selectedAimag ? (
            <>
              {AIMAGS.map((aimag) => (
                <button
                  key={aimag}
                  onClick={() => {
                    if ((SOUMS[aimag] || []).length > 0) {
                      setSelectedAimag(aimag);
                    } else {
                      handleSelect(aimag);
                    }
                  }}
                  className="w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-muted/70 transition"
                >
                  <span>{aimag}</span>
                  {(SOUMS[aimag] || []).length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {(SOUMS[aimag] || []).length} сум →
                    </span>
                  )}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedAimag(null)}
                className="w-full px-4 py-2 text-xs text-primary text-left hover:underline"
              >
                ← Бүх аймгууд
              </button>

              <button
                onClick={() => handleSelect(selectedAimag)}
                className="w-full px-4 py-3 text-sm text-left font-medium border-b border-border hover:bg-muted/70"
              >
                📍 {selectedAimag} (төв)
              </button>

              {(SOUMS[selectedAimag] || []).map((soum) => (
                <button
                  key={soum}
                  onClick={() => handleSelect(`${soum}, ${selectedAimag}`)}
                  className="w-full px-6 py-3 text-sm text-left hover:bg-muted/70 transition"
                >
                  {soum}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelect;