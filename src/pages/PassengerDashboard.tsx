import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const PassengerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();

  const mockBookings = [
    { id: "1", from: "Ulaanbaatar", to: "Darkhan", date: "2026-03-10", time: "08:00", status: "confirmed", price: 25000 },
    { id: "2", from: "Ulaanbaatar", to: "Erdenet", date: "2026-02-28", time: "07:00", status: "completed", price: 35000 },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading text-2xl font-bold mb-1">
          {profile?.name ? `Welcome, ${profile.name}` : t("dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{t("passenger")} {t("dashboard")}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bookings */}
          <div className="md:col-span-2">
            <h2 className="font-heading font-semibold text-lg mb-4">{t("myBookings")}</h2>
            <div className="space-y-3">
              {mockBookings.map((b) => (
                <div key={b.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <MapPin className="h-3 w-3 text-primary" /> {b.from} → {b.to}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-primary">{b.price.toLocaleString()}₮</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === "completed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-heading font-semibold mb-3">{t("searchTrips")}</h3>
            <p className="text-sm text-muted-foreground mb-4">Find available trips between cities</p>
            <Button asChild className="w-full">
              <a href="/trips">{t("searchNow")}</a>
            </Button>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="font-heading font-semibold mb-3">{t("submitComplaint")}</h3>
            <p className="text-sm text-muted-foreground mb-4">Report issues or provide feedback</p>
            <Button variant="outline" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> {t("submitComplaint")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
