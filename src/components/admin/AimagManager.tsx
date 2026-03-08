import React, { useState, useEffect, useCallback } from "react";
import {
  collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { AIMAG_DATA, AimagInfo, Attraction } from "@/lib/aimag-data";
import {
  MapPin, Plus, Trash2, Edit, Save, X, Loader2, Image, ChevronDown, ChevronUp, Star, Users, Ruler, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

interface AimagDoc extends AimagInfo {
  id?: string;
}

const emptyAttraction: Attraction = { name: "", description: "", photoUrl: "" };

const emptyAimag: AimagDoc = {
  name: "",
  description: "",
  highlights: [],
  image: "📍",
  photoUrl: "",
  population: "",
  area: "",
  attractions: [],
};

const AimagManager: React.FC = () => {
  const { t } = useLanguage();
  const [aimags, setAimags] = useState<AimagDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingAimag, setEditingAimag] = useState<AimagDoc | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AimagDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAimags = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "aimags"));
      if (snap.empty) {
        // Seed from hardcoded data
        setAimags(AIMAG_DATA.map((a) => ({ ...a, id: a.name })));
      } else {
        setAimags(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AimagDoc)));
      }
    } catch (err) {
      console.error("Fetch aimags error:", err);
      setAimags(AIMAG_DATA.map((a) => ({ ...a, id: a.name })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAimags();
  }, [fetchAimags]);

  const handleSave = async () => {
    if (!editingAimag) return;
    if (!editingAimag.name.trim()) {
      toast.error(t("fillAllFields"));
      return;
    }
    setSaving(true);
    try {
      const docId = editingAimag.id || editingAimag.name;
      const { id, ...data } = editingAimag;
      await setDoc(doc(db, "aimags", docId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast.success(t("settingsSaved"));
      setEditingAimag(null);
      setIsNew(false);
      await fetchAimags();
    } catch (err) {
      console.error("Save aimag error:", err);
      toast.error(t("errorOccurred"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "aimags", deleteConfirm.id));
      toast.success(t("deleteSuccess"));
      setDeleteConfirm(null);
      await fetchAimags();
    } catch (err) {
      console.error("Delete aimag error:", err);
      toast.error(t("deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

  const handleSeedAll = async () => {
    setSaving(true);
    try {
      for (const aimag of AIMAG_DATA) {
        await setDoc(doc(db, "aimags", aimag.name), {
          ...aimag,
          updatedAt: serverTimestamp(),
        });
      }
      toast.success(t("settingsSaved"));
      await fetchAimags();
    } catch (err) {
      console.error("Seed error:", err);
      toast.error(t("errorOccurred"));
    } finally {
      setSaving(false);
    }
  };

  // Edit form helpers
  const updateField = (field: keyof AimagDoc, value: any) => {
    if (!editingAimag) return;
    setEditingAimag({ ...editingAimag, [field]: value });
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
      attractions: [...editingAimag.attractions, { ...emptyAttraction }],
    });
  };

  const removeAttraction = (index: number) => {
    if (!editingAimag) return;
    const updated = editingAimag.attractions.filter((_, i) => i !== index);
    setEditingAimag({ ...editingAimag, attractions: updated });
  };

  const updateHighlight = (index: number, value: string) => {
    if (!editingAimag) return;
    const updated = [...editingAimag.highlights];
    updated[index] = value;
    setEditingAimag({ ...editingAimag, highlights: updated });
  };

  const addHighlight = () => {
    if (!editingAimag) return;
    setEditingAimag({ ...editingAimag, highlights: [...editingAimag.highlights, ""] });
  };

  const removeHighlight = (index: number) => {
    if (!editingAimag) return;
    setEditingAimag({ ...editingAimag, highlights: editingAimag.highlights.filter((_, i) => i !== index) });
  };

  // Edit view
  if (editingAimag) {
    return (
      <div>
        <button
          onClick={() => { setEditingAimag(null); setIsNew(false); }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </button>

        <h2 className="font-heading font-semibold text-xl mb-6">
          {isNew ? `+ ${t("addAttraction")}` : `${t("edit")} — ${editingAimag.name}`}
        </h2>

        <div className="space-y-6 max-w-2xl">
          {/* Basic info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("aimagName")}</label>
              <Input value={editingAimag.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("aimagPhoto")}</label>
              <Input value={editingAimag.photoUrl} onChange={(e) => updateField("photoUrl", e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("aimagDescription")}</label>
            <Textarea value={editingAimag.description} onChange={(e) => updateField("description", e.target.value)} rows={3} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("population")}</label>
              <Input value={editingAimag.population} onChange={(e) => updateField("population", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("area")}</label>
              <Input value={editingAimag.area} onChange={(e) => updateField("area", e.target.value)} />
            </div>
          </div>

          {/* Photo preview */}
          {editingAimag.photoUrl && (
            <div className="rounded-xl overflow-hidden aspect-[16/7] border border-border">
              <img src={editingAimag.photoUrl} alt={editingAimag.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" /> Highlights
              </label>
              <Button size="sm" variant="outline" onClick={addHighlight}>
                <Plus className="h-3 w-3 mr-1" /> Нэмэх
              </Button>
            </div>
            {editingAimag.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={h} onChange={(e) => updateHighlight(i, e.target.value)} placeholder={`Highlight ${i + 1}`} />
                <Button size="icon" variant="ghost" className="text-destructive shrink-0" onClick={() => removeHighlight(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Attractions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {t("attractions")}
              </label>
              <Button size="sm" variant="outline" onClick={addAttraction}>
                <Plus className="h-3 w-3 mr-1" /> {t("addAttraction")}
              </Button>
            </div>

            {editingAimag.attractions.map((attr, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">#{i + 1}</span>
                  <Button size="icon" variant="ghost" className="text-destructive h-7 w-7" onClick={() => removeAttraction(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  value={attr.name}
                  onChange={(e) => updateAttraction(i, "name", e.target.value)}
                  placeholder={t("aimagName")}
                />
                <Textarea
                  value={attr.description}
                  onChange={(e) => updateAttraction(i, "description", e.target.value)}
                  placeholder={t("aimagDescription")}
                  rows={2}
                />
                <Input
                  value={attr.photoUrl}
                  onChange={(e) => updateAttraction(i, "photoUrl", e.target.value)}
                  placeholder={t("aimagPhoto")}
                />
                {attr.photoUrl && (
                  <div className="rounded-lg overflow-hidden aspect-[16/9] border border-border max-w-xs">
                    <img src={attr.photoUrl} alt={attr.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Save */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t("saveBtn")}
            </Button>
            <Button variant="outline" onClick={() => { setEditingAimag(null); setIsNew(false); }}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> {t("aimagManagement")} ({aimags.length})
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSeedAll}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
            Firestore-д хадгалах
          </Button>
          <Button
            size="sm"
            onClick={() => { setEditingAimag({ ...emptyAimag }); setIsNew(true); }}
          >
            <Plus className="h-4 w-4 mr-1" /> Аймаг нэмэх
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : aimags.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Аймаг бүртгэгдээгүй байна</p>
          <Button className="mt-4" onClick={handleSeedAll} disabled={saving}>
            Анхны өгөгдлийг оруулах
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {aimags.map((aimag) => (
            <div
              key={aimag.id || aimag.name}
              className="rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    {aimag.photoUrl ? (
                      <img src={aimag.photoUrl} alt={aimag.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{aimag.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{aimag.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {aimag.population}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {aimag.attractions?.length || 0} газар</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedId(expandedId === (aimag.id || aimag.name) ? null : (aimag.id || aimag.name))}
                  >
                    {expandedId === (aimag.id || aimag.name) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingAimag({ ...aimag }); setIsNew(false); }}
                  >
                    <Edit className="h-3 w-3 mr-1" /> {t("edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setDeleteConfirm(aimag)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Expanded view */}
              {expandedId === (aimag.id || aimag.name) && (
                <div className="px-4 pb-4 border-t border-border/50">
                  {aimag.photoUrl && (
                    <div className="rounded-lg overflow-hidden aspect-[16/7] mt-3 mb-3">
                      <img src={aimag.photoUrl} alt={aimag.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                      <Users className="h-4 w-4 text-primary" /> {t("population")}: <span className="font-medium">{aimag.population}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                      <Ruler className="h-4 w-4 text-accent" /> {t("area")}: <span className="font-medium">{aimag.area}</span>
                    </div>
                  </div>
                  {aimag.attractions && aimag.attractions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-warning" /> {t("attractions")} ({aimag.attractions.length})
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {aimag.attractions.map((attr, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                            {attr.photoUrl && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={attr.photoUrl} alt={attr.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{attr.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{attr.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Аймаг устгах</DialogTitle>
            <DialogDescription>
              "{deleteConfirm?.name}" аймгийг устгахдаа итгэлтэй байна уу? {t("cannotUndo")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>{t("stopAction")}</Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AimagManager;
