import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bus, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Bus className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-bold">{t("registerTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("registerSubtitle")}</p>
        </div>
        <form onSubmit={handleRegister} className="glass-card rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Label>{t("name")}</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t("phone")}</Label>
            <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t("password")}</Label>
            <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t("confirmPassword")}</Label>
            <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>{t("selectRole")}</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["passenger", "driver"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => update("role", role)}
                  className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                    form.role === role
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t(role)}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("register")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">{t("login")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
