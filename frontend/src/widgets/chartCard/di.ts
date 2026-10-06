import type { ReactNode } from "react";
import type { ChartConfig, ChartPoint } from "@/entities/chart/model/types";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type ChartCardDeps = {
  chart: ChartConfig;
  points: ChartPoint[];
  /** Подпись оси X: «Год ввода в эксплуатацию» / «… (по годам)». */
  xTitle: string | null;
  /** Столбцы конфига, которых больше нет в файле. */
  missingColumns: string[];
  isRefreshing: boolean;
  /** Заголовок вместо простого текста — например, редактируемый (фича переименования). */
  titleSlot?: ReactNode;
  /** Кнопки в шапке (сбросить, удалить) — их дают фичи, раскладывает страница. */
  headerActions?: ReactNode;
  /** Слоты осей X и Y (перетаскивание, линии) — тоже от фич. Нет — просто подпись оси X. */
  axisSlots?: ReactNode;
};

export const chartCardInjector = createStrictContext<ChartCardDeps>();
export const useDi = () => useStrictContext(chartCardInjector);
