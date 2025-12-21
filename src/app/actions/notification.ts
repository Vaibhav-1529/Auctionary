"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role for internal updates
);

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("You must be logged in to perform this action");
    }

    const { error } = await supabase
      .from("notifications")
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;
    revalidatePath("/profile"); 
    
    return { success: true };
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    return { success: false, error: "Update failed" };
  }
}