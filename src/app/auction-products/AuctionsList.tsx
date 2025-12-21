import { createClient } from "@supabase/supabase-js";
import ItemCard from "@/FunComponents/ItemCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AuctionsList({ page }: { page: number }) {
  const { data, error } = await supabase.functions.invoke("get-auctions", {
    body: { page },
  });

  if (error) {
    return <p className="text-red-500">Failed to load auctions</p>;
  }

  const items = Array.isArray(data) ? data : data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item: any, i: number) => (
          <ItemCard key={item.id} item={item} i={i} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/auction-products?page=${page - 1}`}
                  aria-disabled={page === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href={`/auction-products?page=${i + 1}`}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href={`/auction-products?page=${page + 1}`}
                  aria-disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
