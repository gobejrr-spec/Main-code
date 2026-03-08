import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Clock, Users, Plus, Upload, Shield, AlertCircle, Loader2, CheckCircle, Lock, X, Image, ChevronDown, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import LocationSelect from "@/components/LocationSelect";
import { getDistanceKm } from "@/lib/distance";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel
} from "@/components/ui/select";

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

const CAR_BRANDS: Record<string, string[]> = {
  "Toyota": ["Prius", "Camry", "Corolla", "RAV4", "Land Cruiser", "Hilux", "Hiace", "Alphard", "Noah", "Voxy", "Wish", "Fielder", "Aqua", "Vitz", "Harrier", "Fortuner"],
  "Hyundai": ["Starex", "Tucson", "Santa Fe", "Sonata", "Elantra", "Accent", "Porter", "Creta", "Palisade", "Kona", "i30"],
  "Kia": ["Sportage", "Sorento", "K5", "K3", "Carnival", "Seltos", "Morning", "Rio"],
  "Lexus": ["RX", "LX", "NX", "ES", "IS", "GX"],
  "Honda": ["Fit", "CRV", "HRV", "Civic", "Accord", "Stepwgn", "Freed", "Vezel"],
  "Nissan": ["X-Trail", "Note", "Serena", "Elgrand", "Juke", "Qashqai", "Patrol", "Leaf"],
  "Mitsubishi": ["Pajero", "Outlander", "Delica", "L200", "Eclipse Cross", "ASX"],
  "Suzuki": ["Swift", "Jimny", "Vitara", "SX4", "Escudo", "Every"],
  "Ford": ["Explorer", "Ranger", "Everest", "Focus", "Escape"],
  "Mercedes-Benz": ["Sprinter", "V-Class", "GLE", "GLC", "E-Class", "C-Class", "S-Class"],
  "BMW": ["X5", "X3", "X1", "3 Series", "5 Series", "7 Series"],
  "Volkswagen": ["Passat", "Tiguan", "Polo", "Golf", "Touareg"],
  "SsangYong": ["Rexton", "Tivoli", "Korando", "Musso"],
  "УАЗ": ["Патриот", "Буханка", "Хантер"],
  "Бусад": ["Бусад"],
};

const PHOTO_LABELS = [
  { key: "idFront", label: "Иргэний үнэмлэх (Урд)" },
  { key: "idBack", label: "Иргэний үнэмлэх (Ар)" },
  { key: "vehicleRegistration", label: "ТХ гэрчилгээ" },
  { key: "carFront", label: "Машин (Урд)" },
  { key: "carBack", label: "Машин (Хойд)" },
  { key: "carLeft", label: "Машин (Зүүн)" },
  { key: "carRight", label: "Машин (Баруун)" },
  { key: "carInterior", label: "Дотор зураг" },
];

const PLATE_SUFFIXES = [
  { code: "УБА", label: "Улаанбаатар" }, { code: "УБЕ", label: "Улаанбаатар" },
  { code: "УБИ", label: "Улаанбаатар" }, { code: "УБО", label: "Улаанбаатар" },
  { code: "УБУ", label: "Улаанбаатар" }, { code: "УБЯ", label: "Улаанбаатар" },
  { code: "АРА", label: "Архангай" }, { code: "БУА", label: "Баян-Өлгий" },
  { code: "БХА", label: "Баянхонгор" }, { code: "БОА", label: "Булган" },
  { code: "ГАА", label: "Говь-Алтай" }, { code: "ДОА", label: "Дорноговь" },
  { code: "ДДА", label: "Дорнод" }, { code: "ДУА", label: "Дундговь" },
  { code: "ЗАА", label: "Завхан" }, { code: "ӨВА", label: "Өвөрхангай" },
  { code: "ӨМА", label: "Өмнөговь" }, { code: "СҮА", label: "Сүхбаатар" },
  { code: "СЭА", label: "Сэлэнгэ" }, { code: "ТӨА", label: "Төв" },
  { code: "УВА", label: "Увс" }, { code: "ХОА", label: "Ховд" },
  { code: "ХӨА", label: "Хөвсгөл" }, { code: "ХЭА", label: "Хэнтий" },
  { code: "ДАА", label: "Дархан-Уул" }, { code: "ОРА", label: "Орхон" },
  { code: "ГОА", label: "Говьсүмбэр" },
];

const DriverDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("none");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Trip form state
  const [tripFrom, setTripFrom] = useState("");
  const [tripTo, setTripTo] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("");
  const [tripSeats, setTripSeats] = useState("");
  const [tripPrice, setTripPrice] = useState("");
  const [carType, setCarType] = useState("");
  const [pricePerKm, setPricePerKm] = useState<number>(150);

  // Driver document fields
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [plateSuffix, setPlateSuffix] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [driverEmail, setDriverEmail] = useState("");

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
          setVerificationStatus(data.verificationStatus || "none");
          setHasSubmitted(true);
          setVehiclePlate(data.vehiclePlate || "");
          setLicenseNumber(data.licenseNumber || "");
          setDriverEmail(data.email || "");
          if (data.vehicleType) {
            const parts = data.vehicleType.split(" ");
            if (parts.length >= 2) {
              setSelectedBrand(parts[0]);
              setSelectedModel(parts.slice(1).join(" "));
            }
          }
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

  // Real-time listener for verification status changes
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "drivers", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const newStatus = data.verificationStatus || "none";
        setHasSubmitted(true);
        setVerificationStatus(newStatus);
        if (data.vehiclePlate) setVehiclePlate(data.vehiclePlate);
        if (data.licenseNumber) setLicenseNumber(data.licenseNumber);
        if (data.vehicleType) {
          const parts = data.vehicleType.split(" ");
          if (parts.length >= 2) {
            setSelectedBrand(parts[0]);
            setSelectedModel(parts.slice(1).join(" "));
          }
        }
        if (data.photos) setPhotoUrls(data.photos);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch platform price per km
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "platform"));
        if (settingsDoc.exists() && settingsDoc.data().pricePerKm) {
          setPricePerKm(settingsDoc.data().pricePerKm);
        }
      } catch (e) { console.warn("Settings fetch:", e); }
    };
    fetchSettings();
  }, []);

  // Auto-calculate price when from/to changes
  useEffect(() => {
    if (tripFrom && tripTo) {
      const dist = getDistanceKm(tripFrom, tripTo);
      if (dist) {
        setTripPrice(String(dist * pricePerKm));
      }
    }
  }, [tripFrom, tripTo, pricePerKm]);

  const isVerified = verificationStatus === "approved";
  const isPending = verificationStatus === "pending" && hasSubmitted;
  const isRejected = verificationStatus === "rejected";
  const needsSubmission = !isVerified && !isPending;
  const vehicleType = selectedBrand && selectedModel ? `${selectedBrand} ${selectedModel}` : "";

  const handlePhotoSelect = (key: string, file: File | null) => {
    if (!file) return;
    setPhotos(prev => ({ ...prev, [key]: file }));
  };

  const removePhoto = (key: string) => {
    setPhotos(prev => { const n = { ...prev }; delete n[key]; return n; });
    // Also clear the URL if it was previously uploaded
    setPhotoUrls(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const fullPlate = plateNumber.trim() || vehiclePlate;

  const handleSubmitVerification = async () => {
    if (!user) return;
    if (!vehicleType || (!fullPlate) || !licenseNumber) {
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
        driverName: profile?.name || "",
        driverPhone: profile?.phone || "",
        vehicleType,
        vehiclePlate: fullPlate,
        licenseNumber,
        email: driverEmail || profile?.phone || "",
        photos: uploadedPhotos,
        verificationStatus: "pending",
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setPhotoUrls(uploadedPhotos);
      setPhotos({});
      setVerificationStatus("pending");
      setHasSubmitted(true);
      toast.success("Бичиг баримтууд амжилттай илгээгдлээ! Админ шалгаж баталгаажуулна.");
    } catch (err: any) {
      console.error(err);
      if (err?.code === "storage/unauthorized") {
        toast.error("Firebase Storage зөвшөөрөл тохируулаагүй байна. Firebase Console → Storage → Rules дээр зөвшөөрөл нэмнэ үү.");
      } else {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      }
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
        carType: vehicleType || carType || "",
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

        {/* STATE 1: Pending - Waiting for admin approval */}
        {isPending && !isRejected && (
          <div className="animate-fade-in text-center py-16">
            <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
              <Hourglass className="h-10 w-10 text-warning animate-pulse" />
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2">Баталгаажуулалт хүлээгдэж байна</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Таны бичиг баримтууд амжилттай илгээгдсэн. Админ шалгаж баталгаажуулсны дараа та аялал оруулах боломжтой болно.
            </p>
            <div className="inline-flex items-center gap-2 bg-warning/10 text-warning text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Хянагдаж байна...
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => setHasSubmitted(false)}>
                Дахин засах
              </Button>
            </div>
          </div>
        )}

        {/* STATE 2: Rejected or Not submitted - Show verification form */}
        {needsSubmission && (
          <>
            <div className="glass-card-elevated rounded-2xl p-5 mb-6 border-l-4 border-warning flex items-start gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {isRejected ? "Баталгаажуулалт татгалзсан. Дахин илгээнэ үү." : t("verificationPending")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Бичиг баримт, зургуудаа байршуулж баталгаажуулна уу.
                </p>
              </div>
            </div>

            <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> {t("verification")}
              </h2>

              {/* Document info fields */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* Vehicle Brand */}
                <div className="space-y-2">
                  <Label>Машины брэнд *</Label>
                  <Select value={selectedBrand} onValueChange={(val) => { setSelectedBrand(val); setSelectedModel(""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Брэнд сонгох" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.keys(CAR_BRANDS).map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehicle Model */}
                <div className="space-y-2">
                  <Label>Машины модел *</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedBrand ? "Модел сонгох" : "Эхлээд брэнд сонгоно уу"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {selectedBrand && CAR_BRANDS[selectedBrand]?.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* License Plate */}
                <div className="space-y-2">
                  <Label>Улсын дугаар *</Label>
                  <Input
                    placeholder="8332УБА"
                    value={plateNumber}
                    onChange={e => {
                      let val = e.target.value;
                      const digits = val.slice(0, 4).replace(/\D/g, "");
                      const letters = val.slice(4).replace(/[^А-ЯӨҮЁа-яөүё]/g, "").toUpperCase().slice(0, 3);
                      setPlateNumber(digits + letters);
                    }}
                    className="uppercase"
                    maxLength={7}
                  />
                  <p className="text-[11px] text-muted-foreground">4 тоо + 3 кирилл үсэг</p>
                </div>

                {/* License Number */}
                <div className="space-y-2">
                  <Label>Жолоочийн үнэмлэхийн дугаар *</Label>
                  <Input
                    placeholder="00000000"
                    value={licenseNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setLicenseNumber(val);
                    }}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* Photo uploads */}
              <h3 className="font-medium text-sm mb-3">Зургууд байршуулах</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {PHOTO_LABELS.map(({ key, label }) => {
                  const preview = photos[key] ? URL.createObjectURL(photos[key]!) : photoUrls[key];
                  return (
                    <div key={key} className="space-y-1">
                      <div
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
                                removePhoto(key);
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
                    </div>
                  );
                })}
              </div>

              <Button
                className="mt-5"
                onClick={handleSubmitVerification}
                disabled={uploadingDocs || !selectedBrand || !selectedModel || plateNumber.length < 7 || !licenseNumber}
              >
                {uploadingDocs ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Илгээх
              </Button>
            </div>
          </>
        )}

        {/* STATE 3: Verified - Show trip creation */}
        {isVerified && (
          <div className="glass-card-elevated rounded-2xl p-5 mb-6 border-l-4 border-success flex items-start gap-3 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-success mt-0.5" />
            <div>
              <p className="font-medium text-sm text-success">Баталгаажсан жолооч</p>
              <p className="text-xs text-muted-foreground mt-1">Та аялал оруулж болно</p>
            </div>
          </div>
        )}

        {/* Trip section - only visible when verified */}
        {isVerified && (
          <div className="flex items-center justify-between mb-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="font-heading font-semibold text-xl">Миний аялалууд</h2>
            <Button size="sm" onClick={() => setShowCreateTrip(!showCreateTrip)} className="hover-scale">
              <Plus className="mr-2 h-4 w-4" /> Аялал үүсгэх
            </Button>
          </div>
        )}

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
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={handleCreateTrip} disabled={submitting} className="hover-scale">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Нийтлэх
              </Button>
              <Button variant="outline" onClick={() => setShowCreateTrip(false)}>Болих</Button>
            </div>
          </div>
        )}

        {/* Trip List - only when verified */}
        {isVerified && (
          <>
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
                <p className="text-sm text-muted-foreground/70 mt-1">Шинэ аялал үүсгэж эхлээрэй</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
