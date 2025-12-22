"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs"; 
import ProductHeader from "@/FunComponents/product/ProductHeader";
import ProductGallery from "@/FunComponents/product/ProductGallery";
import ProductBidPanel from "@/FunComponents/product/ProductBidPanel";
import AuctionSideTabs from "@/FunComponents/product/AuctionSideTabs";
import ProductBottomTabs from "@/FunComponents/product/ProductBottomTabs";

type AuctionItem = {
  id: string;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
  ends_at: string;
  bought_by: string | null; 
  buy_now_price: number | null;
  description: string | null;
  seller_id: string;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { userId } = useAuth();

  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchAuction() {
      const { data, error } = await supabase
        .from("auction_items")
        .select("id, title, image_url, starting_bid, current_bid, status, ends_at, bought_by, buy_now_price, description, seller_id")
        .eq("id", id)
        .single();
        
      if (data) {
        setAuction(data as AuctionItem);
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
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "auction_items", filter: `id=eq.${id}` }, 
      (payload) => {
        const updatedItem = payload.new as AuctionItem;
        setAuction(updatedItem);
        if (updatedItem.current_bid && updatedItem.current_bid >= amount) {
           setAmount(updatedItem.current_bid + 10);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, amount]);

  if (loading) return <div className="py-20 text-center font-bold animate-pulse">Initializing...</div>;
  if (!auction) return <div className="py-20 text-center">Auction not found</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {auction.bought_by && (
        <div className="mb-6 p-4 bg-green-600 text-white text-center rounded-xl font-bold">
          🎉 THIS ITEM HAS BEEN PURCHASED!
        </div>
      )}

      <ProductHeader auction={auction} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-10">
        <ProductGallery auction={auction} />
        <div className="space-y-8">
          <ProductBidPanel auction={auction} amount={amount} setAmount={setAmount} />
          <AuctionSideTabs auctionId={auction.id as any} />
        </div>
      </div>

      <hr className="mt-20 border-gray-100" />
      
      <ProductBottomTabs 
        description={auction.description} 
        sellerId={auction.seller_id}
        auctionId={auction.id}
        userId={userId} 
      />
    </section>
  );
}