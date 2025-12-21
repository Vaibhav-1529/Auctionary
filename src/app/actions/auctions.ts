"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createAuctionAction(data: any) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to create an auction.");
  }
  const { error } = await supabaseAdmin.from("auction_items").insert({
    ...data,
    seller_id: userId,
  });
  if (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create auction.");
  }
  revalidatePath("/profile");
  return { success: true };
}