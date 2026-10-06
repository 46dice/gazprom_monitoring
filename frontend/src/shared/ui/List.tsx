import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type Props<Data extends { id: number | string }> = {
  data: Data[];
  renderData: (item: Data) => ReactNode;
} & ComponentProps<"ul">;

export const List = <Data extends { id: number | string }>({
  data,
  renderData,
  className,
  ...props
}: Props<Data>) => {
  return (
    <ul className={cn("list-none", className)} {...props}>
      {data.map((item) => (
        <li key={item.id}>{renderData(item)}</li>
      ))}
    </ul>
  );
};
