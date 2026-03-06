import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  collection, query, where, getDocs, doc, updateDoc, deleteDoc, getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Car, MapPin, CheckCircle, Shield, AlertTriangle, MessageSquare, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PendingDriver {
  id: string;
  userId: string;
  verificationStatus: string;
  userName?: string;
  userPhone?: string;
}

interface PendingTrip {
  id: string;
  driverName: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  status: string;
}

interface Complaint {
  id: string;
  userName?: string;
  message: string;
  createdAt: any;
}

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, drivers: 0, trips: 0, completed: 0 });
  const [pendingDrivers, setPendingDrivers] = useState<PendingDriver[]>([]);
  const [pendingTrips, setPendingTrips] = useState<PendingTrip[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch stats
      const [usersSnap, driversSnap, tripsSnap, completedSnap] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "drivers")),
        getCountFromServer(collection(db, "trips")),
        getCountFromServer(query(collection(db, "trips"), where("status", "==", "completed"))),
      ]);
      setStats({
        users: usersSnap.data().count,
        drivers: driversSnap.data().count,
        trips: tripsSnap.data().count,
        completed: completedSnap.data().count,
      });

      // Fetch pending drivers
      const driversQuery = query(collection(db, "drivers"), where("verificationStatus", "==", "pending"));
      const driversSnapshot = await getDocs(driversQuery);
      const driversList: PendingDriver[] = [];
      for (const driverDoc of driversSnapshot.docs) {
        const driverData = driverDoc.data();
        let userName = "";
        let userPhone = "";
        try {
          const userSnap = await getDocs(query(collection(db, "users")));
          const userDoc = userSnap.docs.find((u) => u.id === driverData.userId);
          if (userDoc) {
            userName = userDoc.data().name || "";
            userPhone = userDoc.data().phone || "";
          }
        } catch {}
        driversList.push({
          id: driverDoc.id,
          userId: driverData.userId,
          verificationStatus: driverData.verificationStatus,
          userName,
          userPhone,
        });
      }
      setPendingDrivers(driversList);

      // Fetch pending trips
      const tripsQuery = query(collection(db, "trips"), where("status", "==", "pending"));
      const tripsSnapshot = await getDocs(tripsQuery);
      setPendingTrips(
        tripsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PendingTrip))
      );

      // Fetch complaints
      const complaintsSnapshot = await getDocs(collection(db, "complaints"));
      const complaintsList: Complaint[] = [];
      for (const cDoc of complaintsSnapshot.docs) {
        const cData = cDoc.data();
        let userName = "";
        try {
          const userSnap = await getDocs(query(collection(db, "users")));
          const userDoc = userSnap.docs.find((u) => u.id === cData.userId);
          if (userDoc) userName = userDoc.data().name || "";
        } catch {}
        complaintsList.push({
          id: cDoc.id,
          userName,
          message: cData.message,
          createdAt: cData.createdAt,
        });
      }
      setComplaints(complaintsList);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDriverAction = async (driverId: string, status: "approved" | "rejected") => {
    setActionLoading(driverId);
    try {
      await updateDoc(doc(db, "drivers", driverId), { verificationStatus: status });
      setPendingDrivers((prev) => prev.filter((d) => d.id !== driverId));
      toast.success(status === "approved" ? "Driver approved!" : "Driver rejected");
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTripAction = async (tripId: string, status: "approved" | "rejected") => {
    setActionLoading(tripId);
    try {
      await updateDoc(doc(db, "trips", tripId), { status });
      setPendingTrips((prev) => prev.filter((t) => t.id !== tripId));
      toast.success(status === "approved" ? "Trip approved!" : "Trip rejected");
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    setActionLoading(complaintId);
    try {
      await deleteDoc(doc(db, "complaints", complaintId));
      setComplaints((prev) => prev.filter((c) => c.id !== complaintId));
      toast.success("Complaint deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = [
    { icon: Users, label: t("totalUsers"), value: stats.users, color: "text-primary" },
    { icon: Car, label: t("totalDrivers"), value: stats.drivers, color: "text-secondary" },
    { icon: MapPin, label: t("totalTrips"), value: stats.trips, color: "text-accent" },
    { icon: CheckCircle, label: t("completedTrips"), value: stats.completed, color: "text-success" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-heading text-2xl font-bold mb-1">Admin {t("dashboard")}</h1>
        <p className="text-sm text-muted-foreground mb-8">Manage platform operations</p>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="font-heading text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Driver Verification */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> {t("manageDrivers")}
            </h2>
            {pendingDrivers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t("noResults")}</p>
            ) : (
              <div className="space-y-3">
                {pendingDrivers.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{d.userName || d.userId}</p>
                      <p className="text-xs text-muted-foreground">{d.userPhone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={actionLoading === d.id}
                        onClick={() => handleDriverAction(d.id, "approved")}
                      >
                        {actionLoading === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : t("approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === d.id}
                        onClick={() => handleDriverAction(d.id, "rejected")}
                      >
                        {t("reject")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trip Management */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> {t("manageTrips")}
            </h2>
            {pendingTrips.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t("noResults")}</p>
            ) : (
              <div className="space-y-3">
                {pendingTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{trip.from} → {trip.to}</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.driverName} · {trip.date} · {trip.time}
                      </p>
                      <p className="text-xs text-primary font-medium">{trip.price?.toLocaleString()}₮ · {trip.seats} {t("seats")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={actionLoading === trip.id}
                        onClick={() => handleTripAction(trip.id, "approved")}
                      >
                        {actionLoading === trip.id ? <Loader2 className="h-3 w-3 animate-spin" /> : t("approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === trip.id}
                        onClick={() => handleTripAction(trip.id, "rejected")}
                      >
                        {t("reject")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Complaints */}
          <div className="glass-card rounded-xl p-6 lg:col-span-2">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-warning" /> {t("manageComplaints")}
            </h2>
            {complaints.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t("noResults")}</p>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div key={c.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{c.userName || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{c.message}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === c.id}
                      onClick={() => handleDeleteComplaint(c.id)}
                    >
                      {actionLoading === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
