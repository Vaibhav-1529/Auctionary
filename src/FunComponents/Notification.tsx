"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Gavel, Trophy, Clock } from "lucide-react";
import { markNotificationAsRead } from "@/app/actions/notification";
import { supabase } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRing, setIsRing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!userId) return;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(15);

      if (data) setNotifications(data);
    };

    fetchInitial();

    const channel = supabase
      .channel(`user-notifications-${userId}`)
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
          setIsRing(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/mixkit-correct-answer-tone-2870.wav");
  }, []);

  useEffect(() => {
    if (isRing && audioRef.current) {
      audioRef.current.play().catch(() => {});
      const timer = setTimeout(() => setIsRing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRing]);

  const handleRead = async (id: string, link: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await markNotificationAsRead(id);
    router.push(link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition"
      >
        <Bell
          size={22}
          className={unreadCount > 0 ? "text-primary" : "text-muted-foreground"}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border border-background">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-popover text-popover-foreground shadow-xl rounded-2xl border border-border z-50 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/40 flex justify-between items-center">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-2">
                <Bell size={32} className="text-muted-foreground/40" />
                <p className="text-muted-foreground text-xs">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n.id, n.link)}
                  className={`p-4 border-b border-border last:border-0 flex gap-3 cursor-pointer transition ${
                    !n.is_read
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {n.type === "outbid" ? (
                      <Gavel size={16} className="text-primary" />
                    ) : n.type === "won" ? (
                      <Trophy size={16} className="text-yellow-500" />
                    ) : (
                      <Bell size={16} className="text-secondary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs truncate ${
                        !n.is_read
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground uppercase font-semibold">
                      <Clock size={10} />
                      {n.created_at
                        ? formatDistanceToNow(new Date(n.created_at), {
                            addSuffix: true,
                          })
                        : "Recently"}
                    </div>
                  </div>

                  {!n.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-muted/40 border-t border-border text-center">
            <button className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition uppercase">
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
