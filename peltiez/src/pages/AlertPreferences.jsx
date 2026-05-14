import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell, Plus, X, Save, Loader2, AlertCircle, DollarSign, MapPin, Tags
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["électronique", "vêtements", "mobilier", "livres", "sport", "maison", "outils", "autre"];
const TYPES = [
  { key: "don", label: "Don", emoji: "🎁" },
  { key: "vente", label: "Vente", emoji: "💰" },
  { key: "échange", label: "Échange", emoji: "🔄" },
  { key: "réparation", label: "Réparation", emoji: "🔧" },
];

export default function AlertPreferences() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    categories: [],
    types: [],
    keywords: [],
    notification_method: "both",
    frequency: "realtime",
    min_price: "",
    max_price: "",
    preferred_locations: []
  });
  const [newKeyword, setNewKeyword] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Auth
  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  // Récupérer les alertes
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["user-alerts", user?.email],
    queryFn: () => user?.email 
      ? base44.entities.UserAlert.filter({ user_email: user.email }, "-created_at", 20)
      : Promise.resolve([]),
    enabled: !!user?.email,
    staleTime: 30_000,
  });

  // Créer alerte
  const createMutation = useMutation({
    mutationFn: async () => {
      if (newAlert.categories.length === 0 && newAlert.types.length === 0) {
        throw new Error("Sélectionnez au moins une catégorie ou un type");
      }
      return base44.entities.UserAlert.create({
        ...newAlert,
        user_email: user.email,
        min_price: newAlert.min_price ? parseFloat(newAlert.min_price) : undefined,
        max_price: newAlert.max_price ? parseFloat(newAlert.max_price) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
      setShowForm(false);
      setNewAlert({
        categories: [],
        types: [],
        keywords: [],
        notification_method: "both",
        frequency: "realtime",
        min_price: "",
        max_price: "",
        preferred_locations: []
      });
    }
  });

  // Supprimer alerte
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.UserAlert.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
    }
  });

  // Basculer alerte
  const toggleMutation = useMutation({
    mutationFn: (id) => base44.entities.UserAlert.update(id, {
      is_active: !alerts.find(a => a.id === id)?.is_active
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
    }
  });

  if (!user) return (
    <div className="text-center py-12">
      <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
      <p className="text-muted-foreground">Connectez-vous pour gérer vos alertes</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-500" /> Mes alertes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Restez notifié des nouveaux objets qui vous intéressent</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
      ) : (
        <>
          {alerts.length > 0 && (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={cn(
                  "bg-card rounded-2xl border p-5 space-y-3",
                  alert.is_active ? "border-blue-200/50" : "border-border opacity-60"
                )}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={alert.is_active ? "bg-blue-100 text-blue-700 border-0" : "bg-muted"}>
                          {alert.frequency === "realtime" ? "⚡ En temps réel" : alert.frequency === "daily_digest" ? "📅 Digest quotidien" : "📋 Digest hebdomadaire"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.notification_method === "email" ? "📧 Email" : alert.notification_method === "in_app" ? "🔔 App" : "📧📱 Les deux"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {alert.categories?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Catégories</p>
                            <div className="flex flex-wrap gap-1">
                              {alert.categories.map(c => (
                                <Badge key={c} variant="outline" className="text-xs capitalize">{c}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {alert.types?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Types</p>
                            <div className="flex flex-wrap gap-1">
                              {alert.types.map(t => {
                                const cfg = TYPES.find(ty => ty.key === t);
                                return (
                                  <Badge key={t} variant="outline" className="text-xs">
                                    {cfg?.emoji} {cfg?.label}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {alert.min_price || alert.max_price ? (
                          <div className="flex items-center gap-1 text-xs">
                            <DollarSign className="h-3 w-3" />
                            {alert.min_price} - {alert.max_price || "∞"} $
                          </div>
                        ) : null}

                        {alert.preferred_locations?.length > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {alert.preferred_locations.join(", ")}
                          </div>
                        )}

                        {alert.keywords?.length > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <Tags className="h-3 w-3" />
                            {alert.keywords.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => toggleMutation.mutate(alert.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          alert.is_active ? "bg-blue-100 text-blue-600 hover:bg-blue-200" : "bg-muted text-muted-foreground hover:bg-accent"
                        )}>
                        <Bell className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(alert.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full rounded-xl h-12 gap-2" size="lg">
              <Plus className="h-4 w-4" /> Créer une nouvelle alerte
            </Button>
          )}

          {showForm && (
            <div className="bg-card rounded-2xl border border-blue-200 p-6 space-y-5">
              <h2 className="font-semibold text-lg text-foreground">Nouvelle alerte</h2>

              {/* Catégories */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Catégories (optionnel)</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => {
                      const cats = newAlert.categories.includes(cat)
                        ? newAlert.categories.filter(c => c !== cat)
                        : [...newAlert.categories, cat];
                      setNewAlert({ ...newAlert, categories: cats });
                    }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
                        newAlert.categories.includes(cat)
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-card border-border text-muted-foreground hover:bg-accent"
                      )}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Types (optionnel)</label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(type => (
                    <button key={type.key} onClick={() => {
                      const types = newAlert.types.includes(type.key)
                        ? newAlert.types.filter(t => t !== type.key)
                        : [...newAlert.types, type.key];
                      setNewAlert({ ...newAlert, types });
                    }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        newAlert.types.includes(type.key)
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-card border-border text-muted-foreground hover:bg-accent"
                      )}>
                      {type.emoji} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix (pour ventes) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Prix min ($)</label>
                  <Input type="number" min="0" step="0.50" placeholder="0.00"
                    value={newAlert.min_price}
                    onChange={e => setNewAlert({ ...newAlert, min_price: e.target.value })}
                    className="rounded-lg h-10" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Prix max ($)</label>
                  <Input type="number" min="0" step="0.50" placeholder="∞"
                    value={newAlert.max_price}
                    onChange={e => setNewAlert({ ...newAlert, max_price: e.target.value })}
                    className="rounded-lg h-10" />
                </div>
              </div>

              {/* Localités */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Localités (optionnel)</label>
                <div className="flex gap-2 mb-2">
                  <Input type="text" placeholder="Ex: Québec, Montréal"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="rounded-lg h-10 flex-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newLocation.trim()) {
                        setNewAlert({
                          ...newAlert,
                          preferred_locations: [...new Set([...newAlert.preferred_locations, newLocation.trim()])]
                        });
                        setNewLocation("");
                      }
                    }} />
                  <Button onClick={() => {
                    if (newLocation.trim()) {
                      setNewAlert({
                        ...newAlert,
                        preferred_locations: [...new Set([...newAlert.preferred_locations, newLocation.trim()])]
                      });
                      setNewLocation("");
                    }
                  }} variant="outline" className="rounded-lg">Ajouter</Button>
                </div>
                {newAlert.preferred_locations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newAlert.preferred_locations.map((loc, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 cursor-pointer"
                        onClick={() => setNewAlert({
                          ...newAlert,
                          preferred_locations: newAlert.preferred_locations.filter((_, idx) => idx !== i)
                        })}>
                        {loc} <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Mots-clés */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mots-clés (optionnel)</label>
                <div className="flex gap-2 mb-2">
                  <Input type="text" placeholder="Ex: vintage, bois"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    className="rounded-lg h-10 flex-1"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newKeyword.trim()) {
                        setNewAlert({
                          ...newAlert,
                          keywords: [...new Set([...newAlert.keywords, newKeyword.trim()])]
                        });
                        setNewKeyword("");
                      }
                    }} />
                  <Button onClick={() => {
                    if (newKeyword.trim()) {
                      setNewAlert({
                        ...newAlert,
                        keywords: [...new Set([...newAlert.keywords, newKeyword.trim()])]
                      });
                      setNewKeyword("");
                    }
                  }} variant="outline" className="rounded-lg">Ajouter</Button>
                </div>
                {newAlert.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newAlert.keywords.map((kw, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 cursor-pointer"
                        onClick={() => setNewAlert({
                          ...newAlert,
                          keywords: newAlert.keywords.filter((_, idx) => idx !== i)
                        })}>
                        {kw} <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Fréquence */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Fréquence</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "realtime", label: "⚡ En temps réel" },
                    { key: "daily_digest", label: "📅 Digest quotidien" },
                    { key: "weekly_digest", label: "📋 Digest hebdomadaire" }
                  ].map(f => (
                    <button key={f.key} onClick={() => setNewAlert({ ...newAlert, frequency: f.key })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        newAlert.frequency === f.key
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-card border-border text-muted-foreground hover:bg-accent"
                      )}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Méthode notification */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Comment notifier?</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "email", label: "📧 Email" },
                    { key: "in_app", label: "🔔 App" },
                    { key: "both", label: "📧📱 Les deux" }
                  ].map(m => (
                    <button key={m.key} onClick={() => setNewAlert({ ...newAlert, notification_method: m.key })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        newAlert.notification_method === m.key
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-card border-border text-muted-foreground hover:bg-accent"
                      )}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}
                  className="flex-1 rounded-xl h-11 bg-blue-500 hover:bg-blue-600 text-white font-semibold gap-2">
                  {createMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Création...</> : <><Save className="h-4 w-4" /> Créer</> }
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl h-11">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}