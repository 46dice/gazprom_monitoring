import type { ReactNode } from "react";
import { createStrictContext } from "@/shared/lib/helpers/createStrictContext";
import { useStrictContext } from "@/shared/lib/hooks/useStrictContext";

export type ExpandChartDeps = {
  title: string;
  /** Пустой график разворачивать незачем. */
  canExpand: boolean;
  /** Сам график крупно — его рисует страница (ChartView с size="full"); фича не знает про сущность. */
  renderChart: () => ReactNode;
};

export const expandChartInjector = createStrictContext<ExpandChartDeps>();
export const useDi = () => useStrictContext(expandChartInjector);
