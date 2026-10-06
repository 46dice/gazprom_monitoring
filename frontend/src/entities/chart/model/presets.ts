import type { ChartConfig } from "./types";

const YEAR_ISSUED = "Год выпуска";
const YEAR_COMMISSIONED = "Год ввода в эксплуатацию";
const INSPECTION_VIK = "Дата проведения обследования / ВИК, ВК, МК";
const INSPECTION_UZK = "Дата проведения обследования / УЗК";
const INSPECTION_RK = "Дата проведения обследования / РК (кольцевых стыков)";
const PLACEMENT = "Местонахождение / Подземный, надземный";
const RESULT = "Результат обследования";

const count = (id: string, label: string, colorSlot: number) => ({
  id,
  columnId: null,
  aggregation: "count" as const,
  filter: null,
  xColumnId: null,
  label,
  colorSlot,
});

/** 4 графика из ТЗ — стартовое содержимое, когда в хранилище пусто, и цель «сбросить». */
export const CHART_PRESETS: ChartConfig[] = [
  {
    id: "preset-issued-commissioned",
    presetId: "preset-issued-commissioned",
    title: "Выпуск и ввод в эксплуатацию",
    xAxis: { columnId: YEAR_COMMISSIONED },
    yAxis: [
      { ...count("p1-issued", "Выпущено", 1), xColumnId: YEAR_ISSUED },
      count("p1-commissioned", "Введено в эксплуатацию", 2),
    ],
  },
  {
    id: "preset-inspection-methods",
    presetId: "preset-inspection-methods",
    title: "Обследования по методам",
    xAxis: { columnId: INSPECTION_VIK, grain: "year" },
    yAxis: [
      count("p2-vik", "ВИК, ВК, МК", 1),
      { ...count("p2-uzk", "УЗК", 2), xColumnId: INSPECTION_UZK },
      { ...count("p2-rk", "РК", 3), xColumnId: INSPECTION_RK },
    ],
  },
  {
    id: "preset-placement",
    presetId: "preset-placement",
    title: "Подземные и надземные по году ввода",
    xAxis: { columnId: YEAR_COMMISSIONED },
    yAxis: [
      { ...count("p3-under", "Подземный", 1), filter: { columnId: PLACEMENT, value: "подземный", label: "Подземный" } },
      { ...count("p3-over", "Надземный", 2), filter: { columnId: PLACEMENT, value: "надземный", label: "Надземный" } },
    ],
  },
  {
    id: "preset-result",
    presetId: "preset-result",
    title: "Результат обследования по году ввода",
    xAxis: { columnId: YEAR_COMMISSIONED },
    yAxis: [
      { ...count("p4-ok", "Годен", 1), filter: { columnId: RESULT, value: "годен", label: "Годен" } },
      { ...count("p4-replace", "Замена", 2), filter: { columnId: RESULT, value: "замена", label: "Замена" } },
    ],
  },
];
