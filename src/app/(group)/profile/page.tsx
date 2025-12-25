import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import BecomeSeller from "@/FunComponents/Modals/BecomSellerModal";
import ProfileTabs from "@/FunComponents/ProfileTabs";
import { redirect } from "next/navigation";
import ParticipatingTab from "@/FunComponents/profile/ParticipatingTab";
import SellingProductTab from "@/FunComponents/profile/SellingProductTab";
import { Suspense } from "react";
import AddFundsModal from "@/FunComponents/AddFundsModal";
import OrdersTab from "@/FunComponents/profile/OrderTab";
import StoreSettingTab from "@/FunComponents/profile/SellerSettingTab";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  
  const isSeller = user.publicMetadata?.role === "seller";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Parallel fetching for performance
  const [userDetailsRes, participatingRes, sellerProfileRes, sellingAuctionsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("bids").select("amount, auction_items(*)").eq("bidder_id", user.id).order("created_at", { ascending: false }),
    isSeller
      ? supabase.from("seller_profiles").select("*").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase.from("auction_items").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
  ]);

  const userDetails = userDetailsRes.data;
  const myBids = participatingRes.data || [];
  const storeInfo = sellerProfileRes.data;
  const auctions = sellingAuctionsRes.data || [];

  return (
    <section className="max-w-6xl mx-auto px-6 py-14 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as <span className="font-bold text-gray-800">{user.emailAddresses[0].emailAddress}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="px-6 py-2 text-xl font-black border-2 border-gray-900 rounded-full bg-gray-50">
            ₹ {(userDetails?.current_balance || 0).toLocaleString()}
          </p>
          <AddFundsModal />
          {isSeller && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-3 rounded-full">
              <span className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-black text-orange-600 uppercase tracking-wider">
                {storeInfo?.store_name || "Official Seller"}
              </span>
            </div>
          )}
        </div>
      </div>

      <ProfileTabs>
        {/* Statistics and Activation UI */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl p-6 bg-white border shadow-sm text-gray-900">
              <p className="text-xs font-bold text-gray-400 uppercase">Active Bids</p>
              <p className="text-3xl font-black mt-1">{myBids.length}</p>
            </div>
            {isSeller && (
              <div className="rounded-2xl p-6 bg-white border shadow-sm text-gray-900">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Sales</p>
                <p className="text-3xl font-black mt-1">{storeInfo?.total_sales || 0}</p>
              </div>
            )}
            <div className="rounded-2xl p-6 bg-orange-50 border border-orange-200 text-orange-600">
              <p className="text-xs font-bold text-orange-400 uppercase">Account Type</p>
              <p className="text-xl font-black mt-1 uppercase">{isSeller ? "Seller" : "Standard"}</p>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-gray-50 border">
            <h3 className="font-black text-lg mb-2 text-gray-900">Seller Account Activation</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Want to list your own items? Activate your seller account to reach thousands of bidders.
            </p>
            {isSeller ? (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">
                ✓ Seller Powers Active
              </div>
            ) : (
              <BecomeSeller />
            )}
          </div>
        </div>

        {/* Tab 1: Selling Items */}
        <Suspense fallback={<div className="p-10 text-center animate-pulse">Loading listings...</div>}>
          <SellingProductTab sellingAuctions={auctions}/>
        </Suspense>

        {/* Tab 2: Bids */}
        <ParticipatingTab />

        {/* Tab 3: Orders */}
        <OrdersTab userId={user.id} />

        {/* Tab 4: Store Settings */}
        <StoreSettingTab 
          storeInfo={storeInfo} 
          isSeller={isSeller} 
          activeListingsCount={auctions.length} 
        />
      </ProfileTabs>
    </section>
  );
}