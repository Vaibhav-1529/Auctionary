"use client";

import { Store, Pencil } from "lucide-react";
import { useState } from "react";

export default function StoreSettingTab({
  storeInfo,
  isSeller,
  activeListingsCount,
}: {
  storeInfo: any;
  isSeller: boolean;
  activeListingsCount: number;
}) {
  const [editing, setEditing] = useState(false);

  if (!isSeller) {
    return (
      <div className="border rounded-xl p-10 text-center bg-gray-50">
        <p className="text-gray-600 font-medium">
          Become a seller to manage your store.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-white border">
          <p className="text-xs text-gray-500 uppercase">Total Listings</p>
          <p className="text-3xl font-bold">{activeListingsCount}</p>
        </div>

        <div className="p-6 rounded-xl bg-white border">
          <p className="text-xs text-gray-500 uppercase">Account Status</p>
          <p className="text-3xl font-bold text-green-600">Active</p>
        </div>
      </div>

      {/* Store Info */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Store Details</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm px-4 py-1.5 rounded-full border hover:bg-gray-100"
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Store Name
            </label>
            {editing ? (
              <input
                defaultValue={storeInfo?.store_name}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <p className="font-medium">{storeInfo?.store_name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Description
            </label>
            {editing ? (
              <textarea
                defaultValue={storeInfo?.store_bio}
                className="w-full border rounded-lg p-3 min-h-[100px]"
              />
            ) : (
              <p className="text-gray-600">
                {storeInfo?.store_bio || "No description provided."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
