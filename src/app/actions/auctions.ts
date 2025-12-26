"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createAuctionAction(data: any) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const {
      title,
      description,
      starting_bid,
      current_bid,
      status,
      starts_at,
      ends_at,
      image_url,
      category, // Added category
    } = data;

    if (!title || !starting_bid || !ends_at || !category) {
      throw new Error("Missing required fields");
    }

    const { error } = await supabase.from("auction_items").insert({
      title,
      description,
      starting_bid: Number(starting_bid),
      current_bid: Number(current_bid),
      status,
      starts_at,
      ends_at,
      image_url,
      category_id: category,
      seller_id: userId,
    });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      throw new Error(error.message);
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (err: any) {
    console.error("CREATE AUCTION ERROR:", err.message);
    throw new Error(err.message || "Failed to create auction");
  }
}