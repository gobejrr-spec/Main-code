import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bus, Loader2, ArrowRight, User, Car } from "lucide-react";
import { toast } from "sonner";

const Register: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "passenger" as "passenger" | "driver",
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name: form.name,
        phone: form.phone,
        role: form.role,
        language,
        createdAt: serverTimestamp(),
      });
      if (form.role === "driver") {
        await setDoc(doc(db, "drivers", cred.user.uid), {
          userId: cred.user.uid,
          verificationStatus: "pending",
          idCardFront: "",
          idCardBack: "",
          carCertificate: "",
          carFrontPhoto: "",
          carBackPhoto: "",
          carLeftPhoto: "",
          carRightPhoto: "",
          carInteriorPhoto: "",
        });
        toast.success("Registered! Please upload your verification documents.");
        navigate("/driver");
      } else {
        toast.success("Registered successfully!");
        navigate("/passenger");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 glow-primary">
            <Bus className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-bold">{t("registerTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("registerSubtitle")}</p>
        </div>
        <form onSubmit={handleRegister} className="glass-card-elevated rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("selectRole")}</Label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { role: "passenger" as const, icon: User, label: t("passenger") },
                { role: "driver" as const, icon: Car, label: t("driver") },
              ]).map(({ role, icon: Icon, label }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => update("role", role)}
                  className={`rounded-xl border-2 p-4 text-sm font-medium transition-all duration-300 flex flex-col items-center gap-2 ${
                    form.role === role
                      ? "border-primary bg-primary/10 text-primary shadow-md"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("name")}</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("email")}</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="h-11" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("phone")}</Label>
            <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="h-11" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("password")}</Label>
              <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("confirmPassword")}</Label>
              <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="h-11" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 text-base glow-primary" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            {t("register")}
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
