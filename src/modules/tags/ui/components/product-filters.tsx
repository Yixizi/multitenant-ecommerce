"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { PriceFilter } from "./price-filter";
import { useProductFilters } from "../../hooks/use-product-filters";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ProductFilter = ({ title, children, className }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4  border-b-0 flex-col gap-2", className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className=" flex items-center justify-between cursor-pointer"
      >
        <p className=" font-medium">{title}</p>
        <Icon className=" size-5" />
      </div>
      {isOpen && children}
    </div>
  );
};
export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([, value]) => {
    if (typeof value === "string") {
      return value !== "";
    }

    return value !== null;
  });
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
    });
  };
  return (
    <div className=" border rounded-md bg-white">
      <div className=" p-4 border-b flex items-center justify-between">
        <p className=" font-medium">过滤</p>
        {hasAnyFilters && (
          <button
            className=" underline cursor-pointer"
            onClick={() => onClear()}
            type="button"
          >
            清除
          </button>
        )}
      </div>
      <ProductFilter title="价格">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
          onMinPriceChange={(value) => onChange("minPrice", value)}
        />
      </ProductFilter>
    </div>
  );
};
