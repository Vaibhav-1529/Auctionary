"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

/* ================= DATA ================= */

const steps = [
  {
    title: "Registration",
    text:
      "Clearly state your pricing structure, payment terms, and any additional charges. Simplify them to avoid confusion.",
  },
  {
    title: "Browse Listings",
    text:
      "Clearly state your pricing structure, payment terms, and any additional charges. Simplify them to avoid confusion.",
  },
  {
    title: "Place Bids",
    text:
      "Clearly state your pricing structure, payment terms, and any additional charges. Simplify them to avoid confusion.",
  },
  {
    title: "Winning the Auction",
    text:
      "Clearly state your pricing structure, payment terms, and any additional charges. Simplify them to avoid confusion.",
  },
  {
    title: "Payment and Shipping",
    text:
      "Clearly state your pricing structure, payment terms, and any additional charges. Simplify them to avoid confusion.",
  },
];

/* ================= COMPONENT ================= */

export default function HowToBid() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progressHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <section
      ref={sectionRef}
      className="max-w-300 mx-auto px-6 py-16"
    >
      {/* HEADER */}
      <div className="mb-24">
        <span className="inline-block text-xs tracking-widest px-4 py-1 rounded-full border mb-4">
          HOW TO BID
        </span>
        <h2 className="text-4xl font-bold">How To Bid</h2>
      </div>

      {/* TIMELINE */}
      <div className="relative">

        {/* CENTER LINE */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-0.5 bg-gray-200">
          <motion.div
            style={{ height: progressHeight }}
            className="absolute top-0 left-0 w-full bg-black origin-top"
          />
        </div>

        {/* STEPS */}
        <div className="space-y-32">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;

            // each step completes gradually
            const stepProgress = useTransform(
              scrollYProgress,
              [index / steps.length, (index + 1) / steps.length],
              [0, 1]
            );

            return (
              <div
                key={index}
                className="relative grid grid-cols-[1fr_auto_1fr] items-start"
              >
                {/* LEFT */}
                <div className={isLeft ? "pr-16 text-right" : ""}>
                  {isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span className="inline-block text-xs px-3 py-1 bg-gray-100 rounded mb-3">
                        Step {index + 1}
                      </span>
                      <h3 className="font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm ml-auto">
                        {step.text}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* DOT */}
                <div className="relative flex justify-center">
                  <motion.div
                    className="w-6 h-6 rounded-full border border-gray-400 bg-white z-10 flex items-center justify-center"
                  >
                    <motion.div
                      style={{ scale: stepProgress }}
                      className="absolute inset-0 rounded-full bg-black"
                    />
                    <motion.div
                      style={{ opacity: stepProgress }}
                      className="relative text-white"
                    >
                      <Check size={14} />
                    </motion.div>
                  </motion.div>
                </div>

                {/* RIGHT */}
                <div className={!isLeft ? "pl-16" : ""}>
                  {!isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span className="inline-block text-xs px-3 py-1 bg-gray-100 rounded mb-3">
                        Step {index + 1}
                      </span>
                      <h3 className="font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {step.text}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
