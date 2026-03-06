import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MapPin, Shield, ArrowRight, Car, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing: React.FC = () => {
  const { t } = useLanguage();

  const routes = [
    { from: "Ulaanbaatar", to: "Darkhan", price: "25,000₮", time: "4h" },
    { from: "Ulaanbaatar", to: "Erdenet", price: "35,000₮", time: "6h" },
    { from: "Ulaanbaatar", to: "Kharkhorin", price: "30,000₮", time: "5h" },
    { from: "Darkhan", to: "Sukhbaatar", price: "15,000₮", time: "2h" },
  ];

  const steps = [
    { icon: Search, title: t("step1Title"), desc: t("step1Desc") },
    { icon: MapPin, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Shield, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Car className="h-4 w-4" />
              Mongolia's Rural Transport Platform
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/trips">
                  {t("searchNow")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">{t("becomeDriver")}</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-16">
            {[
              { icon: Users, label: "500+ Riders", sublabel: "Active users" },
              { icon: Car, label: "120+ Drivers", sublabel: "Verified" },
              { icon: Clock, label: "1000+ Trips", sublabel: "Completed" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="font-heading font-bold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">{t("howItWorks")}</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="glass-card rounded-xl p-6 text-center hover-lift">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">{t("popularRoutes")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {routes.map((route, i) => (
              <Link
                key={i}
                to="/trips"
                className="glass-card rounded-xl p-5 hover-lift group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{route.from}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{route.to}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-heading font-bold text-primary">{route.price}</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {route.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <Car className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold mb-4">{t("becomeDriver")}</h2>
          <p className="text-muted-foreground mb-8">{t("becomeDriverDesc")}</p>
          <Button size="lg" asChild>
            <Link to="/register">{t("registerAsDriver")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
