"use client";

import { useState } from "react";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/app/actions/cloudinary";
import { createAuctionAction } from "@/app/actions/auctions"; // Import the new action

export default function AddAuctionModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [schedule, setSchedule] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_bid: "",
    start_date: "",
    end_date: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Handle Cloudinary Upload
      let imageUrl = "https://via.placeholder.com/600x400?text=Auction+Item";
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        imageUrl = await uploadToCloudinary(data);
      }

      // 2. Prepare Data
      const startTime = schedule
        ? new Date(formData.start_date).toISOString()
        : new Date().toISOString();

      const status = schedule ? "Scheduled" : "Live";

      const auctionData = {
        title: formData.title,
        description: formData.description,
        starting_bid: Number(formData.starting_bid),
        current_bid: Number(formData.starting_bid),
        status,
        starts_at: startTime,
        ends_at: new Date(formData.end_date).toISOString(),
        image_url: imageUrl,
      };
      await createAuctionAction(auctionData);

      setOpen(false);
      setSchedule(false);
      setImageFile(null);
      setPreviewUrl(null);
      setFormData({ title: "", description: "", starting_bid: "", start_date: "", end_date: "" });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition"
      >
        <Plus size={18} /> Add New Auction
      </button>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black">List New Product</h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Preview Image if exists */}
              {previewUrl && (
                <div className="w-full h-40 rounded-xl overflow-hidden border-2 border-gray-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <input
                required
                placeholder="Product title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border-2 p-3 rounded-xl focus:border-orange-500 outline-none"
              />

              <input
                required
                type="number"
                placeholder="Starting price (₹)"
                value={formData.starting_bid}
                onChange={(e) =>
                  setFormData({ ...formData, starting_bid: e.target.value })
                }
                className="w-full border-2 p-3 rounded-xl focus:border-orange-500 outline-none"
              />

              <label className="flex items-center gap-2 cursor-pointer border-2 p-3 rounded-xl hover:bg-gray-50 transition">
                <ImagePlus className="text-gray-400" />
                <span className="text-sm text-gray-600 truncate">
                  {imageFile ? imageFile.name : "Upload product image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </label>

              <textarea
                required
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border-2 p-3 rounded-xl h-24 focus:border-orange-500 outline-none"
              />

              <label className="flex items-center gap-3 p-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-orange-500"
                  checked={schedule}
                  onChange={(e) => setSchedule(e.target.checked)}
                />
                <span className="font-semibold text-sm">
                  Schedule for later?
                </span>
              </label>

              {schedule && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                    Start Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full border-2 p-3 rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                  End Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full border-2 p-3 rounded-xl"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black transition disabled:bg-gray-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Launch Auction"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
