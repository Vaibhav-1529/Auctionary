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

  const { data: sellingAuctions } = await supabase
    .from("auction_items")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">
            Your Listed Auctions
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage and track your active listings.
          </p>
        </div>
        <AddAuctionModal userId={user.id} />
      </div>

      {sellingAuctions && sellingAuctions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {sellingAuctions.map((item: any) => (
            <div
              key={item.id}
              className="border border-border p-5 rounded-2xl flex justify-between items-center bg-card hover:bg-muted/30 transition shadow-sm"
            >
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    CURRENT BID:{" "}
                    <span className="text-foreground">
                      ₹{item.current_bid || item.starting_bid}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest border ${
                    item.status === "Live"
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-3xl p-16 text-center bg-muted/40">
          <p className="text-muted-foreground font-medium">
            You haven't listed any items yet.
          </p>
        </div>
      )}
    </div>
  );
}
