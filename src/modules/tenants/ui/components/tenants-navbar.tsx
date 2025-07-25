"use client";
import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import { CheckoutButton } from "@/modules/checkout/ui/components/checkout-buttin";
import dynamic from "next/dynamic";
const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-buttin").then(
      (mod) => mod.CheckoutButton,
    ),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="  bg-white">
        <ShoppingCartIcon className=" text-black" />
      </Button>
    ),
  },
);

interface Props {
  slug: string;
}

const TenantsNavbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  return (
    <div className=" h-20 border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl)  mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link
        
          href={generateTenantURL(slug)}
          className=" flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              className=" rounded-full border shrink-0 size-8"
              alt={slug}
            />
          )}
          <p className=" text-xl">{data.name}</p>
        </Link>
        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </div>
  );
};

export default TenantsNavbar;

export const TenantsNavbarSkeleton = () => {
  return (
    <div className=" h-20 border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl)  mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div></div>
        <Button disabled className=" bg-white">
          <ShoppingCartIcon className=" text-black" />
        </Button>
      </div>
    </div>
  );
};
