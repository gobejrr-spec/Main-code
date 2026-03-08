import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Calendar, Clock, Users, User, Car, ArrowLeft, Shield, Loader2, Phone, CreditCard, FileText, Navigation } from "lucide-react";
import { getDistanceKm } from "@/lib/distance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TripData {
  driverId: string;
  driverName: string;
  driverPhone?: string;
  carType: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  status: string;
}

interface DriverInfo {
  vehicleType?: string;
  vehiclePlate?: string;
  licenseNumber?: string;
  driverLastName?: string;
}

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState(0);
  const [booking, setBooking] = useState(false);
  const [pricePerKm, setPricePerKm] = useState<number>(150);

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
            // Fetch driver details from drivers collection
            try {
              const driverDoc = await getDoc(doc(db, "drivers", data.driverId));
              if (driverDoc.exists()) {
                setDriverInfo(driverDoc.data() as DriverInfo);
              }
            } catch (dErr) {
              console.warn("Could not fetch driver info:", dErr);
            }
            // Try to get booked seats count
            try {
              const bookingsSnap = await getCountFromServer(
                query(collection(db, "bookings"), where("tripId", "==", id), where("status", "==", "confirmed"))
              );
              setBookedSeats(bookingsSnap.data().count);
            } catch (bookingErr) {
              console.warn("Could not fetch bookings count:", bookingErr);
              setBookedSeats(0);
            }
            // Fetch platform settings for price per km
            try {
              const settingsDoc = await getDoc(doc(db, "settings", "platform"));
              if (settingsDoc.exists() && settingsDoc.data().pricePerKm) {
                setPricePerKm(settingsDoc.data().pricePerKm);
              }
            } catch (sErr) {
              console.warn("Could not fetch settings:", sErr);
            }
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

  const remainingSeats = trip ? trip.seats - bookedSeats : 0;

  const handleBook = async () => {
    if (!user) {
      toast.info("Нэвтрэх шаардлагатай");
      navigate("/login");
      return;
    }
    if (remainingSeats <= 0) {
      toast.error("Суудал дууссан байна");
      return;
    }
    setBooking(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        tripId: id,
        passengerName: userData.name || "Зорчигч",
        passengerPhone: userData.phone || "",
        seats: 1,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });
      toast.success("Захиалга амжилттай!");
      setBookedSeats((prev) => prev + 1);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Захиалга амжилтгүй");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("noResults")}</p>
          <Link to="/trips" className="text-primary text-sm hover:underline mt-2 inline-block">{t("back")}</Link>
        </div>
      </div>
    );
  }

  const distanceKm = trip ? getDistanceKm(trip.from, trip.to) : null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <Link to="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Буцах
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-8 animate-fade-in">Аялалын дэлгэрэнгүй</h1>

        <div className="space-y-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {/* Route Card */}
          <div className="glass-card-elevated rounded-2xl p-7">
            <div className="flex items-start gap-5">
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="w-4 h-4 rounded-full bg-primary shadow-md ring-4 ring-primary/20" />
                <div className="w-0.5 h-10 bg-gradient-to-b from-primary/40 to-accent/40 rounded-full" />
                <div className="w-4 h-4 rounded-full bg-accent shadow-md ring-4 ring-accent/20" />
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Хаанаас</p>
                  <p className="font-heading font-bold text-xl mt-1">{trip.from}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Хаашаа</p>
                  <p className="font-heading font-bold text-xl mt-1">{trip.to}</p>
                </div>
              </div>
            </div>
            {distanceKm !== null && (
              <div className="mt-5 pt-5 border-t border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Ойролцоо зай</p>
                  <p className="font-heading font-bold text-lg">{distanceKm} км</p>
                </div>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Огноо</p>
                <p className="text-sm font-semibold mt-0.5">{trip.date}</p>
              </div>
            </div>
            <div className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Хөдлөх цаг</p>
                <p className="text-sm font-semibold mt-0.5">{trip.time}</p>
              </div>
            </div>
            <div className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Үлдсэн суудал</p>
                <p className={`text-sm font-bold mt-0.5 ${remainingSeats <= 1 ? "text-destructive" : "text-success"}`}>
                  {remainingSeats} / {trip.seats}
                </p>
              </div>
            </div>
            <div className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Үнэ</p>
                <p className="text-sm font-bold text-primary mt-0.5">{trip.price.toLocaleString()}₮</p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="glass-card-elevated rounded-2xl p-7">
            <h3 className="font-heading font-semibold text-lg mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Жолоочийн мэдээлэл
            </h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-lg">
                  {driverInfo?.driverLastName ? `${driverInfo.driverLastName} ` : ""}{trip.driverName}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-success mt-1.5 bg-success/8 px-2.5 py-1 rounded-full">
                  <Shield className="h-3 w-3" /> Баталгаажсан жолооч
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Утас</p>
                  <p className="text-sm font-medium truncate">{trip.driverPhone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Машин</p>
                  <p className="text-sm font-medium truncate">{driverInfo?.vehicleType || trip.carType || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Улсын дугаар</p>
                  <p className="text-sm font-medium truncate">{driverInfo?.vehiclePlate || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Жолоочийн үнэмлэх</p>
                  <p className="text-sm font-medium truncate">{driverInfo?.licenseNumber || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <Button
            className="w-full h-14 text-base font-semibold glow-primary rounded-xl"
            size="lg"
            onClick={handleBook}
            disabled={booking || remainingSeats <= 0}
          >
            {booking ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : remainingSeats <= 0 ? (
              "Суудал дууссан"
            ) : (
              <>Захиалах — {trip.price.toLocaleString()}₮</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
