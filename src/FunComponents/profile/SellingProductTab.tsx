"use client";

import { Gavel } from "lucide-react";

interface AuctionItem {
  id: string;
  title: string;
  current_bid: number;
  starting_bid: number;
  status: string;
}

export default function SellingProductTab({
  sellingAuctions,
}: {
  sellingAuctions: AuctionItem[];
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Your Active Listings
          </h3>
          <p className="text-sm text-gray-500">
            Manage and monitor your auction items
          </p>
        </div>
      </div>

      {sellingAuctions.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-gray-400">
          You haven't listed any items yet.
        </div>
      ) : (
        <div className="space-y-4">
          {sellingAuctions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border bg-white px-6 py-4 hover:shadow-md transition"
            >
              <div>
                <h4 className="font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  Current Bid: ₹{(item.current_bid ?? item.starting_bid).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === "Live"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
