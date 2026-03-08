import React, { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Loader2, Flame, List, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LocationSelect from "@/components/LocationSelect";

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

const statusLabel: Record<string, { text: string; cls: string }> = {
  approved: { text: "Зөвшөөрсөн", cls: "bg-success/10 text-success" },
  pending: { text: "Хүлээгдэж буй", cls: "bg-warning/10 text-warning" },
  rejected: { text: "Татгалзсан", cls: "bg-destructive/10 text-destructive" },
  cancelled: { text: "Цуцлагдсан", cls: "bg-muted text-muted-foreground" },
  completed: { text: "Дууссан", cls: "bg-primary/10 text-primary" },
};

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
        setTrips(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Trip)));
      } catch (err) {
        console.error("Error fetching trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    if (user && profile) fetchTrips();
  }, [user, profile, isDriver]);

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

  // Driver view — no search, just their trips
  if (isDriver) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-background to-accent/8" />
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="font-heading text-4xl font-bold text-center mb-2 animate-fade-in">Миний аялалууд</h1>
            <p className="text-center text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Таны оруулсан бүх аялалууд
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-10">
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
              <p className="text-muted-foreground text-xl font-heading font-semibold mb-2">Аялал байхгүй</p>
              <p className="text-sm text-muted-foreground/70">Та жолоочийн самбараас аялал нийтлэх боломжтой</p>
              <Button className="mt-6" asChild>
                <Link to="/driver">Аялал нийтлэх</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
              {trips.map((trip) => {
                const st = statusLabel[trip.status] || { text: trip.status, cls: "bg-muted text-muted-foreground" };
                return (
                  <div key={trip.id} className="glass-card-elevated rounded-2xl p-6 hover-lift group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
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
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.text}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-5">
                      <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5">
                        <Calendar className="h-3 w-3" /> {trip.date}
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5">
                        <Clock className="h-3 w-3" /> {trip.time}
                      </div>
                      <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5">
                        <Users className="h-3 w-3" /> {trip.seats} суудал
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading font-bold text-2xl text-primary">{trip.price?.toLocaleString()}₮</p>
                        <p className="text-xs text-muted-foreground">суудал бүр</p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/trips/${trip.id}`}>
                          Дэлгэрэнгүй <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Passenger view — with search
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-background to-accent/8" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-heading text-4xl font-bold text-center mb-2 animate-fade-in">{t("availableTrips")}</h1>
          <p className="text-center text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Монгол даяар аялал хайх
          </p>
          <div className="glass-card-elevated rounded-2xl p-5 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="grid sm:grid-cols-4 gap-3">
              <LocationSelect value={searchFrom} onChange={setSearchFrom} placeholder="Хаанаас" iconColor="text-primary" />
              <LocationSelect value={searchTo} onChange={setSearchTo} placeholder="Хаашаа" iconColor="text-accent" />
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

      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "all" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <List className="h-4 w-4" /> Бүх аялал
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "popular" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Flame className="h-4 w-4" /> Эрэлттэй аялал
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
            <p className="text-muted-foreground text-xl font-heading font-semibold mb-2">Аялал олдсонгүй</p>
            <p className="text-sm text-muted-foreground/70">
              {trips.length === 0 ? "Одоогоор зөвшөөрөгдсөн аялал байхгүй байна" : "Хайлтын шүүлтүүрээ өөрчилж үзнэ үү"}
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
                    <Users className="h-3 w-3" /> {trip.seats} суудал
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-2xl text-primary">{trip.price?.toLocaleString()}₮</p>
                    <p className="text-xs text-muted-foreground">суудал бүр</p>
                  </div>
                  <Button size="sm" className="hover-scale" asChild>
                    <Link to={`/trips/${trip.id}`}>
                      Захиалах <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
