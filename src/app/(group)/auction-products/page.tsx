"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List } from "lucide-react";
import Link from "next/link";
import AuctionsList from "./AuctionsList";

export default function AuctionGridContent() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const currentStatus = searchParams.get("status") ?? "all";
  const searchQuery = searchParams.get("search") ?? "";
  const isDetailedFromUrl = searchParams.get("view") === "true";

  const [isMobile, setIsMobile] = useState(false);
  const [isDetailedCard, setIsDetailedCard] = useState(isDetailedFromUrl);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ FINAL VIEW MODE
  const isDetailedView = isMobile ? true : isDetailedCard;

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
          Home <span className="mx-1">→</span> Auctions
        </p>
      </div>

      {/* Filters + Toggle (Desktop Only) */}
      
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Link
                key={f.value}
                href={`/auction-products?status=${f.value}${searchQuery ? `&search=${searchQuery}` : ""}`}
                className={`sm:px-4 px-2 sm:py-2 p-1 rounded-full text-xs sm:text-sm sm:font-bold font-semibold border transition ${
                  currentStatus === f.value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-500"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          {/* Toggle Button */}
          {!isMobile&&<button
            onClick={() => setIsDetailedCard(!isDetailedCard)}
            className="p-2 rounded-full border border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100"
          >
            {isDetailedView ? <Grid size={18} /> : <List size={18} />}
          </button>}
        </div>

      <AuctionsList
        page={page}
        status={currentStatus}
        search={searchQuery}
        isDetailed={isDetailedView}
      />
    </section>
  );
}
