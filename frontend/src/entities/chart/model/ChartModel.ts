import type { CellValue, ColumnIndex, Row } from "@/shared/lib/types";
import { normalizeText } from "@/shared/lib/text";
import { AGGREGATION_LABELS, COUNT_LABEL, otherLabel } from "./labels";
import { CHART_PRESETS } from "./presets";
import {
  MAX_SERIES,
  TOP_CATEGORIES,
  type Aggregation,
  type AxisField,
  type AxisSlot,
  type ChartConfig,
  type ChartPoint,
  type DropField,
  type FieldInfo,
  type Series,
} from "./types";

type Accumulator = { count: number; sum: number; min: number; max: number };

/** Группа строк с одним значением X. norm — нормализованный текст (null для чисел). */
type Bucket = { x: number | string; norm: string | null; rows: number; acc: Map<string, Accumulator> };

export type SeriesDraft = Omit<Series, "id" | "colorSlot">;

export class ChartModel {
  createPresets(): ChartConfig[] {
    return structuredClone(CHART_PRESETS);
  }

  /**
   * Сохранённые конфиги — к текущим правилам: снимаем приставку «Среднее · » (и прочих агрегатов)
   * с подписей, собранных автоматически. Переименованные вручную линии не трогаем.
   */
  migrate(charts: ChartConfig[]): ChartConfig[] {
    const prefixed = (s: Series) =>
      s.columnId !== null && Object.values(AGGREGATION_LABELS).some((l) => s.label === `${l} · ${s.columnId}`);
    return charts.map((chart) => ({
      ...chart,
      yAxis: chart.yAxis.map((s) => (prefixed(s) ? { ...s, label: s.columnId! } : s)),
    }));
  }

  add(charts: ChartConfig[]): ChartConfig[] {
    const chart: ChartConfig = {
      id: crypto.randomUUID(),
      title: `График ${charts.length + 1}`,
      xAxis: null,
      yAxis: [],
      presetId: null,
    };
    return [...charts, chart];
  }

  remove(charts: ChartConfig[], chartId: string): ChartConfig[] {
    return charts.filter((chart) => chart.id !== chartId);
  }

  /** Стартовый график — к пресету, свой — к пустому; id и место в сетке сохраняются. */
  reset(charts: ChartConfig[], chartId: string): ChartConfig[] {
    return this.update(charts, chartId, (chart) => {
      const preset = CHART_PRESETS.find((p) => p.id === chart.presetId);
      return preset
        ? { ...structuredClone(preset), id: chart.id }
        : { ...chart, xAxis: null, yAxis: [] };
    });
  }

  rename(charts: ChartConfig[], chartId: string, title: string): ChartConfig[] {
    return this.update(charts, chartId, (chart) => ({ ...chart, title: title.trim() || chart.title }));
  }

  /**
   * В X — любое поле (одно); в Y — только меры и «Количество строк», не больше MAX_SERIES линий.
   * «Количество» — не поле, на ось X его не положить.
   */
  canDrop(chart: ChartConfig, field: DropField, slot: AxisSlot): boolean {
    if (slot === "x") return !isCount(field);
    return this.canAddSeries(chart) && (isCount(field) || field.role === "measure");
  }

  canAddSeries(chart: ChartConfig): boolean {
    return chart.yAxis.length < MAX_SERIES;
  }

  /**
   * Агрегаты для меры (первый — по умолчанию); «Количество» (columnId null) — только count.
   * Год — без суммы: «средний / самый ранний / самый поздний год» осмысленны, сумма годов — нет.
   */
  getAggregations(columnId: string | null, isYear = false): Aggregation[] {
    if (columnId === null) return ["count"];
    return isYear ? ["avg", "min", "max"] : ["avg", "sum", "min", "max"];
  }

