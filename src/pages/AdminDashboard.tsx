import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  collection, query, where, getDocs, doc, updateDoc, deleteDoc, getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Users, Car, MapPin, CheckCircle, Shield, AlertTriangle, MessageSquare,
  Loader2, Trash2, Eye, Clock
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"drivers" | "trips" | "complaints">("drivers");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
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

      const driversQuery = query(collection(db, "drivers"), where("verificationStatus", "==", "pending"));
      const driversSnapshot = await getDocs(driversQuery);
      const driversList: PendingDriver[] = [];
      for (const driverDoc of driversSnapshot.docs) {
        const driverData = driverDoc.data();
        let userName = "";
        let userPhone = "";
        try {
          const userSnap = await getDocs(collection(db, "users"));
          const userDoc = userSnap.docs.find((u) => u.id === driverData.userId);
          if (userDoc) {
            userName = userDoc.data().name || "";
            userPhone = userDoc.data().phone || "";
          }
        } catch {}
        driversList.push({ id: driverDoc.id, userId: driverData.userId, verificationStatus: driverData.verificationStatus, userName, userPhone });
      }
      setPendingDrivers(driversList);

      const tripsQuery = query(collection(db, "trips"), where("status", "==", "pending"));
      const tripsSnapshot = await getDocs(tripsQuery);
      setPendingTrips(tripsSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PendingTrip)));

      const complaintsSnapshot = await getDocs(collection(db, "complaints"));
      const complaintsList: Complaint[] = [];
      for (const cDoc of complaintsSnapshot.docs) {
        const cData = cDoc.data();
        let userName = "";
        try {
          const userSnap = await getDocs(collection(db, "users"));
          const userDoc = userSnap.docs.find((u) => u.id === cData.userId);
          if (userDoc) userName = userDoc.data().name || "";
        } catch {}
        complaintsList.push({ id: cDoc.id, userName, message: cData.message, createdAt: cData.createdAt });
      }
      setComplaints(complaintsList);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDriverAction = async (driverId: string, status: "approved" | "rejected") => {
    setActionLoading(driverId);
    try {
      await updateDoc(doc(db, "drivers", driverId), { verificationStatus: status });
      setPendingDrivers((prev) => prev.filter((d) => d.id !== driverId));
      toast.success(status === "approved" ? "Жолооч зөвшөөрөгдлөө!" : "Жолооч татгалзсан");
    } catch (err) {
      console.error(err);
      toast.error("Алдаа гарлаа");
    } finally { setActionLoading(null); }
  };

  const handleTripAction = async (tripId: string, status: "approved" | "rejected") => {
    setActionLoading(tripId);
    try {
      await updateDoc(doc(db, "trips", tripId), { status });
      setPendingTrips((prev) => prev.filter((t) => t.id !== tripId));
      toast.success(status === "approved" ? "Аялал зөвшөөрөгдлөө!" : "Аялал татгалзсан");
    } catch (err) {
      console.error(err);
      toast.error("Алдаа гарлаа");
    } finally { setActionLoading(null); }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    setActionLoading(complaintId);
    try {
      await deleteDoc(doc(db, "complaints", complaintId));
      setComplaints((prev) => prev.filter((c) => c.id !== complaintId));
      toast.success("Гомдол устгагдлаа");
    } catch (err) {
      console.error(err);
      toast.error("Устгах амжилтгүй");
    } finally { setActionLoading(null); }
  };

  const statCards = [
    { icon: Users, label: "Нийт хэрэглэгчид", value: stats.users, color: "from-primary to-primary-glow" },
    { icon: Car, label: "Нийт жолоочид", value: stats.drivers, color: "from-secondary to-warning" },
    { icon: MapPin, label: "Нийт аялалууд", value: stats.trips, color: "from-accent to-success" },
    { icon: CheckCircle, label: "Дууссан аялалууд", value: stats.completed, color: "from-success to-accent" },
  ];

  const tabs = [
    { key: "drivers" as const, label: "Жолоочдыг удирдах", icon: Shield, count: pendingDrivers.length },
    { key: "trips" as const, label: "Аялалуудыг удирдах", icon: MapPin, count: pendingTrips.length },
    { key: "complaints" as const, label: "Гомдлууд", icon: MessageSquare, count: complaints.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Shield className="h-3 w-3" /> АДМИН
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Хянах самбар</h1>
          <p className="text-muted-foreground mt-1">Платформыг удирдах</p>
        </div>

        {/* Stats - real numbers, no fake % */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 animate-stagger">
          {statCards.map((stat, i) => (
            <div key={i} className="glass-card-elevated rounded-2xl p-6 hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md glow-primary"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card-elevated rounded-2xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
          {activeTab === "drivers" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Жолоочийн баталгаажуулалт
              </h2>
              {pendingDrivers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-muted-foreground font-medium">Хүлээгдэж буй баталгаажуулалт байхгүй</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDrivers.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{d.userName || d.userId}</p>
                          <p className="text-xs text-muted-foreground">{d.userPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="mr-1 h-3 w-3" /> Бичиг баримт
                        </Button>
                        <Button size="sm" disabled={actionLoading === d.id} onClick={() => handleDriverAction(d.id, "approved")} className="hover-scale">
                          {actionLoading === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Зөвшөөрөх"}
                        </Button>
                        <Button size="sm" variant="outline" disabled={actionLoading === d.id} onClick={() => handleDriverAction(d.id, "rejected")}>
                          Татгалзах
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "trips" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> Аялалын зөвшөөрөл
              </h2>
              {pendingTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-muted-foreground font-medium">Хүлээгдэж буй аялал байхгүй</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{trip.from} → {trip.to}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{trip.driverName}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.date} {trip.time}</span>
                            <span className="font-medium text-primary">{trip.price?.toLocaleString()}₮</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" disabled={actionLoading === trip.id} onClick={() => handleTripAction(trip.id, "approved")} className="hover-scale">
                          {actionLoading === trip.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Зөвшөөрөх"}
                        </Button>
                        <Button size="sm" variant="outline" disabled={actionLoading === trip.id} onClick={() => handleTripAction(trip.id, "rejected")}>
                          Татгалзах
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "complaints" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-warning" /> Гомдол & Санал
              </h2>
              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-muted-foreground font-medium">Гомдол байхгүй!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <div key={c.id} className="flex items-start justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center mt-0.5">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{c.userName || "Нэргүй"}</p>
                          <p className="text-sm text-muted-foreground mt-1">{c.message}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" disabled={actionLoading === c.id} onClick={() => handleDeleteComplaint(c.id)}>
                        {actionLoading === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
