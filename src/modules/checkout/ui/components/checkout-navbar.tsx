"use client";
import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import Link from "next/link";

interface Props {
  slug: string;
}

const CheckoutNavbar = ({ slug }: Props) => {
  return (
    <div className=" h-20 border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl)  mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link
        
          href={generateTenantURL(slug)}
          className=" flex items-center gap-2"
        >
          <p className=" text-xl">付款</p>
        </Link>
        <Button variant={"elevated"} asChild>
          <Link  href={generateTenantURL(slug)}>继续购物</Link>
        </Button>
      </div>
    </div>
  );
};

export default CheckoutNavbar;

// export const TenantsNavbarSkeleton = () => {
//   return (
//     <div className=" h-20 border-b font-medium bg-white">
//       <div className=" max-w-(--breakpoint-xl)  mx-auto flex justify-between items-center h-full px-4 lg:px-12">
//         <div></div>
//         <Button disabled className=" bg-white">
//           <ShoppingCartIcon className=" text-black" />
//         </Button>
//       </div>
//     </div>
//   );
// };
