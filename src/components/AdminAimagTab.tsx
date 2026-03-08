import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIMAG_DATA, AimagInfo, Attraction } from "@/lib/aimag-data";
import { Compass, Plus, Trash2, Save, Loader2, Image, ChevronDown, ChevronUp, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FirestoreAimag {
  name: string;
  description: string;
  highlights: string[];
  image: string;
  photoUrl: string;
  population: string;
  area: string;
  attractions: Attraction[];
}

const AdminAimagTab: React.FC = () => {
  const { t } = useLanguage();
  const [aimags, setAimags] = useState<(AimagInfo & { id: string; fromFirestore?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingAimag, setEditingAimag] = useState<(FirestoreAimag & { id: string }) | null>(null);

  const fetchAimags = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "aimags"));
      const firestoreMap = new Map<string, any>();
      snap.docs.forEach(d => {
        firestoreMap.set(d.id, { ...d.data(), id: d.id, fromFirestore: true });
      });

      // Merge: Firestore overrides hardcoded
      const merged = AIMAG_DATA.map(a => {
        const fsData = firestoreMap.get(a.name);
        if (fsData) {
          firestoreMap.delete(a.name);
          return { ...a, ...fsData, id: a.name };
        }
        return { ...a, id: a.name, fromFirestore: false };
      });

      // Add any extra aimags from Firestore not in hardcoded
      firestoreMap.forEach((val) => {
        merged.push(val);
      });

      setAimags(merged);
    } catch (err) {
      console.error("Aimag fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAimags(); }, []);

  const handleEdit = (aimag: any) => {
    setEditingAimag({
      id: aimag.id || aimag.name,
      name: aimag.name,
      description: aimag.description,
      highlights: aimag.highlights || [],
      image: aimag.image || "",
      photoUrl: aimag.photoUrl || "",
      population: aimag.population || "",
      area: aimag.area || "",
      attractions: aimag.attractions || [],
    });
  };

  const handleSave = async () => {
    if (!editingAimag) return;
    setSaving(editingAimag.id);
    try {
      const { id, ...data } = editingAimag;
      await setDoc(doc(db, "aimags", id), data, { merge: true });
      toast.success(t("settingsSaved"));
      setEditingAimag(null);
      await fetchAimags();
    } catch (err) {
      console.error(err);
      toast.error(t("errorOccurred"));
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteAimag = async (aimagId: string) => {
    setSaving(aimagId);
    try {
      await deleteDoc(doc(db, "aimags", aimagId));
      toast.success(t("deleteSuccess"));
      await fetchAimags();
    } catch (err) {
      console.error(err);
      toast.error(t("deleteFailed"));
    } finally {
      setSaving(null);
    }
  };

  const updateAttraction = (index: number, field: keyof Attraction, value: string) => {
    if (!editingAimag) return;
    const updated = [...editingAimag.attractions];
    updated[index] = { ...updated[index], [field]: value };
    setEditingAimag({ ...editingAimag, attractions: updated });
  };

  const addAttraction = () => {
    if (!editingAimag) return;
    setEditingAimag({
      ...editingAimag,
      attractions: [...editingAimag.attractions, { name: "", description: "", photoUrl: "" }],
    });
  };

  const removeAttraction = (index: number) => {
    if (!editingAimag) return;
    setEditingAimag({
      ...editingAimag,
      attractions: editingAimag.attractions.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Editing mode
  if (editingAimag) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-xl flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" /> {editingAimag.name} — {t("edit")}
          </h2>
          <Button variant="outline" size="sm" onClick={() => setEditingAimag(null)}>
            <X className="mr-1 h-4 w-4" /> {t("cancel")}
          </Button>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">{t("aimagName")}</label>
              <Input value={editingAimag.name} onChange={(e) => setEditingAimag({ ...editingAimag, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">{t("aimagPhoto")}</label>
              <Input value={editingAimag.photoUrl} onChange={(e) => setEditingAimag({ ...editingAimag, photoUrl: e.target.value })} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">{t("aimagDescription")}</label>
            <Input value={editingAimag.description} onChange={(e) => setEditingAimag({ ...editingAimag, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">{t("population")}</label>
              <Input value={editingAimag.population} onChange={(e) => setEditingAimag({ ...editingAimag, population: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">{t("area")}</label>
              <Input value={editingAimag.area} onChange={(e) => setEditingAimag({ ...editingAimag, area: e.target.value })} />
            </div>
          </div>

          {/* Preview image */}
          {editingAimag.photoUrl && (
            <div className="rounded-xl overflow-hidden h-32 bg-muted">
              <img src={editingAimag.photoUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}

          {/* Attractions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-sm">{t("attractions")} ({editingAimag.attractions.length})</h3>
              <Button size="sm" variant="outline" onClick={addAttraction}>
                <Plus className="mr-1 h-3 w-3" /> {t("addAttraction")}
              </Button>
            </div>
            <div className="space-y-3">
              {editingAimag.attractions.map((attr, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => removeAttraction(i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input placeholder={t("aimagName")} value={attr.name} onChange={(e) => updateAttraction(i, "name", e.target.value)} />
                  <Input placeholder={t("aimagDescription")} value={attr.description} onChange={(e) => updateAttraction(i, "description", e.target.value)} />
                  <Input placeholder={t("aimagPhoto") + " URL"} value={attr.photoUrl} onChange={(e) => updateAttraction(i, "photoUrl", e.target.value)} />
                  {attr.photoUrl && (
                    <div className="rounded-lg overflow-hidden h-20 bg-muted">
                      <img src={attr.photoUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={!!saving} className="w-full">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {t("saveBtn")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading font-semibold text-xl mb-6 flex items-center gap-2">
        <Compass className="h-5 w-5 text-accent" /> {t("aimagManagement")} ({aimags.length})
      </h2>

      <div className="space-y-2">
        {aimags.map((aimag) => (
          <div key={aimag.id} className="rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {aimag.photoUrl ? (
                    <img src={aimag.photoUrl} alt={aimag.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">{aimag.image}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{aimag.name}</p>
                    {aimag.fromFirestore && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-medium">{t("customized")}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{aimag.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{aimag.attractions?.length || 0} {t("attractions")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(aimag)}>
                  <Edit2 className="mr-1 h-3 w-3" /> {t("edit")}
                </Button>
                {aimag.fromFirestore && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={saving === aimag.id}
                    onClick={() => handleDeleteAimag(aimag.id)}
                  >
                    {saving === aimag.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAimagTab;