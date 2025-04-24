"use client";
import React from "react";
import { useProductFilters } from "../../hooks/use-product-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProductSort = () => {
  const [filters, setFilters] = useProductFilters();

  // console.log(filters.sort);
  return (
    <div className=" flex items-center gap-2">
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "curated" &&
            " bg-transparent border-transparent hover:border-border hover:bg-transparent",
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "curated" })}
      >
        精选
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "trending" &&
            " bg-transparent border-transparent hover:border-border hover:bg-transparent",
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "trending" })}
      >
        热门
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "hot_and_new" &&
            " bg-transparent border-transparent hover:border-border hover:bg-transparent",
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "hot_and_new" })}
      >
        最新与最热
      </Button>
    </div>
  );
};

export default ProductSort;
