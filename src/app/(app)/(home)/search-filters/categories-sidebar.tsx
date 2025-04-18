import React, { useState } from "react";
import { CustomCategory } from "../types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[];
}

const CategoriesSidebar = ({
  open,
  onOpenChange,
  data,
}: CategoriesSidebarProps) => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null);
    setSelectedCategory(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className=" p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className=" lg:h-20 lg:text-2xl p-4 border-b flex   justify-center">
          <SheetTitle>分类</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={() => {
                handleBackClick();
              }}
              className=" cursor-pointer w-full text-left p-4 hover:bg-black hover:text-white flex  items-center text-base font-medium"
            >
              <ChevronLeftIcon className=" size-4 mr-2" />
              Back
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              onClick={() => handleCategoryClick(category)}
              className=" cursor-pointer w-full text-left p-4 hover:bg-black hover:text-white flex  items-center text-base font-medium"
              key={category.slug}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className=" size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategoriesSidebar;
