"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function activateSellerAccount(storeName: string, storeBio: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const { error: storeError } = await supabaseAdmin.from("seller_profiles").insert({
    id: userId,
    store_name: storeName,
    store_bio: storeBio,
  });

  if (storeError) throw new Error(storeError.message);

  await supabaseAdmin.from("profiles").update({ role: "seller" }).eq("id", userId);

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "seller",
    },
  });

  return { success: true };
}