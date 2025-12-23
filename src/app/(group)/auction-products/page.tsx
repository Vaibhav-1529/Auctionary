"use client"; // This makes the entire component client-side

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuctionsList from "./AuctionsList";
import { ChevronDown, Grid, List } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const currentStatus = searchParams.get("status") ?? "all";
  const isDetailedFromUrl = searchParams.get("view") === "true";

  const [isDetailedCard, setIsDetailedCard] = useState(isDetailedFromUrl);

  const filters = [
    { label: "All Auctions", value: "all" },
    { label: "Live", value: "Live" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Ended", value: "Ended" },
  ];

  return (
    <section className="max-w-370 mx-auto px-6 py-16 bg-white">
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
              href={`/auction-products?status=${f.value}`}
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
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold hover:border-orange-500 hover:text-orange-500 transition">
            Default Sorting <ChevronDown size={14} />
          </button>

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
            isDetailed={isDetailedCard} 
        />
    </section>
  );
}
