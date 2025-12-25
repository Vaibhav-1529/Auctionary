"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/app/actions/cloudinary";
import { useRouter } from "next/navigation";
import { Save, Loader2, UploadCloud } from "lucide-react";

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data?.length) {
        setCategories(data);
        setFormData((p) => ({ ...p, category: data[0].name }));
      }
    };
    fetchCategories();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "https://via.placeholder.com/800x500";

      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);
        imageUrl = await uploadToCloudinary(form);
      }

      // 1. Get the JWT token from Clerk
      // This ensures your Edge Function's 'jwtVerify' doesn't fail with a 400/401
      const token = await (window as any).Clerk?.session?.getToken();

      // 2. Pass the token in the headers
      const { error } = await supabase.functions.invoke("create-blog", {
        body: { ...formData, image_url: imageUrl },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) throw error;
      router.push("/blogs");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-20 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2">Create New Blog</h1>
        <p className="text-gray-500 text-sm">
          Write something meaningful and publish it instantly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-3xl p-10 shadow-sm space-y-8"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input
            required
            placeholder="Enter blog title..."
            className="w-full p-4 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-orange-400 outline-none"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Category + Image */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-4 bg-gray-50 rounded-xl border"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Thumbnail</label>
            <label className="flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
              <UploadCloud size={18} />
              <span className="text-sm">
                {imageFile ? imageFile.name : "Upload image"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold mb-2">Short Description</label>
          <textarea
            rows={3}
            placeholder="Short summary for listing page..."
            className="w-full p-4 rounded-xl bg-gray-50 border resize-none"
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold mb-2">Full Content</label>
          <textarea
            rows={10}
            placeholder="Write your blog content here..."
            className="w-full p-4 rounded-xl bg-gray-50 border resize-none"
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-orange-500 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Publish Blog
        </button>
      </form>
    </section>
  );
}
