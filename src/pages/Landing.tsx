import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MapPin, Shield, ArrowRight, Car, Users, Clock, Star, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-landscape.jpg";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Landing: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ users: 0, drivers: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, driversSnap] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "drivers")),
        ]);
        setStats({
          users: usersSnap.data().count,
          drivers: driversSnap.data().count,
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoaded(true);
      }
    };
    fetchStats();
  }, []);

  const routes = [
    { from: "Улаанбаатар", to: "Дархан-Уул", price: "25,000₮", time: "4ц", emoji: "🏙️" },
    { from: "Улаанбаатар", to: "Орхон", price: "35,000₮", time: "6ц", emoji: "⛏️" },
    { from: "Улаанбаатар", to: "Өвөрхангай", price: "30,000₮", time: "5ц", emoji: "🏛️" },
    { from: "Дархан-Уул", to: "Сэлэнгэ", price: "15,000₮", time: "2ц", emoji: "🌿" },
  ];

  const steps = [
    { icon: Search, title: t("step1Title"), desc: t("step1Desc"), color: "from-primary to-primary-glow" },
    { icon: MapPin, title: t("step2Title"), desc: t("step2Desc"), color: "from-secondary to-warning" },
    { icon: Shield, title: t("step3Title"), desc: t("step3Desc"), color: "from-accent to-success" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Mongolian steppe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md text-primary-foreground text-sm font-medium px-4 py-2 rounded-full mb-8 animate-fade-in border border-primary-foreground/20">
              <Sparkles className="h-4 w-4" />
              Монголын #1 Хөдөө Тээврийн Платформ
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              {t("heroTitle")}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Button size="lg" className="text-base px-8 py-6 glow-primary hover-scale" asChild>
                <Link to="/trips">
                  {t("searchNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-primary-foreground/10 backdrop-blur-md border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover-scale" asChild>
                <Link to="/register">{t("becomeDriver")}</Link>
              </Button>
            </div>

            {/* Stats - real from Firebase */}
            <div className="flex items-center gap-8 mt-14 animate-fade-in" style={{ animationDelay: "400ms" }}>
              {[
                { icon: Users, val: statsLoaded ? `${stats.users}+` : "...", label: "Зорчигч" },
                { icon: Car, val: statsLoaded ? `${stats.drivers}+` : "...", label: "Жолооч" },
                { icon: Star, val: "4.8", label: "Үнэлгээ" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
                    <s.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary-foreground text-lg leading-none">{s.val}</p>
                    <p className="text-xs text-primary-foreground/60">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm tracking-wide uppercase">{t("howItWorks")}</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-3">
              Хялбар & <span className="text-gradient">Найдвартай</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-stagger">
            {steps.map((step, i) => (
              <div key={i} className="group glass-card-elevated rounded-2xl p-8 text-center hover-lift">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="w-8 h-8 rounded-full bg-muted text-foreground font-heading font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-heading font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-medium text-sm tracking-wide uppercase">Эрэлттэй чиглэлүүд</span>
              <h2 className="font-heading text-4xl font-bold mt-3">Шилдэг чиглэлүүд</h2>
            </div>
            <Link to="/trips" className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Бүгдийг харах <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-stagger">
            {routes.map((route, i) => (
              <Link key={i} to="/trips" className="group glass-card-elevated rounded-2xl p-6 hover-lift">
                <div className="text-3xl mb-4">{route.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{route.from}</span>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm font-medium">{route.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xl text-primary">{route.price}</span>
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Clock className="h-3.5 w-3.5" /> {route.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 animate-bounce-soft border border-primary-foreground/20">
            <Car className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">{t("becomeDriver")}</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-md mx-auto">{t("becomeDriverDesc")}</p>
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-10 py-6 hover-scale" asChild>
            <Link to="/register">
              {t("registerAsDriver")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
