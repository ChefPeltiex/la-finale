import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useMemo, useRef, useEffect } from "react";
import { Leaf, Globe, Users, TrendingUp, Heart, Award, MapPin, Wrench, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function GlobalImpact() {
  const canvasRef = useRef(null);

  const { data: listings = [] } = useQuery({
    queryKey: ["listings-all"],
    queryFn: () => base44.entities.Listing.list("-created_date", 10000),
    staleTime: 30_000,
  });

  const { data: ecoProfiles = [] } = useQuery({
    queryKey: ["eco-profiles-all"],
    queryFn: () => base44.entities.EcoProfile.list("-created_date", 10000),
    staleTime: 60_000,
  });

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(16, 185, 129, 0.1)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.globalAlpha = p.opacity;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = useMemo(() => {
    const co2 = listings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const objects = listings.filter(l => l.status === "actif").length;
    const users = new Set(listings.map(l => l.created_by)).size;
    const countries = new Set(listings.map(l => l.location).filter(Boolean)).size;
    const repairs = listings.filter(l => l.type === "réparation").length;
    const donations = listings.filter(l => l.type === "don").length;

    return { co2: Math.round(co2), objects, users, countries, repairs, donations };
  }, [listings]);

  const topCountries = useMemo(() => {
    const countMap = {};
    listings.forEach(l => {
      if (l.location) countMap[l.location] = (countMap[l.location] || 0) + 1;
    });
    return Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([country, count]) => ({ country, count }));
  }, [listings]);

  const topContributors = ecoProfiles
    .sort((a, b) => (b.total_co2_saved || 0) - (a.total_co2_saved || 0))
    .slice(0, 5);

  return (
    <div className="pb-20 space-y-8 overflow-hidden">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{ mixBlendMode: "screen" }}
      />

      <div className="relative z-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4 pt-8">
          <Badge className="mb-2 bg-emerald-100 text-emerald-800 border-emerald-300 font-medium">
            🌍 Impact Écologique Global
          </Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-white">
            Notre puissance<br />
            <span className="text-emerald-400">en temps réel</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Chaque objet réparé, chaque échange équitable, c'est une empreinte carbone réduite. 
            Voici votre impact collectif.
          </p>
        </div>

        {/* Main stats grid */}
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Leaf, label: "CO₂ Évité", value: stats.co2, unit: "kg", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
            { icon: Gift, label: "Objets Sauvés", value: stats.objects, unit: "", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30" },
            { icon: Users, label: "Utilisateurs", value: stats.users, unit: "", color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30" },
            { icon: Globe, label: "Pays/Régions", value: stats.countries, unit: "", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
            { icon: Wrench, label: "Réparations", value: stats.repairs, unit: "", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
            { icon: Heart, label: "Donations", value: stats.donations, unit: "", color: "from-red-500/20 to-rose-500/20", border: "border-red-500/30" },
          ].map(({ icon: Icon, label, value, unit, color, border }) => (
            <div key={label} className={`rounded-2xl p-6 border backdrop-blur-sm bg-gradient-to-br ${color} ${border}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">{label}</p>
                  <p className="text-4xl font-bold text-white">
                    <AnimatedCounter target={value} />
                    <span className="text-lg text-white/50 ml-1">{unit}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white/60" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projection section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
              <h2 className="font-display text-2xl font-bold text-white">Projection 2030</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-white/50 text-sm mb-2">CO₂ évité (cumulé)</p>
                <p className="text-3xl font-bold text-emerald-400">
                  <AnimatedCounter target={Math.round(stats.co2 * 500)} />
                  <span className="text-lg text-white/50"> kg</span>
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-2">Emplois verts soutenus</p>
                <p className="text-3xl font-bold text-blue-400">
                  <AnimatedCounter target={stats.repairs * 12} />
                </p>
              </div>
              <div>
                <p className="text-white/50 text-sm mb-2">Objets sauvés</p>
                <p className="text-3xl font-bold text-purple-400">
                  <AnimatedCounter target={stats.objects * 250} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top countries + contributors */}
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Countries */}
          <div className="rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-white">Top Régions</h3>
            </div>
            <div className="space-y-3">
              {topCountries.map(({ country, count }, i) => (
                <div key={country} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-400">#{i + 1}</span>
                    {country}
                  </span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top contributors */}
          <div className="rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">Champions du bien</h3>
            </div>
            <div className="space-y-3">
              {topContributors.map(({ display_name, total_co2_saved }, i) => (
                <div key={display_name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-400">#{i + 1}</span>
                    {display_name}
                  </span>
                  <span className="text-white font-bold text-sm">+{(total_co2_saved || 0).toFixed(1)}kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Rejoignez le mouvement
            </h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto">
              Chaque action compte. Chaque échange réduit l'impact. Ensemble, nous changeons le monde.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 border-0">
                <Link to="/marketplace">Découvrir les annonces</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
                <Link to="/publier">Publier un objet</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}