import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import AddAuctionModal from "../Modals/AddAuctionModal";
export default async function SellingProductTab() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: sellingAuctions, error } = await supabase
    .from("auction_items")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black">Your Listed Auctions</h3>
          <p className="text-sm text-gray-500">
            Manage and track your active listings.
          </p>
        </div>
        <AddAuctionModal userId={user.id} />
      </div>

      {sellingAuctions && sellingAuctions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {sellingAuctions.map((item) => (
            <div
              key={item.id}
              className="border-2 border-gray-100 p-5 rounded-2xl flex justify-between items-center bg-white hover:border-orange-100 transition shadow-sm"
            >
              <div>
                <p className="font-bold text-lg text-gray-900">{item.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs font-bold text-gray-400">
                    CURRENT BID:{" "}
                    <span className="text-gray-900">
                      ₹{item.current_bid || item.starting_bid}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    item.status === "Live"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
          <p className="text-gray-400 font-medium">
            You haven't listed any items yet.
          </p>
        </div>
      )}
    </div>
  );
}
