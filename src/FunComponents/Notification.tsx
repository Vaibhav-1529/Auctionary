"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Gavel, Trophy, Package, Clock } from "lucide-react";
import { markNotificationAsRead } from "@/app/actions/notification"; 
import { supabase } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns"; // Recommended for real time strings
import { useRouter } from "next/navigation";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
const router=useRouter()
  // Derived state for the badge count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!userId) return;

    const fetchInitial = async () => {
      console.log("Fetching notifications for:", userId);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(15);
      
      if (error) {
        console.error("Fetch error:", error.message);
      } else {
        console.log("Initial Notifications Loaded:", data?.length);
        setNotifications(data || []);
      }
    };

    fetchInitial();

    // Setup Realtime Channel
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
          console.log("Realtime Notification Received:", payload.new);
          // Use functional update to ensure we have latest state
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log("Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Click outside listener
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRead = async (id: string,link:string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    try {
      await markNotificationAsRead(id);
      router.push(link)
    } catch (err) {
      console.error("Failed to sync read status:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
      >
        <Bell size={24} className={unreadCount > 0 ? "text-orange-500" : "text-gray-600"} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 z-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
            <span className="font-bold text-sm text-gray-800">Notifications</span>
            {unreadCount > 0 && (
               <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">
                 {unreadCount} New
               </span>
            )}
          </div>

          <div className="max-h-87.5 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-2">
                <Bell size={32} className="text-gray-200" />
                <p className="text-gray-400 text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n.id,n.link)}
                  className={`p-4 border-b last:border-0 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !n.is_read ? "bg-blue-50/40 border-l-4 border-l-blue-500" : "opacity-80"
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {n.type === 'outbid' ? <Gavel size={16} className="text-orange-500" /> : 
                     n.type === 'won' ? <Trophy size={16} className="text-yellow-500" /> : 
                     <Bell size={16} className="text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${!n.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[9px] text-gray-400 font-bold uppercase">
                      <Clock size={10} /> 
                      {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : 'Recently'}
                    </div>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 self-start shrink-0" />}
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 bg-gray-50 border-t text-center">
             <button className="text-[11px] font-bold text-gray-500 hover:text-black transition-colors uppercase">
               View All
             </button>
          </div>
        </div>
      )}
    </div>
  );
}