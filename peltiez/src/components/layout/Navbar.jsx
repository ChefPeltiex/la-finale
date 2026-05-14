import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { path: "/", label: "Accueil" },
  { path: "/marketplace", label: "Marketplace" },
  { path: "/carte-site", label: "Carte du site" },
  { path: "/vision", label: "Vision" },
  { path: "/about", label: "À propos" },
  { path: "/contact", label: "Contact" },
];

const Navbar = memo(function Navbar() {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">Egor69</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}>
              {link.label}
            </Link>
          ))}
        </div>
        <Button asChild size="sm" className="rounded-xl">
          <Link to="/publier">Publier</Link>
        </Button>
      </div>
    </nav>
  );
});

export default Navbar;