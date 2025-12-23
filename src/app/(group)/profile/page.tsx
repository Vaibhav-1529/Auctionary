import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import BecomeSeller from "@/FunComponents/Modals/BecomSellerModal";
import ProfileTabs from "@/FunComponents/ProfileTabs";
import { redirect } from "next/navigation";
import ParticipatingTab from "@/FunComponents/profile/ParticipatingTab";
import SellingProductTab from "@/FunComponents/profile/SellingProductTab";
import { Suspense } from "react";
import AddFundsModal from "@/FunComponents/AddFundsModal";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const isSeller = user.publicMetadata?.role === "seller";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [userDetails,participatingRes, sellerProfileRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single(),
    supabase
      .from("bids")
      .select("amount, auction_items(*)")
      .eq("bidder_id", user.id)
      .order("created_at", { ascending: false }),
    isSeller
      ? supabase.from("seller_profiles").select("*").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
  ]);

  const myBids = participatingRes.data || [];
  const storeInfo = sellerProfileRes.data;

  return (
    <section className="max-w-6xl mx-auto px-6 py-14 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as{" "}
            <span className="font-bold text-gray-800">
              {user.emailAddresses[0].emailAddress}
            </span>
          </p>
        </div>
        {/* Updated Balance & Add Funds Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="px-6 py-2 text-xl font-black border-2 border-gray-900 rounded-full bg-gray-50">
              {"₹ " + (userDetails.data?.current_balance?.toLocaleString() || "0")}
            </p>
          </div>
          
          {/* THE NEW MODAL COMPONENT */}
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
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl p-6 bg-white border shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Active Bids
              </p>
              <p className="text-3xl font-black mt-1 text-gray-900">
                {myBids.length}
              </p>
            </div>

            {isSeller && (
              <div className="rounded-2xl p-6 bg-white border shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Total Sales
                </p>
                <p className="text-3xl font-black mt-1 text-gray-900">
                  {storeInfo?.total_sales || 0}
                </p>
              </div>
            )}

            <div className="rounded-2xl p-6 bg-orange-50 border border-orange-200">
              <p className="text-xs font-bold text-orange-400 uppercase">
                Account Type
              </p>
              <p className="text-xl font-black mt-1 uppercase text-orange-600">
                {isSeller ? "Seller" : "Standard"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-gray-50 border">
            <h3 className="font-black text-lg mb-2 text-gray-900">
              Seller Account Activation
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Want to list your own items? Activate your seller account to reach
              thousands of bidders.
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

        <Suspense
          fallback={
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
              <p className="text-gray-400 font-medium">Loading...</p>
            </div>
          }
        >
          <SellingProductTab />
        </Suspense>

        <ParticipatingTab />

        <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50">
          <p className="text-gray-400 font-medium">
            Post-auction logistics and order tracking will appear here.
          </p>
        </div>

        <div className="max-w-2xl">
          <h3 className="text-xl font-black mb-6 text-gray-900">
            Store Settings
          </h3>

          {isSeller ? (
            <form className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">
                  Store Name
                </label>
                <input
                  disabled
                  value={storeInfo?.store_name}
                  className="w-full border p-3 rounded-xl bg-gray-100 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-400">
                  Store Description
                </label>
                <textarea
                  defaultValue={storeInfo?.store_bio}
                  className="w-full border p-3 rounded-xl h-32"
                />
              </div>

              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black transition">
                Save Changes
              </button>
            </form>
          ) : (
            <p className="text-gray-400 italic">
              Please activate your seller account to access settings.
            </p>
          )}
        </div>
      </ProfileTabs>
    </section>
  );
}
