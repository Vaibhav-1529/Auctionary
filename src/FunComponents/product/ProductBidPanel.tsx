"use client";

import { Minus, Plus, Clock, Loader2, Store } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export default function ProductBidPanel({ auction, amount, setAmount }: any) {
  const { userId, getToken } = useAuth();

  const displayPrice = auction.current_bid ?? auction.starting_bid;
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const isSold = !!auction.bought_by;
  const isSeller = userId === auction.seller_id;
  const isLive = auction.status === "Live" && !isExpired && !isSold;

  const calculateTimeLeft = useCallback(() => {
    if (!auction.ends_at) return;

    const dateStr =
      auction.ends_at.includes("Z") || auction.ends_at.includes("+")
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
    if (isSeller) {
      toast.error("Sellers cannot bid on their own items.");
      return;
    }
    if (!isLive) {
      toast.error("Auction is no longer accepting bids");
      return;
    }
    if (amount <= displayPrice) {
      toast.error(
        `Bid must be at least ₹${(displayPrice + 1).toLocaleString()}`
      );
      return;
    }

    setLoading(true);

    try {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        toast.error("Please log in to place a bid");
        return;
      }

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

      toast.success("🎉 Bid placed successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" relative p-6 border border-border rounded-2xl bg-card text-card-foreground shadow-lg space-y-5">
      <div className="flex justify-between items-center">
        <div
          className={`absolute top-12 right-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            isLive
              ? "bg-destructive text-destructive-foreground border-destructive animate-pulse"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          <span
            className={` h-2 w-2 rounded-full ${
              auction.status === "Live" ? "bg-black" : "bg-black"
            }`}
          />
          {isSold ? "SOLD" : isExpired ? "ENDED" :auction.status.toUpperCase()}
        </div>

        {isSeller && (
          <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
            <Store size={14} />
            <span className="text-[10px] font-semibold uppercase tracking-tight">
              Your Listing
            </span>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold leading-tight mb-1">
          {auction.title}
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-accent tracking-tight">
            ₹{displayPrice.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground font-semibold uppercase">
            Current High Bid
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-border">
        <div className="p-2 bg-card rounded-lg shadow-sm">
          <Clock
            className={`h-5 w-5 ${
              !isLive ? "text-muted-foreground" : "text-primary"
            }`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Time Remaining
          </span>
          <span
            className={`text-lg font-mono font-semibold ${
              !isLive ? "text-destructive" : "text-foreground"
            }`}
          >
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="space-y-3 relative">
        {(!isLive || isSeller) && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-xl">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              {isSeller ? "Viewing as Seller" : "Bidding Unavailable"}
            </span>
            {isSeller && (
              <p className="text-[9px] text-muted-foreground mt-1">
                Sellers cannot bid on their own products.
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted">
            <button
              onClick={() =>
                setAmount((v: number) => Math.max(v - 10, displayPrice + 10))
              }
              className="px-4 py-3 hover:bg-muted/70 transition disabled:opacity-30"
              disabled={loading || !isLive || isSeller}
            >
              <Minus size={18} className="text-foreground" />
            </button>
            <div className="px-4 py-2 min-w-25 text-center font-semibold text-lg bg-card border-x border-border">
              ₹{amount.toLocaleString()}
            </div>
            <button
              onClick={() => setAmount((v: number) => v + 10)}
              className="px-4 py-3 hover:bg-muted/70 transition disabled:opacity-30"
              disabled={loading || !isLive || isSeller}
            >
              <Plus size={18} className="text-foreground" />
            </button>
          </div>

          <button
            onClick={placeBid}
            disabled={!isLive || loading || isSeller}
            className="flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-widest hover:opacity-90 disabled:bg-muted disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                PROCESSING...
              </>
            ) : isSeller ? (
              "SELLER VIEW"
            ) : isSold ? (
              "SOLD"
            ) : isExpired ? (
              "BIDDING CLOSED"
            ) : (
              "PLACE BID"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
