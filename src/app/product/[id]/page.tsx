"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import ProductHeader from "@/FunComponents/product/ProductHeader";
import ProductGallery from "@/FunComponents/product/ProductGallery";
import ProductBidPanel from "@/FunComponents/product/ProductBidPanel";
import AuctionSideTabs from "@/FunComponents/product/AuctionSideTabs";
import ProductBottomTabs from "@/FunComponents/product/ProductBottomTabs";

type AuctionItem = {
  id: number;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
  ends_at: string;
  bought_by: string | null; // Added to track purchase
  buy_now_price: number | null;
};

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Initial Data Fetch
  useEffect(() => {
    if (!id) return;

    async function fetchAuction() {
      const { data } = await supabase
        .from("auction_items")
        .select(
          "id, title, image_url, starting_bid, current_bid, status, ends_at, bought_by, buy_now_price"
        )
        .eq("id", id)
        .single();

      if (data) {
        setAuction(data);
        // Set default bid amount to current bid + some increment, or starting bid
        setAmount((data.current_bid ?? data.starting_bid) + 10);
      }

      setLoading(false);
    }

    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`live-auction-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auction_items",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          const updatedItem = payload.new as AuctionItem;
          
          setAuction(updatedItem);
          
          // If the bid changed, update the input amount as well
          if (updatedItem.current_bid) {
             setAmount(updatedItem.current_bid + 10);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center font-bold tracking-tighter">Initializing Live Stream...</div>;
  }

  if (!auction) {
    return <div className="py-20 text-center">Auction not found</div>;
  }

  return (
    <section className="max-w-370 mx-auto px-6 py-16">
      {/* Visual indicator if the item is bought */}
      {auction.bought_by && (
        <div className="mb-6 p-4 bg-orange-500 text-white text-center rounded-xl font-bold animate-bounce">
          🎉 THIS ITEM HAS BEEN PURCHASED!
        </div>
      )}

      <ProductHeader auction={auction} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <ProductGallery auction={auction} />

        <div className="space-y-8">
          <ProductBidPanel
            auction={auction}
            amount={amount}
            setAmount={setAmount}
          />

          <AuctionSideTabs auctionId={auction.id} />
        </div>
      </div>

      <ProductBottomTabs/>
    </section>
  );
}