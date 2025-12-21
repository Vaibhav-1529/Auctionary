"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import TestimonialSection from "@/FunComponents/TestimonialSection";
import InsightsFromAuctions from "@/FunComponents/InsightsFromAuctions";
import FaqSection from "@/FunComponents/FaqSection";

export default function WhoWeAre() {
  return (
    <div className="max-w-370 mx-auto space-y-5 mb-15">
    <section className="max-w-370 mx-auto px-6 pt-32 space-y-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">
            Who We <span className="font-light text-muted-foreground">Are</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-10 max-w-lg">
            Welcome to Zenth, where digital innovation meets strategic excellence.
            As a dynamic force in the realm of digital marketing, we are dedicated
            to propelling businesses into the spotlight of online success.
          </p>

          <div className="space-y-6">
            <Feature
              title="Our Expert Solutions"
              text="Praesent gravida nunc at tortor cursus, molestie dapibus purus posuere."
            />
            <Feature
              title="Trusted Performance"
              text="Praesent gravida nunc at tortor cursus, molestie dapibus purus posuere."
            />
            <Feature
              title="Experience the Difference"
              text="Praesent gravida nunc at tortor cursus, molestie dapibus purus posuere."
            />
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1518770660439-4636190af475"
              alt="Device"
              width={520}
              height={520}
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-14 -left-14 rounded-2xl overflow-hidden shadow-2xl bg-white p-3">
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              alt="Workspace"
              width={340}
              height={220}
              className="rounded-xl object-cover"
            />
          </div>

          <div className="absolute top-8 -right-6 bg-white rounded-xl px-5 py-4 shadow-lg">
            <p className="text-xl font-bold">5.6k</p>
            <p className="text-xs text-muted-foreground">
              Number Of Total Bidder
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden ">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="Auction Expert"
            width={620}
            height={620}
            className="object-cover shadow-xl"
          />
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-4">
            Get In{" "}
            <span className="font-light text-muted-foreground">Know</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg">
            Welcome to Zenth, where digital innovation meets strategic excellence.
            As a dynamic force in the realm of digital marketing, we are dedicated
            to propelling businesses into the spotlight of online success.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              "Ready to boost your online presence",
              "Transform your business our Auction",
              "Don’t miss out our exclusive insights",
              "See result like never Click schedule",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-10 mb-8">
            <Stat value="3.5k" label="Customer" />
            <Stat value="700k" label="Auction" />
            <Stat value="5.6k" label="Bidder" />
          </div>

          <button className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition">
            About Us More →
          </button>
        </div>
      </div>

      <div className="max-w-3xl">
        <p className="italic text-muted-foreground mb-4">
          “I work with Alubox John on many projects, he always told advanced
          my expectations with his quality work and fast response.”
        </p>
        <p className="font-semibold">Leslie Alexander</p>
      </div>
    </section>
    <TestimonialSection/>
    <InsightsFromAuctions/>
    <FaqSection/>
    </div>
  );
}


function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground max-w-md">
        {text}
      </p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
