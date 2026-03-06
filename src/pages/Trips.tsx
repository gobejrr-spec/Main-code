import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for demo
const mockTrips = [
  { id: "1", from: "Ulaanbaatar", to: "Darkhan", date: "2026-03-10", time: "08:00", seats: 3, price: 25000, driverName: "Batbold", carType: "Toyota Prius", status: "approved" },
  { id: "2", from: "Ulaanbaatar", to: "Erdenet", date: "2026-03-11", time: "07:00", seats: 2, price: 35000, driverName: "Munkh-Erdene", carType: "Hyundai Starex", status: "approved" },
  { id: "3", from: "Darkhan", to: "Sukhbaatar", date: "2026-03-10", time: "10:00", seats: 4, price: 15000, driverName: "Tuvshinbayar", carType: "Toyota Land Cruiser", status: "approved" },
  { id: "4", from: "Ulaanbaatar", to: "Kharkhorin", date: "2026-03-12", time: "06:30", seats: 1, price: 30000, driverName: "Enkhbat", carType: "Mitsubishi Delica", status: "approved" },
  { id: "5", from: "Erdenet", to: "Murun", date: "2026-03-13", time: "09:00", seats: 3, price: 40000, driverName: "Sukhbaatar", carType: "Toyota HiAce", status: "approved" },
  { id: "6", from: "Ulaanbaatar", to: "Choir", date: "2026-03-10", time: "14:00", seats: 4, price: 20000, driverName: "Ganbold", carType: "Toyota Prius", status: "approved" },
];

const Trips: React.FC = () => {
  const { t } = useLanguage();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const filtered = mockTrips.filter((trip) => {
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
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("noResults")}</p>
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