  /** Бросили поле на ось: X заменяется (оно одно), в Y добавляется линия. Нельзя — без изменений. */
  dropField(
    charts: ChartConfig[],
    chartId: string,
    slot: AxisSlot,
    field: DropField,
    aggregation?: Aggregation,
  ): ChartConfig[] {
    const chart = charts.find((c) => c.id === chartId);
    if (!chart || !this.canDrop(chart, field, slot)) return charts;

    if (slot === "x") {
      const info = field as FieldInfo;
      // Дата по дням даёт тысячи точек — группируем по году.
      return this.setXAxis(charts, chartId, {
        columnId: info.id,
        grain: info.dataType === "date" ? "year" : undefined,
        categorical: info.dataType === "string",
      });
    }

    const columnId = isCount(field) ? null : field.id;
    const agg = aggregation ?? this.getAggregations(columnId, !isCount(field) && field.isYear)[0];
    return this.addSeries(charts, chartId, {
      columnId,
      aggregation: agg,
      filter: null,
      xColumnId: null,
      label: isCount(field) ? COUNT_LABEL : field.title,
      isYear: !isCount(field) && field.isYear === true ? true : undefined,
    });
  }

  setXAxis(charts: ChartConfig[], chartId: string, field: AxisField | null): ChartConfig[] {
    return this.update(charts, chartId, (chart) => ({ ...chart, xAxis: field }));
  }

  addSeries(charts: ChartConfig[], chartId: string, draft: SeriesDraft): ChartConfig[] {
    return this.update(charts, chartId, (chart) => {
      if (!this.canAddSeries(chart)) return chart;
      const series: Series = { ...draft, id: crypto.randomUUID(), colorSlot: freeColorSlot(chart.yAxis) };
      return { ...chart, yAxis: [...chart.yAxis, series] };
    });
  }

  updateSeries(
    charts: ChartConfig[],
    chartId: string,
    seriesId: string,
    patch: Partial<Omit<Series, "id" | "colorSlot">>,
  ): ChartConfig[] {
    return this.update(charts, chartId, (chart) => ({
      ...chart,
      yAxis: chart.yAxis.map((s) => (s.id === seriesId ? withAutoLabel(s, patch) : s)),
    }));
  }

  removeSeries(charts: ChartConfig[], chartId: string, seriesId: string): ChartConfig[] {
    return this.update(charts, chartId, (chart) => ({
      ...chart,
      yAxis: chart.yAxis.filter((s) => s.id !== seriesId),
    }));
  }

  /** Столбцы конфига, которых нет в файле (переименовали/удалили в Excel). */
  getMissingColumns(chart: ChartConfig, columnIndex: ColumnIndex): string[] {
    const ids = [
      chart.xAxis?.columnId,
      ...chart.yAxis.flatMap((s) => [s.columnId, s.xColumnId, s.filter?.columnId]),
    ];
    return [...new Set(ids.filter((id): id is string => !!id && columnIndex[id] === undefined))];
  }

