"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Package, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      console.log("Fetching orders for userId:", userId); // Debugging line

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          auction_items (
            title,
            image_url,
            status
          )
        `)
        .eq("buyer_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
        console.error("Error Details:", error.details);
      } else {
        console.log("Data received from Supabase:", data);
        setOrders(data || []);
        setLoading(false);
      }
    }

    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-400">Loading your orders...</div>;

  return (
    <div className="space-y-4 pt-4">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">No orders found.</p>
          <p className="text-gray-400 text-sm">Items you win will appear here.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div 
            key={order.id} 
            className="flex flex-col md:flex-row items-center gap-6 p-5 bg-white rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-gray-100/50 transition-all group"
          >
            {/* Item Image */}
            <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={order.auction_items?.image_url || "/placeholder.jpg"}
                alt={order.auction_items?.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Order Details */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-black text-gray-900 leading-tight">
                    {order.auction_items?.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Order ID: {order.id.slice(0, 8)}...
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">₹{order.order_amount.toLocaleString()}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Paid via {order.payment_method}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{order.status}</span>
                </div>
                
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto">
              <button className="w-full md:w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-orange-500 transition-all shadow-lg shadow-gray-200">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}