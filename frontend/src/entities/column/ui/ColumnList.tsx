import type { ComponentProps, ReactNode } from "react";
import { List } from "@/shared/ui/List";
import { cn } from "@/shared/lib/utils";
import type { Column } from "../model/types";

type Props = {
  columns: Column[];
  /** Как рисовать поле — решает тот, кто знает про перетаскивание (страница/виджет). */
  renderColumn: (column: Column) => ReactNode;
} & ComponentProps<"ul">;

export const ColumnList = ({ columns, renderColumn, className, ...props }: Props) => {
  return (
    <List
      data={columns}
      renderData={renderColumn}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  );
};
