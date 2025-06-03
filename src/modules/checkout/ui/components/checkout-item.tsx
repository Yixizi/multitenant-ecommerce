import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  // id: string;
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  onRemove: () => void;
}

const CheckoutItem = ({
  // id,
  isLast,
  imageUrl,
  price,
  onRemove,
  productUrl,
  tenantName,
  tenantUrl,
  name,
}: Props) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b px-4",
        isLast && "border-b-0",
      )}
    >
      <div className=" overflow-hidden border-r">
        <div className=" relative aspect-square h-full">
          <Image
            src={imageUrl || "/auth-bg.png"}
            alt={name}
            fill
            className=" object-cover"
          />
        </div>
      </div>

      <div className=" py-4 flex flex-col justify-between">
        <div>
          <Link  href={productUrl}>
            <h4 className=" font-bold underline">{name}</h4>
          </Link>
          <Link  href={tenantUrl}>
            <h4 className=" font-bold underline">{tenantName}</h4>
          </Link>
        </div>
      </div>

      <div className=" py-4 flex flex-col justify-between">
        <p className=" font-medium">{formatCurrency(price)}</p>
        <button
          className=" underline font-medium cursor-pointer"
          onClick={onRemove}
          type="button"
        >
          移除
        </button>
      </div>
    </div>
  );
};

export default CheckoutItem;
