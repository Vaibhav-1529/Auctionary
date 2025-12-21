// Types for Supabase Edge runtime
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data, error } = await supabase
      .from("auction_items")
      .select(`
        id,
        title,
        description,
        image_url,
        starting_bid,
        current_bid,
        status,
        starts_at,
        ends_at,
        buy_now_enabled,
        buy_now_price
      `)
      .order("ends_at", { ascending: true });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500 }
    );
  }
});
