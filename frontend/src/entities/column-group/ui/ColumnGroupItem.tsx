import type { ReactNode } from "react";
import { IconStack2 } from "@tabler/icons-react";
import type { ColumnGroup } from "../model/types";
import { ExpandToggle } from "./ExpandToggle";

type Props = {
  group: ColumnGroup;
  expanded: boolean;
  onToggle: () => void;
  /** Обёртка заголовка — например, ручка перетаскивания из фичи axisDnd. */
  renderHeader?: (header: ReactNode) => ReactNode;
  /** Подстолбцы (SubColumnList) — рисуются, только когда группа раскрыта. */
  children?: ReactNode;
};

/** Группа выделена фоном и рамкой, значком «стопки» и счётчиком подстолбцов — чтобы не путать с обычным полем. */
export const ColumnGroupItem = ({ group, expanded, onToggle, renderHeader, children }: Props) => {
  const header = (
    <div className="flex min-w-0 flex-1 items-center gap-2 py-1 text-sm font-medium" title={group.title}>
      <IconStack2 size={16} className="shrink-0 text-primary" aria-hidden />
      <span className="truncate">{group.title}</span>
      <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
        {group.subColumns.length}
      </span>
    </div>
  );

  return (
    <div className="rounded-md border border-border bg-muted/50">
      <div className="flex items-center gap-1 px-1">
        <ExpandToggle expanded={expanded} onToggle={onToggle} label={group.title} />
        {renderHeader ? renderHeader(header) : header}
      </div>
      {expanded && children}
    </div>
  );
};
