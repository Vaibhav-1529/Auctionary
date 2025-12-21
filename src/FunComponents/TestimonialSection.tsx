"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import Image from "next/image";

/* ================= DATA ================= */

const testimonials = [
  {
    id: 1,
    title: "Great Auction Product!",
    text: "Feel free to customize the key features based on the services and strategies you offer in each plan. This breakdown helps potential clients understand the specific value they'll receive at each pricing tier.",
    name: "Weston Bennett",
    role: "CEO at Triprex",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    title: "Excellent Experience!",
    text: "The platform is intuitive and the bidding process is smooth. I felt confident throughout the auction and the support team was extremely responsive.",
    name: "Emily Watson",
    role: "Art Collector",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    title: "Highly Recommended",
    text: "Auctionary helped me discover rare collectibles with ease. The UI is clean and the experience feels premium.",
    name: "Daniel Cooper",
    role: "Antique Dealer",
    avatar: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];


const textVariants: Variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -50 : 50,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const imageVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};


export default function TestimonialSection() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  const paginate = (dir: number) => {
    setIndex(([prev]) => [
      (prev + dir + testimonials.length) % testimonials.length,
      dir,
    ]);
  };

  const testimonial = testimonials[index];

  return (
    <section className="max-w-370 mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* ================= LEFT ================= */}
        <div>
          <span className="inline-block text-sm tracking-widest px-4 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold mb-4">
            → TESTIMONIAL
          </span>

          <div className="leading-none w-full flex justify-between">
            {" "}
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-10">
              Praise from Our{" "}
              <span className="text-muted-foreground font-light">Client.</span>
            </h2>
            <MessageSquareQuote size={50} color="orange"/>
          </div>

          {/* TEXT ANIMATION */}
          <div className="min-h-60 overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={testimonial.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <p className="text-orange-500 font-semibold mb-3">
                  {testimonial.title}
                </p>

                <p className="text-gray-600 leading-relaxed mb-8 max-w-xl">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CONTROLS */}
          <div className="flex gap-4 mt-5">
            <button
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronLeft size={25} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronRight size={25} />
            </button>
          </div>
        </div>

<div className="relative w-137.5 h-137.5 ml-auto">
  {[
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  ].map((img, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.15, duration: 0.5 }}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      className={`
        absolute w-[288px] h-72 rounded-full overflow-hidden border border-white cursor-pointer
        ${i === 0 && "top-0 left-0 z-20 translate-x-1.5 translate-y-1.5"}
        ${i === 1 && "top-0 right-0 z-10 -translate-x-1.5 translate-y-1.5"}
        ${i === 2 && "bottom-0 left-0 z-10 translate-x-1.5 -translate-y-1.5"}
        ${i === 3 && "bottom-0 right-0 z-30 -translate-x-1.5 -translate-y-1.5"}
      `}
    >
      <Image
        src={img}
        alt="Client"
        fill
        className="object-cover"
      />
    </motion.div>
  ))}
</div>

      </div>
    </section>
  );
}
