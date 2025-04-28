import React from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { webSiteName } from "@/contants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
const TenantsFooter = () => {
  return (
    <footer className=" border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl)  mx-auto flex gap-2 items-center h-full px-4 py-4 lg:px-12">
        <p>由</p>
        <Link href={process.env.NEXT_PUBLIC_APP_URL!}>
          <span className={cn("text-2xl font-medium", poppins.className)}>
            {webSiteName}
          </span>
        </Link>
        <p>支持提供</p>
      </div>
    </footer>
  );
};

export default TenantsFooter;
