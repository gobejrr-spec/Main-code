import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "@/components/Logo";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[hsl(222,32%,8%)] text-white/80 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-white mb-4">
              <Logo size={28} className="text-white" />
              Rural
            </Link>
            <p className="text-sm text-white/50 max-w-sm leading-relaxed">
              {t("footerDesc")}
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wide">{t("links")}</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-white/50 hover:text-white transition-colors">{t("home")}</Link>
              <Link to="/trips" className="block text-sm text-white/50 hover:text-white transition-colors">{t("searchTrips")}</Link>
              <Link to="/explore" className="block text-sm text-white/50 hover:text-white transition-colors">{t("aimags")}</Link>
              <Link to="/register" className="block text-sm text-white/50 hover:text-white transition-colors">{t("register")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wide">{t("contactUs")}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin className="h-4 w-4" /> Улаанбаатар, Монгол
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="h-4 w-4" /> +976 88744721
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="h-4 w-4" /> emongontsetseg0@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
