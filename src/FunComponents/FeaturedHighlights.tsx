"use client";

import {
  Handshake,
  Gavel,
  ShieldCheck,
  HelpCircle,
  Users,
  Package,
  UserCheck,
  LifeBuoy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";


export default function FeaturedHighlights() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#f3f7e9] via-[#f6faef] to-[#eef4df]" />

      <div className="relative max-w-370 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 max-w-xl"
        >
          <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border bg-white/60 mb-4">
            → HIGHLIGHTED
          </span>
          <h2 className="text-4xl font-bold">
            Our Featured{" "}
            <span className="text-muted-foreground font-normal">
              Highlights.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 relative">
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="absolute left-1/4 top-0 h-full w-px bg-gray-200" />
            <div className="absolute left-2/4 top-0 h-full w-px bg-gray-200" />
            <div className="absolute left-3/4 top-0 h-full w-px bg-gray-200" />
          </div>

          {features.map((f, i) => (
            <Feature key={i} {...f} index={i} />
          ))}
        </div>

        <div className="relative pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 text-center sm:text-left">
            <Stat icon={<Users />} value={3500} suffix="K" label="Customer" sub="Total Customer" />
            <Stat icon={<Package />} value={700} label="Auctions" sub="Total Product" />
            <Stat icon={<UserCheck />} value={5500} suffix="K" label="Bidder" sub="Number Of Total Bidder" />
            <Stat icon={<LifeBuoy />} value={7400} suffix="k" label="Accounts" sub="User Helped" />
          </div>
        </div>
      </div>
    </section>
  );
}


const features = [
  {
    icon: <Handshake className="w-7 h-7 text-orange-500" />,
    title: "Discover the best deals",
    text: "Egestas libero. Aenean id lacin est. Mauris urn purus, docni.",
  },
  {
    icon: <Gavel className="w-7 h-7 text-orange-500" />,
    title: "Standout Auctions",
    text: "Egestas libero. Aenean id lacin est. Mauris urn purus, docni.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-orange-500" />,
    title: "Pay safely",
    text: "Egestas libero. Aenean id lacin est. Mauris urn purus, docni.",
  },
  {
    icon: <HelpCircle className="w-7 h-7 text-orange-500" />,
    title: "We're here to help",
    text: "Egestas libero. Aenean id lacin est. Mauris urn purus, docni.",
  },
];


function Feature({
  icon,
  title,
  text,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-xs"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}

function Stat({
  icon,
  value,
  suffix = "",
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  sub: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOut
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 justify-center sm:justify-start"
    >
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <div className="text-lg font-bold">
          {count}
          {suffix}{" "}
          <span className="font-medium text-sm">
            {label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  );
}
