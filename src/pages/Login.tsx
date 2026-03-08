import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ruralLogo from "@/assets/rural-logo.png";

const Login: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(t("loginSuccess"));
      navigate("/");
    } catch (err: any) {
      toast.error(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <img src={ruralLogo} alt="Rural" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="font-heading text-3xl font-bold">{t("loginTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("loginSubtitle")}</p>
        </div>
        <form onSubmit={handleLogin} className="glass-card-elevated rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">{t("password")}</Label>
            <div className="relative">
              <Input id="password" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (!email) { toast.error(t("enterEmailFirst")); return; }
                try {
                  await sendPasswordResetEmail(auth, email);
                  toast.success(t("resetEmailSent"));
                } catch {
                  toast.error(t("resetEmailError"));
                }
              }}
              className="text-xs text-primary hover:underline self-end"
            >
              {t("forgotPassword")}
            </button>
          </div>
          <Button type="submit" className="w-full h-12 text-base glow-primary" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
            {t("login")}
          </Button>
          <p className="text-center text-sm text-muted-foreground pt-2">
            {t("noAccount")}{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">{t("register")}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