  /**
   * Точки линейного графика: группировка строк по X и агрегация по каждой линии.
   * Линию со ссылкой на отсутствующий столбец пропускаем, пустая группа — null (разрыв).
   */
  buildPoints(chart: ChartConfig, rows: readonly Row[], columnIndex: ColumnIndex): ChartPoint[] {
    if (!chart.xAxis || chart.yAxis.length === 0) return [];

    const grain = chart.xAxis.grain;
    const categorical = chart.xAxis.categorical ?? isMostlyText(rows, columnIndex[chart.xAxis.columnId]);
    const buckets = new Map<string, Bucket>();

    for (const series of chart.yAxis) {
      const xIndex = columnIndex[series.xColumnId ?? chart.xAxis.columnId];
      const valueIndex = series.columnId === null ? null : columnIndex[series.columnId];
      const filterIndex = series.filter ? columnIndex[series.filter.columnId] : null;
      if (xIndex === undefined || valueIndex === undefined || filterIndex === undefined) continue;

      for (const row of rows) {
        const x = toX(row[xIndex], grain, categorical);
        if (x === null) continue;

        // Точку X заводим до фильтра и проверки значения: год, где у линии нет подходящих строк,
        // должен остаться на оси с null (разрыв), а не выпасть — иначе линия соединит соседей.
        const norm = typeof x === "number" ? null : normalizeText(x);
        const key = norm === null ? `n:${x}` : `s:${norm}`;
        const bucket = buckets.get(key) ?? { x, norm, rows: 0, acc: new Map<string, Accumulator>() };
        buckets.set(key, bucket);

        if (series.filter && filterIndex !== null && !matches(row[filterIndex], series.filter.value)) continue;

        let value = 1;
        if (valueIndex !== null) {
          const cell = row[valueIndex];
          if (typeof cell !== "number") continue;
          value = cell;
        }

        const acc = bucket.acc.get(series.id) ?? emptyAccumulator();
        addValue(acc, value);
        bucket.acc.set(series.id, acc);
        bucket.rows += 1;
      }
    }

    const all = [...buckets.values()];
    const toPoint = (bucket: Bucket): ChartPoint => {
      const point: ChartPoint = { x: bucket.x };
      for (const series of chart.yAxis) {
        const a = bucket.acc.get(series.id);
        // Нет строк: для количества это честный 0, для среднего/мин/макс — «нет данных» (разрыв).
        point[series.id] = a ? aggregate(a, series.aggregation) : series.aggregation === "count" ? 0 : null;
      }
      return point;
    };

    // Годы, даты, числа — линия по порядку X.
    if (!categorical) return all.sort((a, b) => compareX(a.x, b.x)).map(toPoint);

    // Текстовая ось: выбранные значения (или самые частые) — по убыванию первой линии,
    // остальные — одним пунктом «Прочие» тем же агрегатом.
    const selected = new Set(chart.xAxis.values ?? this.topValues(rows, columnIndex[chart.xAxis.columnId]));
    const shown = all.filter((b) => selected.has(b.norm!));
    const rest = all.filter((b) => !selected.has(b.norm!));

    const firstId = chart.yAxis[0].id;
    const points = shown.map(toPoint).sort((a, b) => numeric(b[firstId]) - numeric(a[firstId]));
    if (chart.xAxis.showOther !== false && rest.length > 0) {
      points.push({ ...toPoint(mergeBuckets(rest)), x: otherLabel(rest.length), isOther: true });
    }
    return points;
  }

  /** Выбор значений текстовой оси X. values null — снова «топ самых частых». */
  setXValues(charts: ChartConfig[], chartId: string, values: string[] | null, showOther: boolean): ChartConfig[] {
    return this.update(charts, chartId, (chart) =>
      chart.xAxis ? { ...chart, xAxis: { ...chart.xAxis, values, showOther } } : chart,
    );
  }

