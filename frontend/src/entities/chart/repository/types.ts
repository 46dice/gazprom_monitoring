import type { ChartConfig } from "../model/types";

export type ChartsRepository = {
  /** null — сохранённых графиков нет (первый запуск или устаревший формат). */
  load(): ChartConfig[] | null;
  save(charts: ChartConfig[]): void;
};
