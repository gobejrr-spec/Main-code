import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Car, Eye, EyeOff, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import ruralLogo from "@/assets/rural-logo.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const Register: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    registerNo: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "passenger" as "passenger" | "driver",
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // OTP state
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verificationId, setVerificationId] = useState<string>("");
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    if (!cleaned.startsWith("976")) {
      cleaned = "976" + cleaned;
    }
    return "+" + cleaned;
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (form.role === "driver" && (!form.lastName || !form.registerNo)) {
      toast.error("Овог болон регистрийн дугаар бөглөнө үү");
      return;
    }
    if (form.role === "driver" && !/^[А-ЯӨҮЁа-яөүё]{2}\d{8}$/.test(form.registerNo)) {
      toast.error("Регистрийн дугаар буруу байна (жишээ: АА00000000)");
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
    if (form.role === "driver" && !/^[а-яА-ЯөӨүҮёЁ\s-]+$/.test(form.name)) {
      toast.error("Жолоочийн нэрийг зөвхөн кирилл үсгээр бичнэ үү");
      return;
    }

    setSendingOtp(true);
    try {
      setupRecaptcha();
      const phoneNumber = formatPhone(form.phone);
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setVerificationId(result.verificationId);
      // Sign out the phone-auth session immediately so it doesn't interfere
      await signOut(auth);
      setStep("otp");
      toast.success("OTP код илгээгдлээ!");
    } catch (err: any) {
      console.error("OTP send error:", err);
      if (err.code === "auth/too-many-requests") {
        toast.error("Хэт олон оролдлого. Түр хүлээнэ үү.");
      } else if (err.code === "auth/invalid-phone-number") {
        toast.error("Утасны дугаар буруу байна");
      } else {
        toast.error("OTP илгээхэд алдаа гарлаа. Firebase Console → Authentication → Phone sign-in идэвхжүүлнэ үү.");
      }
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined as any;
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("6 оронтой код оруулна уу");
      return;
    }
    setVerifyingOtp(true);
    try {
      // Just verify the OTP is valid by creating credential (doesn't sign in)
      const phoneCredential = PhoneAuthProvider.credential(verificationId, otpCode);

      // Create the actual account with email/password
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Link phone to the account
      try {
        await linkWithCredential(cred.user, phoneCredential);
      } catch (linkErr) {
        console.warn("Phone link skipped:", linkErr);
      }

      // Save user profile to Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        name: form.name,
        ...(form.role === "driver" ? { lastName: form.lastName, registerNo: form.registerNo } : {}),
        phone: form.phone,
        role: form.role,
        language,
        phoneVerified: true,
        createdAt: serverTimestamp(),
      });

      if (form.role === "driver") {
        await setDoc(doc(db, "drivers", cred.user.uid), {
          userId: cred.user.uid,
          verificationStatus: "pending",
        });
      }

      toast.success("Бүртгэл амжилттай!");
      // Navigate based on role
      navigate(form.role === "driver" ? "/driver" : "/passenger");
    } catch (err: any) {
      console.error("Verify error:", err);
      if (err.code === "auth/invalid-verification-code") {
        toast.error("Код буруу байна. Дахин оролдоно уу.");
      } else if (err.code === "auth/email-already-in-use") {
        toast.error("Энэ имэйл аль хэдийн бүртгэлтэй байна");
      } else {
        toast.error(err.message || "Баталгаажуулалт амжилтгүй");
      }
    } finally {
      setVerifyingOtp(false);
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

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="glass-card-elevated rounded-2xl p-8 space-y-5">
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
                    let val = e.target.value.toUpperCase();
                    // First 2 chars: cyrillic only, rest: digits only
                    const letters = val.slice(0, 2).replace(/[^А-ЯӨҮЁа-яөүё]/g, "").toUpperCase();
                    const digits = val.slice(2).replace(/\D/g, "").slice(0, 8);
                    update("registerNo", letters + digits);
                  }}
                  required
                  className="h-11"
                  placeholder="АА00000000"
                  maxLength={10}
                />
                <p className="text-[11px] text-muted-foreground">2 кирилл үсэг + 8 тоо</p>
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

            <Button type="submit" className="w-full h-12 text-base glow-primary" disabled={sendingOtp}>
              {sendingOtp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              OTP код авах
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2">
              {t("hasAccount")}{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">{t("login")}</Link>
            </p>
          </form>
        ) : (
          <div className="glass-card-elevated rounded-2xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold">Утас баталгаажуулах</h2>
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium text-foreground">+976 {form.phone}</span> дугаарт илгээсэн 6 оронтой кодыг оруулна уу
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button onClick={handleVerifyOtp} className="w-full h-12 text-base glow-primary" disabled={verifyingOtp || otpCode.length !== 6}>
              {verifyingOtp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              Баталгаажуулах
            </Button>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => { setStep("form"); setOtpCode(""); }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Буцах
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                className="text-sm text-primary hover:underline"
              >
                Код дахин илгээх
              </button>
            </div>
          </div>
        )}
      </div>

      <div id="recaptcha-container" ref={recaptchaRef} />
    </div>
  );
};

export default Register;
