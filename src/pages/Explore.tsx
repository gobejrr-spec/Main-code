import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AIMAG_DATA, AimagInfo } from "@/lib/aimag-data";
import { MapPin, Users, Ruler, ArrowLeft, Star, ChevronRight, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Explore: React.FC = () => {
  const [selected, setSelected] = useState<AimagInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = AIMAG_DATA.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selected) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <button
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Бүх аймгууд
          </button>

          <div className="animate-fade-in">
            <div className="glass-card-elevated rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{selected.image}</div>
                <div>
                  <h1 className="font-heading text-3xl font-bold">{selected.name}</h1>
                  <p className="text-muted-foreground mt-1">{selected.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Хүн ам</p>
                    <p className="text-sm font-semibold">{selected.population}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Ruler className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Талбай</p>
                    <p className="text-sm font-semibold">{selected.area}</p>
                  </div>
                </div>
              </div>

              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                Үзэх газрууд
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {selected.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{h}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Button asChild className="w-full glow-primary">
                  <Link to={`/trips?to=${encodeURIComponent(selected.name)}`}>
                    <MapPin className="mr-2 h-4 w-4" />
                    {selected.name} руу аялал хайх
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-background to-accent/8" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-4xl font-bold animate-fade-in">Монголын 21 аймаг</h1>
          </div>
          <p className="text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Аймаг бүрийн онцлог, үзэх газрууд, байгалийн гайхамшгуудтай танилцаарай
          </p>
          <div className="max-w-md animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Аймаг хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-stagger">
          {filtered.map((aimag) => (
            <button
              key={aimag.name}
              onClick={() => setSelected(aimag)}
              className="glass-card-elevated rounded-2xl p-5 text-left hover-lift group transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{aimag.image}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {aimag.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {aimag.description}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {aimag.population}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {aimag.highlights.length} газар
                </span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Аймаг олдсонгүй</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
