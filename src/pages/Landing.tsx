import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Shield, ArrowRight, Car, Users, Clock, Star, Sparkles, Loader2, CheckCircle, Phone, CreditCard, Compass, Route, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-landscape.jpg";
import heroNightImage from "@/assets/hero-night.jpg";
import { useTheme } from "@/components/ThemeProvider";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Landing: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({ users: 0, drivers: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, driversSnap] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "drivers")),
        ]);
        setStats({ users: usersSnap.data().count, drivers: driversSnap.data().count });
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
      title: "Чиглэл хайх",
      desc: "Аймаг, сумаа сонгоод тохирох аялалыг олоорой",
      color: "from-primary to-primary-glow",
      step: "01",
    },
    {
      icon: CheckCircle,
      title: "Жолоочийн мэдээлэл",
      desc: "Жолоочийн нэр, утас, машин, суудлын мэдээллийг бүрэн харна",
      color: "from-secondary to-warning",
      step: "02",
    },
    {
      icon: CreditCard,
      title: "QPay төлбөр",
      desc: "QPay-ээр 5 минутын дотор төлбөрөө баталгаажуулна",
      color: "from-accent to-success",
      step: "03",
    },
    {
      icon: Shield,
      title: "Аюулгүй аялах",
      desc: "Баталгаажсан жолоочтой уулзаж аялалаа эхлүүлнэ",
      color: "from-primary to-accent",
      step: "04",
    },
  ];

  const features = [
    { icon: Shield, title: "Баталгаатай жолооч", desc: "Бүх жолооч бичиг баримтаар баталгаажсан" },
    { icon: Zap, title: "Хурдан захиалга", desc: "Хэдхэн товшилтоор аялалаа захиалаарай" },
    { icon: Route, title: "21 аймаг", desc: "Монгол даяарх бүх чиглэлд үйлчилнэ" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Монгол тал" className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
          <img src={heroNightImage} alt="Монгол шөнө" className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-xl text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full mb-10 animate-fade-in border border-primary-foreground/15">
              <Sparkles className="h-4 w-4 text-warning" />
              Монголын #1 Хөдөө Тээврийн Платформ
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground leading-[1.05] mb-7 animate-fade-in" style={{ animationDelay: "100ms" }}>
              {t("heroTitle")}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/75 mb-12 max-w-lg leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Button size="lg" className="text-base px-8 py-6 glow-primary hover-scale rounded-xl" asChild>
                <Link to="/trips">
                  {t("searchNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-primary-foreground/8 backdrop-blur-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/15 hover-scale rounded-xl" asChild>
                <Link to="/explore">
                  <Compass className="mr-2 h-5 w-5" />
                  Аймгууд үзэх
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
              {[
                { icon: Users, val: statsLoaded ? `${stats.users}+` : "...", label: "Зорчигч" },
                { icon: Car, val: statsLoaded ? `${stats.drivers}+` : "...", label: "Жолооч" },
                { icon: Star, val: "4.8", label: "Үнэлгээ" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary-foreground/8 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/15">
                    <s.icon className="h-5 w-5 text-primary-foreground/90" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary-foreground text-xl leading-none">{s.val}</p>
                    <p className="text-xs text-primary-foreground/50 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-soft">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-primary-foreground/50 animate-pulse-soft" />
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
              Хялбар & <span className="text-gradient">Найдвартай</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md mx-auto text-lg">
              4 алхамаар аюулгүй, хямд аялалаа захиалаарай
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
              Одоо бүртгүүлээрэй
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-12 max-w-md mx-auto leading-relaxed">
              Бүртгүүлж, Монгол даяарх аялалуудыг хайж, захиалаарай
            </p>
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-10 py-6 hover-scale rounded-xl shadow-xl" asChild>
              <Link to="/register">
                Бүртгүүлэх
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
