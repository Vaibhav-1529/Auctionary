"use client";

import { Store, Pencil, Save } from "lucide-react";
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
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(storeInfo?.store_name || "");
  const [bio, setBio] = useState(storeInfo?.store_bio || "");

  if (!isSeller) {
    return (
      <div className="border rounded-2xl p-10 text-center bg-gray-50">
        <h3 className="text-xl font-semibold">Become a Seller</h3>
        <p className="text-sm text-gray-500 mt-2">
          Activate your seller account to start listing products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Store Settings</h3>
        <button
          onClick={() => setEdit(!edit)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
        >
          {edit ? <Save size={16} /> : <Pencil size={16} />}
          {edit ? "Save" : "Edit"}
        </button>
      </div>

      {/* Store Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-white">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Store Name
          </p>
          {edit ? (
            <input
              className="w-full border rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="text-lg font-semibold">{storeInfo.store_name}</p>
          )}
        </div>

        <div className="p-6 rounded-2xl border bg-white">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Active Listings
          </p>
          <p className="text-lg font-bold">{activeListingsCount}</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border bg-white">
        <p className="text-xs font-semibold text-gray-500 mb-2">
          Store Description
        </p>

        {edit ? (
          <textarea
            className="w-full border rounded-xl p-3 resize-none"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {storeInfo?.store_bio || "No description provided."}
          </p>
        )}
      </div>
    </div>
  );
}
