"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client"; // No need for createClerkSupabaseClient here anymore
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function ChatRoom({ auctionId, userId }: { auctionId: number; userId: string | null | undefined }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!auctionId) return;

    const fetchChats = async () => {
  const { data, error } = await supabase
    .from("chats")
    .select("*, profiles(full_name, avatar_url)")
    .eq("auction_item_id", auctionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Chat Fetch Error:", error.message);
  } else {
    console.log("Fetched Messages:", data);
    setMessages(data || []);
  }
};

    fetchChats();

    const channel = supabase
      .channel(`chat-${auctionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats", filter: `auction_item_id=eq.${auctionId}` },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.user_id)
            .single();
          
          setMessages((prev) => [...prev, { ...payload.new, profiles: profile }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auctionId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    const content = input;
    setInput(""); 
    const token = await getToken({ template: "supabase" });
    if (!token) return;
    const { error } = await supabase.functions.invoke("send-chat-message", {
      body: {
        content,
        auction_item_id: auctionId,
        user_id: userId,
        message_type: 'text'
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (error) {
      console.error("Chat Error:", error);
      setInput(content);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 rounded-xl overflow-hidden border">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => {
          const isMe = msg.user_id === userId;
          const isBid = msg.message_type === 'bid';

          if (isBid) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-orange-200">
                  New Bid: ₹{msg.bid_amount?.toLocaleString()} by {msg.profiles?.full_name || "System"}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isMe ? 'order-1' : 'order-2'}`}>
                <div className={`px-3 py-2 rounded-2xl text-sm ${
                  isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white border rounded-tl-none shadow-sm'
                }`}>
                  {!isMe && <p className="text-[10px] font-bold text-orange-500 mb-1">{msg.profiles?.full_name}</p>}
                  <p>{msg.content}</p>
                </div>
                <p className={`text-[9px] mt-1 text-muted-foreground ${isMe ? 'text-right' : 'text-left'}`}>
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-hidden transition"
        />
        <button 
          disabled={!userId || !input.trim()} 
          type="submit" 
          className="bg-black text-white p-2 rounded-full hover:opacity-80 disabled:opacity-50 transition cursor-pointer"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}