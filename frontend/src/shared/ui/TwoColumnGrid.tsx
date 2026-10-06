import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

/**
 * Сетка 2×N с ячейками одной высоты: так плитка «+» совпадает по размеру с графиком.
 * Слева ещё панель полей, поэтому две колонки — с xl, ниже одна.
 */
export const TwoColumnGrid = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cn("grid grid-cols-1 auto-rows-[440px] gap-4 xl:grid-cols-2", className)}
      {...props}
    />
  );
};
