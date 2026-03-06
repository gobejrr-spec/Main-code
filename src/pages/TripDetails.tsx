import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Clock, Users, User, Car, ArrowLeft, Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tripData: Record<string, any> = {
  "1": { from: "Ulaanbaatar", to: "Darkhan", date: "2026-03-10", time: "08:00", seats: 3, price: 25000, driverName: "Batbold", carType: "Toyota Prius", phone: "+976 9911 2233" },
  "2": { from: "Ulaanbaatar", to: "Erdenet", date: "2026-03-11", time: "07:00", seats: 2, price: 35000, driverName: "Munkh-Erdene", carType: "Hyundai Starex", phone: "+976 9922 3344" },
  "3": { from: "Darkhan", to: "Sukhbaatar", date: "2026-03-10", time: "10:00", seats: 4, price: 15000, driverName: "Tuvshinbayar", carType: "Toyota Land Cruiser", phone: "+976 9933 4455" },
  "4": { from: "Ulaanbaatar", to: "Kharkhorin", date: "2026-03-12", time: "06:30", seats: 1, price: 30000, driverName: "Enkhbat", carType: "Mitsubishi Delica", phone: "+976 9944 5566" },
  "5": { from: "Erdenet", to: "Murun", date: "2026-03-13", time: "09:00", seats: 3, price: 40000, driverName: "Sukhbaatar", carType: "Toyota HiAce", phone: "+976 9955 6677" },
  "6": { from: "Ulaanbaatar", to: "Choir", date: "2026-03-10", time: "14:00", seats: 4, price: 20000, driverName: "Ganbold", carType: "Toyota Prius", phone: "+976 9966 7788" },
};

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const trip = id ? tripData[id] : null;

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("noResults")}</p>
      </div>
    );
  }

  const handleBook = () => {
    if (!user) {
      toast.info(t("login") + " required");
      navigate("/login");
      return;
    }
    toast.success("Booking request sent! (Demo mode)");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        <h1 className="font-heading text-2xl font-bold mb-6">{t("tripDetails")}</h1>

        <div className="glass-card rounded-xl p-6 space-y-6">
          {/* Route */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-px h-8 bg-border" />
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">{t("from")}</p>
                <p className="font-heading font-semibold text-lg">{trip.from}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("to")}</p>
                <p className="font-heading font-semibold text-lg">{trip.to}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t("date")}</p>
                <p className="text-sm font-medium">{trip.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t("departureTime")}</p>
                <p className="text-sm font-medium">{trip.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t("seatsAvailable")}</p>
                <p className="text-sm font-medium">{trip.seats}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t("price")}</p>
                <p className="text-sm font-bold text-primary">{trip.price.toLocaleString()}₮</p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="border-t border-border pt-4">
            <h3 className="font-heading font-semibold mb-3">{t("driverInfo")}</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{trip.driverName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Car className="h-3 w-3" /> {trip.carType}
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <Shield className="h-3 w-3" /> Verified Driver
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleBook}>
            {t("bookNow")} — {trip.price.toLocaleString()}₮
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
