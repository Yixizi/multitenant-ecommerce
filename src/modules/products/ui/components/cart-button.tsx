import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Button
        variant={"elevated"}
        asChild
        className=" flex-1 font-medium bg-white-400"
      >
        <Link  href={`/library/${productId}`}>进入账单库</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={"elevated"}
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white",
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "移除购物车" : "添加至购物车"}
    </Button>
  );
};
