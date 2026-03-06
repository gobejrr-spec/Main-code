import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        const q = query(
          collection(db, "trips"),
          where("status", "==", "approved")
        );
        const snapshot = await getDocs(q);
        const fetchedTrips: Trip[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trip[];
        setTrips(fetchedTrips);
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
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-center mb-6">{t("availableTrips")}</h1>
          <div className="glass-card rounded-xl p-4 max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("from")}
                  className="pl-9"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("to")}
                  className="pl-9"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                {t("search")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("noResults")}</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {trips.length === 0
                ? "No approved trips available yet"
                : "Try adjusting your search filters"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((trip) => (
              <div key={trip.id} className="glass-card rounded-xl p-5 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {trip.from}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium mt-1">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {trip.to}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {trip.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {trip.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {trip.seats} {t("seats")}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-lg text-primary">{trip.price.toLocaleString()}₮</p>
                    <p className="text-xs text-muted-foreground">{t("perSeat")}</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/trips/${trip.id}`}>{t("bookNow")}</Link>
                  </Button>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>{trip.driverName}</span>
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
