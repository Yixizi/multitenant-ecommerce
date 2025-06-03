import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { ProductList, ProductListSkeleton } from "../components/product-list";

const LibraryView = () => {
  return (
    <div className=" min-h-screen bg-white">
      <nav className=" p-4 bg-[#f4f4f0] w-full border-b">
        <Link  href={"/"} className=" flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className=" text font-medium ">继续购物</span>
        </Link>
      </nav>

      <header className=" bg-[#f4f4f0] py-8 border-b">
        <div className=" max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
          <h1 className=" text-[40px] font-medium">账单库</h1>
          <p>你的消费账单</p>
        </div>
      </header>

      <section className=" max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
};

export default LibraryView;
