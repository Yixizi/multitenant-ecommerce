import { Category } from "@/payload-types";
import React from "react";
import CategoryDropdown from "./category-dropdown";

interface CategoriesProps {
  data: any;
}

const Categories = ({ data }: CategoriesProps) => {
  return (
    <div className=" w-full relative">
      <div className=" flex  flex-nowrap items-center">
        {data.map((category: Category) => {
          return (
            <div key={category.id}>
              <CategoryDropdown
                category={category}
                isActive={false}
                isNavigationHovered={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
