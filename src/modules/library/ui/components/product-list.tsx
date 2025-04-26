"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import ProductCard, { ProductCardSkeleton } from "./product-card";
import { DEFAULT_LIMIT } from "@/contants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";

export const ProductList = () => {
  const trpc = useTRPC();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        {
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
        className={
          " grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
        }
      >
        {data?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              name={product.name}
              key={product.id}
              id={product.id}
              // imageUrl={product.image?.url}
              tenantSlug={product.tenant.slug}
              tenantName={product.tenant.name}
              tenantImageUrl={product.tenant.image?.url}
              reviewCount={5}
              reviewRating={3}
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

export const ProductListSkeleton = () => {
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => {
        return <ProductCardSkeleton key={index} />;
      })}
    </div>
  );
};
