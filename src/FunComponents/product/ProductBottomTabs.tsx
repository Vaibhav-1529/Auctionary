"use client";
import { useState } from "react";

export default function ProductBottomTabs() {
  const [active, setActive] = useState("Description");

  return (
    <div className="mt-24">
      <div className="flex gap-10 border-b mb-10">
        {["Description", "Comments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-sm font-semibold border-b-2 ${
              active === tab
                ? "border-black text-black"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Description" && (
        <p className="text-muted-foreground max-w-4xl">
          This is a premium auction item. Place your bid before the auction ends.
        </p>
      )}

      {active === "Comments" && (
        <p className="text-muted-foreground">
          There are no Comments yet.
        </p>
      )}
    </div>
  );
}
