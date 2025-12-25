"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  User,
  Mail,
  Headphones,
  Menu,
  X,
  Plus,
  LogOut,
  LayoutDashboard,
  Settings,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import NotificationBell from "./Notification";
import HeaderSearch from "./HeaderSearch";

const sidebarVariants: Variants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 26,
      staggerChildren: 0.08,
    },
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 35,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Auctions", href: "/auction-products" },
  { name: "Blog", href: "/blogs" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        avatar_url: user.imageUrl,
      });
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="max-w-350 mx-auto px-6">
        {/* TOP BAR */}
        <div className="hidden lg:flex items-center justify-between py-2 text-sm text-muted-foreground border-b">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Mail size={14} /> info@auctionary.com
            </span>
            <span className="flex items-center gap-2">
              <Headphones size={14} /> Customer Support
            </span>
          </div>
          <div className="flex items-center gap-3 ">
            <Link href={`/howtobid`} className="border rounded-sm px-2 border-muted-foreground hover:text-black">How to Bid</Link>
            <Link href={`/howtosell`} className="border rounded-sm px-2 border-muted-foreground hover:text-black">Sell Item</Link>
          </div>
        </div>

        {/* MAIN NAV */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="leading-tight">
            <p className="text-2xl font-extrabold">
              Auction<span className="text-primary">ary</span>
            </p>
            <span className="text-xs text-muted-foreground">
              Bid Smart. Win Big.
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-semibold">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-primary transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <HeaderSearch />
            </div>

            {isSignedIn ? (
              <NotificationBell userId={user!.id} />
            ) : (
              <Bell className="text-muted-foreground" />
            )}

            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button className="hidden md:flex rounded-full">
                  <User size={16} /> My Account
                </Button>
              </SignInButton>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="hidden md:flex rounded-full bg-primary text-primary-foreground">
                    <User size={16} />
                    {user?.firstName}
                  </Button>
                </DropdownMenuTrigger>

                {/* ✅ FIXED PROFILE DROPDOWN */}
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl p-2"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="profile-menu-item"
                    >
                      <Settings size={16} /> Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="profile-menu-item"
                    >
                      <LayoutDashboard size={16} /> My Bids & Auctions
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="profile-menu-item text-destructive hover:bg-destructive/10"
                  >
                    <LogOut size={16} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-80 bg-background z-50 p-6"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex justify-between mb-6">
                <span className="text-xl font-bold">
                  Auction<span className="text-primary">ary</span>
                </span>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X />
                </Button>
              </div>

              <nav className="space-y-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex justify-between py-2 border-b hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                    <Plus size={14} />
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
