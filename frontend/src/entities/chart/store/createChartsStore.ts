import { createStore } from "zustand/vanilla";
import type { ColumnIndex, Row } from "@/shared/lib/types";
import type { SeriesDraft } from "../model/ChartModel";
import type {
  Aggregation,
  AxisField,
  AxisSlot,
  ChartConfig,
  ChartPoint,
  DropField,
  Series,
} from "../model/types";
import type { ChartsService } from "../services/ChartsService";

export type ChartsState = {
  charts: ChartConfig[];

  addChart: () => void;
  removeChart: (chartId: string) => void;
  resetChart: (chartId: string) => void;
  renameChart: (chartId: string, title: string) => void;
  setXAxis: (chartId: string, field: AxisField | null) => void;
  addSeries: (chartId: string, draft: SeriesDraft) => void;
  updateSeries: (chartId: string, seriesId: string, patch: Partial<Omit<Series, "id" | "colorSlot">>) => void;
  removeSeries: (chartId: string, seriesId: string) => void;
  /** Значения текстовой оси X: null — снова топ самых частых. */
  setXValues: (chartId: string, values: string[] | null, showOther: boolean) => void;
  /** Бросили поле на ось графика. aggregation — выбран в окне подстолбца, иначе по умолчанию. */
  dropField: (chartId: string, slot: AxisSlot, field: DropField, aggregation?: Aggregation) => void;

  canDrop: (chart: ChartConfig, field: DropField, slot: AxisSlot) => boolean;
  canAddSeries: (chart: ChartConfig) => boolean;
  getAggregations: (columnId: string | null, isYear?: boolean) => Aggregation[];
  /** Строки — из стора dataset, их передаёт страница. Вызывать в useMemo. */
  buildPoints: (chart: ChartConfig, rows: readonly Row[], columnIndex: ColumnIndex) => ChartPoint[];
  getMissingColumns: (chart: ChartConfig, columnIndex: ColumnIndex) => string[];
};

export type ChartsStoreDeps = { chartsService: ChartsService };

export const createChartsStore = ({ chartsService }: ChartsStoreDeps) =>
  createStore<ChartsState>()((set, get) => ({
    charts: chartsService.getCharts(),

    addChart: () => set({ charts: chartsService.addChart(get().charts) }),
    removeChart: (chartId) => set({ charts: chartsService.removeChart(get().charts, chartId) }),
    resetChart: (chartId) => set({ charts: chartsService.resetChart(get().charts, chartId) }),
    renameChart: (chartId, title) => set({ charts: chartsService.renameChart(get().charts, chartId, title) }),
    setXAxis: (chartId, field) => set({ charts: chartsService.setXAxis(get().charts, chartId, field) }),
    addSeries: (chartId, draft) => set({ charts: chartsService.addSeries(get().charts, chartId, draft) }),
    updateSeries: (chartId, seriesId, patch) =>
      set({ charts: chartsService.updateSeries(get().charts, chartId, seriesId, patch) }),
    removeSeries: (chartId, seriesId) =>
      set({ charts: chartsService.removeSeries(get().charts, chartId, seriesId) }),

    setXValues: (chartId, values, showOther) =>
      set({ charts: chartsService.setXValues(get().charts, chartId, values, showOther) }),

    dropField: (chartId, slot, field, aggregation) =>
      set({ charts: chartsService.dropField(get().charts, chartId, slot, field, aggregation) }),

    canDrop: (chart, field, slot) => chartsService.canDrop(chart, field, slot),
    canAddSeries: (chart) => chartsService.canAddSeries(chart),
    getAggregations: (columnId, isYear) => chartsService.getAggregations(columnId, isYear),
    buildPoints: (chart, rows, columnIndex) => chartsService.buildPoints(chart, rows, columnIndex),
    getMissingColumns: (chart, columnIndex) => chartsService.getMissingColumns(chart, columnIndex),
  }));
