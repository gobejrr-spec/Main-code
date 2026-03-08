import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import ChatBox from "@/components/ChatBox";

interface BookingData {
  userId: string;
  tripId: string;
  passengerName: string;
  status: string;
}

interface TripData {
  driverId: string;
  driverName: string;
  from: string;
  to: string;
  date: string;
}

const ChatPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId || !user) return;
      try {
        const bookingDoc = await getDoc(doc(db, "bookings", bookingId));
        if (!bookingDoc.exists()) return;
        const bData = bookingDoc.data() as BookingData;
        setBooking(bData);

        const tripDoc = await getDoc(doc(db, "trips", bData.tripId));
        if (tripDoc.exists()) {
          const tData = tripDoc.data() as TripData;
          setTrip(tData);
          // Check authorization: must be the passenger or the driver
          if (user.uid === bData.userId || user.uid === tData.driverId) {
            setAuthorized(true);
          }
        }
      } catch (err) {
        console.error("Chat fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized || !booking || !trip || booking.status === "cancelled" || booking.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">{t("chatAvailable")}</p>
          <Link to="/" className="text-primary text-sm hover:underline mt-2 inline-block">{t("back")}</Link>
        </div>
      </div>
    );
  }

  const isDriver = user?.uid === trip.driverId;
  const otherName = isDriver ? booking.passengerName : trip.driverName;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          to={isDriver ? "/driver" : "/passenger"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>

        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            {isDriver ? t("chatWithPassenger") : t("chatWithDriver")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {trip.from} → {trip.to} • {trip.date}
          </p>
        </div>

        <ChatBox
          bookingId={bookingId!}
          tripId={booking.tripId}
          otherUserName={otherName}
        />
      </div>
    </div>
  );
};

export default ChatPage;
