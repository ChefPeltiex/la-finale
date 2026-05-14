import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { useMemo, useState, useEffect } from "react";

export default function SearchOptimized({ items, onSearch, placeholder = "Rechercher..." }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return items;
    return items.filter((item) =>
      (item.title?.toLowerCase() || "").includes(debouncedQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(debouncedQuery.toLowerCase())
    );
  }, [items, debouncedQuery]);

  useEffect(() => onSearch?.(filtered), [filtered, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 rounded-xl h-11"
      />
    </div>
  );
}