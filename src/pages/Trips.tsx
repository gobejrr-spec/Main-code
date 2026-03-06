import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState as useStateHook, useEffect } from "react";

interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  carType: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  status: string;
}

const Trips: React.FC = () => {
  const { t } = useLanguage();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "trips"), where("status", "==", "approved"));
        const snapshot = await getDocs(q);
        setTrips(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Trip)));
      } catch (err) {
        console.error("Error fetching trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filtered = trips.filter((trip) => {
    const matchFrom = !searchFrom || trip.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchTo = !searchTo || trip.to.toLowerCase().includes(searchTo.toLowerCase());
    const matchDate = !searchDate || trip.date === searchDate;
    return matchFrom && matchTo && matchDate;
  });

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Search Bar */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-background to-accent/8" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-heading text-4xl font-bold text-center mb-2 animate-fade-in">{t("availableTrips")}</h1>
          <p className="text-center text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Find your next ride across Mongolia
          </p>
          <div className="glass-card-elevated rounded-2xl p-5 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input placeholder={t("from")} className="pl-9 h-11" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
                <Input placeholder={t("to")} className="pl-9 h-11" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9 h-11" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
              </div>
              <Button className="w-full h-11 glow-primary">
                <Search className="mr-2 h-4 w-4" />
                {t("search")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-xl font-heading font-semibold mb-2">{t("noResults")}</p>
            <p className="text-sm text-muted-foreground/70">
              {trips.length === 0 ? "No approved trips available yet" : "Try adjusting your search filters"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
            {filtered.map((trip) => (
              <div key={trip.id} className="glass-card-elevated rounded-2xl p-6 hover-lift group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      {trip.from}
                    </div>
                    <div className="w-px h-3 bg-border ml-[5px] my-1" />
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                      {trip.to}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-5">
                  <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5">
                    <Calendar className="h-3 w-3" /> {trip.date}
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5">
                    <Clock className="h-3 w-3" /> {trip.time}
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5">
                    <Users className="h-3 w-3" /> {trip.seats} {t("seats")}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-2xl text-primary">{trip.price.toLocaleString()}₮</p>
                    <p className="text-xs text-muted-foreground">{t("perSeat")}</p>
                  </div>
                  <Button size="sm" className="hover-scale" asChild>
                    <Link to={`/trips/${trip.id}`}>
                      {t("bookNow")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">{trip.driverName}</span>
                  <span>{trip.carType}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
