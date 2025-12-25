"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debouncing Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const { data } = await supabase
          .from("auction_items")
          .select("id, title, image_url, current_bid")
          .ilike("title", `%${query}%`)
          .limit(5);
        
        setSuggestions(data || []);
        setIsOpen(true);
        setLoading(false);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/auction-products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full md:w-64" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          placeholder="Search auctions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full rounded-full pr-10 focus-visible:ring-primary"
        />
        <div className="absolute right-3 top-2.5">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || query.length > 1) && (
        <div className="absolute top-full mt-2 w-full md:w-80 bg-popover border rounded-xl shadow-lg z-[60] overflow-hidden">
          {suggestions.length > 0 ? (
            <div className="p-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground px-3 py-2">
                Suggestions
              </p>
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors group"
                >
                  <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate group-hover:text-primary">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current: ₹{item.current_bid?.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : !loading && query.length > 1 ? (
            <p className="p-4 text-sm text-center text-muted-foreground">
              No auctions found.
            </p>
          ) : null}
          
          <button
            onClick={handleSearch}
            className="w-full bg-muted/50 p-2 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors border-t"
          >
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}