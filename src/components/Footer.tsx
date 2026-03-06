import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bus, MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-primary-foreground/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-heading text-xl font-bold text-primary-foreground mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bus className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              Rural Transport
            </Link>
            <p className="text-sm text-primary-foreground/50 max-w-sm leading-relaxed">
              Connecting passengers with trusted rural drivers across Mongolia. Safe, affordable, and reliable transportation.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wide">Links</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t("home")}</Link>
              <Link to="/trips" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t("searchTrips")}</Link>
              <Link to="/register" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t("register")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <MapPin className="h-4 w-4" /> Ulaanbaatar, Mongolia
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Phone className="h-4 w-4" /> +976 7777 8888
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Mail className="h-4 w-4" /> info@ruraltransport.mn
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-xs text-primary-foreground/30">© 2026 Rural Transport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
