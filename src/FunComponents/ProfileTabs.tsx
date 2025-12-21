"use client";

import { useState } from "react";
import clsx from "clsx";

const tabs = [
  "Overview",
  "Selling",
  "Participating",
  "Orders",
  "Seller Settings",
];

export default function ProfileTabs({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-6 border-b mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className={clsx(
              "pb-3 text-sm font-medium transition",
              active === i
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-muted-foreground hover:text-black"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>{children[active]}</div>
    </div>
  );
}
