import { useMemo, type ReactNode } from "react";
import type { DropField } from "@/entities/chart/model/types";
import { useChartsStore } from "@/entities/chart/store/ChartsProvider";
import { useColumnGroupsStore } from "@/entities/column-group/store/ColumnGroupsProvider";
import { useColumnsStore } from "@/entities/column/store/ColumnsProvider";
import { AxisDndProvider } from "@/features/axisDndFeature/AxisDndProvider";
import { axisDndInjector, type AxisDndDeps } from "@/features/axisDndFeature/di";
import type { DirectPayload, DropTarget, SubColumnOption } from "@/features/axisDndFeature/types";
import { toFieldInfo } from "./toFieldInfo";

/** Перетаскивание соединяет три сущности: поле (column), группу (column-group) и график (chart). */
export function AxisDndContainer({ children }: { children: ReactNode }) {
  const columns = useColumnsStore((s) => s.columns);
  const groups = useColumnGroupsStore((s) => s.groups);
  const charts = useChartsStore((s) => s.charts);
  const canDrop = useChartsStore((s) => s.canDrop);
  const dropField = useChartsStore((s) => s.dropField);

  const deps = useMemo<AxisDndDeps>(() => {
    const byId = new Map(columns.map((c) => [c.id, c]));
    const chartsById = new Map(charts.map((c) => [c.id, c]));
    // Правило «не больше 8 линий» зависит от текущего состояния графика.
    const canDropOn = (chartId: string, field: DropField, slot: DropTarget["slot"]) => {
      const chart = chartsById.get(chartId);
      return chart ? canDrop(chart, field, slot) : false;
    };

    const toDropField = (payload: DirectPayload): DropField | null => {
      if (payload.kind === "count") return { kind: "count" };
      const column = byId.get(payload.columnId);
      return column ? toFieldInfo(column) : null;
    };

    const getSubColumnOptions = (groupId: string, target: DropTarget): SubColumnOption[] =>
      groups
        .find((g) => g.id === groupId)
        ?.subColumns.flatMap((sub) => {
          const column = byId.get(sub.id);
          if (!column) return [];
          return [{ id: column.id, title: sub.title, dataType: column.dataType, disabled: !canDropOn(target.chartId, toFieldInfo(column), target.slot) }];
        }) ?? [];

    return {
      canAccept: (payload, target) => {
        if (payload.kind === "group") return getSubColumnOptions(payload.groupId, target).some((o) => !o.disabled);
        const field = toDropField(payload);
        return field !== null && canDropOn(target.chartId, field, target.slot);
      },
      getSubColumnOptions,
      drop: (payload, target) => {
        const field = toDropField(payload);
        // Агрегат не выбирается — модель ставит среднее (для «Количества строк» — количество).
        if (field) dropField(target.chartId, target.slot, field);
      },
    };
  }, [columns, groups, charts, canDrop, dropField]);

  return (
    <axisDndInjector.Provider value={deps}>
      <AxisDndProvider>{children}</AxisDndProvider>
    </axisDndInjector.Provider>
  );
}