  /**
   * Значения по умолчанию — самые частые во всём файле, без учёта фильтров линий:
   * так «топ» на графике совпадает с «Топ-15» в окне выбора значений.
   */
  private topValues(rows: readonly Row[], xIndex: number | undefined): string[] {
    if (xIndex === undefined) return [];
    const counts = new Map<string, number>();
    for (const row of rows) {
      const cell = row[xIndex];
      // Как в toX для текстовой оси: число — тоже категория (марка «20»).
      const text = typeof cell === "number" ? String(cell) : cell;
      if (!text || !text.trim()) continue;
      const norm = normalizeText(text);
      counts.set(norm, (counts.get(norm) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_CATEGORIES)
      .map(([norm]) => norm);
  }

  private update(
    charts: ChartConfig[],
    chartId: string,
    change: (chart: ChartConfig) => ChartConfig,
  ): ChartConfig[] {
    return charts.map((chart) => (chart.id === chartId ? change(chart) : chart));
  }
}

function isCount(field: DropField): field is { kind: "count" } {
  return "kind" in field;
}

/**
 * Подпись линии следует за фильтром, пока пользователь не задал свою:
 * «Количество строк» + фильтр «Годен» → «Годен».
 */
function withAutoLabel(series: Series, patch: Partial<Omit<Series, "id" | "colorSlot">>): Series {
  const next = { ...series, ...patch };
  if (patch.label !== undefined) return next;
  return series.label === autoLabel(series) ? { ...next, label: autoLabel(next) } : next;
}

/** Подпись числовой линии — просто название поля: id столбца и есть полное название из шапки. */
function autoLabel(series: Series): string {
  if (series.columnId !== null) return series.columnId;
  return series.filter?.label ?? COUNT_LABEL;
}

function freeColorSlot(series: Series[]): number {
  const used = new Set(series.map((s) => s.colorSlot));
  for (let slot = 1; slot <= MAX_SERIES; slot++) if (!used.has(slot)) return slot;
  return 1;
}

function matches(cell: CellValue, normalizedValue: string): boolean {
  if (cell === null) return false;
  return normalizeText(String(cell)) === normalizedValue;
}

/**
 * Значение ячейки → значение оси X. Тип оси важнее типа ячейки:
 * на текстовой оси число — это тоже категория (марка стали «20»),
 * на числовой — текст разбираем как число («2019-02-21» → 2019), мусор отбрасываем.
 */
function toX(cell: CellValue, grain: AxisField["grain"], categorical: boolean): number | string | null {
  if (cell === null) return null;
  if (grain === "year" && typeof cell === "string") {
    const year = Number(cell.slice(0, 4));
    return Number.isInteger(year) && /^\d{4}-/.test(cell) ? year : null;
  }
  if (categorical) return typeof cell === "string" ? cell.trim() || null : String(cell);
  if (typeof cell === "number") return cell;
  const parsed = Number.parseFloat(cell.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Для старых конфигов без флага categorical: текстовая ось, если строк больше, чем чисел. */
function isMostlyText(rows: readonly Row[], xIndex: number | undefined): boolean {
  if (xIndex === undefined) return false;
  let text = 0;
  let numbers = 0;
  for (const row of rows) {
    const cell = row[xIndex];
    if (typeof cell === "string") text += 1;
    else if (typeof cell === "number") numbers += 1;
  }
  return text > numbers;
}

function compareX(a: number | string, b: number | string): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "ru", { numeric: true });
}

function emptyAccumulator(): Accumulator {
  return { count: 0, sum: 0, min: Infinity, max: -Infinity };
}

function addValue(acc: Accumulator, value: number) {
  acc.count += 1;
  acc.sum += value;
  acc.min = Math.min(acc.min, value);
  acc.max = Math.max(acc.max, value);
}

/**
 * «Прочие» — сумма накопителей, а не значений: среднее по «Прочим» — это среднее
 * по всем их строкам, а не среднее средних.
 */
function mergeBuckets(buckets: Bucket[]): Bucket {
  const acc = new Map<string, Accumulator>();
  for (const bucket of buckets) {
    for (const [seriesId, a] of bucket.acc) {
      const m = acc.get(seriesId) ?? emptyAccumulator();
      m.count += a.count;
      m.sum += a.sum;
      m.min = Math.min(m.min, a.min);
      m.max = Math.max(m.max, a.max);
      acc.set(seriesId, m);
    }
  }
  return { x: "", norm: null, rows: buckets.reduce((n, b) => n + b.rows, 0), acc };
}

/** null (нет данных) — в конец сортировки по убыванию. */
function numeric(value: unknown): number {
  return typeof value === "number" ? value : -Infinity;
}

function aggregate(acc: Accumulator, aggregation: Aggregation): number {
  switch (aggregation) {
    case "count":
      return acc.count;
    case "sum":
      return acc.sum;
    case "avg":
      return acc.sum / acc.count;
    case "min":
      return acc.min;
    case "max":
      return acc.max;
  }
}
