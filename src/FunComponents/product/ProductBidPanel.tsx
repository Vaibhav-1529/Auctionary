"use client";

import { Minus, Plus, Clock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ProductBidPanel({ auction, amount, setAmount }: any) {
  const displayPrice = auction.current_bid ?? auction.starting_bid;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const { getToken } = useAuth();

  const isSold = !!auction.bought_by;

  const calculateTimeLeft = useCallback(() => {
    if (!auction.ends_at) return;

    const dateStr = auction.ends_at.includes("Z") || auction.ends_at.includes("+")
      ? auction.ends_at
      : `${auction.ends_at.replace(" ", "T")}Z`;

    const target = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0 || isSold || auction.status === "Ended") {
      setTimeLeft(isSold ? "Item Sold" : "Auction Ended");
      setIsExpired(true);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    setIsExpired(false);
  }, [auction.ends_at, isSold, auction.status]);

  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  async function placeBid() {
    setError(null);

    if (auction.status !== "Live" || isExpired || isSold) {
      setError("Auction is no longer accepting bids");
      return;
    }
    if (amount <= displayPrice) {
      setError(`Bid must be at least ₹${(displayPrice + 1).toLocaleString()}`);
      return;
    }

    setLoading(true);

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Please log in to place a bid");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/place-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ auctionId: auction.id, amount }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place bid");

      alert("🎉 Bid placed successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-lg space-y-5">
      <div className="flex justify-between items-start">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
          Lot #{auction.id}
        </span>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm border transition-all
          ${auction.status === "Live" && !isExpired && !isSold
            ? "bg-red-500 text-white border-red-600 animate-pulse" 
            : "bg-gray-100 text-gray-500 border-gray-200"}`}>
          <span className={`h-2 w-2 rounded-full ${auction.status === "Live" && !isExpired && !isSold ? "bg-white" : "bg-gray-400"}`} />
          {isSold ? "SOLD" : isExpired ? "ENDED" : auction.status.toUpperCase()}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{auction.title}</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-green-600">₹{displayPrice.toLocaleString()}</span>
          <span className="text-xs text-gray-400 font-medium">Current High Bid</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Clock className={`h-5 w-5 ${isExpired || isSold ? "text-gray-400" : "text-orange-500"}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Time Remaining</span>
          <span className={`text-lg font-mono font-bold ${isExpired || isSold ? "text-red-500" : "text-gray-900"}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
            <button
              onClick={() => setAmount((v: number) => Math.max(v - 10, displayPrice + 10))}
              className="px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-30"
              disabled={loading || isExpired || isSold}
            >
              <Minus size={18} className="text-gray-600" />
            </button>
            <div className="px-4 py-2 min-w-25 text-center font-black text-lg text-gray-800 border-x-2 border-gray-100 bg-white">
              ₹{amount.toLocaleString()}
            </div>
            <button
              onClick={() => setAmount((v: number) => v + 10)}
              className="px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-30"
              disabled={loading || isExpired || isSold}
            >
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>

          <button
            onClick={placeBid}
            disabled={auction.status !== "Live" || loading || isExpired || isSold}
            className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            {loading ? "PROCESSING..." : isSold ? "SOLD" : isExpired ? "BIDDING CLOSED" : "PLACE BID"}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
            <span className="text-xs text-red-600 font-bold">⚠️ {error}</span>
          </div>
        )}
      </div>
    </div>
  );
}