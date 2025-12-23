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
    return (
      <p className="text-center text-red-600 font-semibold py-20">
        Failed to load auctions
      </p>
    );
  }

  const items = Array.isArray(data) ? data : data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-linear-to-br from-[#f3f7e9] via-[#f6faef] to-[#eef4df]" />

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item: any, i: number) => (
            <ItemCard key={item.id} item={item} i={i} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <Pagination>
              <PaginationContent className="bg-white rounded-xl px-4 py-2 shadow-sm border border-border">
                
                {/* PREVIOUS */}
                <PaginationItem>
                  <PaginationPrevious
                    href={`/auction-products?page=${page - 1}`}
                    aria-disabled={page === 1}
                    className={`
                      border border-border rounded-lg
                      hover:bg-orange-50 hover:text-orange-600
                      ${page === 1 
                        ? "pointer-events-none opacity-40"
                        : ""}
                    `}
                  />
                </PaginationItem>

                {/* PAGE NUMBERS */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  const isActive = page === pageNumber;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={`/auction-products?page=${pageNumber}`}
                        isActive={isActive}
                        className={`
                          rounded-lg border border-border font-semibold
                          transition-colors
                          ${
                            isActive
                              ? "bg-orange-500 text-white hover:bg-orange-300 hover:text-orange-600"
                              : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                          }
                        `}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* NEXT */}
                <PaginationItem>
                  <PaginationNext
                    href={`/auction-products?page=${page + 1}`}
                    aria-disabled={page === totalPages}
                    className={`
                      border border-border rounded-lg
                      hover:bg-orange-50 hover:text-orange-600
                      ${page === totalPages 
                        ? "pointer-events-none opacity-40"
                        : ""}
                    `}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
