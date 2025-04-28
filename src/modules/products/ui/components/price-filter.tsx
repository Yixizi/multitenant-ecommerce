"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");

  const formattedValue =
    parts[0] + (parts.length > 0 ? "." + parts[1]?.slice(0, 2) : "");

  if (!formattedValue) return "";

  const numberValue = parseFloat(formattedValue);
  if (isNaN(numberValue)) return "";
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    // useGrouping: false,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMaxPriceChange,
  onMinPriceChange,
}: Props) => {
  const [minPriceInput, setMinPriceInput] = useState(minPrice ?? "");
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice ?? "");
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    // console.log(numericValue);
    setMinPriceInput(numericValue);
    onMinPriceChange(numericValue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    // console.log(numericValue);
    setMaxPriceInput(numericValue);
    onMaxPriceChange(numericValue);
  };

  const handleMinPriceBlur = () => {
    const formattedValue = formatAsCurrency(minPriceInput);
    setMinPriceInput(formattedValue); // Only format on blur
    onMinPriceChange(formattedValue.replace(/[^0-9.]/g, "")); // Save raw numeric value
  };

  const handleMaxPriceBlur = () => {
    const formattedValue = formatAsCurrency(maxPriceInput);
    setMaxPriceInput(formattedValue); // Only format on blur
    onMaxPriceChange(formattedValue.replace(/[^0-9.]/g, "")); // Save raw numeric value
  };
  return (
    <div className=" flex flex-col gap-2">
      <div className=" flex flex-col gap2">
        <Label className=" font-medium text-base">最低价格</Label>
        <Input
          type="text"
          placeholder="￥0"
          value={minPriceInput}
          onChange={handleMinPriceChange}
          onBlur={handleMinPriceBlur}
        />
      </div>
      <div className=" flex flex-col gap2">
        <Label className=" font-medium text-base">最高价格</Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPriceInput}
          onChange={handleMaxPriceChange}
          onBlur={handleMaxPriceBlur}
        />
      </div>
    </div>
  );
};
