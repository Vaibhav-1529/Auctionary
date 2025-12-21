"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const posts = [
  {
    id: 1,
    title: "Collector’s Edition Limited Print of Frank Peral St.",
    excerpt:
      "Suspendisse blandit ultrices erat, at pretium erat mattis nec. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae...",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    date: "05 November, 2024",
    category: "Books & Comic",
  },
  {
    id: 2,
    title: "Gizmo galaxy your universent of cutting edge tech.",
    excerpt:
      "Suspendisse blandit ultrices erat, at pretium erat mattis nec. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae...",
    image: "https://images.unsplash.com/photo-1500534314209-a26db0f5b2a0",
    date: "12 November, 2024",
    category: "Gadget & Technology",
  },
  {
    id: 3,
    title: "Hidden treasures from the antique world.",
    excerpt:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
    date: "18 November, 2024",
    category: "Antiques",
  },
  {
    id: 4,
    title: "Rare coins that shaped history.",
    excerpt:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    image: "https://images.unsplash.com/photo-1602524202519-2a79f13a0cba",
    date: "22 November, 2024",
    category: "Old Coin",
  },
];

const categories = [
  { name: "Antiques", count: 2 },
  { name: "Automotive", count: 4 },
  { name: "Books & Comic", count: 6 },
  { name: "Digital Art", count: 3 },
  { name: "Gadget and Technology", count: 5 },
  { name: "Old Coin", count: 2 },
  { name: "Real State", count: 1 },
];

const popularPosts = posts.slice(0, 3);


const POSTS_PER_PAGE = 2;


export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <section className="max-w-370 mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-orange-500">
            Home
          </Link>{" "}
          → Blog Standard
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
        <div className="lg:col-span-2 space-y-14">
          {paginatedPosts.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="border rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-90 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>

              <div className="p-8">
                <div className="text-xs text-muted-foreground mb-3">
                  {post.category} • {post.date}
                </div>

                <h2 className="text-2xl font-bold mb-4 leading-snug hover:text-orange-500 transition">
                  {post.title}
                </h2>

                <p className="text-muted-foreground mb-6">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block text-sm font-semibold text-orange-500 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}

          <div className="flex items-center justify-center gap-3 pt-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-md border text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>

       <aside className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Search</h3>
            <div className="flex">
              <input
                placeholder="Search..."
                className="flex-1 px-3 py-2 border rounded-l-md outline-none text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 rounded-r-md bg-orange-500 text-white"
              >
                <Search size={20} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Category</h3>
            <ul className="space-y-3 text-sm">
              {categories.map((cat) => (
                <motion.li
                  key={cat.name}
                  whileHover={{ x: 6 }}
                  className="flex justify-between text-muted-foreground hover:text-orange-500 cursor-pointer transition"
                >
                  <span>{cat.name}</span>
                  <span>({cat.count})</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Popular Post</h3>
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ x: 6 }}
                  className="flex gap-3 cursor-pointer"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium leading-snug hover:text-orange-500 transition">
                      {post.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">New Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Antique",
                "Auction",
                "Art",
                "Vintage",
                "Collectibles",
                "Bidding",
              ].map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.08 }}
                  className="text-xs px-3 py-1 border rounded-full hover:bg-orange-500 hover:text-white cursor-pointer transition"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}
