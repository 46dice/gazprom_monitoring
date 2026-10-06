import type { ColumnGroup } from "@/entities/column-group/model/types";
import type { Column, DataType } from "@/entities/column/model/types";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

/** Уже отфильтрованное поиском — фильтрует страница через сторы column и column-group. */
export type FieldsPanelDeps = {
  groups: ColumnGroup[];
  standaloneByType: Record<DataType, Column[]>;
  columnsById: Readonly<Record<string, Column>>;
  isExpanded: (groupId: string) => boolean;
  toggleExpanded: (groupId: string) => void;
  isSearching: boolean;
};

export const fieldsPanelInjector = createStrictContext<FieldsPanelDeps>();
export const useDi = () => useStrictContext(fieldsPanelInjector);
