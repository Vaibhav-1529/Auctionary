"use client";

import { motion } from "framer-motion";
import { Gavel, ShieldCheck, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: <Gavel size={20} />,
    title: "Smart Live Auctions",
    desc: "Real-time bidding with instant updates, fair competition, and transparent pricing for every auction.",
    status: "Step 01",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Verified Sellers",
    desc: "All sellers are reviewed and verified to ensure authenticity, trust, and premium quality items.",
    status: "Step 02",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Competitive Pricing",
    desc: "Bid-driven pricing ensures you always get the true market value — no hidden margins.",
    status: "Step 03",
  },
  {
    icon: <Users size={20} />,
    title: "Growing Community",
    desc: "Thousands of bidders and collectors actively participate every day across multiple categories.",
    status: "Step 04",
  },
];

export default function HomeAuctionIntro() {
  return (
    <section className="pt-16 pb-5  bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            The Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-6 text-foreground">
            How it <span className="text-muted-foreground font-light text-3xl md:text-4xl">Works</span>
          </h2>
        </div>

        {/* CUSTOM VERTICAL TIMELINE */}
        <div className="relative">
          {/* Vertical Line Connector */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden sm:block" />

          <div className="space-y-7 md:space-y-0">
            {features.map((item, i) => (
              <div key={i} className="relative flex flex-col md:flex-row items-center justify-between md:mb-24 last:mb-0">
                
                {/* 1. Left Content (Desktop) / Full Content (Mobile) */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`w-full md:w-[42%] ${i % 2 === 0 ? "md:text-right" : "md:order-last md:text-left"}`}
                >
                  <span className="text-xs font-bold text-primary mb-2 block">{item.status}</span>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>

                {/* 2. Center Icon Node */}
                <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden sm:block">
                  <div className="w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center text-primary shadow-xl">
                    {item.icon}
                  </div>
                </div>

                {/* 3. Empty Space for layout balance (Desktop) */}
                <div className="hidden md:block w-[42%]" />
              </div>
            ))}

            {/* Final Completion Node */}
            <div className="relative flex justify-center pt-8">
               <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200 z-10">
                  <CheckCircle2 size={24} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}