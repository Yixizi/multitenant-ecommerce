import TenantsFooter from "@/modules/tenants/ui/components/tenants-footer";
import CheckoutNavbar from "@/modules/checkout/ui/components/checkout-navbar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  return (
    <div className=" min-h-screen bg-[#f4f4f0] flex flex-col">
      <CheckoutNavbar slug={slug} />

      <div className=" flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <TenantsFooter />
    </div>
  );
};

export default Layout;
