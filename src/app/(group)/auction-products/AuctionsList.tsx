"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuctionsList({
  page,
  status,
  search, // Added search prop
  isDetailed,
}: {
  page: number;
  status: string;
  search?: string; // Added search type
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
            search: search || null, // Pass search query to Edge Function
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
  }, [page, status, search]); // Added search to dependency array

  if (loading) {
    return <AuctionsSkeleton isDetailed={isDetailed} />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold">Failed to load auctions.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-sm text-orange-500 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getPageUrl = (p: number) =>
    `/auction-products?page=${p}${status !== "all" ? `&status=${status}` : ""}${
      search ? `&search=${search}` : ""
    }${isDetailed ? `&view=true` : ""}`;

  return (
    <section className="relative">
      <div className={`grid gap-6 ${
        isDetailed 
        ? "grid-cols-1" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}>
        {items.length > 0 ? (
          items.map((item: any, i: number) => (
            isDetailed ?
            <HorizontalItemCard key={item.id} item={item} i={i} /> :
            <ItemCard key={item.id} item={item} i={i} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
              No auctions found matching your search.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination>
            <PaginationContent className="bg-white rounded-xl px-4 py-2 shadow-sm border border-border">
              <PaginationItem>
                <PaginationPrevious
                  href={getPageUrl(page - 1)}
                  aria-disabled={page === 1}
                  className={`border border-border rounded-lg hover:bg-orange-50 hover:text-orange-600 ${
                    page === 1 ? "pointer-events-none opacity-40" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                const isActive = page === pageNumber;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={getPageUrl(pageNumber)}
                      isActive={isActive}
                      className={`rounded-lg border border-border font-semibold transition-colors ${
                        isActive
                          ? "bg-orange-500 text-white hover:bg-orange-300"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href={getPageUrl(page + 1)}
                  aria-disabled={page === totalPages}
                  className={`border border-border rounded-lg hover:bg-orange-50 hover:text-orange-600 ${
                    page === totalPages ? "pointer-events-none opacity-40" : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
}

function AuctionsSkeleton({ isDetailed }: { isDetailed?: boolean }) {
  return (
    <div className={`grid gap-6 ${
        isDetailed 
        ? "grid-cols-1" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${isDetailed ? "flex flex-col md:flex-row h-auto md:h-64" : ""}`}
        >
          <div className={`relative bg-gray-100 animate-pulse ${isDetailed ? "w-full md:w-1/3 h-48 md:h-full" : "h-70"}`}>
            <div className="absolute top-3 left-3 h-5 w-14 rounded-full bg-gray-200" />
          </div>
          <div className={`p-4 space-y-3 flex-1 ${isDetailed ? "flex flex-col justify-center" : ""}`}>
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded-full bg-gray-200 animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}