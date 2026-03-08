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
import monpayQr from "@/assets/monpay-qr.png";

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
  const [showPayment, setShowPayment] = useState(false);
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
            try {
              const driverDoc = await getDoc(doc(db, "drivers", data.driverId));
              if (driverDoc.exists()) {
                setDriverInfo(driverDoc.data() as DriverInfo);
              }
            } catch (dErr) {
              console.warn("Could not fetch driver info:", dErr);
            }
            try {
              const bookingsSnap = await getCountFromServer(
                query(collection(db, "bookings"), where("tripId", "==", id), where("status", "==", "confirmed"))
              );
              setBookedSeats(bookingsSnap.data().count);
            } catch (bookingErr) {
              console.warn("Could not fetch bookings count:", bookingErr);
              setBookedSeats(0);
            }
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

  const handleBook = () => {
    if (!user) {
      toast.info(t("loginRequired"));
      navigate("/login");
      return;
    }
    if (remainingSeats <= 0) {
      toast.error(t("seatsFulled"));
      return;
    }
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!user) return;
    setBooking(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        tripId: id,
        passengerName: userData.name || t("passengerName"),
        passengerPhone: userData.phone || "",
        seats: 1,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setShowPayment(false);
      toast.success(t("paymentPendingMsg"));
      setBookedSeats((prev) => prev + 1);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(t("bookingFailed"));
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
  const calculatedPrice = distanceKm ? distanceKm * pricePerKm : null;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <Link to="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> {t("goBack")}
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-8 animate-fade-in">{t("tripDetailTitle")}</h1>

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
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("fromLabel")}</p>
                  <p className="font-heading font-bold text-xl mt-1">{trip.from}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("toLabel")}</p>
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
                  <p className="text-xs text-muted-foreground font-medium">{t("approxDistance")}</p>
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
                <p className="text-xs text-muted-foreground">{t("dateLabel")}</p>
                <p className="text-sm font-semibold mt-0.5">{trip.date}</p>
              </div>
            </div>
            <div className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("departureTimeLabel")}</p>
                <p className="text-sm font-semibold mt-0.5">{trip.time}</p>
              </div>
            </div>
            <div className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("remainingSeats")}</p>
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
                <p className="text-xs text-muted-foreground">{t("calculatedPrice")}</p>
                <p className="text-sm font-bold text-primary mt-0.5">
                  {calculatedPrice ? `${calculatedPrice.toLocaleString()}₮` : `${trip.price.toLocaleString()}₮`}
                </p>
                {distanceKm && (
                  <p className="text-[10px] text-muted-foreground">{distanceKm}км × {pricePerKm}₮</p>
                )}
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="glass-card-elevated rounded-2xl p-7">
            <h3 className="font-heading font-semibold text-lg mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t("driverInfoTitle")}
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
                  <Shield className="h-3 w-3" /> {t("verifiedDriverBadge")}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{t("phoneLabel")}</p>
                  <p className="text-sm font-medium truncate">{trip.driverPhone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{t("carLabel")}</p>
                  <p className="text-sm font-medium truncate">{driverInfo?.vehicleType || trip.carType || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{t("plateNo")}</p>
                  <p className="text-sm font-medium truncate">{driverInfo?.vehiclePlate || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{t("driverLicense")}</p>
                  <p className="text-sm font-medium truncate">{driverInfo?.licenseNumber || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button or Payment Section */}
          {!showPayment ? (
            <Button
              className="w-full h-14 text-base font-semibold glow-primary rounded-xl"
              size="lg"
              onClick={handleBook}
              disabled={booking || remainingSeats <= 0}
            >
              {booking ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : remainingSeats <= 0 ? (
                t("seatsFulled")
              ) : (
                <>{t("bookAction")} — {calculatedPrice ? `${calculatedPrice.toLocaleString()}₮` : `${trip.price.toLocaleString()}₮`}</>
              )}
            </Button>
          ) : (
            <div className="glass-card-elevated rounded-2xl p-6 space-y-4 animate-fade-in">
              <h3 className="font-heading font-semibold text-lg text-center">{t("paymentTitle")}</h3>
              <p className="text-sm text-muted-foreground text-center">{t("paymentDesc")}</p>

              {/* Recipient */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Э.МӨНГӨНЦЭЦЭГ</p>
                  <p className="text-xs text-primary font-medium">88744721</p>
                </div>
              </div>

              {/* Amount */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                <p className="text-xs text-muted-foreground">{t("paymentAmount")}</p>
                <p className="text-2xl font-bold text-primary">
                  {calculatedPrice ? `${calculatedPrice.toLocaleString()}₮` : `${trip.price.toLocaleString()}₮`}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center p-4 bg-background rounded-xl border border-border">
                <img src={monpayQr} alt="MonPay QR" className="w-56 h-56 object-contain" />
              </div>

              {/* Open MonPay App Button (mobile) */}
              <a
                href="https://play.google.com/store/apps/details?id=mn.mobicom.candy"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full h-11 rounded-xl font-semibold gap-2" type="button">
                  MonPay апп нээх
                </Button>
              </a>

              {/* Account Info */}
              <div className="space-y-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">{t("ibanAccount")}</p>
                  <p className="text-sm font-mono font-medium text-primary">MN81 0050 0991 0762 6169</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("monpayAccount")}</p>
                  <p className="text-sm font-mono font-medium">9910 7626 169</p>
                </div>
              </div>

              {/* Confirm & Cancel */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={() => setShowPayment(false)}
                >
                  {t("goBack")}
                </Button>
                <Button
                  className="flex-1 h-12 font-semibold rounded-xl"
                  onClick={handleConfirmPayment}
                  disabled={booking}
                >
                  {booking ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  {t("iHavePaid")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
