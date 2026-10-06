/** Общее оформление линий и столбиков: текст — в цветах темы, не в цвете серии. */

const numberFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export const formatValue = (value: unknown) => (typeof value === "number" ? numberFormat.format(value) : "—");

/** Год — без разделителя тысяч: «1985,9», а не «1 985,9». */
const yearFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1, useGrouping: false });
export const formatYear = (value: unknown) => (typeof value === "number" ? yearFormat.format(value) : "—");

type SeriesFormat = { id: string; isYear?: boolean };

/** Формат значения конкретной линии: годы — как годы, остальное — как числа. */
export const formatFor = (series: SeriesFormat | undefined) => (series?.isYear ? formatYear : formatValue);

/** Для подсказки Recharts: по dataKey находим линию и её формат. */
export const tooltipFormatter =
  (series: SeriesFormat[]) =>
  (value: unknown, _name: unknown, item: { dataKey?: unknown }) =>
    formatFor(series.find((s) => s.id === item.dataKey))(value);

/**
 * Все линии — годы: у годов нет осмысленного нуля, шкала от минимального года с запасом,
 * иначе столбцы 1985 и 1990 почти одной высоты. Иначе — обычная шкала от нуля.
 */
export const yAxisFor = (series: SeriesFormat[]) => {
  const allYears = series.length > 0 && series.every((s) => s.isYear);
  return {
    tickFormatter: allYears ? formatYear : formatValue,
    domain: allYears ? (["dataMin - 3", "dataMax + 3"] as [string, string]) : undefined,
    allowDecimals: !allYears,
  };
};

export const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

export const TOOLTIP_PROPS = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    color: "var(--popover-foreground)",
    fontSize: 12,
  },
  labelStyle: { color: "var(--muted-foreground)" },
  itemStyle: { color: "var(--popover-foreground)" },
};

export const LEGEND_STYLE = { fontSize: 12, color: "var(--foreground)" };

export const seriesColor = (colorSlot: number) => `var(--series-${colorSlot})`;

/** Recharts сортирует легенду и подсказку по алфавиту — держим порядок линий. */
export const bySeriesOrder =
  (series: { id: string }[]) =>
  (item: { dataKey?: unknown }) =>
    series.findIndex((s) => s.id === item.dataKey);
