"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type AuctionItem = {
  id: number;
  title: string;
  image_url: string;
  starting_bid: number;
  current_bid: number | null;
  status: "Live" | "Upcoming" | "Ended";
};

function ItemCard({ item, i }: { item: AuctionItem; i: number }) {
  const router = useRouter();

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
      className="min-w-84 max-w-84 bg-white rounded-2xl border shadow-sm overflow-hidden group"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.title}
          width={400}
          height={400}
          className="w-full h-70 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status */}
        <span
          className={`absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full ${
            item.status === "Live"
              ? "bg-red-500"
              : item.status === "Upcoming"
              ? "bg-yellow-500"
              : "bg-gray-500"
          }`}
        >
          ● {item.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="text-lg cursor-pointer font-semibold leading-snug mb-2 hover:underline"
        >
          {item.title}
        </h3>

        <p className="text-lg font-extrabold mb-3">
          ₹{displayPrice?.toLocaleString()}
        </p>

        <Button 
        onClick={handleClick}
        className="w-full rounded-full" disabled={item.status !== "Live"}>
          {item.status === "Live" ? "Bid Now" : "View"}
        </Button>
      </div>
    </motion.div>
  );
}

export default ItemCard;
