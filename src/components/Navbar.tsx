import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, Menu, X, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = () => {
    if (!profile) return "/";
    switch (profile.role) {
      case "admin": return "/admin";
      case "driver": return "/driver";
      default: return "/passenger";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <Bus className="h-6 w-6" />
          Rural Transport
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">{t("home")}</Link>
          <Link to="/trips" className="text-sm font-medium text-foreground hover:text-primary transition-colors">{t("searchTrips")}</Link>

          <button
            onClick={() => setLanguage(language === "en" ? "mn" : "en")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "MN" : "EN"}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(getDashboardPath())}>
                {t("dashboard")}
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                {t("logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                {t("login")}
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                {t("register")}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 animate-fade-in">
          <Link to="/" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>{t("home")}</Link>
          <Link to="/trips" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>{t("searchTrips")}</Link>
          <button
            onClick={() => { setLanguage(language === "en" ? "mn" : "en"); setMobileOpen(false); }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "Монгол" : "English"}
          </button>
          {user ? (
            <>
              <Link to={getDashboardPath()} className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>{t("dashboard")}</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-destructive">{t("logout")}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>{t("login")}</Link>
              <Link to="/register" className="block text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>{t("register")}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
