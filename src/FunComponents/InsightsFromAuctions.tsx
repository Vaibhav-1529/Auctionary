"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InsightsFromAuctions() {
  return (
    <section className="max-w-370 w-full mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-14">
        <div>
          <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border bg-muted/40 mb-3">
            → READ OUR
          </span>
          <h2 className="text-4xl font-bold leading-tight">
            Insights From The{" "}
            <span className="text-muted-foreground font-normal">
              Auctions.
            </span>
          </h2>
        </div>

        <Button
          variant="ghost"
          className="group gap-2 text-sm font-medium"
        >
          View All Article
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <ArticleCard
          image="https://images.unsplash.com/photo-1513364776144-60967b0f800f"
          meta="Real State · October 3, 2024"
          title="Auction Avenue Your Roadmap to Winning Deals open."
        />

        <ArticleCard
          image="https://images.unsplash.com/photo-1524758631624-e2822e304c36"
          meta="Old Coin · October 8, 2024"
          title="Bidder’s Beat off Insights from the Auction Floor This."
        />
      </div>
    </section>
  );
}


function ArticleCard({
  image,
  meta,
  title,
}: {
  image: string;
  meta: string;
  title: string;
}) {
  return (
    <article
      className="
        group relative overflow-hidden rounded-2xl border
        bg-white transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
      "
    >
      <div className="relative h-70 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="
            object-cover transition-transform duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-7 space-y-4">
        <p className="text-xs text-muted-foreground">{meta}</p>

        <h3 className="text-xl font-semibold leading-snug max-w-md transition-colors group-hover:text-orange-600">
          {title}
        </h3>

        <Button
          variant="ghost"
          className="group/btn px-0 gap-2 text-sm font-medium"
        >
          Read More
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </Button>
      </div>
    </article>
  );
}
