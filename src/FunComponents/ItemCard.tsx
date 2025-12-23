"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuctionItem = {
  id: number;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
};

const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?b=1&s=170x170&k=20&c=rUeK8H2EAp_sBFlbk7-m5STaJw18ldbBWsb2093N0-s=";

function ItemCard({ item, i }: { item: AuctionItem; i: number }) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(item.image_url);

  function handleClick() {
    router.push(`/product/${item.id}`);
  }

  const displayPrice = item.current_bid ?? item.starting_bid;

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: i * 0.12,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      whileHover={{ y: -10 }}
      className="min-w-84 max-w-84 bg-card rounded-2xl border border-border shadow-sm overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.title}
          width={400}
          height={400}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-70 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className={`absolute top-2 left-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            item.status === "Live"
              ? "bg-destructive text-destructive-foreground border-destructive"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-black" />
          {item.status === "Live"
            ? "LIVE"
            : item.status === "Ended"
            ? "ENDED"
            : item.status.toUpperCase()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug mb-2 text-foreground cursor-pointer hover:underline">
          {item.title}
        </h3>

        <p className="text-lg font-extrabold mb-3 text-foreground">
          ₹{displayPrice.toLocaleString()}
        </p>

        <Button
          onClick={handleClick}
          disabled={item.status !== "Live"}
          className="w-full rounded-full"
        >
          {item.status === "Live" ? "Bid Now" : "View"}
        </Button>
      </div>
    </motion.div>
  );
}

export default ItemCard;
