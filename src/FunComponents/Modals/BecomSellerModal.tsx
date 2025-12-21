"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateSellerAccount } from "@/app/actions/seller-onboarding";

export default function BecomeSeller() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeBio, setStoreBio] = useState("");
  const router = useRouter();

  async function handleCreateSeller() {
    setLoading(true);
    try {
      await activateSellerAccount(storeName, storeBio);
      setOpen(false);
      router.refresh(); 
      window.location.reload(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 transition"
      >
        Become a Seller
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-black mb-2">Create Seller Store</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your business details to start listing auctions.</p>

            <div className="space-y-4">
              <input
                placeholder="Unique Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border-2 p-3 rounded-xl focus:border-orange-500 outline-none transition"
              />

              <textarea
                placeholder="About your store..."
                value={storeBio}
                onChange={(e) => setStoreBio(e.target.value)}
                className="w-full border-2 p-3 h-32 rounded-xl focus:border-orange-500 outline-none transition"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  className="font-bold text-gray-400 px-4" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSeller}
                  disabled={loading || !storeName}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold disabled:bg-gray-200"
                >
                  {loading ? "Activating..." : "Launch Store"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}