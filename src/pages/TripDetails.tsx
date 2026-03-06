import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Calendar, Clock, Users, User, Car, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TripData {
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

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, "trips", id));
        if (docSnap.exists()) {
          const data = docSnap.data() as TripData;
          if (data.status === "approved") {
            setTrip(data);
          }
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      toast.info(t("login") + " required");
      navigate("/login");
      return;
    }
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        tripId: id,
        seats: 1,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });
      toast.success("Booking confirmed!");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Booking failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("noResults")}</p>
          <Link to="/trips" className="text-primary text-sm hover:underline mt-2 inline-block">{t("back")}</Link>
        </div>
      </div>
    );
  }

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
