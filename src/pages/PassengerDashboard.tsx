import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Clock, MessageSquare, Loader2, Send, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface Booking {
  id: string;
  tripId: string;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  price?: number;
  status: string;
}

const PassengerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const bookingsList: Booking[] = [];
        for (const bDoc of snapshot.docs) {
          const bData = bDoc.data();
          try {
            const { getDoc, doc } = await import("firebase/firestore");
            const tripDoc = await getDoc(doc(db, "trips", bData.tripId));
            if (tripDoc.exists()) {
              const tripData = tripDoc.data();
              bookingsList.push({
                id: bDoc.id,
                tripId: bData.tripId,
                from: tripData.from,
                to: tripData.to,
                date: tripData.date,
                time: tripData.time,
                price: tripData.price,
                status: bData.status,
              });
            }
          } catch {
            bookingsList.push({ id: bDoc.id, tripId: bData.tripId, status: bData.status });
          }
        }
        setBookings(bookingsList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleComplaint = async () => {
    if (!complaint.trim() || !user) return;
    setSending(true);
    try {
      await addDoc(collection(db, "complaints"), {
        userId: user.uid,
        message: complaint,
        createdAt: serverTimestamp(),
      });
      toast.success(t("complaintSuccess"));
      setComplaint("");
    } catch (err) {
      toast.error(t("complaintFailed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-heading text-3xl font-bold">
            {profile?.name ? `${t("hello")}, ${profile.name}` : t("dashboard")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("passengerDashboard")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bookings */}
          <div className="md:col-span-2">
            <h2 className="font-heading font-semibold text-lg mb-4">{t("myBookingsTitle")}</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 glass-card-elevated rounded-2xl">
                <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">{t("noBookings")}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{t("startSearching")}</p>
              </div>
            ) : (
              <div className="space-y-3 animate-stagger">
                {bookings.map((b) => (
                  <div key={b.id} className="glass-card-elevated rounded-2xl p-4 flex items-center justify-between hover-lift">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          {b.from || "?"} → {b.to || "?"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {b.date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date}</span>}
                          {b.time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.time}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {b.price && <p className="font-heading font-bold text-primary">{b.price.toLocaleString()}₮</p>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        b.status === "confirmed" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {b.status === "confirmed" ? t("confirmed") : b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="glass-card-elevated rounded-2xl p-6">
            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              {t("searchTripsTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{t("searchTripsDesc")}</p>
            <Button asChild className="w-full glow-primary">
              <Link to="/trips">{t("searchNow")}</Link>
            </Button>
          </div>

          {/* Complaint */}
          <div className="glass-card-elevated rounded-2xl p-6">
            <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-warning" />
              {t("complaintTitle")}
            </h3>
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder={t("complaintPlaceholder")}
              className="w-full h-20 rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring mb-3"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleComplaint}
              disabled={sending || !complaint.trim()}
            >
              {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {t("send")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
