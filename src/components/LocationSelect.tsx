import React, { useState, useMemo } from "react";
import { AIMAGS } from "@/lib/locations";
import { SOUMS } from "@/lib/soums";
import { MapPin, ChevronLeft } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [selectedAimag, setSelectedAimag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const displayValue = value || "";

  const filteredAimags = useMemo(() => {
    if (!search) return [...AIMAGS];
    const q = search.toLowerCase();
    return AIMAGS.filter(a => a.toLowerCase().includes(q));
  }, [search]);

  const filteredSoums = useMemo(() => {
    if (!selectedAimag) return [];
    const soums = SOUMS[selectedAimag] || [];
    if (!search) return soums;
    const q = search.toLowerCase();
    return soums.filter(s => s.toLowerCase().includes(q));
  }, [selectedAimag, search]);

  const handleSelect = (location: string) => {
    onChange(location);
    setOpen(false);
    setSelectedAimag(null);
    setSearch("");
  };

  const handleAimagClick = (aimag: string) => {
    const soums = SOUMS[aimag] || [];
    if (soums.length === 0) {
      handleSelect(aimag);
    } else {
      setSelectedAimag(aimag);
      setSearch("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${iconColor} pointer-events-none z-10`} />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-11 pl-9 pr-8 rounded-md border border-input bg-background text-sm text-left ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer truncate"
      >
        <span className={displayValue ? "text-foreground" : "text-muted-foreground"}>
          {displayValue || placeholder}
        </span>
      </button>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSelectedAimag(null); setSearch(""); }} />
          <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
            {/* Search */}
            <div className="p-2 border-b border-border">
              {selectedAimag && (
                <button
                  type="button"
                  onClick={() => { setSelectedAimag(null); setSearch(""); }}
                  className="flex items-center gap-1 text-xs text-primary mb-2 hover:underline"
                >
                  <ChevronLeft className="h-3 w-3" /> Бүх аймгууд
                </button>
              )}
              <input
                type="text"
                placeholder={selectedAimag ? `${selectedAimag} сумууд хайх...` : "Аймаг хайх..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-muted/50 rounded-md border-0 outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {!selectedAimag ? (
                <>
                  {/* Clear option */}
                  {value && (
                    <button
                      type="button"
                      onClick={() => handleSelect("")}
                      className="w-full px-3 py-2.5 text-sm text-left text-muted-foreground hover:bg-muted/50 border-b border-border"
                    >
                      — {placeholder}
                    </button>
                  )}
                  {filteredAimags.map((aimag) => {
                    const soumCount = (SOUMS[aimag] || []).length;
                    return (
                      <button
                        key={aimag}
                        type="button"
                        onClick={() => handleAimagClick(aimag)}
                        className={`w-full px-3 py-2.5 text-sm text-left hover:bg-muted/50 flex items-center justify-between transition-colors ${value === aimag ? "bg-primary/10 text-primary font-medium" : ""}`}
                      >
                        <span>{aimag}</span>
                        {soumCount > 0 && (
                          <span className="text-xs text-muted-foreground">{soumCount} сум →</span>
                        )}
                      </button>
                    );
                  })}
                  {filteredAimags.length === 0 && (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">Олдсонгүй</div>
                  )}
                </>
              ) : (
                <>
                  {/* Select aimag center */}
                  <button
                    type="button"
                    onClick={() => handleSelect(selectedAimag)}
                    className={`w-full px-3 py-2.5 text-sm text-left hover:bg-muted/50 font-medium border-b border-border flex items-center gap-2 ${value === selectedAimag ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {selectedAimag} (төв)
                  </button>
                  {filteredSoums.map((soum) => {
                    const fullValue = `${soum}, ${selectedAimag}`;
                    return (
                      <button
                        key={soum}
                        type="button"
                        onClick={() => handleSelect(fullValue)}
                        className={`w-full px-3 py-2.5 pl-6 text-sm text-left hover:bg-muted/50 transition-colors ${value === fullValue ? "bg-primary/10 text-primary font-medium" : ""}`}
                      >
                        {soum}
                      </button>
                    );
                  })}
                  {filteredSoums.length === 0 && (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">Олдсонгүй</div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSelect;
