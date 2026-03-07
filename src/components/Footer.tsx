import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail } from "lucide-react";
import ruralLogo from "@/assets/rural-logo.png";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-primary-foreground/80 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary-foreground mb-4">
              <img src={ruralLogo} alt="Rural" className="w-8 h-8 object-contain brightness-0 invert" />
              Rural
            </Link>
            <p className="text-sm text-primary-foreground/50 max-w-sm leading-relaxed">
              Монгол даяар найдвартай жолоочтой холбогдож, аюулгүй, хямд тээврийн үйлчилгээ.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wide">Холбоосууд</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t("home")}</Link>
              <Link to="/trips" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t("searchTrips")}</Link>
              <Link to="/explore" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">Аймгууд</Link>
              <Link to="/register" className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t("register")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wide">Холбоо барих</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <MapPin className="h-4 w-4" /> Улаанбаатар, Монгол
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Phone className="h-4 w-4" /> +976 7777 8888
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/50">
                <Mail className="h-4 w-4" /> info@rural.mn
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-xs text-primary-foreground/30">© 2026 Rural. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
