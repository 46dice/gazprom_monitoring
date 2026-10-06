import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint, Series } from "../model/types";
import { AXIS_TICK, LEGEND_STYLE, TOOLTIP_PROPS, bySeriesOrder, seriesColor, tooltipFormatter, yAxisFor } from "./chartTheme";

type Props = {
  points: ChartPoint[];
  series: Pick<Series, "id" | "label" | "colorSlot" | "isYear">[];
};

const hasValue = (p: ChartPoint | undefined, key: string) => p !== undefined && p[key] !== null && p[key] !== undefined;

/** Точка без соседей (разрывы с обеих сторон) — линии к ней нет, без маркера её не видно. */
const isolatedDot = (key: string, points: ChartPoint[], color: string) =>
  function IsolatedDot({ cx, cy, index }: { cx?: number; cy?: number; index?: number }) {
    const i = index ?? -1;
    const alone = hasValue(points[i], key) && !hasValue(points[i - 1], key) && !hasValue(points[i + 1], key);
    if (!alone || cx === undefined || cy === undefined) return <g key={`${key}-${i}`} />;
    return <circle key={`${key}-${i}`} cx={cx} cy={cy} r={3} fill={color} />;
  };

/** Ось X упорядочена (годы, даты, числа) — линия показывает изменение. Только отрисовка готовых точек. */
export const LineChartView = ({ points, series }: Props) => {
  const numericX = points.every((p) => typeof p.x === "number");
  const order = bySeriesOrder(series);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={points} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="x"
          type={numericX ? "number" : "category"}
          domain={numericX ? ["dataMin", "dataMax"] : undefined}
          allowDecimals={false}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          minTickGap={16}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width="auto" {...yAxisFor(series)} />
        <Tooltip
          {...TOOLTIP_PROPS}
          formatter={tooltipFormatter(series)}
          itemSorter={order}
          cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
        />
        {/* Одна линия — легенда не нужна, её называет заголовок карточки. */}
        {series.length > 1 && <Legend iconType="plainline" itemSorter={order} wrapperStyle={LEGEND_STYLE} />}
        {series.map((s) => (
          <Line
            key={s.id}
            dataKey={s.id}
            name={s.label}
            type="linear"
            stroke={seriesColor(s.colorSlot)}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={isolatedDot(s.id, points, seriesColor(s.colorSlot))}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
            connectNulls={false}
            // Иначе каждое обновление из Excel перерисовывает линии с анимацией.
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
