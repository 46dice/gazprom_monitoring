import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";
import type { Column } from "../model/types";
import { DataTypeIcon } from "./DataTypeIcon";

type Props = {
  column: Column;
  /** Внутри группы — короткое имя подстолбца, иначе полное. */
  short?: boolean;
} & ComponentProps<"div">;

/** Только отображение поля. Перетаскивание добавляет фича axisDnd, оборачивая чип. */
export const ColumnChip = ({ column, short = false, className, ...props }: Props) => {
  return (
    <div
      className={cn("flex min-w-0 items-center gap-2 px-2 py-1 text-sm", className)}
      title={column.title}
      {...props}
    >
      <DataTypeIcon dataType={column.dataType} className="shrink-0 text-muted-foreground" />
      <span className="truncate">{short ? column.shortTitle : column.title}</span>
    </div>
  );
};
