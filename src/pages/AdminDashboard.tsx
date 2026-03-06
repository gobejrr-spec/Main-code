import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Car, MapPin, CheckCircle, Shield, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, label: t("totalUsers"), value: "523", color: "text-primary" },
    { icon: Car, label: t("totalDrivers"), value: "127", color: "text-secondary" },
    { icon: MapPin, label: t("totalTrips"), value: "1,048", color: "text-accent" },
    { icon: CheckCircle, label: t("completedTrips"), value: "892", color: "text-success" },
  ];

  const pendingDrivers = [
    { id: "1", name: "Ganbaatar", phone: "+976 9911 1111", status: "pending" },
    { id: "2", name: "Oyunbileg", phone: "+976 9922 2222", status: "pending" },
  ];

  const pendingTrips = [
    { id: "1", driver: "Batbold", from: "Ulaanbaatar", to: "Darkhan", date: "2026-03-15" },
    { id: "2", driver: "Munkh-Erdene", from: "Erdenet", to: "Murun", date: "2026-03-16" },
  ];

  const complaints = [
    { id: "1", user: "Sarnai", message: "Driver was 30 minutes late", date: "2026-03-05" },
    { id: "2", user: "Temuujin", message: "Car was not clean", date: "2026-03-04" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-heading text-2xl font-bold mb-1">Admin {t("dashboard")}</h1>
        <p className="text-sm text-muted-foreground mb-8">Manage platform operations</p>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
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
            <div className="space-y-3">
              {pendingDrivers.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">{t("approve")}</Button>
                    <Button size="sm" variant="outline">{t("reject")}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Management */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> {t("manageTrips")}
            </h2>
            <div className="space-y-3">
              {pendingTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{trip.from} → {trip.to}</p>
                    <p className="text-xs text-muted-foreground">{trip.driver} · {trip.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">{t("approve")}</Button>
                    <Button size="sm" variant="outline">{t("reject")}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaints */}
          <div className="glass-card rounded-xl p-6 lg:col-span-2">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-warning" /> {t("manageComplaints")}
            </h2>
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{c.user}</p>
                      <p className="text-sm text-muted-foreground">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">{t("delete")}</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
