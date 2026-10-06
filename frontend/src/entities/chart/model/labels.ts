import type { Aggregation } from "./types";

/**
 * Названия агрегатов. В подпись линии больше не попадают (приставка «Среднее · » убрана) —
 * нужны только чтобы снять её со старых сохранённых конфигов (ChartModel.migrate).
 */
export const AGGREGATION_LABELS: Record<Aggregation, string> = {
  count: "Количество",
  sum: "Сумма",
  avg: "Среднее",
  min: "Минимум",
  max: "Максимум",
};

export const COUNT_LABEL = "Количество строк";

export const otherLabel = (count: number) => `Прочие (${count})`;
