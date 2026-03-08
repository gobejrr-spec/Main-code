import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Clock, Users, Plus, Upload, Shield, AlertCircle, Loader2, CheckCircle, Lock, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import LocationSelect from "@/components/LocationSelect";

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  price: number;
  status: string;
}

const PHOTO_LABELS = [
  { key: "idFront", label: "Иргэний үнэмлэх (Урд)" },
  { key: "idBack", label: "Иргэний үнэмлэх (Ар)" },
  { key: "vehicleRegistration", label: "Тээврийн хэрэгслийн гэрчилгээ" },
  { key: "carFront", label: "Машины урд зураг" },
  { key: "carBack", label: "Машины хойд зураг" },
  { key: "carLeft", label: "Машины зүүн зураг" },
  { key: "carRight", label: "Машины баруун зураг" },
  { key: "carInterior", label: "Дотор зураг" },
];

const DriverDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("pending");

  // Trip form state
  const [tripFrom, setTripFrom] = useState("");
  const [tripTo, setTripTo] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("");
  const [tripSeats, setTripSeats] = useState("");
  const [tripPrice, setTripPrice] = useState("");
  const [carType, setCarType] = useState("");

  // Driver document fields
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // Photo uploads
  const [photos, setPhotos] = useState<Record<string, File | null>>({});
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const driverDoc = await getDoc(doc(db, "drivers", user.uid));
        if (driverDoc.exists()) {
          const data = driverDoc.data();
          setVerificationStatus(data.verificationStatus || "pending");
          setVehiclePlate(data.vehiclePlate || "");
          setLicenseNumber(data.licenseNumber || "");
          setDriverEmail(data.email || "");
          setVehicleType(data.vehicleType || "");
          if (data.photos) setPhotoUrls(data.photos);
        }
        const q = query(collection(db, "trips"), where("driverId", "==", user.uid));
        const snapshot = await getDocs(q);
        setTrips(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Trip)));
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isVerified = verificationStatus === "approved";

  const handlePhotoSelect = (key: string, file: File | null) => {
    if (!file) return;
    setPhotos(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmitVerification = async () => {
    if (!user) return;
    if (!vehiclePlate || !licenseNumber || !vehicleType) {
      toast.error("Тээврийн хэрэгсэл, улсын дугаар, жолоочийн үнэмлэхийн дугаар бөглөнө үү");
      return;
    }
    setUploadingDocs(true);
    try {
      const uploadedPhotos: Record<string, string> = { ...photoUrls };
      
      for (const [key, file] of Object.entries(photos)) {
        if (file) {
          const storageRef = ref(storage, `drivers/${user.uid}/${key}_${Date.now()}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          uploadedPhotos[key] = url;
        }
      }

      await setDoc(doc(db, "drivers", user.uid), {
        userId: user.uid,
        vehicleType,
        vehiclePlate,
        licenseNumber,
        email: driverEmail || profile?.phone || "",
        photos: uploadedPhotos,
        verificationStatus: "pending",
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setPhotoUrls(uploadedPhotos);
      setPhotos({});
      setVerificationStatus("pending");
      toast.success("Бичиг баримтууд амжилттай илгээгдлээ! Админ шалгаж баталгаажуулна.");
    } catch (err) {
      console.error(err);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleCreateTrip = async () => {
    if (!user || !tripFrom || !tripTo || !tripDate || !tripTime || !tripSeats || !tripPrice) {
      toast.error("Бүх талбарыг бөглөнө үү");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "trips"), {
        driverId: user.uid,
        driverName: profile?.name || "Unknown",
        driverPhone: profile?.phone || "",
        carType: carType,
        from: tripFrom,
        to: tripTo,
        date: tripDate,
        time: tripTime,
        seats: parseInt(tripSeats),
        price: parseInt(tripPrice),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Аялал амжилттай илгээгдлээ!");
      setShowCreateTrip(false);
      setTripFrom(""); setTripTo(""); setTripDate(""); setTripTime(""); setTripSeats(""); setTripPrice(""); setCarType("");
      const q = query(collection(db, "trips"), where("driverId", "==", user.uid));
      const snapshot = await getDocs(q);
      setTrips(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Trip)));
    } catch (err) {
      console.error(err);
      toast.error("Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <MapPin className="h-3 w-3" /> ЖОЛООЧ
          </div>
          <h1 className="font-heading text-3xl font-bold">
            {profile?.name ? `Сайн байна уу, ${profile.name}` : t("dashboard")}
          </h1>
          <p className="text-muted-foreground mt-1">Аялалаа удирдах самбар</p>
        </div>

        {/* Verification Status */}
        {!isVerified ? (
          <div className="glass-card-elevated rounded-2xl p-5 mb-6 border-l-4 border-warning flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">
                {verificationStatus === "rejected" ? "Баталгаажуулалт татгалзсан. Дахин илгээнэ үү." : t("verificationPending")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Бичиг баримт, зургуудаа байршуулж баталгаажуулна уу.
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card-elevated rounded-2xl p-5 mb-6 border-l-4 border-success flex items-start gap-3 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-success mt-0.5" />
            <div>
              <p className="font-medium text-sm text-success">Баталгаажсан жолооч</p>
              <p className="text-xs text-muted-foreground mt-1">Та аялал оруулж болно</p>
            </div>
          </div>
        )}

        {/* Verification Documents Form */}
        {!isVerified && (
          <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> {t("verification")}
            </h2>

            {/* Document info fields */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Тээврийн хэрэгслийн төрөл *</Label>
                <Input placeholder="Toyota Prius, Hyundai Starex г.м." value={vehicleType} onChange={e => setVehicleType(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Улсын дугаар *</Label>
                <Input placeholder="0000 УБА" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Жолоочийн үнэмлэхийн дугаар *</Label>
                <Input placeholder="AA00000000" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Имэйл</Label>
                <Input type="email" placeholder="example@mail.com" value={driverEmail} onChange={e => setDriverEmail(e.target.value)} />
              </div>
            </div>

            {/* Photo uploads */}
            <h3 className="font-medium text-sm mb-3">Зургууд байршуулах</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {PHOTO_LABELS.map(({ key, label }) => {
                const preview = photos[key] ? URL.createObjectURL(photos[key]!) : photoUrls[key];
                return (
                  <div
                    key={key}
                    className="relative border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group aspect-[4/3]"
                    onClick={() => fileInputRefs.current[key]?.click()}
                  >
                    <input
                      ref={el => { fileInputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handlePhotoSelect(key, e.target.files?.[0] || null)}
                    />
                    {preview ? (
                      <>
                        <img src={preview} alt={label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="h-5 w-5 text-white" />
                        </div>
                        <button
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotos(prev => { const n = { ...prev }; delete n[key]; return n; });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-3">
                        <Image className="h-5 w-5 text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
                        <p className="text-[10px] text-muted-foreground text-center leading-tight">{label}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Button className="mt-5" onClick={handleSubmitVerification} disabled={uploadingDocs}>
              {uploadingDocs ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Илгээх
            </Button>
          </div>
        )}

        {/* Create Trip */}
        <div className="flex items-center justify-between mb-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className="font-heading font-semibold text-xl">Миний аялалууд</h2>
          {isVerified ? (
            <Button size="sm" onClick={() => setShowCreateTrip(!showCreateTrip)} className="hover-scale">
              <Plus className="mr-2 h-4 w-4" /> Аялал үүсгэх
            </Button>
          ) : (
            <Button size="sm" disabled className="opacity-50">
              <Lock className="mr-2 h-4 w-4" /> Баталгаажсаны дараа
            </Button>
          )}
        </div>

        {showCreateTrip && isVerified && (
          <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-fade-in">
            <h3 className="font-heading font-semibold mb-4">Шинэ аялал үүсгэх</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Хаанаас</Label>
                <LocationSelect value={tripFrom} onChange={setTripFrom} placeholder="Аймаг сонгох" iconColor="text-primary" />
              </div>
              <div className="space-y-2">
                <Label>Хаашаа</Label>
                <LocationSelect value={tripTo} onChange={setTripTo} placeholder="Аймаг сонгох" iconColor="text-accent" />
              </div>
              <div className="space-y-2">
                <Label>Огноо</Label>
                <Input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Цаг</Label>
                <Input type="time" value={tripTime} onChange={(e) => setTripTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Суудлын тоо</Label>
                <Input type="number" min="1" max="10" placeholder="4" value={tripSeats} onChange={(e) => setTripSeats(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Үнэ (₮)</Label>
                <Input type="number" placeholder="25000" value={tripPrice} onChange={(e) => setTripPrice(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Машины төрөл</Label>
                <Input placeholder="Toyota Prius, Hyundai Starex г.м." value={carType} onChange={(e) => setCarType(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={handleCreateTrip} disabled={submitting} className="hover-scale">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Илгээх
              </Button>
              <Button variant="outline" onClick={() => setShowCreateTrip(false)}>Болих</Button>
            </div>
          </div>
        )}

        {/* Trip List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-medium">Аялал байхгүй байна</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {isVerified ? "Шинэ аялал үүсгэж эхлээрэй" : "Баталгаажуулалтаа хийснийх дараа аялал оруулж болно"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-stagger">
            {trips.map((trip) => (
              <div key={trip.id} className="glass-card-elevated rounded-2xl p-5 flex items-center justify-between hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {trip.from} → {trip.to}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {trip.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.time}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {trip.seats} суудал</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-primary">{trip.price?.toLocaleString()}₮</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    trip.status === "approved" 
                      ? "bg-success/10 text-success" 
                      : trip.status === "rejected"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {trip.status === "approved" ? "Зөвшөөрсөн" : trip.status === "rejected" ? "Татгалзсан" : "Хүлээгдэж буй"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
