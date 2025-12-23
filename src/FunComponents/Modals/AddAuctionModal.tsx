"use client";

import { useState } from "react";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/app/actions/cloudinary";
import { createAuctionAction } from "@/app/actions/auctions";

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
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl =
        "https://via.placeholder.com/600x400?text=Auction+Item";

      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        imageUrl = await uploadToCloudinary(data);
      }

      const startTime = schedule
        ? new Date(formData.start_date).toISOString()
        : new Date().toISOString();

      const status = schedule ? "Scheduled" : "Live";

      await createAuctionAction({
        title: formData.title,
        description: formData.description,
        starting_bid: Number(formData.starting_bid),
        current_bid: Number(formData.starting_bid),
        status,
        starts_at: startTime,
        ends_at: new Date(formData.end_date).toISOString(),
        image_url: imageUrl,
      });

      setOpen(false);
      setSchedule(false);
      setImageFile(null);
      setPreviewUrl(null);
      setFormData({
        title: "",
        description: "",
        starting_bid: "",
        start_date: "",
        end_date: "",
      });
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
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
      >
        <Plus size={18} />
        Add New Auction
      </button>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-lg font-semibold">
                List New Product
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {previewUrl && (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-border">
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
                className="w-full border border-input p-3 rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />

              <input
                required
                type="number"
                placeholder="Starting price (₹)"
                value={formData.starting_bid}
                onChange={(e) =>
                  setFormData({ ...formData, starting_bid: e.target.value })
                }
                className="w-full border border-input p-3 rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />

              <label className="flex items-center gap-2 cursor-pointer border border-input p-3 rounded-xl hover:bg-muted transition">
                <ImagePlus className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
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
                className="w-full border border-input p-3 rounded-xl h-24 bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />

              <label className="flex items-center gap-3 p-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-accent"
                  checked={schedule}
                  onChange={(e) => setSchedule(e.target.checked)}
                />
                <span className="font-medium text-sm">
                  Schedule for later?
                </span>
              </label>

              {schedule && (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase ml-1">
                    Start Time
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full border border-input p-3 rounded-xl bg-background focus:border-primary outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase ml-1">
                  End Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      end_date: e.target.value,
                    })
                  }
                  className="w-full border border-input p-3 rounded-xl bg-background focus:border-primary outline-none"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-semibold transition hover:opacity-90 disabled:bg-muted"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
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
