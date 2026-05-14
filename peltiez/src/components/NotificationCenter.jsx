import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Bell, BellRing, X, MapPin, Share2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const SHARE_QUEST_INTERVAL = 4 * 60 * 60 * 1000; // every 4h
const SHARE_QUEST_MESSAGES = [
  { title: "⚡ Nouvelle Quête de Partage !", body: "Partagez Egor69 sur LinkedIn → +100 Étincelles débloquées.", link: "/share-quests" },
  { title: "✨ Étincelles disponibles", body: "Un partage Facebook vous donne +50 crédits communautaires maintenant.", link: "/share-quests" },
  { title: "🔥 Quête quotidienne active", body: "Invitez un ami et gagnez +50 points de réputation aujourd'hui.", link: "/referral" },
];

function fireNotification(title, body, link, onAdd) {
  // In-app
  onAdd({ id: Date.now(), title, body, link, time: new Date(), read: false });

  // Browser push
  if (Notification.permission === "granted") {
    const n = new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: link,
    });
    n.onclick = () => { window.focus(); window.location.href = link; n.close(); };
  }
}

export default function NotificationCenter() {
  const [permission, setPermission] = useState(Notification.permission);
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const lastShareQuestRef = useRef(0);
  const panelRef = useRef(null);

  const addNotif = useCallback((n) => setNotifs(prev => [n, ...prev].slice(0, 30)), []);

  // Request permission once
  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  // Get user city from profile
  useEffect(() => {
    base44.auth.me().then(u => { if (u?.location) setUserLocation(u.location); }).catch(() => {});
  }, []);

  // Subscribe to new Listing entities in real-time
  useEffect(() => {
    const unsub = base44.entities.Listing.subscribe((event) => {
      if (event.type !== "create") return;
      const listing = event.data;
      if (!listing) return;

      const isNearby = !userLocation || !listing.location ||
        listing.location.toLowerCase().includes(userLocation.toLowerCase().split(",")[0]) ||
        userLocation.toLowerCase().includes(listing.location.toLowerCase().split(",")[0]);

      if (!isNearby) return;

      const typeLabels = { don: "Don gratuit", échange: "Échange", réparation: "Réparation", vente: "Vente" };
      const typeEmojis = { don: "🎁", échange: "♻️", réparation: "🔧", vente: "📦" };

      fireNotification(
        `${typeEmojis[listing.type] || "📦"} Nouvelle annonce près de vous !`,
        `${typeLabels[listing.type] || listing.type} : ${listing.title}${listing.location ? ` · ${listing.location}` : ""}`,
        `/annonce/${listing.id}`,
        addNotif
      );
    });
    return unsub;
  }, [userLocation, addNotif]);

  // Periodic share quest reminders
  useEffect(() => {
    const check = () => {
      const now = Date.now();
      if (now - lastShareQuestRef.current < SHARE_QUEST_INTERVAL) return;
      lastShareQuestRef.current = now;
      const msg = SHARE_QUEST_MESSAGES[Math.floor(Math.random() * SHARE_QUEST_MESSAGES.length)];
      fireNotification(msg.title, msg.body, msg.link, addNotif);
    };

    // Check on mount (after 30s delay so it's not instant)
    const initial = setTimeout(check, 30_000);
    const interval = setInterval(check, 60_000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [addNotif]);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(v => !v); if (!open) markAllRead(); }}
        className={cn(
          "relative p-2 rounded-xl transition-all",
          open ? "bg-primary/20 text-primary" : "text-white/50 hover:text-white hover:bg-white/5"
        )}
      >
        {unread > 0
          ? <BellRing className="h-5 w-5 animate-pulse text-amber-400" />
          : <Bell className="h-5 w-5" />
        }
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: "#ef4444", color: "white" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Permission banner (if needed) */}
      {permission === "default" && !open && (
        <div className="hidden" />
      )}

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl z-50 overflow-hidden animate-fade-in-scale"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(16,185,129,0.06)"
          }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {notifs.length > 0 && <span className="text-xs text-muted-foreground">({notifs.length})</span>}
            </div>
            <div className="flex items-center gap-2">
              {notifs.length > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1">
                  <CheckCheck className="h-3 w-3" /> Tout lire
                </button>
              )}
            </div>
          </div>

          {/* Permission request */}
          {permission !== "granted" && (
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: "hsl(var(--primary)/0.08)", borderBottom: "1px solid hsl(var(--border))" }}>
              <BellRing className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground">Activer les alertes push</p>
                <p className="text-[10px] text-muted-foreground">Reçevez les opportunités en temps réel</p>
              </div>
              <button onClick={requestPermission}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "hsl(var(--primary))" }}>
                Activer
              </button>
            </div>
          )}

          {/* Notifications list */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell className="h-8 w-8 text-muted-foreground/20" />
                <p className="text-xs text-muted-foreground">Aucune notification pour l'instant</p>
                <p className="text-[10px] text-muted-foreground/60">Les nouvelles annonces proches de vous apparaîtront ici</p>
              </div>
            ) : (
              notifs.map(n => {
                const isQuest = n.link?.includes("share") || n.link?.includes("referral");
                return (
                  <Link
                    key={n.id}
                    to={n.link || "/"}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group",
                      !n.read && "bg-primary/4"
                    )}
                    style={{ borderBottom: "1px solid hsl(var(--border)/0.5)" }}
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isQuest ? "rgba(139,92,246,0.15)" : "rgba(16,185,129,0.15)" }}>
                      {isQuest ? <Share2 className="h-4 w-4 text-purple-400" /> : <MapPin className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground line-clamp-1">{n.title}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                      <p className="text-[9px] text-muted-foreground/50 mt-1">
                        {new Date(n.time).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all flex-shrink-0"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <Link to="/marketplace" className="text-[10px] text-primary hover:underline font-medium" onClick={() => setOpen(false)}>
              Voir toutes les annonces →
            </Link>
            <Link to="/share-quests" className="text-[10px] text-purple-400 hover:underline font-medium" onClick={() => setOpen(false)}>
              Quêtes ✨
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}