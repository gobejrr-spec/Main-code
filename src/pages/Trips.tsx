import React, { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Loader2, Flame, List, Car, XCircle, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LocationSelect from "@/components/LocationSelect";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

interface Trip {
  id: string;
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

interface Booking {
  id: string;
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  seats: number;
  status: string;
}

const Trips: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchFrom, setSearchFrom] = useState(searchParams.get("from") || "");
  const [searchTo, setSearchTo] = useState(searchParams.get("to") || "");
  const [searchDate, setSearchDate] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "popular">("all");

  // Driver-specific state
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({});
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const isDriver = profile?.role === "driver";

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = isDriver
          ? query(collection(db, "trips"), where("driverId", "==", user.uid))
          : query(collection(db, "trips"), where("status", "==", "approved"));
        const snapshot = await getDocs(q);
        const tripsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Trip));
        setTrips(tripsList);

        if (isDriver && tripsList.length > 0) {
          const bookingsMap: Record<string, Booking[]> = {};
          for (const trip of tripsList) {
            try {
              const bq = query(collection(db, "bookings"), where("tripId", "==", trip.id));
              const bSnap = await getDocs(bq);
              bookingsMap[trip.id] = bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
            } catch {
              bookingsMap[trip.id] = [];
            }
          }
          setBookings(bookingsMap);
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    if (user && profile) fetchTrips();
  }, [user, profile, isDriver]);

  const handleCancelTrip = async (tripId: string) => {
    setCancelling(true);
    try {
      await updateDoc(doc(db, "trips", tripId), { status: "cancelled" });
      setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: "cancelled" } : t));
      toast.success(t("tripCancelledSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("cancelError"));
    } finally {
      setCancelling(false);
      setCancelConfirm(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const filtered = trips.filter((trip) => {
    const matchFrom = !searchFrom || trip.from === searchFrom;
    const matchTo = !searchTo || trip.to === searchTo;
    const matchDate = !searchDate || trip.date === searchDate;
    return matchFrom && matchTo && matchDate;
  });

  const displayTrips = activeTab === "popular"
    ? [...filtered].sort((a, b) => b.seats - a.seats)
    : filtered;

  const statusLabel: Record<string, { text: string; cls: string }> = {
    approved: { text: t("approved"), cls: "bg-success/10 text-success" },
    pending: { text: t("pending"), cls: "bg-warning/10 text-warning" },
    rejected: { text: t("rejected"), cls: "bg-destructive/10 text-destructive" },
    cancelled: { text: t("cancelled"), cls: "bg-muted text-muted-foreground" },
    completed: { text: t("completed"), cls: "bg-primary/10 text-primary" },
  };

  // ==================== DRIVER VIEW ====================
  if (isDriver) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-background to-accent/8" />
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="font-heading text-4xl font-bold text-center mb-2 animate-fade-in">{t("myTripsTitle")}</h1>
            <p className="text-center text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
              {t("myTripsSubtitle")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-10 max-w-4xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">{t("loading")}</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
                <Car className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-xl font-heading font-semibold mb-2">{t("noTrips")}</p>
              <p className="text-sm text-muted-foreground/70">{t("postTripFromDashboard")}</p>
              <Button className="mt-6" asChild>
                <Link to="/driver">{t("postTrip")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-stagger">
              {trips.map((trip) => {
                const st = statusLabel[trip.status] || { text: trip.status, cls: "bg-muted text-muted-foreground" };
                const tripBookings = bookings[trip.id] || [];
                const bookedSeats = tripBookings.reduce((sum, b) => sum + (b.seats || 1), 0);
                const isExpanded = expandedTrip === trip.id;
                const canCancel = trip.status === "pending" || trip.status === "approved";

                return (
                  <div key={trip.id} className="glass-card-elevated rounded-2xl overflow-hidden hover-lift">
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => setExpandedTrip(isExpanded ? null : trip.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              {trip.from} → {trip.to}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {trip.date}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.time}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.text}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-muted/40 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{t("totalSeats")}</p>
                          <p className="font-heading font-bold text-lg">{trip.seats}</p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{t("booked")}</p>
                          <p className="font-heading font-bold text-lg text-primary">{bookedSeats}</p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{t("freeSeats")}</p>
                          <p className={`font-heading font-bold text-lg ${trip.seats - bookedSeats <= 0 ? "text-destructive" : "text-success"}`}>
                            {Math.max(0, trip.seats - bookedSeats)}
                          </p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">{t("price")}</p>
                          <p className="font-heading font-bold text-lg text-primary">{trip.price?.toLocaleString()}₮</p>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          {t("bookedPassengers")} ({tripBookings.length})
                        </h4>
                        {tripBookings.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic mb-4">{t("noBookingsYet")}</p>
                        ) : (
                          <div className="space-y-2 mb-4">
                            {tripBookings.map((b) => (
                              <div key={b.id} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{b.passengerName || t("passenger")}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Phone className="h-3 w-3" /> {b.passengerPhone || "—"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">{b.seats || 1} {t("seats")}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    b.status === "confirmed" ? "bg-success/10 text-success" :
                                    b.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                                    "bg-warning/10 text-warning"
                                  }`}>
                                    {b.status === "confirmed" ? t("confirmed") : b.status === "cancelled" ? t("cancelled") : t("pending")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCancelConfirm(trip.id);
                            }}
                          >
                            <XCircle className="mr-1.5 h-4 w-4" />
                            {t("cancelTrip")}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Dialog open={!!cancelConfirm} onOpenChange={() => setCancelConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("cancelTrip")}</DialogTitle>
              <DialogDescription>
                {t("cancelTripConfirm")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCancelConfirm(null)}>{t("stopCancel")}</Button>
              <Button
                variant="destructive"
                disabled={cancelling}
                onClick={() => cancelConfirm && handleCancelTrip(cancelConfirm)}
              >
                {cancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                {t("cancelAction")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ==================== PASSENGER VIEW ====================
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-background to-accent/8" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-heading text-4xl font-bold text-center mb-2 animate-fade-in">{t("availableTrips")}</h1>
          <p className="text-center text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {t("searchTripsAcross")}
          </p>
          <div className="glass-card-elevated rounded-2xl p-5 max-w-3xl mx-auto animate-fade-in overflow-hidden" style={{ animationDelay: "200ms" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <LocationSelect value={searchFrom} onChange={setSearchFrom} placeholder={t("from")} iconColor="text-primary" />
              <LocationSelect value={searchTo} onChange={setSearchTo} placeholder={t("to")} iconColor="text-accent" />
              <div className="relative min-w-0">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9 h-11 w-full" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
              </div>
              <Button className="w-full h-11 glow-primary">
                <Search className="mr-2 h-4 w-4" />
                {t("search")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "all" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <List className="h-4 w-4" /> {t("allTrips")}
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "popular" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Flame className="h-4 w-4" /> {t("popularTripsTab")}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        ) : displayTrips.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-xl font-heading font-semibold mb-2">{t("noTripsFound")}</p>
            <p className="text-sm text-muted-foreground/70">
              {trips.length === 0 ? t("noApprovedTrips") : t("changeFilters")}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
            {displayTrips.map((trip) => (
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
                    <p className="font-heading font-bold text-2xl text-primary">{trip.price?.toLocaleString()}₮</p>
                    <p className="text-xs text-muted-foreground">{t("eachSeat")}</p>
                  </div>
                  <Button size="sm" className="hover-scale" asChild>
                    <Link to={`/trips/${trip.id}`}>
                      {t("book")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
