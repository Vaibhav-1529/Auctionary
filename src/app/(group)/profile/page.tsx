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

  const isSeller = user?.publicMetadata?.role === "seller";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [userDetailsRes, participatingRes, sellerProfileRes, sellingAuctionsRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user?.id).single(),
      supabase.from("bids").select("amount, auction_items(*)").eq("bidder_id", user?.id),
      isSeller
        ? supabase.from("seller_profiles").select("*").eq("id", user?.id).single()
        : Promise.resolve({ data: null }),
      supabase.from("auction_items").select("*").eq("seller_id", user?.id),
    ]);

  const userDetails = userDetailsRes.data;
  const myBids = participatingRes.data || [];
  const storeInfo = sellerProfileRes.data;
  const auctions = sellingAuctionsRes.data || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1 break-all">
            {user?.emailAddresses[0].emailAddress}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-full border font-semibold text-sm bg-gray-50">
            ₹ {userDetails?.current_balance?.toLocaleString()}
          </div>

          <AddFundsModal />

          {isSeller && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Seller
            </div>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-xs uppercase text-gray-500">Active Bids</p>
          <p className="text-2xl font-bold">{myBids.length}</p>
        </div>

        {isSeller && (
          <div className="bg-white border rounded-xl p-5">
            <p className="text-xs uppercase text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold">{storeInfo?.total_sales || 0}</p>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <p className="text-xs uppercase text-orange-600">Account Type</p>
          <p className="text-lg font-bold text-orange-700">
            {isSeller ? "Seller" : "Standard"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs>
        <Suspense fallback={<div className="py-10 text-center">Loading...</div>}>
          <SellingProductTab sellingAuctions={auctions} />
        </Suspense>

        <ParticipatingTab />

        <OrdersTab userId={user?.id||""} />

        <StoreSettingTab
          storeInfo={storeInfo}
          isSeller={isSeller}
          activeListingsCount={auctions.length}
        />
      </ProfileTabs>
    </section>
  );
}
