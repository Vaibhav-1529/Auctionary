"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, ArrowDownRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import ItemsRow from "@/FunComponents/ItemsRow";
import HotBidsModal from "@/FunComponents/Modals/HotBidsModal";
import FaqSection from "@/FunComponents/FaqSection";
import TestimonialSection from "@/FunComponents/TestimonialSection";
import HowToBid from "@/FunComponents/HowToBid";
import FeaturedHighlights from "@/FunComponents/FeaturedHighlights";
import InsightsFromAuctions from "@/FunComponents/InsightsFromAuctions";
import AuctionByCategory from "@/FunComponents/AuctionByCategory";
import HomeAuctionIntro from "@/FunComponents/HomeAuctionIntro";

const textContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

const imageContainer: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  const oliveGreen = "rgb(84, 110, 71)";

  return (
    <div className="overflow-x-hidden">
      <section
        className="max-w-350 mx-auto mt-5 rounded-b-[40px] md:rounded-b-[60px] shadow-2xl overflow-hidden"
        style={{ backgroundColor: oliveGreen }}
      >
        <div className="flex flex-col lg:flex-row items-center p-6 md:p-12 lg:p-16">
          <motion.div
            className="w-full lg:w-1/2 text-white relative z-10"
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col space-y-8 text-white/60">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            </div>

            <div className="lg:pl-8">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1.1]"
                variants={textItem}
              >
                Select{" "}
                <span className="italic font-serif font-light text-orange-400">
                  Our Product
                </span>{" "}
                <br />
                At Our Auction.
              </motion.h1>

              <motion.p
                className="text-base md:text-lg mb-10 text-white/80 max-w-lg leading-relaxed"
                variants={textItem}
              >
                Join us as we carve a path to success, driven by passion,
                powered by innovation, and we're here to turn your dreams into
                reality.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-16"
                variants={textItem}
              >
                <Button
                  className="px-8 py-7 text-lg font-bold rounded-full transition-transform hover:scale-105 active:scale-95 flex gap-2"
                  style={{
                    backgroundColor: "rgb(238, 126, 68)",
                    color: "white",
                  }}
                >
                  Start A Bid <ArrowDownRight className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  className="px-8 py-7 text-lg font-bold rounded-full bg-white text-black border-none hover:bg-gray-100 transition-transform hover:text-orange-400 hover:scale-105 active:scale-95"
                >
                  View All Auction
                </Button>
              </motion.div>

              <motion.div
                className="pt-8 border-t border-white/10"
                variants={textItem}
              >
                <p className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-white/50">
                  Trusted Partners :
                </p>
                <div className="flex flex-wrap items-center gap-6 md:gap-10 opacity-70 grayscale contrast-200">
                  <span className="text-xl font-black tracking-tighter italic">
                    OTIVAR°
                  </span>
                  <span className="text-xl font-black tracking-widest">
                    KAON
                  </span>
                  <span className="text-xl font-black tracking-tighter italic">
                    archzilla°
                  </span>
                  <span className="text-xl font-black">PARK PLACE</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 mt-12 lg:mt-0 grid grid-cols-2 gap-4 h-100 md:h-137.5"
            variants={imageContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={textItem} className="col-span-1 h-full">
              <img
                src="https://i.pinimg.com/564x/e5/95/39/e59539e01b53c00e6fed854db2779af8.jpg"
                alt="Antique Tea Set"
                className="w-full h-full object-cover rounded-tl-[60px] md:rounded-tl-[100px] rounded-br-[40px] shadow-2xl"
              />
            </motion.div>

            <div className="col-span-1 flex flex-col gap-4 h-full">
              <motion.div variants={textItem} className="h-1/2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXFD8iTCcximIgcJPVRDrXBaJpXcNlL-n3XQ&s"
                  alt="Copper Ewer"
                  className="w-full h-full object-cover rounded-2xl rounded-tr-[40px] shadow-xl"
                />
              </motion.div>
              <motion.div variants={textItem} className="h-1/2">
                <img
                  src="https://m.media-amazon.com/images/I/61v9YPhuv-L._AC_UF894,1000_QL80_.jpg"
                  alt="Vase"
                  className="w-full h-full object-cover rounded-2xl rounded-br-[60px] md:rounded-br-[100px] shadow-xl border border-white/10"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="space-y-10 py-15">
        <HomeAuctionIntro/>
        <ItemsRow />
        <HotBidsModal />
        <AuctionByCategory />
        <HowToBid />
        <FaqSection />
        <TestimonialSection />
        <FeaturedHighlights />
        <InsightsFromAuctions />
      </main>
    </div>
  );
}
