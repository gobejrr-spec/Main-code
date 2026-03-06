import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Clock, Users, Plus, Upload, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DriverDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const verified = false; // Would come from Firestore driver doc

  const mockTrips = [
    { id: "1", from: "Ulaanbaatar", to: "Darkhan", date: "2026-03-10", time: "08:00", seats: 3, price: 25000, status: "approved" },
    { id: "2", from: "Ulaanbaatar", to: "Erdenet", date: "2026-03-11", time: "07:00", seats: 4, price: 35000, status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-2xl font-bold mb-1">
          {profile?.name ? `${profile.name}` : t("dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{t("driver")} {t("dashboard")}</p>

        {/* Verification Banner */}
        {!verified && (
          <div className="glass-card rounded-xl p-4 mb-6 border-l-4 border-warning flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">{t("verificationPending")}</p>
              <p className="text-xs text-muted-foreground mt-1">Upload your documents below to get verified</p>
            </div>
          </div>
        )}

        {/* Verification Documents */}
        {!verified && (
          <div className="glass-card rounded-xl p-6 mb-6">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> {t("verification")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "ID Card (Front)", "ID Card (Back)", "Car Certificate",
                "Car Front Photo", "Car Back Photo", "Car Left Photo",
                "Car Right Photo", "Interior Photo",
              ].map((label) => (
                <div key={label} className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <Button className="mt-4">{t("submit")}</Button>
          </div>
        )}

        {/* Create Trip */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">{t("myTrips")}</h2>
          <Button size="sm" onClick={() => setShowCreateTrip(!showCreateTrip)} disabled={!verified}>
            <Plus className="mr-2 h-4 w-4" /> {t("createTrip")}
          </Button>
        </div>

        {showCreateTrip && (
          <div className="glass-card rounded-xl p-6 mb-4 animate-fade-in">
            <h3 className="font-heading font-semibold mb-4">{t("createTrip")}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("from")}</Label>
                <Input placeholder="Ulaanbaatar" />
              </div>
              <div className="space-y-2">
                <Label>{t("to")}</Label>
                <Input placeholder="Darkhan" />
              </div>
              <div className="space-y-2">
                <Label>{t("date")}</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>{t("departureTime")}</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>{t("seats")}</Label>
                <Input type="number" min="1" max="10" placeholder="4" />
              </div>
              <div className="space-y-2">
                <Label>{t("price")} (₮)</Label>
                <Input type="number" placeholder="25000" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button>{t("submit")}</Button>
              <Button variant="outline" onClick={() => setShowCreateTrip(false)}>{t("cancel")}</Button>
            </div>
          </div>
        )}

        {/* Trip List */}
        <div className="space-y-3">
          {mockTrips.map((trip) => (
            <div key={trip.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <MapPin className="h-3 w-3 text-primary" /> {trip.from} → {trip.to}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {trip.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.time}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {trip.seats} {t("seats")}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-heading font-bold text-primary">{trip.price.toLocaleString()}₮</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${trip.status === "approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                  {trip.status === "approved" ? t("approved") : t("pending")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
