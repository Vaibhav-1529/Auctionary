"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";


const slides = [
  {
    bg: "#8b5a3c",
    accent: "#9a6a4a",
    price: "$6,367.00",
    title: "Apex Automotive Excellence New Heights.",
  },
  {
    bg: "#2f4f4f",
    accent: "#3f6f6f",
    price: "$8,920.00",
    title: "Rare Collectibles That Define Prestige.",
  },
  {
    bg: "#4b3621",
    accent: "#6b4a2f",
    price: "$5,480.00",
    title: "Timeless Artifacts From Historic Eras.",
  },
];


const textItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, x: 80, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};


export default function HotBidsModal() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="max-w-370 mx-auto px-6 py-16">
      <Carousel opts={{ loop: true }} setApi={setApi} className="relative">
        <CarouselContent>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <CarouselItem key={index}>
                <div
                  className="relative overflow-hidden rounded-[32px] text-white min-h-130"
                  style={{ backgroundColor: slide.bg }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-orange-500 h-24 w-20 flex flex-col justify-center items-center text-lg font-semibold rounded-b-[36px]">
                      <p>HOT</p>
                      <p>NOW</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 items-center h-full">

                    <div className="p-12 lg:p-20 space-y-10">
                      <motion.div
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                      >
                        <p className="text-sm text-white/70 mb-2">
                          Starting bid:
                        </p>
                        <h2 className="text-5xl font-extrabold">
                          {slide.price}
                        </h2>
                      </motion.div>

                      <motion.h1
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                        className="text-4xl lg:text-5xl font-bold max-w-lg leading-tight"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.div
                        variants={textItem}
                        initial="hidden"
                        animate={isActive ? "show" : "hidden"}
                      >
                        <Button className="mt-4 px-10 py-7 text-xl font-semibold bg-orange-500 rounded-xl">
                          Bid Now
                        </Button>
                      </motion.div>
                    </div>

                    <motion.div
                      variants={imageVariant}
                      initial="hidden"
                      animate={isActive ? "show" : "hidden"}
                      className="relative flex items-center justify-center p-16"
                    >
                      <div
                        className="absolute w-130 h-130 rounded-full -right-30"
                        style={{ backgroundColor: slide.accent }}
                      />

                      <div className="relative z-10 w-105 h-105 rounded-full overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1600180758890-6b94519a8ba6"
                          alt="Antique Sculpture"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-6" />
        <CarouselNext className="right-6" />
      </Carousel>
    </section>
  );
}
