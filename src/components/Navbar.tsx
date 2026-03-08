import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, Menu, X, Shield, Compass, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import ruralLogo from "@/assets/rural-logo.png";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === "/";

  const getDashboardPath = () => {
    if (!profile) return "/";
    switch (profile.role) {
      case "admin": return "/admin";
      case "driver": return "/driver";
      default: return "/passenger";
    }
  };

  const navLinkClass = `text-sm font-medium transition-colors duration-200 ${
    isLanding
      ? "text-primary-foreground/80 hover:text-primary-foreground"
      : "text-foreground/70 hover:text-foreground"
  }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isLanding
        ? "bg-foreground/8 backdrop-blur-2xl border-b border-primary-foreground/8"
        : "bg-card/85 backdrop-blur-2xl border-b border-border/50 shadow-sm"
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className={`flex items-center gap-2 font-heading text-xl font-bold ${
          isLanding ? "text-primary-foreground" : "text-primary"
        }`}>
          <img src={ruralLogo} alt="Rural Transport" className="w-10 h-10 object-contain" />
          Rural Transport
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {!user && <Link to="/" className={`${navLinkClass} px-3 py-2 rounded-lg`}>{t("home")}</Link>}
          <Link to="/trips" className={`${navLinkClass} px-3 py-2 rounded-lg`}>
            {profile?.role === "driver" ? t("myTripsNav") : t("searchTrips")}
          </Link>
          <Link to="/explore" className={`${navLinkClass} px-3 py-2 rounded-lg flex items-center gap-1`}>
            <Compass className="h-3.5 w-3.5" />
            {t("aimags")}
          </Link>

          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLanding ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setLanguage(language === "en" ? "mn" : "en")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLanding ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "MN" : "EN"}
          </button>

          <div className="w-px h-6 bg-border/30 mx-2" />

          {user ? (
            <div className="flex items-center gap-2">
              {profile?.role === "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className={isLanding ? "text-success hover:bg-success/10" : "text-success hover:bg-success/10"}
                >
                  <Shield className="mr-1.5 h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(getDashboardPath())}
                className={isLanding ? "text-primary-foreground hover:bg-primary-foreground/10" : ""}
              >
                {t("dashboard")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => { await logout(); navigate("/"); }}
                className={isLanding ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" : ""}
              >
                {t("logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className={isLanding ? "text-primary-foreground hover:bg-primary-foreground/10" : ""}
              >
                {t("login")}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className={isLanding ? "glow-primary" : ""}
              >
                {t("register")}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${isLanding ? "text-primary-foreground" : "text-foreground"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-card/95 backdrop-blur-xl border-t border-border px-4 py-5 space-y-3 animate-fade-in shadow-lg overflow-y-auto z-50">
          {!user && <Link to="/" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>{t("home")}</Link>}
          <Link to="/trips" className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
            {profile?.role === "driver" ? t("myTripsNav") : t("searchTrips")}
          </Link>
          <Link to="/explore" className="flex items-center gap-2 text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
            <Compass className="h-4 w-4" /> {t("aimags")}
          </Link>
          <button
            onClick={() => { toggleTheme(); }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground py-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            onClick={() => { setLanguage(language === "en" ? "mn" : "en"); setMobileOpen(false); }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground py-2"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "Монгол" : "English"}
          </button>
          <div className="border-t border-border pt-3">
            {user ? (
              <>
                {profile?.role === "admin" && (
                   <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-success py-2" onClick={() => setMobileOpen(false)}>
                     <Shield className="h-4 w-4" /> Admin Panel
                   </Link>
                )}
                <Link to={getDashboardPath()} className="block text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>{t("dashboard")}</Link>
                <button onClick={async () => { await logout(); setMobileOpen(false); navigate("/"); }} className="text-sm text-destructive py-2">{t("logout")}</button>
              </>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate("/login"); setMobileOpen(false); }}>{t("login")}</Button>
                <Button size="sm" className="flex-1" onClick={() => { navigate("/register"); setMobileOpen(false); }}>{t("register")}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
