"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Tag as TagIcon, Loader2, X, PenSquareIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

const POSTS_PER_PAGE = 4;

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: catData } = await supabase
        .from("categories")
        .select("name")
        .order("name");

      if (catData) setCategories(catData);

      let query = supabase
        .from("blogs")
        .select("*", { count: "exact" })
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "All") query = query.eq("category", selectedCategory);
      if (searchQuery)
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);

      const { data, count } = await query.range(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE - 1
      );

      setPosts(data || []);
      setTotalCount(count || 0);
      setLoading(false);
    };

    const t = setTimeout(fetchData, 350);
    return () => clearTimeout(t);
  }, [currentPage, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9fbf5] via-[#f7f9f1] to-[#eef3ea] -z-10" />

      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          Our Blog
        </h1>
        <p className="text-gray-500 text-sm">
          <Link href="/" className="hover:text-orange-500">Home</Link> /{" "}
          {searchQuery ? `Search: "${searchQuery}"` : selectedCategory}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
        {/* Blog Feed */}
        <div className="lg:col-span-2 space-y-14">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-orange-500" size={42} />
            </div>
          ) : posts.length ? (
            posts.map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition"
              >
                <div className="relative h-[280px]">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">
                    <span className="bg-orange-100 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 leading-tight hover:text-orange-500 transition">
                    <Link href={`/blogs/${post.id}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-500 leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blogs/${post.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border">
              <p className="text-gray-400 font-semibold">No blogs found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 pt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-11 h-11 rounded-full font-semibold transition ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white border text-gray-500 hover:border-orange-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className=" flex flex-col items-center justify-center gap-2 w-full">

          <Link
            href="/blogs/create"
            className=" w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-500 transition"
            >
            <TagIcon size={18} /> Create Blog
          </Link>
          <Link
            href="/blogs/manage"
            className=" w-full flex items-center justify-center gap-3 bg-gray-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-500 transition"
            >
            <PenSquareIcon size={18} /> Manage Your Blog
          </Link>
            </div>

          {/* Search */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Search</h3>
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg">
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li
                onClick={() => setSelectedCategory("All")}
                className={`cursor-pointer font-medium ${
                  selectedCategory === "All"
                    ? "text-orange-500"
                    : "text-gray-500 hover:text-orange-500"
                }`}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`cursor-pointer font-medium ${
                    selectedCategory === cat.name
                      ? "text-orange-500"
                      : "text-gray-500 hover:text-orange-500"
                  }`}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
