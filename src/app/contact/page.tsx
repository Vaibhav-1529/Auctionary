"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="max-w-370 mx-auto px-6 py-16">
      <div className="mb-14">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>{" "}
          → Contact Us
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="space-y-6">
          <div className="border rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="text-green-600" size={18} />
            </div>
            <div>
              <p className="font-semibold mb-1">To Know More</p>
              <p className="text-sm text-muted-foreground">
                +990-737 621 432
              </p>
              <p className="text-sm text-muted-foreground">
                +990-737 621 432
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="border rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="text-green-600" size={18} />
            </div>
            <div>
              <p className="font-semibold mb-1">Email Now</p>
              <p className="text-sm text-muted-foreground">
                info@example.com
              </p>
              <p className="text-sm text-muted-foreground">
                example@example.com
              </p>
            </div>
          </div>

          <div className="border rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="text-green-600" size={18} />
            </div>
            <div>
              <p className="font-semibold mb-1">Location</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                168/170, Avenue 01, Old York Drive Rich Mirpur
                <br />
                DOHS, Bangladesh
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-blue-50 rounded-xl p-10">
          <form className="space-y-6">
            <div>
              <label className="text-sm font-medium block mb-1">
                Name*
              </label>
              <input
                type="text"
                placeholder="Daniel Scoot"
                className="w-full px-4 py-3 rounded-md border outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="+8801700000000"
                  className="w-full px-4 py-3 rounded-md border outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="info@example.com"
                  className="w-full px-4 py-3 rounded-md border outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Write Your Message*
              </label>
              <textarea
                rows={5}
                placeholder="What’s on your mind"
                className="w-full px-4 py-3 rounded-md border outline-none resize-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Submit Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
