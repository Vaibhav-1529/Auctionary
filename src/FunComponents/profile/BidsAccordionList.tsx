"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
export default function BidsAccordionList({ auctions: initialAuctions }: any) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [liveAuctions, setLiveAuctions] = useState(initialAuctions);

  useEffect(() => {
    setLiveAuctions(initialAuctions);
  }, [initialAuctions]);

  useEffect(() => {
    if (!liveAuctions || liveAuctions.length === 0) return;

    const channels = liveAuctions.map((item: any) => {
      const auctionId = item.auction.id;

      return supabase
        .channel(`live-check-${auctionId}`)
        // --- LISTENER 1: WATCH PRICE CHANGES ---
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "auction_items",
            filter: `id=eq.${auctionId}`,
          },
          (payload) => {
            setLiveAuctions((prev: any) =>
              prev?.map((a: any) =>
                a.auction.id === auctionId 
                  ? { ...a, auction: payload.new } 
                  : a
              )
            );
          }
        )
        // --- LISTENER 2: WATCH FOR NEW BIDS (The Fix) ---
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bids",
            filter: `auction_item_id=eq.${auctionId}`,
          },
          (payload) => {
            const newBid = payload.new;

            setLiveAuctions((prev: any) =>
              prev?.map((a: any) => {
                if (a.auction.id === auctionId) {
                  // Add the new bid to the history list if it's not already there
                  const bidExists = a.bids.some((b: any) => b.id === newBid.id);
                  if (bidExists) return a;

                  return {
                    ...a,
                    bids: [newBid, ...a.bids], // Add new bid to the top
                  };
                }
                return a;
              })
            );
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach((channel: any) => supabase.removeChannel(channel));
    };
  }, [initialAuctions]);
  const toggle = (id: number) =>
    setExpandedId(expandedId === id ? null : id);
  return (
    <div className="space-y-4">
      {liveAuctions.map(({ auction, bids }: any) => {
        const myHighestBid = Math.max(...bids.map((b: any) => b.amount));
        const isLeading = myHighestBid >= (auction.current_bid || 0);
        const isLive = auction.status === "Live";

        return (
          <div
            key={auction.id}
            className={`rounded-xl border transition-all duration-300 bg-white ${
              expandedId === auction.id
                ? "border-orange-500 shadow-sm"
                : "border-gray-100"
            }`}
          >
            {/* HEADER */}
            <button
              onClick={() => toggle(auction.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors duration-500 ${
                    isLeading ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {isLeading ? (
                    <Trophy className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div>
                  <p className="font-bold text-gray-900">{auction.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      My max: ₹{myHighestBid.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-gray-300">|</span>
                    <p className={`text-xs font-bold ${isLeading ? "text-green-600" : "text-red-600"}`}>
                      {isLeading ? "Leading" : `Current: ₹${auction.current_bid?.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
                    isLive
                      ? "bg-orange-50 text-orange-600 border-orange-100 animate-pulse"
                      : "bg-gray-50 text-gray-400 border-gray-100"
                  }`}
                >
                  {auction.status}
                </span>

                {expandedId === auction.id ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </div>
            </button>

            {/* CONTENT */}
            {expandedId === auction.id && (
              <div className="border-t bg-gray-50/50 p-4 space-y-4 animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Bid History
                  </p>
                  <Link
                    href={`/product/${auction.id}`}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
                  >
                    Go to Auction <ExternalLink size={12} />
                  </Link>
                </div>

                <div className="space-y-2">
                  {bids.map((bid: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm"
                    >
                      <span className="text-gray-400 text-[11px] font-medium">
                        {new Date(bid.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="font-bold text-gray-700">
                        ₹{bid.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {!isLeading && isLive && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-600" />
                      <span className="text-red-700 text-xs font-bold">
                        Someone placed a higher bid!
                      </span>
                    </div>
                    <Link
                      href={`/product/${auction.id}`}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-red-700 transition shadow-sm"
                    >
                      Rebid Now
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}