import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Shield, ArrowRight, Car, Users, Clock, Star, Loader2, CheckCircle, Phone, CreditCard, Compass, Route, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-landscape.jpg";
import heroNightImage from "@/assets/hero-night.jpg";
import { useTheme } from "@/components/ThemeProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Landing: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, drivers: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    if (user && profile) {
      switch (profile.role) {
        case "admin": navigate("/admin", { replace: true }); break;
        case "driver": navigate("/driver", { replace: true }); break;
        default: navigate("/passenger", { replace: true }); break;
      }
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsDoc = await getDoc(doc(db, "settings", "stats"));
        if (statsDoc.exists()) {
          const data = statsDoc.data();
          setStats({ users: data.users || 0, drivers: data.drivers || 0 });
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoaded(true);
      }
    };
    fetchStats();
  }, []);

  const steps = [
    {
      icon: Search,
      title: t("step1Title"),
      desc: t("step1Desc"),
      color: "from-primary to-primary-glow",
      step: "01",
    },
    {
      icon: CheckCircle,
      title: t("step2Title"),
      desc: t("step2Desc"),
      color: "from-secondary to-warning",
      step: "02",
    },
    {
      icon: CreditCard,
      title: t("step3Title"),
      desc: t("step3Desc"),
      color: "from-accent to-success",
      step: "03",
    },
    {
      icon: Shield,
      title: t("step4Title"),
      desc: t("step4Desc"),
      color: "from-primary to-accent",
      step: "04",
    },
  ];

  const features = [
    { icon: Shield, title: t("verifiedDriver"), desc: t("verifiedDriverDesc") },
    { icon: Zap, title: t("fastBooking"), desc: t("fastBookingDesc") },
    { icon: Route, title: t("allProvinces"), desc: t("allProvincesDesc") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Mongolia" className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
          <img src={heroNightImage} alt="Mongolia night" className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-7 animate-fade-in">
              {t("heroTitle").split("|").map((part, i) => 
                i === 0 ? <span key={i} className="text-gradient">{part} </span> : <span key={i}>{part}</span>
              )}
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-lg leading-relaxed animate-fade-in" style={{ animationDelay: "100ms" }}>
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Button size="lg" className="text-base px-8 py-6 glow-primary hover-scale rounded-xl" asChild>
                <Link to="/trips">
                  {t("searchNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/10 hover-scale rounded-xl" asChild>
                <Link to="/explore">
                  <Compass className="mr-2 h-5 w-5" />
                  {t("viewProvinces")}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
              {[
                { icon: Users, val: statsLoaded ? `${stats.users}+` : "...", label: t("passengers") },
                { icon: Car, val: statsLoaded ? `${stats.drivers}+` : "...", label: t("drivers") },
                { icon: Star, val: "4.8", label: t("rating") },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <s.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-xl leading-none">{s.val}</p>
                    <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-soft">
          <div className="w-6 h-10 rounded-full border-2 border-white/25 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/40 animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="relative -mt-14 z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="glass-card-elevated rounded-2xl p-5 flex items-center gap-4 hover-lift animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-accent/4 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase bg-primary/8 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4" />
              {t("howItWorks")}
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-6 leading-tight">
              {t("simpleAndReliable").split("&")[0]}& <span className="text-gradient">{t("simpleAndReliable").split("&")[1]?.trim() || ""}</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md mx-auto text-lg">
              {t("stepsSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-stagger">
            {steps.map((step, i) => (
              <div key={i} className="group glass-card-elevated rounded-2xl p-7 hover-lift relative overflow-hidden">
                <div className="absolute top-4 right-4 font-heading text-7xl font-bold text-muted/30 leading-none select-none group-hover:text-primary/10 transition-colors duration-500">
                  {step.step}
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - only show for non-logged-in users */}
      {!user && (
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-foreground/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-[150px] animate-float" style={{ animationDelay: "2s" }} />
          </div>
          <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-primary-foreground/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 animate-bounce-soft border border-primary-foreground/15">
              <MapPin className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              {t("registerNow")}
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              {t("registerNowDesc")}
            </p>
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-10 py-6 hover-scale rounded-xl shadow-xl" asChild>
              <Link to="/register">
                {t("register")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;
