import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapPin, Loader2, AlertCircle, Phone, Globe, Star, Wrench, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Custom icons
const createIcon = (color) => L.icon({
  iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}"><path d="M12 2C6.48 2 2 6.48 2 12c0 7 10 13 10 13s10-6 10-13c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const ARTISAN_ICON = createIcon("%23f59e0b"); // Amber
const DONATION_ICON = createIcon("%2310b981"); // Emerald
const USER_ICON = createIcon("%236366f1"); // Indigo

// Haversine formula pour calculer distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ArtisanInteractiveMap({ radius = 25 }) {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([45.5017, -73.5673]); // Montréal par défaut
  const [locationError, setLocationError] = useState(null);

  // Récupérer localisation utilisateur
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    }
  }, []);

  // Récupérer artisans + services + zones de don
  const { data: artisans = [], isLoading: loadingArtisans } = useQuery({
    queryKey: ["artisans-map"],
    queryFn: () => base44.entities.Artisan.list("-created_date", 200),
    staleTime: 300_000,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services-reparation"],
    queryFn: () => base44.entities.ServiceReparation.list("-created_date", 500),
    staleTime: 300_000,
  });

  const { data: listings = [], isLoading: loadingListings } = useQuery({
    queryKey: ["donation-zones"],
    queryFn: () => base44.entities.Listing.filter({ type: "don", status: "actif" }, "-created_date", 100),
    staleTime: 300_000,
  });

  // Filtrer par rayon
  const nearbyArtisans = useMemo(() => {
    if (!userLocation) return artisans;
    return artisans
      .map(a => {
        const coords = a.location?.split(",").map(x => parseFloat(x.trim()));
        if (!coords || coords.length !== 2) return null;
        const distance = getDistance(userLocation.lat, userLocation.lng, coords[0], coords[1]);
        return { ...a, distance, coords };
      })
      .filter(a => a && a.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [artisans, userLocation, radius]);

  const nearbyDonations = useMemo(() => {
    if (!userLocation) return listings;
    return listings
      .map(l => {
        const coords = l.location?.split(",").map(x => parseFloat(x.trim()));
        if (!coords || coords.length !== 2) return null;
        const distance = getDistance(userLocation.lat, userLocation.lng, coords[0], coords[1]);
        return { ...l, distance, coords };
      })
      .filter(l => l && l.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [listings, userLocation, radius]);

  if (loadingArtisans || loadingListings) {
    return (
      <div className="flex items-center justify-center h-96 rounded-2xl border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-200">
          <p className="text-2xl font-black text-amber-600">{nearbyArtisans.length}</p>
          <p className="text-xs text-amber-700 font-medium mt-0.5">Ateliers</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
          <p className="text-2xl font-black text-emerald-600">{nearbyDonations.length}</p>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">Zones de don</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
          <p className="text-lg font-black text-blue-600">{radius}km</p>
          <p className="text-xs text-blue-700 font-medium mt-0.5">Rayon</p>
        </div>
      </div>

      {/* Erreur géolocalisation */}
      {locationError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Géolocalisation non accessible. Affichage par défaut (Montréal).
        </div>
      )}

      {/* Carte */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-md h-96">
        <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {/* Cercle de rayon */}
          {userLocation && (
            <Circle center={[userLocation.lat, userLocation.lng]} radius={radius * 1000} color="#6366f1" fillOpacity={0.05} weight={2} />
          )}

          {/* Marker utilisateur */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={USER_ICON}>
              <Popup>📍 Votre position</Popup>
            </Marker>
          )}

          {/* Ateliers */}
          {nearbyArtisans.map(a => {
            const artisanServices = services.filter(s => s.artisan_id === a.id);
            return (
              a.coords && (
                <Marker key={a.id} position={a.coords} icon={ARTISAN_ICON}>
                  <Popup maxWidth={320}>
                    <div className="text-xs space-y-2.5 p-2">
                      {/* En-tête */}
                      <div>
                        <p className="font-bold text-amber-700 text-sm">{a.business_name}</p>
                        <p className="text-gray-500 text-[10px]">{a.category}</p>
                      </div>

                      {/* Distance */}
                      {a.distance && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" /> {a.distance.toFixed(1)} km
                        </div>
                      )}

                      {/* Contact */}
                      <div className="space-y-1 border-t pt-1.5">
                        {a.phone && (
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Phone className="h-3 w-3 text-amber-600" /> {a.phone}
                          </div>
                        )}
                        {a.website && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3 w-3 text-blue-600" />
                            <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[10px]">
                              Site web
                            </a>
                          </div>
                        )}
                        {a.email && (
                          <p className="text-gray-600 text-[10px]">{a.email}</p>
                        )}
                      </div>

                      {/* Services */}
                      {artisanServices.length > 0 && (
                        <div className="border-t pt-1.5 space-y-1.5">
                          <p className="font-bold text-amber-700 text-[11px] uppercase tracking-wide flex items-center gap-1">
                            <Wrench className="h-3 w-3" /> Services ({artisanServices.length})
                          </p>
                          {artisanServices.slice(0, 3).map(s => (
                            <div key={s.id} className="bg-amber-50 rounded p-1.5 border border-amber-100">
                              <p className="font-semibold text-amber-900 text-[10px]">{s.service_name}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap text-[9px] text-gray-600">
                                {s.duration_hours && (
                                  <span className="flex items-center gap-0.5">
                                    <Clock className="h-2 w-2" /> {s.duration_hours}h
                                  </span>
                                )}
                                {s.price_range && (
                                  <span className="flex items-center gap-0.5">
                                    <DollarSign className="h-2 w-2" /> {s.price_range}
                                  </span>
                                )}
                                {s.rating && (
                                  <span className="flex items-center gap-0.5 text-amber-600">
                                    <Star className="h-2 w-2 fill-amber-600" /> {s.rating}/5
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {artisanServices.length > 3 && (
                            <p className="text-[9px] text-gray-500 italic">+{artisanServices.length - 3} autres services</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            );
          })}

          {/* Zones de don */}
          {nearbyDonations.map(d => (
            d.coords && (
              <Marker key={d.id} position={d.coords} icon={DONATION_ICON}>
                <Popup>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-700">{d.title}</p>
                    <p className="text-gray-600">{d.category} • {d.condition}</p>
                    {d.distance && <p className="text-gray-500">{d.distance.toFixed(1)} km</p>}
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Légende */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          <span className="text-blue-700 font-medium">Vous</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-600" />
          <span className="text-amber-700 font-medium">Ateliers</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          <span className="text-emerald-700 font-medium">Dons</span>
        </div>
      </div>

      {/* Listes détaillées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ateliers */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <span className="text-xl">🔨</span> Ateliers à proximité
          </h3>
          {nearbyArtisans.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Aucun atelier trouvé à {radius}km</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {nearbyArtisans.map(a => {
                const artisanServices = services.filter(s => s.artisan_id === a.id);
                return (
                  <div key={a.id} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer hover:border-amber-400 hover:bg-amber-100 transition-all">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-amber-900">{a.business_name}</p>
                        <p className="text-xs text-amber-700">{a.category}</p>
                      </div>
                      {artisanServices.length > 0 && (
                        <Badge className="text-[10px] bg-amber-600 text-white border-0 px-1.5 py-0.5">
                          {artisanServices.length} services
                        </Badge>
                      )}
                    </div>
                    {a.distance && (
                      <p className="text-[10px] text-amber-600 font-semibold">
                        {a.distance.toFixed(1)} km
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Zones de don */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <span className="text-xl">🎁</span> Dons disponibles
          </h3>
          {nearbyDonations.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Aucun don à proximité</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {nearbyDonations.map(d => (
                <div key={d.id} className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-sm font-bold text-emerald-900 line-clamp-1">{d.title}</p>
                  <p className="text-xs text-emerald-700">{d.category}</p>
                  {d.distance && (
                    <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold">
                      {d.distance.toFixed(1)} km
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}