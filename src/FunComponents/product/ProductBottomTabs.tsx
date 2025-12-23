"use client";
import { useState } from "react";
import ProductComments from "./ProductComments";

export default function ProductBottomTabs({
  description,
  sellerId,
  auctionId,
  userId,
}: {
  description: string | null;
  sellerId: string;
  auctionId: string;
  userId: string | null | undefined;
}) {
  const [active, setActive] = useState("Description");

  return (
    <div className="mt-24">
      <div className="flex gap-10 border-b border-border mb-10">
        {["Description", "Comments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
              active === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-50">
        {active === "Description" && (
          <p className="text-muted-foreground max-w-4xl leading-7">
            {description || "No description provided for this item."}
          </p>
        )}

        {active === "Comments" && (
          <ProductComments auctionId={auctionId} userId={userId || ""} />
        )}
      </div>
    </div>
  );
}
