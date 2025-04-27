"use client";
import StarRating from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
// import { CartButton } from "../components/cart-button";
//客户端的本地储存可能有值导致和服务端渲染不同
import dynamic from "next/dynamic";
import { toast } from "sonner";
const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="  flex-1 bg-pink-400">
        加载中
      </Button>
    ),
  },
);

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}
const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const [isCopied, setIsCopied] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId }),
  );
  return (
    <div className=" px-4 lg:px-12 py-10">
      <div className=" border rounded-sm bg-white overflow-hidden">
        <div className=" relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url || "/auth-bg.png"}
            fill
            className=" object-cover"
            alt={data.name}
          />
        </div>

        <div className=" grid grid-cols-1 lg:grid-cols-6">
          <div className=" col-span-4">
            <div className=" p-6">
              <h1 className=" text-4xl font-medium">{data.name}</h1>
            </div>

            <div className=" border-y flex ">
              <div className=" px-6 py-4 flex items-center justify-center border-r">
                <div className="  relative px-2 py-1 border bg-pink-400 w-fit">
                  <p className=" text-base font-medium">
                    ￥{formatCurrency(data.price)}
                  </p>
                </div>
              </div>

              <div className=" px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  className=" flex items-center gap-2"
                >
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className=" rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <p className=" text-base underline font-medium">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>

              <div className=" hidden lg:flex px-6 py-4 items-center justify-center">
                <div className=" flex items-center gap-2">
                  <StarRating rating={data.reviewRating} />
                  <p className=" text-base font-medium">{data.reviewCount}条</p>
                </div>
              </div>
            </div>

            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className=" flex items-center gap-1">
                <StarRating rating={data.reviewRating} iconClassName="size-4" />
                <p className=" text-base font-medium">{data.reviewCount}条</p>
              </div>
            </div>

            <div className=" p-6">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className=" font-medium text-muted-foreground italic">
                  没有描述提供
                </p>
              )}
            </div>
          </div>

          <div className=" col-span-2">
            <div className=" border-t lg:border-t-0 lg:border-l h-full">
              <div className=" flex flex-col gap-4 p-6 border-b">
                <div className=" flex flex-row items-center gap-2">
                  <CartButton
                    isPurchased={data.isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
                  />

                  <Button
                    className="  size-12"
                    variant={"elevated"}
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("网址已复制");
                      setTimeout(() => {
                        setIsCopied(false);
                      }, 3000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? <CheckIcon /> : <LinkIcon />}
                  </Button>
                </div>

                <p className=" text-center font-medium">
                  {data.refundPolicy === "no-refunds"
                    ? "无法退款"
                    : `${data.refundPolicy} 内可退款`}
                </p>
              </div>

              <div className="p-6">
                <div className=" flex items-center justify-between">
                  <h3 className=" text-xl font-medium">评论数</h3>
                  <div className=" flex items-center gap-x-1 font-medium">
                    <StarIcon className=" size-4 fill-black" />
                    <p>({data.reviewRating})</p>
                    <p className=" text-base">{data.reviewCount}条</p>
                  </div>
                </div>
              </div>

              <div className=" grid grid-cols-[auto_1fr_auto] gap-3 px-5 mb-4 mt-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <Fragment key={stars}>
                    <div className=" font-medium">
                      {stars} {stars === 1 ? "star" : "stars"}
                    </div>
                    <Progress
                      value={data.ratingDistribution[stars]}
                      className=" h-[1lh]"
                    />
                    <div className="  font-medium">
                      {data.ratingDistribution[stars]}%
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
