"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { NavbarSidebar } from "./navbar-sidebar";
import { MenuIcon } from "lucide-react";
import { webSiteName } from "@/contants";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  href: string;
}

const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant={"outline"}
      className={cn(
        "px-3 text-lg bg-transparent hover:bg-transparent rounded-full border-transparent hover:border-primary",
        isActive && "bg-black text-white hover:bg-black hover:text-white",
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const NavbarItems = [
  {
    href: "/",
    children: "首页",
  },
  {
    href: "/about",
    children: "关于我们",
  },
  {
    href: "/features",
    children: "功能介绍",
  },
  {
    href: "/pricing",
    children: "定价方案",
  },
  {
    href: "/contact",
    children: "联系我们",
  },
];

const Navbar = () => {
  const [isSiderbarOpen, setIsSiderbarOpen] = useState(false);
  const pathname = usePathname();
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  console.log(session.data);
  return (
    <nav className=" bg-white h-14 flex lg:h-20 border-b justify-between font-medium">
      <Link href={"/"} className=" pl-6 flex items-center">
        <span className={cn("text-4xl font-semibold", poppins.className)}>
          {webSiteName}
        </span>
      </Link>

      <NavbarSidebar
        open={isSiderbarOpen}
        onOpenChange={setIsSiderbarOpen}
        items={NavbarItems}
      />

      <div className=" items-center gap-4 hidden lg:flex">
        {NavbarItems.map((item) => (
          <NavbarItem
            isActive={pathname === item.href ? true : false}
            key={item.href}
            href={item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      {session.data?.user ? (
        <div className=" hidden lg:flex">
          <Button
            asChild
            className="border-0 border-l  px-8 h-full rounded-none bg-black text-white hover:text-black  hover:bg-pink-400 transition-colors text-lg"
            variant={"secondary"}
          >
            <Link href="/admin">仪表盘</Link>
          </Button>
        </div>
      ) : (
        <div className=" hidden lg:flex">
          <Button
            asChild
            className="border-0 border-l  px-8 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
            variant={"secondary"}
          >
            <Link href="/sign-in">登入</Link>
          </Button>
          <Button
            asChild
            className="border-0 border-l  px-8 h-full rounded-none bg-black text-white hover:text-black  hover:bg-pink-400 transition-colors text-lg"
            variant={"secondary"}
          >
            <Link href="/sign-up">开始出售</Link>
          </Button>
        </div>
      )}

      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant={"ghost"}
          className=" size-12 border-transparent bg-white"
          onClick={() => setIsSiderbarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
