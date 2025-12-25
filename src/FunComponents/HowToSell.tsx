"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Package,
  Gavel,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

const sellSteps = [
  {
    icon: <UserPlus size={20} />,
    title: "Register an Account",
    desc: "Create your seller profile with basic information to get started on the platform.",
    step: "Step 01",
  },
  {
    icon: <Package size={20} />,
    title: "List Your Item",
    desc: "Upload product images, add details, and set your starting price for bidding.",
    step: "Step 02",
  },
  {
    icon: <Gavel size={20} />,
    title: "Start the Auction",
    desc: "Publish your listing and allow buyers to place competitive bids in real time.",
    step: "Step 03",
  },
  {
    icon: <DollarSign size={20} />,
    title: "Receive Payment",
    desc: "Once the auction ends, the highest bidder wins and payment is securely processed.",
    step: "Step 04",
  },
];

export default function HowToSell() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-semibold tracking-widest text-primary bg-primary/10 px-4 py-1 rounded-full mb-4">
            SELLER GUIDE
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            How to Sell on Our Platform
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2" />

          <div className="space-y-24">
            {sellSteps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row items-center justify-between"
              >
                {/* Left / Right Content */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`w-full md:w-[42%] ${
                    index % 2 === 0 ? "md:text-right" : "md:order-last md:text-left"
                  }`}
                >
                  <span className="text-xs font-semibold text-primary mb-2 block">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>

                {/* Center Icon */}
                <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-11 h-11 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary shadow-md">
                    {step.icon}
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden md:block w-[42%]" />
              </div>
            ))}

            {/* Finish Node */}
            <div className="flex justify-center pt-6">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
