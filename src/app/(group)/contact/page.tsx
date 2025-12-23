"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="relative max-w-370 mx-auto px-6 py-20">
      <div className="absolute inset-0 bg-linear-to-br from-[#f3f7e9] via-[#f6faef] to-[#eef4df]" />

      <div className="relative mb-16">
        <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-orange-500 transition">
            Home
          </Link>{" "}
          → Contact Us
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="space-y-6">
          <div className="border rounded-2xl p-6 flex items-start gap-4 bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Phone className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="font-bold mb-1">To Know More</p>
              <p className="text-sm text-muted-foreground">+990-737 621 432</p>
              <p className="text-sm text-muted-foreground">+990-737 621 432</p>
            </div>
          </div>

          <div className="border rounded-2xl p-6 flex items-start gap-4 bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Mail className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="font-bold mb-1">Email Now</p>
              <p className="text-sm text-muted-foreground">info@example.com</p>
              <p className="text-sm text-muted-foreground">
                example@example.com
              </p>
            </div>
          </div>

          <div className="border rounded-2xl p-6 flex items-start gap-4 bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <MapPin className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="font-bold mb-1">Location</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                168/170, Avenue 01, Old York Drive Rich Mirpur
                <br />
                DOHS, Bangladesh
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-lg border">
          <form className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">
                Name*
              </label>
              <input
                type="text"
                placeholder="Daniel Scoot"
                className="w-full px-4 py-3 rounded-xl border-2 outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="+8801700000000"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="info@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">
                Write Your Message*
              </label>
              <textarea
                rows={5}
                placeholder="What’s on your mind"
                className="w-full px-4 py-3 rounded-xl border-2 outline-none resize-none focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white px-10 py-3 rounded-full font-black tracking-wider hover:bg-orange-600 transition shadow-md"
            >
              Submit Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
