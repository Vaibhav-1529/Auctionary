"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Clock,
  Gavel,
  TrendingUp,
  User,
  Dot,
} from "lucide-react";

type AuctionItem = {
  id: number;
  title: string;
  description?: string | null;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
  ends_at?: string;
  seller_name?: string;
};

const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/1055079680/vector/no-image-available-icon.jpg";

function formatRemainingTime(end?: string) {
  if (!end) return "—";
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return "Ended";

  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return `${h}h ${m}m ${s}s`;
}

export default function HorizontalItemCard({
  item,
  i,
}: {
  item: AuctionItem;
  i: number;
}) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(item.image_url);
  const [timeLeft, setTimeLeft] = useState(
    formatRemainingTime(item.ends_at)
  );

  const displayPrice = item.current_bid ?? item.starting_bid;
  const nextBid = displayPrice + 10;

  useEffect(() => {
    if (!item.ends_at || item.status !== "Live") return;

    const t = setInterval(() => {
      setTimeLeft(formatRemainingTime(item.ends_at));
    }, 1000);

    return () => clearInterval(t);
  }, [item.ends_at, item.status]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      whileHover={{ y: -6 }}
      className="
        group flex flex-col sm:flex-row
        bg-card border border-border rounded-2xl
        overflow-hidden shadow-sm hover:shadow-xl transition
      "
    >
      {/* IMAGE */}
      <div className="relative sm:w-64 h-52 sm:h-auto shrink-0">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover"
        />

        <span
          className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-bold rounded-full border flex items-center gap-1
            ${
              item.status === "Live"
                ? "bg-red-500 text-white border-red-500"
                : "bg-muted text-muted-foreground border-border"
            }`}
        >
          {item.status === "Live" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
          {item.status.toUpperCase()}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between p-5 flex-1">
        <div>
          <h3 className="text-lg font-bold text-foreground leading-snug mb-1 line-clamp-1">
            {item.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {item.description ??
              "A curated premium auction item attracting competitive bidding."}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Current Bid</p>
              <p className="text-2xl font-black text-foreground">
                ₹{displayPrice.toLocaleString()}
              </p>
              {item.status === "Live" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Next bid: ₹{nextBid.toLocaleString()}
                </p>
              )}
            </div>

            {item.status === "Live" && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-orange-600 font-semibold">
                  <Clock size={16} />
                  <span>{timeLeft}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp size={14} />
                  High bidding activity
                </div>
              </div>
            )}
          </div>

          {item.seller_name && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <User size={14} />
              <span>Seller:</span>
              <span className="font-semibold text-foreground">
                {item.seller_name}
              </span>
            </div>
          )}
        </div>

        {/* ACTION */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Gavel size={14} />
            Live Competitive Auction
          </div>

          <Button
            disabled={item.status !== "Live"}
            onClick={() => router.push(`/product/${item.id}`)}
            className="rounded-full px-6"
          >
            {item.status === "Live" ? "Bid Now" : "View"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
