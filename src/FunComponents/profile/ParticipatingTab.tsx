import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BidsAccordionList from "./BidsAccordionList";
import { supabase } from "@/lib/supabase/client";
import { Suspense } from "react";

async function ParticipatingTab() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { data: myBids, error } = await supabase
    .from("bids")
    .select("amount, created_at, auction_items(*)")
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-destructive">
        Error loading your bidding activity.
      </p>
    );
  }

  const groupedBids: Record<number, any> = {};

  myBids?.forEach((bid: any) => {
    if (!bid.auction_items) return;

    const auctionId = bid.auction_items.id;
    if (!groupedBids[auctionId]) {
      groupedBids[auctionId] = {
        auction: bid.auction_items,
        bids: [],
      };
    }
    groupedBids[auctionId].bids.push({
      amount: bid.amount,
      created_at: bid.created_at,
    });
  });

  const auctionList = Object.values(groupedBids);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            My Bidding Activity
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Track auctions where you have active bids.
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-semibold uppercase">
          {auctionList.length} Items Joined
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-muted/40">
            <p className="text-sm font-medium text-muted-foreground italic">
              You haven’t placed any bids yet. Explore auctions to get started!
            </p>
          </div>
        }
      >
        <BidsAccordionList auctions={auctionList} />
      </Suspense>
    </div>
  );
}

export default ParticipatingTab;
