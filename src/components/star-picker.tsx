"use client";

import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React, { useState } from "react";

interface StarPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  disable?: boolean;
  className?: string;
}

const StarPicker: React.FC<StarPickerProps> = ({
  value = 0,
  onChange,
  disable,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleChange = (value: number) => {

    onChange?.(value);
  };

  return (
    <div
      className={cn(
        "flex items-center",
        disable && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disable}
          className={cn(
            "p-0.5 hover:scale-110 transition",
            !disable && "cursor-pointer hover:scale-none",
          )}
          onClick={() => handleChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black",
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarPicker;
