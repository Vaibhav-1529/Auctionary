"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Gavel, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setIsRinging(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (isRinging) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
      setTimeout(() => setIsRinging(false), 1500);
    }
  }, [isRinging]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id: string, link: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await fetch("/api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    router.push(link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
      fixed sm:absolute
      left-1/2 sm:left-auto
      -translate-x-1/2 sm:translate-x-0
      right-auto sm:right-0
      top-16 sm:top-auto
      mt-2
      w-[95vw] sm:w-[360px]
      max-h-[80vh]
      overflow-y-auto
      bg-white
      shadow-xl
      rounded-xl
      border
      z-50
    "
        >
          <div className="p-3 border-b font-semibold text-sm flex justify-between items-center">
            Notifications
            <span className="text-xs text-gray-500">
              {notifications.length}
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleRead(n.id, n.link)}
                className={`p-4 flex gap-3 cursor-pointer border-b last:border-none transition ${
                  !n.is_read
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="mt-1">
                  {n.type === "bid" ? (
                    <Gavel className="text-blue-500" size={18} />
                  ) : (
                    <Trophy className="text-yellow-500" size={18} />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(n.created_at))} ago
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
