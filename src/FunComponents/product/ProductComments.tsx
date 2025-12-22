"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Star, Loader2 } from "lucide-react"; // Added Loader2 icon
import { useAuth } from "@clerk/nextjs";

export default function ProductComments({ auctionId, userId }: { auctionId: string, userId: string | null | undefined }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  
  // --- NEW LOADING STATES ---
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getToken } = useAuth();

  useEffect(() => {
    if (!auctionId) return;

    const fetchInitialComments = async () => {
      try {
        setIsFetching(true);
        const { data } = await supabase
          .from("comments")
          .select("*, profiles(full_name, avatar_url)")
          .eq("auction_item_id", auctionId)
          .order("created_at", { ascending: false });
        if (data) setComments(data);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialComments();

    const channel = supabase
      .channel(`comments-${auctionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `auction_item_id=eq.${auctionId}` },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", payload.new.commenter_id)
            .single();

          setComments((prev) => [{ ...payload.new, profiles: profile }, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auctionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return alert("Please enter a comment");
    if (!userId) return alert("Please sign in to comment");

    try {
      setIsSubmitting(true);
      const token = await getToken({ template: "supabase" });

      const { data, error } = await supabase.functions.invoke("add-comment", {
        body: { 
          auction_item_id: auctionId,
          rating: rating || 5, 
          content: text 
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        setText("");
        setRating(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {userId ? (
        <form 
          onSubmit={handleSubmit} 
          className={`p-6 border rounded-xl bg-gray-50 shadow-sm transition-all ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
        >
          <p className="text-sm font-bold mb-3">Add a Comment</p>
          
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={20} 
                onClick={() => setRating(s)}
                className={`cursor-pointer transition-all hover:scale-110 ${rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-2 mt-1">(Optional Rating)</span>
          </div>

          <textarea 
            className="w-full p-4 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-black transition-all bg-white min-h-25"
            placeholder="What do you think about this item?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={isSubmitting}
          />
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 bg-black text-white px-8 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Posting...
              </>
            ) : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="p-6 text-center border-2 border-dashed rounded-xl bg-gray-50">
          <p className="text-sm text-muted-foreground">Please sign in to join the discussion.</p>
        </div>
      )}

      <div className="space-y-6">
        {isFetching ? (
          // Loading Skeleton State
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-3 animate-pulse">
                <div className="w-9 h-9 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="group border-b border-gray-100 pb-6 last:border-0 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={c.profiles?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + c.commenter_id} 
                  className="w-9 h-9 rounded-full object-cover border border-gray-100" 
                  alt="avatar" 
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900">{c.profiles?.full_name || "Anonymous User"}</span>
                    {c.rating > 0 && (
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={8} className={`${i < c.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed pl-12">
                {c.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-400 bg-gray-50/50 rounded-xl">
             <p className="text-sm italic">No comments yet. Be the first to start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}