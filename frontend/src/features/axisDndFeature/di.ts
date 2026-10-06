import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";
import type { DirectPayload, DragPayload, DropTarget, SubColumnOption } from "./types";

/** Правила и действия даёт страница (из сторов chart, column, column-group). */
export type AxisDndDeps = {
  /** Можно ли бросить сюда — подсветка зоны и отказ при броске. */
  canAccept: (payload: DragPayload, target: DropTarget) => boolean;
  getSubColumnOptions: (groupId: string, target: DropTarget) => SubColumnOption[];
  drop: (payload: DirectPayload, target: DropTarget) => void;
};

export const axisDndInjector = createStrictContext<AxisDndDeps>();
export const useDi = () => useStrictContext(axisDndInjector);
