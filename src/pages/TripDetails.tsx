import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Calendar, Clock, Users, User, Car, ArrowLeft, Shield, Loader2, Phone, CreditCard, FileText } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Буцах
        </Link>

        <h1 className="font-heading text-2xl font-bold mb-6">Аялалын дэлгэрэнгүй</h1>

        <div className="glass-card-elevated rounded-2xl p-6 space-y-6 animate-fade-in">
          {/* Route */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full bg-primary" />
              <div className="w-px h-8 bg-border" />
              <div className="w-3.5 h-3.5 rounded-full bg-accent" />
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
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Огноо</p>
                <p className="text-sm font-medium">{trip.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Хөдлөх цаг</p>
                <p className="text-sm font-medium">{trip.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Үлдсэн суудал</p>
                <p className={`text-sm font-bold ${remainingSeats <= 1 ? "text-destructive" : "text-success"}`}>
                  {remainingSeats} / {trip.seats}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Үнэ</p>
                <p className="text-sm font-bold text-primary">{trip.price.toLocaleString()}₮</p>
              </div>
            </div>
          </div>

          {/* Driver Info - full details */}
          <div className="border-t border-border pt-5">
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Жолоочийн мэдээлэл
            </h3>
            <div className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-semibold text-lg">
                    {driverInfo?.driverLastName ? `${driverInfo.driverLastName} ` : ""}{trip.driverName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-success mt-1">
                    <Shield className="h-3 w-3" /> Баталгаажсан жолооч
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Утас</p>
                    <p className="text-sm font-medium">{trip.driverPhone || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Машин</p>
                    <p className="text-sm font-medium">{driverInfo?.vehicleType || trip.carType || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Улсын дугаар</p>
                    <p className="text-sm font-medium">{driverInfo?.vehiclePlate || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Жолоочийн үнэмлэх</p>
                    <p className="text-sm font-medium">{driverInfo?.licenseNumber || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full h-12 text-base glow-primary"
            size="lg"
            onClick={handleBook}
            disabled={booking || remainingSeats <= 0}
          >
            {booking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
