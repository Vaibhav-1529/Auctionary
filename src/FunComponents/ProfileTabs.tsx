"use client";

import { useState } from "react";
import clsx from "clsx";

const tabs = [
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
      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-border ">
        <div className="flex gap-3 sm:gap-6 px-1 sm:px-0 ">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className={clsx(
                "relative py-3 px-1 text-sm font-semibold transition-colors",
                active === i
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}

              {/* Active underline */}
              {active === i && (
                <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">{children[active]}</div>
    </div>
  );
}
