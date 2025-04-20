"use client";
import { useTRPC } from "@/trpc/client";
import Categories from "./categories";
import SearchInput from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";

const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  console.log(data);

  return (
    <div
      style={{ backgroundColor: "#f5f5f5" }}
      className=" px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
    >
      <SearchInput />
      <div className=" hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
};

export default SearchFilters;

export const SearchFiltersSkeleton = () => {
  return (
    <div
      style={{ backgroundColor: "#f5f5f5" }}
      className=" px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
    >
      <SearchInput disabled />
      <div className=" hidden lg:block">
        <div className="h-11"></div>
      </div>
    </div>
  );
};
