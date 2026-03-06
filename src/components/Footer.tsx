import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bus } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <Bus className="h-5 w-5" />
            Rural Transport
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">{t("home")}</Link>
            <Link to="/trips" className="hover:text-foreground transition-colors">{t("searchTrips")}</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">{t("login")}</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Rural Transport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
