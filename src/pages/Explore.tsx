import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIMAG_DATA, AimagInfo } from "@/lib/aimag-data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Users, Ruler, ArrowLeft, Star, ChevronRight, Search, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Explore: React.FC = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<AimagInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [aimagList, setAimagList] = useState<AimagInfo[]>(AIMAG_DATA);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAimags = async () => {
      try {
        const snap = await getDocs(collection(db, "aimags"));
        if (snap.empty) {
          setAimagList(AIMAG_DATA);
        } else {
          const firestoreMap = new Map<string, any>();
          snap.docs.forEach(d => firestoreMap.set(d.id, d.data()));

          const merged = AIMAG_DATA.map(a => {
            const fsData = firestoreMap.get(a.name);
            return fsData ? { ...a, ...fsData } : a;
          });

          // Add extras from Firestore
          firestoreMap.forEach((val, key) => {
            if (!AIMAG_DATA.find(a => a.name === key)) {
              merged.push(val as AimagInfo);
            }
          });

          setAimagList(merged);
        }
      } catch (err) {
        console.error("Aimag fetch error:", err);
        setAimagList(AIMAG_DATA);
      } finally {
        setLoadingData(false);
      }
    };
    fetchAimags();
  }, []);

  const filtered = aimagList.filter((a) =>
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
            <ArrowLeft className="h-4 w-4" /> {t("allProvincesBack")}
          </button>

          <div className="animate-fade-in">
            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[16/7]">
              <img
                src={selected.photoUrl}
                alt={selected.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">{selected.name}</h1>
                <p className="text-primary-foreground/80 mt-1 max-w-lg">{selected.description}</p>
              </div>
            </div>

            <div className="glass-card-elevated rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("population")}</p>
                    <p className="text-sm font-semibold">{selected.population}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Ruler className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("area")}</p>
                    <p className="text-sm font-semibold">{selected.area}</p>
                  </div>
                </div>
              </div>

              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                {t("attractions")}
              </h2>

              {/* Attraction cards with photos */}
              {selected.attractions && selected.attractions.length > 0 ? (
                <div className="grid gap-4">
                  {selected.attractions.map((attraction, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="sm:flex">
                        <div className="sm:w-48 h-36 sm:h-auto flex-shrink-0">
                          <img
                            src={attraction.photoUrl}
                            alt={attraction.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
                            }}
                          />
                        </div>
                        <div className="p-4 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {i + 1}
                            </div>
                            <h3 className="font-heading font-semibold text-sm">{attraction.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{attraction.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <Button asChild className="w-full glow-primary">
                  <Link to={`/trips?to=${encodeURIComponent(selected.name)}`}>
                    <MapPin className="mr-2 h-4 w-4" />
                    {selected.name} {t("searchTripsTo")}
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
            <h1 className="font-heading text-4xl font-bold animate-fade-in">{t("mongoliaProvinces")}</h1>
          </div>
          <p className="text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {t("exploreSubtitle")}
          </p>
          <div className="max-w-md animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchProvince")}
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
              className="glass-card-elevated rounded-2xl overflow-hidden text-left hover-lift group transition-all duration-300"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={aimag.photoUrl}
                  alt={aimag.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-heading font-semibold text-lg text-primary-foreground">
                    {aimag.name}
                  </h3>
                </div>
                <div className="absolute top-3 right-3">
                  <ChevronRight className="h-5 w-5 text-primary-foreground/70 group-hover:text-primary-foreground group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {aimag.description}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {aimag.population}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {aimag.highlights.length} {t("places")}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("provinceNotFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
