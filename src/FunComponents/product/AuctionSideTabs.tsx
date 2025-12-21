"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

export default function AuctionSideTabs({ auctionId }: { auctionId: number }) {
  const [active, setActive] = useState("Auction History");
  const [bids, setBids] = useState<any[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (!auctionId) return;

    const fetchBids = async () => {
      const { data, error } = await supabase
        .from("bids")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `
        )
        .eq("auction_item_id", auctionId)
        .order("created_at", { ascending: false });

      if (error) console.error("History Error:", error);
      else setBids(data || []);
    };

    fetchBids();

    const channel = supabase
      .channel(`auction-${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `auction_item_id=eq.${auctionId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.bidder_id)
            .single();

          const newBidWithProfile = { ...payload.new, profiles: profile };
          setBids((prev) =>
            [newBidWithProfile, ...prev].sort((a, b) => b.amount - a.amount)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId]);

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const userHighestBid = sortedBids.find((bid) => bid.bidder_id === userId);

  return (
    <div className="mt-14 h-96">
      <div className="flex gap-10 border-b mb-6">
        {["Auction History", "Live Chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              active === tab
                ? "border-black text-black"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Auction History" && (
        <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
          {userId && userHighestBid && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-green-700 uppercase">
                  Your Highest Bid
                </span>
                <span className="text-xl font-black text-green-800">
                  ₹{userHighestBid.amount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {sortedBids.length > 0 ? (
              sortedBids.map((bid, index) => (
                <div
                  key={bid.id}
                  className="flex justify-between items-center p-3 rounded-lg border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        bid.profiles?.avatar_url ||
                        "https://github.com/identicons/jason.png"
                      }
                      alt="avatar"
                      className="w-9 h-9 rounded-full bg-gray-100"
                    />
                    <div>
                      <p className="text-sm font-bold">
                        {bid.bidder_id === userId
                          ? "You"
                          : bid.profiles?.full_name || "Anonymous"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(bid.created_at + "Z"), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-bold ${
                      index === 0 ? "text-green-600" : "text-black"
                    }`}
                  >
                    ₹{bid.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-10 text-muted-foreground italic">
                No bids yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
