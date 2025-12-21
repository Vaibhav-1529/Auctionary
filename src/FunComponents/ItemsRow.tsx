"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ItemCard from "./ItemCard";
import { supabase } from "@/lib/supabase/client";

const CARD_WIDTH = 360;
const VISIBLE_CARDS = 4;
const AUTO_DELAY = 3500;

export default function ItemsRow() {
  const [items, setItems] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [disableAnim, setDisableAnim] = useState(false);
  const isResetting = useRef(false);

  const maxIndex = Math.max(items.length - VISIBLE_CARDS, 0);

  useEffect(() => {
    const fetchAuctions = async () => {
      const { data, error } = await supabase
        .from("auction_items")
        .select("*")
        .eq("status", "Live")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setItems(data);
    };

    fetchAuctions();
  }, []);

  const next = () => {
    if (isResetting.current || items.length === 0) return;
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (isResetting.current || items.length === 0) return;
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      if (!isResetting.current) {
        setIndex((prev) => prev + 1);
      }
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [items.length, maxIndex]);

  useEffect(() => {
    if (items.length === 0) return;
    if (index > maxIndex) {
      isResetting.current = true;

      const timeout = setTimeout(() => {
        setDisableAnim(true);
        setIndex(0);

        requestAnimationFrame(() => {
          setDisableAnim(false);
          isResetting.current = false;
        });
      }, 550);

      return () => clearTimeout(timeout);
    }
  }, [index, maxIndex, items.length]);

  if (items.length === 0) return null;

  return (
    <section className="relative py-10 my-10">
      <div className="absolute inset-0 bg-linear-to-br from-[#f3f7e9] via-[#f6faef] to-[#eef4df]" />

      <div className="relative max-w-370 mx-auto px-6 py-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <span className="inline-block text-sm tracking-widest px-3 py-1 rounded-full bg-orange-50 text-orange-500 font-semibold mb-2">
              → BIDDING OUR
            </span>
            <h2 className="text-5xl font-bold">
              Live{" "}
              <span className="text-muted-foreground font-light">Auction</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: -index * CARD_WIDTH }}
            transition={
              disableAnim
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 90,
                    damping: 18,
                    mass: 0.6,
                  }
            }
            className="flex gap-6"
          >
            {items.map((item, i) => (
              <ItemCard key={`${item.id}-${i}`} item={item} i={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}