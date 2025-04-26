"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { generateTenantURL } from "@/lib/utils";
import CheckoutItem from "../components/checkout-item";
import CheckoutSidebar from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface Props {
  tenantSlug: string;
}

const CheckoutView = ({ tenantSlug }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds }),
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
        toast.error(error.message);
      },
    }),
  );

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/products");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);

  useEffect(() => {
    if (!error) {
      return;
    }

    if (error.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("有产品未找到，购物车清空");
    }
  }, [clearCart, error]);

  if (isLoading) {
    return (
      <div className=" lg:pt-16 pt-4 px-4 lg:px-12">
        <div className=" border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className=" text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className=" lg:pt-16 pt-4 px-4 lg:px-12">
        <div className=" border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className=" text-base font-medium">没有找到任何产品</p>
        </div>
      </div>
    );
  }
  return (
    <div className=" lg:pt-16 pt-4 px-4 lg:px-12">
      <div className=" grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className=" lg:col-span-4">
          <div className=" border rounded-md overflow-hidden bg-white">
            {data?.docs.map((item, index) => {
              return (
                <CheckoutItem
                  key={item.id}
                  isLast={index === data.docs.length - 1}
                  imageUrl={item.image?.url}
                  name={item.name}
                  productUrl={`${generateTenantURL(item.tenant.slug)}/products/${item.id}`}
                  tenantUrl={generateTenantURL(item.tenant.slug)}
                  tenantName={item.name}
                  price={item.price}
                  onRemove={() => {
                    removeProduct(item.id);
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className=" lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
          <div className=" p-5">
            <p className=" pb-5">此为练习项目，使用付款沙盒作为测试</p>
            <div>
              输入
              <p
                className=" underline inline-block cursor-pointer "
                onClick={() => {
                  try {
                    navigator.clipboard.writeText("4242 4242 4242 4242");
                    toast.error("复制成功");
                  } catch (error) {
                    toast.error("复制失败");
                    console.log(
                      JSON.stringify(error, null, 2) || "卡号复制失败",
                    );
                  }
                }}
              >
                4242 4242 4242 4242
              </p>
              卡号
            </div>
            <div>输入卡到期的任何未来日期 如 12/34 </div>
            <div>输入任意3位 CVC 号码 如 123</div>
            <div>输入任意帐单邮政编码 如 94103</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
