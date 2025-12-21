// app/test/page.tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function page() {
  const { data, error } = await supabase.functions.invoke('get-auctions')

  return (
    <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
  )
}
