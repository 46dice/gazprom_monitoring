import type { ReactNode } from "react";
import { List } from "@/shared/ui/List";

type Props<Item extends { id: string }> = {
  items: Item[];
  renderItem: (item: Item) => ReactNode;
};

/** Подстолбцы под раскрытой группой — с отступом и линией-«деревом» слева. */
export const SubColumnList = <Item extends { id: string }>({ items, renderItem }: Props<Item>) => {
  return (
    <List
      data={items}
      renderData={renderItem}
      className="ml-4 flex flex-col gap-0.5 border-l border-border py-1 pl-3"
    />
  );
};
