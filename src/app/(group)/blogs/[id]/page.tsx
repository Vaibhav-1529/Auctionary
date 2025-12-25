import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag } from "lucide-react";

// Use the correct Type for Next.js 15 params
export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await the params object
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Use the awaited id
  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    return (
      <div className="py-20 text-center font-bold text-gray-500">
        Post not found.
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-20 px-6 animate-in fade-in duration-700">
      <Link 
        href="/blogs" 
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-500 mb-10 transition"
      >
        <ChevronLeft size={16} /> Back to Blogs
      </Link>

      <div className="relative h-125 w-full rounded-xl overflow-hidden mb-12 shadow-2xl">
        <Image 
          src={post.image_url} 
          alt={post.title} 
          fill 
          className="object-cover" 
          priority
        />
      </div>

      <div className="flex items-center gap-4 mb-8">
         <span className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {post.category}
         </span>
         <span className="text-gray-400 text-xs font-bold">
            {new Date(post.created_at).toLocaleDateString()}
         </span>
      </div>

      <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-10">
        {post.title}
      </h1>

      <div className="text-gray-600 leading-loose text-lg whitespace-pre-wrap font-medium">
        {post.content}
      </div>
    </article>
  );
}