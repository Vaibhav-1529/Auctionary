"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <h1 className="text-4xl font-black mb-2 text-gray-900">
          Auctions
        </h1>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.value}
              href={`/auction-products?status=${f.value}${
                searchQuery ? `&search=${searchQuery}` : ""
              }`}
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                currentStatus === f.value
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {!isMobile && (
          <button
            onClick={() => setIsDetailedCard(!isDetailedCard)}
            className="p-2 rounded-full border border-orange-500 bg-orange-50 text-orange-600"
          >
            {isDetailedView ? <Grid size={18} /> : <List size={18} />}
          </button>
        )}
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
