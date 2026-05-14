import { useMemo } from "react";
import { Link } from "react-router-dom";
import SEOMeta from "@/components/SEOMeta";
import { BIBLE_ENTRIES } from "@/data/bibleEncyclopedia";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function BiblePlacesMap() {
  const places = useMemo(
    () => BIBLE_ENTRIES.filter((e) => e.category === "Lieux" && e.geo?.lat && e.geo?.lng),
    []
  );

  const center = places[0]?.geo ? [places[0].geo.lat, places[0].geo.lng] : [31.7683, 35.2137];

  return (
    <div className="pb-20 space-y-10">
      <SEOMeta
        title="Carte — Lieux bibliques | Egor69"
        description="Carte interactive des lieux (liens directs vers les fiches)."
        canonicalUrl="/encyclopedie-biblique/carte"
        schemaData={{ "@context": "https://schema.org", "@type": "Map", name: "Carte des lieux bibliques" }}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/encyclopedie-biblique">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Link>
        </Button>
        <Badge className="bg-black/30 text-white border-white/10">
          <MapPin className="h-3.5 w-3.5 mr-2" /> CARTE
        </Badge>
      </div>

      <div className="rounded-3xl overflow-hidden border border-white/10 bg-card">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-display text-3xl font-black text-foreground">Carte des lieux</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chaque marqueur ouvre une fiche. On étend ensuite vers routes, itinéraires et timeline géographique.
          </p>
          <p className="text-[11px] text-white/35 mt-2">
            Prochaine passe: “Trajectoires” (polylines) générées depuis la timeline + journaux de voyage.
          </p>
        </div>

        <div className="h-[520px]">
          <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map((p) => (
              <Marker key={p.id} position={[p.geo.lat, p.geo.lng]}>
                <Popup>
                  <div style={{ maxWidth: 240 }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>{p.subtitle}</div>
                    <a href={`/encyclopedie-biblique/${p.id}`} style={{ fontWeight: 700 }}>
                      Ouvrir la fiche →
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

