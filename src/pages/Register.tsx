import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Car, Eye, EyeOff, Phone } from "lucide-react";
import { toast } from "sonner";
import ruralLogo from "@/assets/rural-logo.png";

const Register: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    plateNo: "",
    registerNo: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "passenger" as "passenger" | "driver",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (form.role === "driver" && !form.lastName) {
      toast.error("Овог бөглөнө үү");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Нууц үг таарахгүй байна");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Нууц үг хамгийн багадаа 8 тэмдэгт байна");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 8) {
      toast.error("Утасны дугаар зөв оруулна уу");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Зөв имэйл хаяг оруулна уу");
      return;
    }
    if (form.role === "driver" && !/^[а-яА-ЯөӨүҮёЁ]{2}\d{8}$/.test(form.registerNo)) {
      toast.error("Регистрийн дугаар буруу байна (2 кирилл үсэг + 8 тоо)");
      return;
    }
    if (form.role === "driver" && !/^[а-яА-ЯөӨүҮёЁ\s-]+$/.test(form.name)) {
      toast.error("Жолоочийн нэрийг зөвхөн кирилл үсгээр бичнэ үү");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      await setDoc(doc(db, "users", cred.user.uid), {
        name: form.name,
        ...(form.role === "driver" ? { lastName: form.lastName, registerNo: form.registerNo } : {}),
        phone: form.phone,
        role: form.role,
        language,
        createdAt: serverTimestamp(),
      });

      if (form.role === "driver") {
        await setDoc(doc(db, "drivers", cred.user.uid), {
          userId: cred.user.uid,
          driverName: form.name,
          driverLastName: form.lastName,
          driverPhone: form.phone,
          driverEmail: form.email,
          verificationStatus: "none",
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Бүртгэл амжилттай!");
      navigate(form.role === "driver" ? "/driver" : "/passenger");
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("Энэ имэйл аль хэдийн бүртгэлтэй байна");
      } else {
        toast.error(err.message || "Бүртгэл амжилтгүй");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <img src={ruralLogo} alt="Rural" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="font-heading text-3xl font-bold">{t("registerTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-2">Rural платформд нэгдээрэй</p>
        </div>

        <form onSubmit={handleRegister} className="glass-card-elevated rounded-2xl p-8 space-y-5">
          {/* Role selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Та юу хийх вэ?</Label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { role: "passenger" as const, icon: User, label: "Зорчигч", desc: "Аялал хайж захиалах" },
                { role: "driver" as const, icon: Car, label: "Жолооч", desc: "Аялал зарлаж орлого олох" },
              ]).map(({ role, icon: Icon, label, desc }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => update("role", role)}
                  className={`rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                    form.role === role
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${form.role === role ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-semibold ${form.role === role ? "text-primary" : ""}`}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {form.role === "driver" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Овог <span className="text-xs text-muted-foreground">(кирилл)</span></Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^а-яА-ЯөӨүҮёЁ\s-]/g, "");
                    update("lastName", val);
                  }}
                  required
                  className="h-11"
                  placeholder="Дорж"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Нэр <span className="text-xs text-muted-foreground">(кирилл)</span></Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^а-яА-ЯөӨүҮёЁ\s-]/g, "");
                    update("name", val);
                  }}
                  required
                  className="h-11"
                  placeholder="Баатар"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("name")}</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} required className="h-11" placeholder="Name / Нэр" />
            </div>
          )}

          {form.role === "driver" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Регистрийн дугаар</Label>
              <Input
                value={form.registerNo}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().slice(0, 10);
                  update("registerNo", val);
                }}
                required
                className="h-11"
                placeholder="УБ12345678"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">2 кирилл үсэг + 8 тоо</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("phone")}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                    update("phone", val);
                  }}
                  required
                  className="h-11 pl-9"
                  placeholder="99112233"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("email")}</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="h-11" placeholder="email@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("password")}</Label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("confirmPassword")}</Label>
              <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="h-11" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base glow-primary" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            Бүртгүүлэх
          </Button>
          <p className="text-center text-sm text-muted-foreground pt-2">
            {t("hasAccount")}{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">{t("login")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
