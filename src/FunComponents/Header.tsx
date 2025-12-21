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

const sidebarVariants: Variants = {
  open: {
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 26,
      when: "beforeChildren",
      staggerChildren: 0.09,
      delayChildren: 0.2,
    },
  },
  closed: {
    x: "-100%",
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 35,
      when: "afterChildren",
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

const itemVariants: Variants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 30, opacity: 0 },
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
    const syncUserProfile = async () => {
      if (isLoaded && isSignedIn && user) {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress,
          avatar_url: user.imageUrl,
        });

        if (error) {
          console.error("Error syncing profile:", error.message);
        }
      }
    };

    syncUserProfile();
  }, [isLoaded, isSignedIn, user]);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar - Hidden on Mobile */}
        <div className="lg:flex hidden items-center justify-between px-6 py-2 text-sm text-muted-foreground border-b">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@auctionary.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              <span>Customer support</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              How to Bid
            </Button>
            <Button variant="outline" size="sm">
              Sell Your Item
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Language
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Hindi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="leading-tight">
            <span className="text-2xl font-extrabold">
              Auction<span className="text-orange-500">ary</span>
            </span>
            <p className="text-xs text-muted-foreground font-medium">
              Bid Smart. Win Big.
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-semibold">
            {navLinks.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className="cursor-pointer hover:text-orange-500 transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Input
                placeholder="Search products..."
                className="pr-10 w-64 rounded-full bg-gray-50 border-gray-200"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>

            {isLoaded && isSignedIn && user?.id ? (
              <NotificationBell userId={user.id} />
            ) : (
              <div className="p-2 text-gray-300">
                <Bell size={24} />
              </div>
            )}

            {!isLoaded ? (
              <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-md hidden md:block" />
            ) : !isSignedIn ? (
              <SignInButton mode="modal">
                <Button className="gap-2 hidden md:flex rounded-full">
                  <User className="h-4 w-4" /> My Account
                </Button>
              </SignInButton>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 hidden md:flex rounded-full bg-orange-500 hover:bg-orange-600">
                    <User className="h-4 w-4" />
                    {user?.firstName ?? "Profile"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 rounded-xl"
                >
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 p-2"
                    >
                      <Settings className="h-4 w-4" /> Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 p-2"
                    >
                      <LayoutDashboard className="h-4 w-4" /> My Bids & Auctions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer p-2"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/40 md:hidden backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 z-70 w-80 bg-white shadow-2xl p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-extrabold">
                  Auction<span className="text-orange-500">ary</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X />
                </Button>
              </div>

              {isLoaded && isSignedIn && (
                <div className="mb-8 p-4 bg-orange-50 rounded-2xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold">
                    {user.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              )}

              <motion.nav className="space-y-4 font-semibold">
                {navLinks.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    className="border-b border-gray-50 pb-2"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between hover:text-orange-500 py-2"
                    >
                      <span>{item.name}</span>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {isLoaded && isSignedIn && (
                <Button
                  variant="destructive"
                  className="w-full mt-10 rounded-full"
                  onClick={() => signOut({ redirectUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
