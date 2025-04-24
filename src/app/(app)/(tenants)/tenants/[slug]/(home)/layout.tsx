import TenantsFooter from "@/modules/tenants/ui/components/tenants-footer";
import TenantsNavbar, {
  TenantsNavbarSkeleton,
} from "@/modules/tenants/ui/components/tenants-navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    }),
  );

  return (
    <div className=" min-h-screen bg-[#f4f4f0] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<TenantsNavbarSkeleton />}>
          <TenantsNavbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className=" flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <TenantsFooter />
    </div>
  );
};

export default Layout;
