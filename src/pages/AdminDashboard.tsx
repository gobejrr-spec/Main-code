import React, { useState, useEffect, useCallback } from "react";
import {
  collection, query, where, getDocs, doc, updateDoc, deleteDoc, getCountFromServer, setDoc, serverTimestamp, getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Users, Car, MapPin, CheckCircle, Shield, AlertTriangle, MessageSquare,
  Loader2, Trash2, Eye, Clock, UserPlus, XCircle, Ban, RefreshCw,
  Phone, Mail, FileText, ChevronDown, ChevronUp, Image, Settings, Save, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: any;
}

interface DriverRecord {
  id: string;
  userId: string;
  verificationStatus: string;
  userName?: string;
  userLastName?: string;
  userPhone?: string;
  userEmail?: string;
  userPlateNo?: string;
  userRegisterNo?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  licenseNumber?: string;
  email?: string;
  photos?: Record<string, string>;
}

interface TripRecord {
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

interface BookingRecord {
  id: string;
  userId: string;
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  seats: number;
  status: string;
  createdAt: any;
  tripFrom?: string;
  tripTo?: string;
  tripDate?: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, drivers: 0, trips: 0, completed: 0 });
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const [allDrivers, setAllDrivers] = useState<DriverRecord[]>([]);
  const [allTrips, setAllTrips] = useState<TripRecord[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "drivers" | "alltrips" | "pendingtrips" | "complaints" | "settings" | "bookings">("users");
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; type: "user" | "driver" } | null>(null);
  const [photoModal, setPhotoModal] = useState<{ url: string; label: string } | null>(null);
  const [pricePerKm, setPricePerKm] = useState<number>(150);
  const [savingSettings, setSavingSettings] = useState(false);

  const PHOTO_LABELS: Record<string, string> = {
    idFront: t("idFront"),
    idBack: t("idBack"),
    vehicleRegistration: t("vehicleRegistration"),
    carFront: t("carFront"),
    carBack: t("carBack"),
    carLeft: t("carLeft"),
    carRight: t("carRight"),
    carInterior: t("carInterior"),
  };

  const fetchData = useCallback(async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
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

      const usersSnapshot = await getDocs(collection(db, "users"));
      setAllUsers(usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserRecord)));

      const driversSnapshot = await getDocs(collection(db, "drivers"));
      const userMap = new Map(usersSnapshot.docs.map(u => [u.id, u.data()]));
      const driversList: DriverRecord[] = driversSnapshot.docs.map(d => {
        const data = d.data();
        const userData = userMap.get(data.userId);
        return {
          id: d.id,
          userId: data.userId,
          verificationStatus: data.verificationStatus || "pending",
          userName: userData?.name || data.driverName || "",
          userLastName: userData?.lastName || data.driverLastName || "",
          userPhone: userData?.phone || data.driverPhone || "",
          userEmail: userData?.email || data.driverEmail || "",
          userPlateNo: userData?.plateNo || "",
          userRegisterNo: userData?.registerNo || data.registerNo || "",
          vehicleType: data.vehicleType || data.carType || "",
          vehiclePlate: data.vehiclePlate || data.plateNumber || userData?.plateNo || "",
          licenseNumber: data.licenseNumber || "",
          email: data.email || data.driverEmail || userData?.email || "",
          photos: data.photos || {},
        };
      });
      setAllDrivers(driversList);

      const tripsSnapshot = await getDocs(collection(db, "trips"));
      setAllTrips(tripsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as TripRecord)));

      const complaintsSnapshot = await getDocs(collection(db, "complaints"));
      const complaintsList: Complaint[] = complaintsSnapshot.docs.map(cDoc => {
        const cData = cDoc.data();
        const userData = userMap.get(cData.userId);
        return {
          id: cDoc.id,
          userName: userData?.name || "",
          message: cData.message,
          createdAt: cData.createdAt,
        };
      });
      setComplaints(complaintsList);

      // Fetch bookings
      const bookingsSnapshot = await getDocs(collection(db, "bookings"));
      const tripMap = new Map(tripsSnapshot.docs.map(t => [t.id, t.data()]));
      const bookingsList: BookingRecord[] = bookingsSnapshot.docs.map(bDoc => {
        const bData = bDoc.data();
        const tripData = tripMap.get(bData.tripId);
        return {
          id: bDoc.id,
          userId: bData.userId,
          tripId: bData.tripId,
          passengerName: bData.passengerName || "",
          passengerPhone: bData.passengerPhone || "",
          seats: bData.seats || 1,
          status: bData.status || "pending",
          createdAt: bData.createdAt,
          tripFrom: tripData?.from || "",
          tripTo: tripData?.to || "",
          tripDate: tripData?.date || "",
        };
      });
      setAllBookings(bookingsList);

      try {
        const settingsDoc = await getDoc(doc(db, "settings", "platform"));
        if (settingsDoc.exists()) {
          setPricePerKm(settingsDoc.data().pricePerKm || 150);
        }
      } catch (e) {
        console.warn("Settings fetch error:", e);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    if (user) fetchData(); 
  }, [user, fetchData]);

  const handleMakeAdmin = async (userId: string) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, "users", userId), { role: "admin" });
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: "admin" } : u));
      toast.success(t("adminRightsGranted"));
    } catch (err) {
      console.error(err);
      toast.error(t("errorOccurred"));
    } finally { setActionLoading(null); }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(t("deleteSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("deleteFailed"));
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`${t("roleUpdated")} "${newRole}"`);
    } catch (err) {
      console.error(err);
      toast.error(t("errorOccurred"));
    } finally { setActionLoading(null); }
  };

  const handleDriverAction = async (driverId: string, status: "approved" | "rejected") => {
    setActionLoading(driverId);
    try {
      await updateDoc(doc(db, "drivers", driverId), { verificationStatus: status });
      const driver = allDrivers.find(d => d.id === driverId);
      if (driver && status === "approved") {
        await setDoc(doc(db, "users", driver.userId), { role: "driver" }, { merge: true });
        setAllUsers(prev => prev.map(u => u.id === driver.userId ? { ...u, role: "driver" } : u));
      }
      setAllDrivers(prev => prev.map(d => d.id === driverId ? { ...d, verificationStatus: status } : d));
      toast.success(status === "approved" ? t("driverApproved") : t("driverRejected"));
    } catch (err) {
      console.error(err);
      toast.error(t("errorOccurred"));
    } finally { setActionLoading(null); }
  };

  const handleDeleteDriver = async (driverId: string) => {
    setActionLoading(driverId);
    try {
      const driver = allDrivers.find(d => d.id === driverId);
      await deleteDoc(doc(db, "drivers", driverId));
      if (driver) {
        await setDoc(doc(db, "users", driver.userId), { role: "passenger" }, { merge: true });
        setAllUsers(prev => prev.map(u => u.id === driver.userId ? { ...u, role: "passenger" } : u));
      }
      setAllDrivers(prev => prev.filter(d => d.id !== driverId));
      toast.success(t("deleteSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("deleteFailed"));
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handleTripAction = async (tripId: string, status: string) => {
    setActionLoading(tripId);
    try {
      await updateDoc(doc(db, "trips", tripId), { status });
      setAllTrips(prev => prev.map(t => t.id === tripId ? { ...t, status } : t));
      toast.success(
        status === "approved" ? t("tripApproved") :
        status === "cancelled" ? t("tripCancelled") : t("tripRejected")
      );
    } catch (err) {
      console.error(err);
      toast.error(t("errorOccurred"));
    } finally { setActionLoading(null); }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    setActionLoading(complaintId);
    try {
      await deleteDoc(doc(db, "complaints", complaintId));
      setComplaints(prev => prev.filter(c => c.id !== complaintId));
      toast.success(t("complaintDeleted"));
    } catch (err) {
      console.error(err);
      toast.error(t("deleteFailed"));
    } finally { setActionLoading(null); }
  };

  const handleBookingAction = async (bookingId: string, status: "confirmed" | "rejected") => {
    setActionLoading(bookingId);
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status });
      setAllBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      toast.success(status === "confirmed" ? t("bookingConfirmed") : t("bookingRejected"));
    } catch (err) {
      console.error(err);
      toast.error(t("errorOccurred"));
    } finally { setActionLoading(null); }
  };

  const pendingDrivers = allDrivers.filter(d => d.verificationStatus === "pending");
  const pendingTrips = allTrips.filter(t => t.status === "pending");
  const pendingBookings = allBookings.filter(b => b.status === "pending");

  const statCards = [
    { icon: Users, label: t("totalUsers"), value: stats.users, color: "from-primary to-primary-glow" },
    { icon: Car, label: t("totalDrivers"), value: stats.drivers, color: "from-secondary to-warning" },
    { icon: MapPin, label: t("totalTrips"), value: stats.trips, color: "from-accent to-success" },
    { icon: CheckCircle, label: t("completedTrips"), value: stats.completed, color: "from-success to-accent" },
  ];

  const tabs = [
    { key: "users" as const, label: t("usersTab"), icon: Users, count: allUsers.length },
    { key: "drivers" as const, label: t("driversTab"), icon: Car, count: allDrivers.length, badge: pendingDrivers.length },
    { key: "bookings" as const, label: t("bookingsTab"), icon: CreditCard, count: allBookings.length, badge: pendingBookings.length },
    { key: "pendingtrips" as const, label: t("pendingTripsTab"), icon: Clock, count: pendingTrips.length },
    { key: "alltrips" as const, label: t("allTripsTab"), icon: MapPin, count: allTrips.length },
    { key: "complaints" as const, label: t("complaintsTab"), icon: MessageSquare, count: complaints.length },
    { key: "settings" as const, label: t("settingsTab"), icon: Settings, count: 0 },
  ];

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, "settings", "platform"), { pricePerKm }, { merge: true });
      toast.success(t("settingsSaved"));
    } catch (err) {
      console.error(err);
      toast.error(t("settingsSaveFailed"));
    } finally {
      setSavingSettings(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      approved: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      rejected: "bg-destructive/10 text-destructive",
      cancelled: "bg-muted text-muted-foreground",
      completed: "bg-primary/10 text-primary",
    };
    const labelMap: Record<string, string> = {
      approved: t("approved"), pending: t("pending"), rejected: t("rejected"),
      cancelled: t("cancelled"), completed: t("completed"),
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || "bg-muted text-muted-foreground"}`}>
        {labelMap[status] || status}
      </span>
    );
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin: "bg-success/10 text-success",
      driver: "bg-primary/10 text-primary",
      passenger: "bg-secondary/10 text-secondary",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[role] || "bg-muted text-muted-foreground"}`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 flex items-center justify-between animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Shield className="h-3 w-3" /> {t("admin")}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">{t("adminDashboard")}</h1>
            <p className="text-muted-foreground mt-1">{t("managePlatform")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> {t("refresh")}
          </Button>
        </div>

        {/* Stats */}
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md glow-primary"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {(tab.badge ?? 0) > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card-elevated rounded-2xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: "300ms" }}>

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> {t("allUsers")} ({allUsers.length})
              </h2>
              {allUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t("noUsersFound")}</p>
              ) : (
                <div className="space-y-2">
                  {allUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{u.name || t("unnamed")}</p>
                            {roleBadge(u.role)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            {u.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</span>}
                            {u.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{u.phone}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.role !== "admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-success border-success/30 hover:bg-success/10"
                            disabled={actionLoading === u.id}
                            onClick={() => handleMakeAdmin(u.id)}
                          >
                            {actionLoading === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><UserPlus className="mr-1 h-3 w-3" />{t("makeAdmin")}</>}
                          </Button>
                        )}
                        {u.role === "driver" && (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => handleUpdateUserRole(u.id, "passenger")} disabled={actionLoading === u.id}>
                            {t("makePassenger")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => setDeleteConfirm({ id: u.id, name: u.name || u.email, type: "user" })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DRIVERS TAB */}
          {activeTab === "drivers" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" /> {t("allDrivers")} ({allDrivers.length})
              </h2>
              {allDrivers.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t("noDriversFound")}</p>
              ) : (
                <div className="space-y-3">
                  {allDrivers.map((d) => (
                    <div key={d.id} className="rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                            <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{d.userLastName ? `${d.userLastName} ${d.userName}` : d.userName || d.userId}</p>
                              {statusBadge(d.verificationStatus)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              {d.userPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{d.userPhone}</span>}
                              {d.vehicleType && <span className="flex items-center gap-1"><Car className="h-3 w-3" />{d.vehicleType}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedDriver(expandedDriver === d.id ? null : d.id)}
                          >
                            <Eye className="mr-1 h-3 w-3" /> {t("details")}
                            {expandedDriver === d.id ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                          </Button>
                          {d.verificationStatus === "pending" && (
                            <>
                              <Button size="sm" disabled={actionLoading === d.id} onClick={() => handleDriverAction(d.id, "approved")}>
                                {actionLoading === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : t("approve")}
                              </Button>
                              <Button size="sm" variant="outline" disabled={actionLoading === d.id} onClick={() => handleDriverAction(d.id, "rejected")}>
                                {t("reject")}
                              </Button>
                            </>
                          )}
                          {d.verificationStatus === "rejected" && (
                            <Button size="sm" variant="outline" disabled={actionLoading === d.id} onClick={() => handleDriverAction(d.id, "approved")}>
                              {t("reApprove")}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            disabled={actionLoading === d.id}
                            onClick={() => setDeleteConfirm({ id: d.id, name: d.userLastName ? `${d.userLastName} ${d.userName}` : d.userName || d.userId, type: "driver" })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {expandedDriver === d.id && (
                        <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-0">
                          <div className="grid sm:grid-cols-2 gap-3 pt-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("fullName")}:</span>
                              <span className="font-medium">{d.userLastName ? `${d.userLastName} ${d.userName}` : d.userName || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("phoneLabel")}:</span>
                              <span className="font-medium">{d.userPhone || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("vehicle")}:</span>
                              <span className="font-medium">{d.vehicleType || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("plateNo")}:</span>
                              <span className="font-medium">{d.vehiclePlate || d.userPlateNo || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("registerNoLabel")}:</span>
                              <span className="font-medium">{d.userRegisterNo || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("driverLicense")}:</span>
                              <span className="font-medium">{d.licenseNumber || "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{t("email")}:</span>
                              <span className="font-medium">{d.userEmail || d.email || "—"}</span>
                            </div>
                          </div>

                          {d.photos && Object.keys(d.photos).length > 0 ? (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                <Image className="h-4 w-4 text-primary" /> {t("uploadedPhotos")}
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {Object.entries(d.photos).map(([key, url]) => (
                                  <div
                                    key={key}
                                    className="relative rounded-lg overflow-hidden aspect-[4/3] cursor-pointer group border border-border"
                                    onClick={() => setPhotoModal({ url, label: PHOTO_LABELS[key] || key })}
                                  >
                                    <img src={url} alt={PHOTO_LABELS[key] || key} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                      <span className="text-[10px] text-white font-medium">{PHOTO_LABELS[key] || key}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">{t("noPhotosUploaded")}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PENDING TRIPS TAB */}
          {activeTab === "pendingtrips" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" /> {t("pendingTripsTitle")} ({pendingTrips.length})
              </h2>
              {pendingTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-muted-foreground font-medium">{t("noPendingTrips")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-warning" />
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
                        <Button size="sm" disabled={actionLoading === trip.id} onClick={() => handleTripAction(trip.id, "approved")}>
                          {actionLoading === trip.id ? <Loader2 className="h-3 w-3 animate-spin" /> : t("approve")}
                        </Button>
                        <Button size="sm" variant="outline" disabled={actionLoading === trip.id} onClick={() => handleTripAction(trip.id, "rejected")}>
                          {t("reject")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ALL TRIPS TAB */}
          {activeTab === "alltrips" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> {t("allTripsTitle")} ({allTrips.length})
              </h2>
              {allTrips.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">{t("noTripsFoundAdmin")}</p>
              ) : (
                <div className="space-y-2">
                  {allTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{trip.from} → {trip.to}</p>
                            {statusBadge(trip.status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{trip.driverName}</span>
                            <span>{trip.date} {trip.time}</span>
                            <span>{trip.seats} {t("seats")}</span>
                            <span className="font-medium text-primary">{trip.price?.toLocaleString()}₮</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(trip.status === "approved" || trip.status === "pending") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            disabled={actionLoading === trip.id}
                            onClick={() => handleTripAction(trip.id, "cancelled")}
                          >
                            {actionLoading === trip.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Ban className="mr-1 h-3 w-3" />{t("cancelAction2")}</>}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMPLAINTS TAB */}
          {activeTab === "complaints" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-warning" /> {t("complaintsTitle")} ({complaints.length})
              </h2>
              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-muted-foreground font-medium">{t("noComplaints")}</p>
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
                          <p className="font-medium text-sm">{c.userName || t("unnamed")}</p>
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

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div>
              <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> {t("platformSettings")}
              </h2>
              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("pricePerKm")}</label>
                  <p className="text-xs text-muted-foreground">{t("pricePerKmDesc")}</p>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={pricePerKm}
                      onChange={(e) => setPricePerKm(Number(e.target.value))}
                      min={1}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground">₮/км</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">{t("exampleCalc")}</p>
                  <p className="font-medium">100 км × {pricePerKm}₮ = <span className="text-primary font-bold">{(100 * pricePerKm).toLocaleString()}₮</span></p>
                  <p className="font-medium mt-1">500 км × {pricePerKm}₮ = <span className="text-primary font-bold">{(500 * pricePerKm).toLocaleString()}₮</span></p>
                </div>
                <Button onClick={handleSaveSettings} disabled={savingSettings}>
                  {savingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {t("saveBtn")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deleteConfirm?.type === "driver" ? t("deleteDriverRecord") : t("deleteUser")}</DialogTitle>
            <DialogDescription>
              "{deleteConfirm?.name}" {deleteConfirm?.type === "driver" ? t("deleteDriverSuffix") : t("deleteUserSuffix")} {t("deleteConfirmMsg")} {t("cannotUndo")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>{t("stopAction")}</Button>
            <Button
              variant="destructive"
              disabled={actionLoading === deleteConfirm?.id}
              onClick={() => deleteConfirm && (deleteConfirm.type === "driver" ? handleDeleteDriver(deleteConfirm.id) : handleDeleteUser(deleteConfirm.id))}
            >
              {actionLoading === deleteConfirm?.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Fullscreen Modal */}
      <Dialog open={!!photoModal} onOpenChange={() => setPhotoModal(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader className="px-4 pt-3">
            <DialogTitle>{photoModal?.label}</DialogTitle>
          </DialogHeader>
          {photoModal && (
            <img src={photoModal.url} alt={photoModal.label} className="w-full rounded-lg object-contain max-h-[70vh]" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
