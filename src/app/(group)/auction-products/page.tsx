import { Suspense } from "react";
import AuctionsList from "./AuctionsList";
import { ChevronDown, Grid, List } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page ?? 1);

  return (
    <section className="max-w-370 mx-auto px-6 py-16 bg-white">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2 text-gray-900">
          Auctions Grid
        </h1>
        <p className="text-sm text-muted-foreground">
          Home <span className="mx-1">→</span> Auctions Grid
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-muted-foreground">
          Showing results
        </p>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold hover:border-orange-500 hover:text-orange-500 transition">
            Default Sorting <ChevronDown size={14} />
          </button>

          <button className="p-2 rounded-full border border-orange-500 bg-orange-50 text-orange-600">
            <Grid size={18} />
          </button>

          <button className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 transition">
            <List size={18} />
          </button>
        </div>
      </div>

      <Suspense fallback={<AuctionsSkeleton />}>
        <AuctionsList page={page} />
      </Suspense>
    </section>
  );
}

function AuctionsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="min-w-84 max-w-84 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="relative h-70 bg-gray-100 animate-pulse">
            <div className="absolute top-3 left-3 h-5 w-14 rounded-full bg-gray-300/40" />
            <div className="absolute top-12 left-3 h-5 w-20 rounded-full bg-gray-300/40" />
          </div>

          <div className="p-4 space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 w-full rounded-full bg-gray-300 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
