"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const categories = [
  {
    title: "Ceramics",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "4 Items",
    img: "https://images.unsplash.com/photo-1582582494700-9c6c3f4fcd0d",
  },
  {
    title: "Coins",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "2 Items",
    img: "https://images.unsplash.com/photo-1610374781660-6c6c44d0f27f",
  },
  {
    title: "Furniture",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "8 Items",
    img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41",
  },
  {
    title: "Instruments",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "8 Items",
    img: "https://images.unsplash.com/photo-1519682577862-22b62b24e493",
  },
  {
    title: "Jewelry",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "3 Items",
    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d",
  },
  {
    title: "Ceramics",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "4 Items",
    img: "https://images.unsplash.com/photo-1582582494700-9c6c3f4fcd0d",
  },
  {
    title: "Coins",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "2 Items",
    img: "https://images.unsplash.com/photo-1610374781660-6c6c44d0f27f",
  },
  {
    title: "Furniture",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "8 Items",
    img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41",
  },
  {
    title: "Instruments",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "8 Items",
    img: "https://images.unsplash.com/photo-1519682577862-22b62b24e493",
  },
  {
    title: "Jewelry",
    titlesrc:
      "https://probid-wp.egenstheme.com/antiques-auction/wp-content/uploads/sites/8/2024/10/ceramics.svg",
    items: "3 Items",
    img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d",
  },
];

export default function AuctionByCategory() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: dir === "right" ? 286 : -286,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-14 overflow-x-hidden">
      <div className="absolute inset-0 bg-muted/40" />

      <div className="relative max-w-370 mx-auto px-6">
        <div className="flex items-center justify-between mb-14">
          <div>
            <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border border-border bg-card mb-3 text-muted-foreground">
              → EXPLORE OUR
            </span>
            <h2 className="text-4xl font-semibold text-foreground">
              Browse by{" "}
              <span className="text-muted-foreground font-normal">
                Category
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card hover:bg-muted transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-card hover:bg-muted transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-7 overflow-x-auto pb-8 scrollbar-hide scroll-smooth snap-x snap-mandatory overscroll-x-contain"
        >
          {categories.map((cat, i) => (
            <div key={i} className="relative min-w-65 snap-start pt-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="w-16 h-16 rounded-full bg-card p-2 flex items-center justify-center shadow-md border border-border">
                  <img
                    src={cat.titlesrc}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="group relative h-55 rounded-2xl overflow-hidden bg-muted hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card rounded-xl px-6 py-3 text-center shadow border border-border">
                  <p className="font-semibold text-foreground">
                    {cat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cat.items}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
