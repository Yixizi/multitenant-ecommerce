"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useProductFilters } from "../../hooks/use-product-filters";
import ProductCard, { ProductCardSkeleton } from "./product-card";
import { DEFAULT_LIMIT } from "@/contants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}

export const ProductList = ({ category, tenantSlug, narrowView }: Props) => {
  const [filters] = useProductFilters();

  const trpc = useTRPC();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          categorySlug: category,
          tenantSlug: tenantSlug,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className=" border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className=" text-base font-medium">没有找到任何产品</p>
      </div>
    );
  }


  return (
    <>
      <div
        className={cn(
          " grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4",
          narrowView && "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4",
        )}
      >
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              name={product.name}
              key={product.id}
              id={product.id}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant.slug}
              tenantName={product.tenant.name}
              tenantImageUrl={product.tenant.image?.url}
              reviewCount={product.reviewCount}
              reviewRating={product.reviewRating}
              price={product.price}
            />
          ))}
      </div>
      <div className=" flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
            className=" font-medium disabled:opacity-50 text-base bg-white"
            variant={"elevated"}
          >
            加载更多
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = ({ narrowView }: Props) => {
  return (
    <div
      className={cn(
        " grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4",
        narrowView && "lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4",
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => {
        return <ProductCardSkeleton key={index} />;
      })}
    </div>
  );
};
