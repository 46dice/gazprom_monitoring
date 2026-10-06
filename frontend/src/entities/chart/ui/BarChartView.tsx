import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint, Series } from "../model/types";
import { AXIS_TICK, LEGEND_STYLE, TOOLTIP_PROPS, bySeriesOrder, formatFor, seriesColor, tooltipFormatter, yAxisFor } from "./chartTheme";

type Props = {
  points: ChartPoint[];
  series: Pick<Series, "id" | "label" | "colorSlot" | "isYear">[];
  /** full — в окне на весь экран: подписи категорий длиннее, обрезаются реже. */
  size?: "card" | "full";
};

/** Сколько символов подписи категории показывать, дальше — многоточие (полное — в подсказке). */
const MAX_CHARS = { card: 18, full: 40 } as const;
/** Подписи «да / нет», «Подземный / Надземный» — короткие и их мало: пишем прямо, без наклона. */
const STRAIGHT_MAX = { chars: 12, count: 8 } as const;
/** Примерная ширина символа 12px-шрифта — чтобы под наклонные подписи хватило высоты оси. */
const CHAR_PX = 6.5;

const shorten = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/**
 * Ось X — категории без порядка (завод, вид дефекта, «да / нет»): вертикальные столбцы.
 * Длинные или многочисленные подписи — под наклоном и с обрезкой. «Прочие» приглушены.
 */
export const BarChartView = ({ points, series, size = "card" }: Props) => {
  const order = bySeriesOrder(series);
  const maxChars = MAX_CHARS[size];
  const longest = Math.min(maxChars, Math.max(...points.map((p) => String(p.x).length)));
  const straight = longest <= STRAIGHT_MAX.chars && points.length <= STRAIGHT_MAX.count;
  // Наклон 40°: высота подписи ≈ длина × sin 40°; плюс запас под сами деления.
  const axisHeight = straight ? 30 : Math.ceil(longest * CHAR_PX * 0.65) + 16;
  // Наклонная подпись первого столбца уходит влево на ≈ длина × cos 40° — за ось Y, нужен отступ.
  const leftMargin = straight ? 0 : Math.max(0, Math.ceil(longest * CHAR_PX * 0.77) - 40);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={points} margin={{ top: 16, right: 8, bottom: 0, left: leftMargin }} barCategoryGap="20%">
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="x"
          type="category"
          interval={0}
          height={axisHeight}
          angle={straight ? 0 : -40}
          textAnchor={straight ? "middle" : "end"}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          tickFormatter={(value) => shorten(String(value), maxChars)}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width="auto" {...yAxisFor(series)} />
        <Tooltip {...TOOLTIP_PROPS} formatter={tooltipFormatter(series)} itemSorter={order} cursor={{ fill: "var(--muted)" }} />
        {series.length > 1 && <Legend itemSorter={order} wrapperStyle={LEGEND_STYLE} />}
        {series.map((s) => (
          <Bar
            key={s.id}
            dataKey={s.id}
            name={s.label}
            fill={seriesColor(s.colorSlot)}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            isAnimationActive={false}
          >
            {points.map((p) => (
              <Cell key={String(p.x)} fillOpacity={p.isOther ? 0.45 : 1} />
            ))}
            {/* Одна серия — значение над столбцом; при нескольких подписи слипаются. */}
            {series.length === 1 && (
              <LabelList
                dataKey={s.id}
                position="top"
                formatter={(value) => formatFor(s)(value)}
                style={{ fill: "var(--foreground)", fontSize: 11 }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
