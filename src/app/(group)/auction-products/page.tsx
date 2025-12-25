"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ChevronDown, Grid, List } from "lucide-react";
import Link from "next/link";
import ItemCard from "@/FunComponents/ItemCard";
import HorizontalItemCard from "@/FunComponents/HorizontalItemCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Supabase Client Initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function AuctionGridContent() {
  const searchParams = useSearchParams();

  // URL State
  const page = Number(searchParams.get("page") ?? 1);
  const currentStatus = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("search") ?? ""; // Fixed: Added search param
  const isDetailedFromUrl = searchParams.get("view") === "true";

  const [isDetailedCard, setIsDetailedCard] = useState(isDetailedFromUrl);

  const filters = [
    { label: "All Auctions", value: "all" },
    { label: "Live", value: "Live" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Ended", value: "Ended" },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-16 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 text-gray-900">Auctions Grid</h1>
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1">→</span> Auctions Grid
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={`/auction-products?status=${f.value}${searchQuery ? `&search=${searchQuery}` : ""}`}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                currentStatus === f.value
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDetailedCard(!isDetailedCard)} 
            className="p-2 rounded-full border border-orange-500 bg-orange-50 text-orange-600 transition-colors hover:bg-orange-100"
          >
            {!isDetailedCard ? <Grid size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      <AuctionsList 
        page={page} 
        status={currentStatus} 
        search={searchQuery} // Fixed: Passing search to list
        isDetailed={isDetailedCard} 
      />
    </section>
  );
}

/**
 * 2. Data Fetching Component
 */
function AuctionsList({
  page,
  status,
  search, // Fixed: Accept search prop
  isDetailed,
}: {
  page: number;
  status: string;
  search: string; // Fixed: Prop type
  isDetailed?: boolean;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAuctions() {
      setLoading(true);
      setError(false);
      try {
        const { data, error: fetchError } = await supabase.functions.invoke("get-auctions", {
          body: {
            page,
            status: status === "all" ? null : status,
            search: search || null, // Fixed: Pass search to Edge Function
          },
        });

        if (fetchError) throw fetchError;

        const auctionItems = Array.isArray(data) ? data : data?.items ?? [];
        const total = data?.totalPages ?? 1;
        setItems(auctionItems);
        setTotalPages(total);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAuctions();
  }, [page, status, search]); // Fixed: Added search to dependency array

  if (loading) return <AuctionsSkeleton isDetailed={isDetailed} />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold">Failed to load auctions.</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-orange-500 underline">
          Try Again
        </button>
      </div>
    );
  }

  const getPageUrl = (p: number) =>
    `/auction-products?page=${p}${status !== "all" ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}${isDetailed ? `&view=true` : ""}`;

  return (
    <section>
      <div className={`grid gap-6 ${isDetailed ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {items.length > 0 ? (
          items.map((item: any, i: number) => (
            isDetailed ? 
              <HorizontalItemCard key={item.id} item={item} i={i} /> : 
              <ItemCard key={item.id} item={item} i={i} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No auctions found matching your criteria.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination>
            <PaginationContent className="bg-white rounded-xl px-4 py-2 shadow-sm border">
              <PaginationItem>
                <PaginationPrevious 
                   href={getPageUrl(Math.max(1, page - 1))}
                   className={page === 1 ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href={getPageUrl(i + 1)} 
                    isActive={page === i + 1}
                    className={page === i + 1 ? "bg-orange-500 text-white" : ""}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                   href={getPageUrl(Math.min(totalPages, page + 1))}
                   className={page === totalPages ? "pointer-events-none opacity-40" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}

/**
 * 3. Loading Skeleton
 */
function AuctionsSkeleton({ isDetailed }: { isDetailed?: boolean }) {
  return (
    <div className={`grid gap-6 ${isDetailed ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse">
           <div className="bg-gray-200 h-40 w-full" />
           <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 w-3/4" />
              <div className="h-4 bg-gray-200 w-1/2" />
           </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 4. Main Page Component (Export Default)
 */
export default function Page() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse">Loading Grid...</div>}>
      <AuctionGridContent />
    </Suspense>
  );
}