import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className=" p-0 transform-none">
        <SheetHeader className="p-4  border-b ">
          <SheetTitle>菜单</SheetTitle>
        </SheetHeader>
        <ScrollArea className=" flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => {
            return (
              <Link
                onClick={() => onOpenChange(false)}
                key={item.href}
                href={item.href}
                className=" flex w-full text-left p-4 hover:bg-black hover:text-white items-center text-base font-medium"
              >
                {item.children}
              </Link>
            );
          })}

          <div className=" border-t">
            <Link
              href={"/sign-in"}
              onClick={() => onOpenChange(false)}
              className="flex w-full text-left p-4 hover:bg-black hover:text-white items-center text-base font-medium"
            >
              登入
            </Link>
            <Link
              onClick={() => onOpenChange(false)}
              href={"/sign-up"}
              className="flex w-full text-left p-4 hover:bg-black hover:text-white items-center text-base font-medium"
            >
              申请销售
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
